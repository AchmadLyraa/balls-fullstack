"use server";

import { BookingStatus } from "@prisma/client";
import { getUser } from "@/lib/server-auth";
import { z } from "zod";
import { prisma } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { addAdminSchema } from "../super-admin/add-admin/schema";
import { editAdminSchema } from "../super-admin/edit-admin/[id]/schema";

export async function confirmPayment(formData: FormData) {
  const paymentId = formData.get("paymentId") as string;
  const note = formData.get("note") as string;

  try {
    const checkPayment = await prisma.payment.findFirst({
      where: { id: paymentId },
      select: { status: true },
    });
    if (!checkPayment) {
      return { success: false, error: "Payment not found" };
    } else if (checkPayment.status === "PAID") {
      return { success: false, error: "This payment has been verified" };
    } else if (checkPayment.status !== "PENDING") {
      return { success: false, error: "Payment status is invalid" };
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "PAID", notes: note },
    });

    // If payment is confirmed, update booking status
    // if (status === "PAID") {
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: BookingStatus.CONFIRMED },
    });

    // Add stamps to loyalty card (1 stamp per booking)
    // const loyaltyCard = await prisma.loyaltyCard.findUnique({
    //   where: { userId: payment.userId },
    // });

    // if (loyaltyCard) {
    //   await prisma.loyaltyCard.update({
    //     where: { id: loyaltyCard.id },
    //     data: { stamps: loyaltyCard.stamps + 1 },
    //   });
    // } else {
    //   await prisma.loyaltyCard.create({
    //     data: {
    //       userId: payment.userId,
    //       stamps: 1,
    //     },
    //   });
    // }
    // }

    revalidatePath("/admin/transactions");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unknown error occurred" };
  }
}

export async function createAdmin(data: z.infer<typeof addAdminSchema>) {
  const user = await getUser();

  if (!user || user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    data = addAdminSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      if (existingUser.username === data.username) {
        return { success: false, error: "Username already exists" };
      } else if (existingUser.email === data.email) {
        return { success: false, error: "Email already exists" };
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const newAdmin = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        role: "ADMIN",
      },
    });

    return { success: true };
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

export async function updateAdmin(
  adminId: string,
  data: z.infer<typeof editAdminSchema>,
) {
  const user = await getUser();

  if (!user || user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    data = editAdminSchema.parse(data);

    // Check if admin exists
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return { success: false, error: "Admin not found" };
    }

    // Check if username or email is already taken by another user
    if (data.username !== admin.username || data.email !== admin.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email, id: { not: adminId } },
            { username: data.username, id: { not: adminId } },
          ],
        },
      });

      if (existingUser) {
        if (existingUser.email === data.email) {
          return { success: false, error: "Email already exists" };
        }
        if (existingUser.username === data.username) {
          return { success: false, error: "Username already exists" };
        }
      }
    }

    // Update admin
    await prisma.user.update({
      where: { id: adminId },
      data,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unknown error occurred" };
  }
}

export async function deleteAdmin(adminId: string) {
  const user = await getUser();

  if (!user || user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if admin exists
    const admin = await prisma.user.findUnique({
      where: { id: adminId, role: "ADMIN" },
    });

    if (!admin) {
      return { success: false, error: "Admin not found" };
    }

    await prisma.user.delete({
      where: { id: adminId },
    });

    revalidatePath("super-admin");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unknown error occurred" };
  }
}
