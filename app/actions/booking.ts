"use server";

import fs from "fs/promises";
import {
  BookingStatus,
  type PaymentMethod,
  PaymentStatus,
  SourceType,
} from "@prisma/client";
import { prisma, getUser, User } from "@/lib/server-auth";
import { z } from "zod";
import sharp from "sharp";

// Validation schema
const createBookingSchema = z.object({
  fieldId: z.string().min(1, "Field is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export async function createBooking(formData: FormData) {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to create a booking",
    };
  }

  const fieldId = formData.get("fieldId") as string;
  const date = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;

  try {
    // Validate form data
    createBookingSchema.parse({
      fieldId,
      date,
      startTime,
      endTime,
    });

    // Get field details
    const field = await prisma.field.findUnique({
      where: { id: fieldId },
    });

    if (!field) {
      return { success: false, error: "Field not found" };
    }

    // Parse date and times
    const bookingDate = new Date(date);
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    // Calculate duration in hours
    const durationHours =
      (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

    // Calculate total amount
    const totalAmount = field.hourlyRate * durationHours;

    // Check if field is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        fieldId,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
        OR: [
          {
            AND: [
              { startTime: { lte: startDateTime } },
              { endTime: { gt: startDateTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endDateTime } },
              { endTime: { gte: endDateTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startDateTime } },
              { endTime: { lte: endDateTime } },
            ],
          },
        ],
      },
    });

    if (existingBooking) {
      return {
        success: false,
        error: "Field is not available at the selected time",
      };
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        fieldId,
        bookingDate,
        startTime: startDateTime,
        endTime: endDateTime,
        duration: durationHours,
        amount: totalAmount,
        status: BookingStatus.UNPAID,
      },
    });

    return { success: true, bookingId: booking.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unknown error occurred" };
  }
}

export async function uploadPaymentProof(formData: FormData) {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to upload payment proof",
    };
  }

  const bookingId = formData.get("bookingId") as string;
  const paymentMethod = formData.get("paymentMethod") as string;
  const amount = formData.get("amount") as string;
  const proofImage = formData.get("proofImage") as File;

  try {
    // Validate booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        _count: {
          select: {
            payments: true,
          },
        },
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    } else if (booking.userId !== user.id) {
      return {
        success: false,
        error: "You are not authorized to upload payment for this booking",
      };
    } else if (booking._count.payments > 0) {
      return {
        success: false,
        error: "This booking has already been paid",
      };
    }

    const [payment] = await Promise.all([
      prisma.payment.create({
        data: {
          bookingId,
          userId: user.id,
          amount: Number.parseFloat(amount),
          method: paymentMethod as PaymentMethod,
          status: PaymentStatus.PENDING,
          transactionId: "TRX-" + Math.floor(Math.random() * 1000000),
        },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.PENDING },
      }),
      proofImage.bytes().then(async (data) => {
        await sharp(data)
          .webp()
          .toFile(`./public/user-content/booking/payment/${bookingId}.webp`);
      }),
    ]);

    return { success: true, paymentId: payment.id };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unknown error occurred" };
  }
}

export async function cancelBooking(bookingId: string) {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to cancel a booking",
    };
  }

  try {
    // Validate booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (
      booking.userId !== user.id &&
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    ) {
      return {
        success: false,
        error: "You are not authorized to cancel this booking",
      };
    }

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
    });

    // Update payment status if exists
    await prisma.payment.updateMany({
      where: { bookingId },
      data: { status: PaymentStatus.CANCELLED },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unknown error occurred" };
  }
}

export async function getUserBookings(user: Pick<User, "id">) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        field: true,
        payments: true,
        players: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function getBookingById(
  user: Pick<User, "id">,
  bookingId: string,
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId, userId: user.id },
      include: {
        _count: {
          select: {
            players: true,
          },
        },
        field: true,
        payments: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!booking) {
      return null;
    }

    return booking;
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
}

export type Booking = NonNullable<Awaited<ReturnType<typeof getBookingById>>>;

export async function setPlayersToBooking(formData: FormData) {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to set players",
    };
  }

  const bookingId = formData.get("bookingId") as string;

  const players = JSON.parse(formData.get("players") as string);
  if (!Array.isArray(players)) {
    return {
      success: false,
      error: "Players field not valid",
    };
  }

  const usernames = JSON.parse(formData.get("usernames") as string);
  if (!Array.isArray(usernames)) {
    return {
      success: false,
      error: "Usernames field not valid",
    };
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      _count: {
        select: {
          payments: true,
          players: true,
        },
      },
    },
  });

  if (!booking) {
    return {
      success: false,
      error: "Booking not found",
    };
  } else if (booking.userId !== user.id) {
    return {
      success: false,
      error: "You are not authorized to set players for this booking",
    };
  } else if (booking._count.payments === 0) {
    return {
      success: false,
      error: "This booking has not been paid",
    };
  } else if (booking._count.players > 0) {
    return {
      success: false,
      error: "Players already set",
    };
  }

  const userIds = await prisma.user.findMany({
    where: {
      username: {
        in: usernames,
      },
    },
    select: {
      id: true,
    },
  });

  userIds.push({ id: user.id });

  const shouldAddPointNow =
    booking.status === "CONFIRMED" || booking.status === "COMPLETED";

  await Promise.all([
    prisma.player.createMany({
      data: players.map((player) => ({
        fullName: player,
        bookingId: bookingId,
      })),
    }),

    prisma.bookingUser.createMany({
      data: userIds.map((user) => ({
        bookingId: bookingId,
        userId: user.id,
      })),
    }),

    shouldAddPointNow &&
      prisma.bookingPoint.createMany({
        data: userIds.map((user) => ({
          bookingId: bookingId,
          userId: user.id,
          points: 10,
        })),
      }),

    shouldAddPointNow &&
      prisma.pointSource.createMany({
        data: userIds.map((user) => ({
          sourceId: bookingId,
          sourceType: "BOOKING",
          userId: user.id,
          points: 10,
        })),
      }),
  ]);

  return { success: true };
}

export async function completeBooking(bookingId: string) {
  const user = await getUser();

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { field: true },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.COMPLETED },
    });

    // Calculate points (10 points per hour)
    const points = Math.round(Number(booking.duration) * 10);

    // Add points to user
    const userPoint = await prisma.userPoint.findFirst({
      where: { userId: booking.userId },
    });

    if (userPoint) {
      await prisma.userPoint.update({
        where: { id: userPoint.id },
        data: { points: userPoint.points + points },
      });
    } else {
      await prisma.userPoint.create({
        data: {
          userId: booking.userId,
          points: points,
          isActive: true,
          expiryDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ),
        },
      });
    }

    // Create booking points record
    await prisma.bookingPoint.create({
      data: {
        userId: booking.userId,
        bookingId: booking.id,
        points: points,
      },
    });

    // Create point source record
    await prisma.pointSource.create({
      data: {
        userId: booking.userId,
        sourceId: booking.id,
        points: points,
        sourceType: SourceType.BOOKING,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unknown error occurred" };
  }
}
