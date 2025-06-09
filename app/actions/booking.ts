//app/actions/booking.ts
"use server";

import {
  BookingStatus,
  type PaymentMethod,
  PaymentStatus,
  SourceType,
} from "@prisma/client";
import { prisma, getUser, User } from "@/lib/server-auth";
import { z } from "zod";
import sharp from "sharp";
import { revalidatePath } from "next/cache";

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
  const proofImage = formData.get("proofImage") as File;

  try {
    // Validate booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payments: {
          select: {
            status: true,
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
    } else if (booking.payments.some((payment) => payment.status === "PAID")) {
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
          amount: booking.amount,
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
      booking.status !== "PENDING" &&
        prisma.booking.update({
          where: { id: bookingId },
          data: { status: "PENDING" },
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
    const booking = await prisma.booking.findUniqueOrThrow({
      where: { id: bookingId },
    });

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

    if (["CANCELLED", "COMPLETED"].includes(booking.status)) {
      return { success: false, error: "Invalid state" };
    }

    await Promise.all([
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      }),
      prisma.payment.updateMany({
        where: { bookingId },
        data: { status: PaymentStatus.CANCELLED },
      }),
    ]);

    revalidatePath("/admin/bookings");
    revalidatePath("/pengguna/transactions");
    revalidatePath("/pengguna/booking/upload-payment");
    revalidatePath("/pengguna/booking/success");

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
        players: true,
        payments: {
          orderBy: {
            createdAt: "desc",
          },
        },
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

  let userIds = (
    await prisma.user.findMany({
      where: {
        username: {
          in: usernames,
        },
      },
      select: {
        id: true,
      },
    })
  ).map((user) => user.id);

  userIds.push(user.id);
  userIds = [...new Set(userIds)];

  const shouldAddPointNow =
    booking.status === "CONFIRMED" || booking.status === "COMPLETED";

  const points = Math.round((Number(booking.duration) * 20) / userIds.length);

  await Promise.all([
    prisma.player.createMany({
      data: players.map((player) => ({
        fullName: player,
        bookingId: bookingId,
      })),
    }),

    prisma.bookingUser.createMany({
      data: userIds.map((userId) => ({
        bookingId: bookingId,
        userId,
      })),
    }),

    shouldAddPointNow &&
      prisma.bookingPoint.createMany({
        data: userIds.map((userId) => ({
          bookingId: bookingId,
          userId,
          points,
        })),
      }),

    shouldAddPointNow &&
      prisma.pointSource.createMany({
        data: userIds.map((userId) => ({
          sourceId: bookingId,
          sourceType: "BOOKING",
          userId,
          points,
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
    const booking = await prisma.booking.findUniqueOrThrow({
      where: { id: bookingId },
      include: { bookingUser: { select: { userId: true } } },
    });

    if (booking.status !== "CONFIRMED") {
      return { success: false, error: "Invalid state" };
    }

    const userIds = [booking.userId];
    booking.bookingUser.forEach((user) => {
      userIds.push(user.userId);
    });

    const points = Math.round((Number(booking.duration) * 20) / userIds.length);

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    await Promise.all([
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.COMPLETED },
      }),

      prisma.userPoint.createMany({
        data: userIds.map((userId) => ({
          userId,
          points,
          isActive: true,
          expiryDate,
        })),
      }),

      prisma.pointSource.createMany({
        data: userIds.map((userId) => ({
          sourceId: bookingId,
          sourceType: "BOOKING",
          userId,
          points,
        })),
      }),
    ]);

    revalidatePath("/admin/bookings");
    revalidatePath("/pengguna/transactions");
    revalidatePath("/pengguna/booking/upload-payment");
    revalidatePath("/pengguna/booking/success");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unknown error occurred" };
  }
}
