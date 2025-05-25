"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { jwtVerify } from "jose";
import { prisma, type UserJwtPayload } from "@/lib/server-auth";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key",
);

const registerSchema = z.object({
  username: z.string().min(3, "Username harus minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password harus minimal 6 karakter"),
  fullName: z.string().min(3, "Nama lengkap harus minimal 3 karakter"),
  phoneNumber: z.string().optional(),
  role: z
    .enum([UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN])
    .default(UserRole.CUSTOMER),
});

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email atau username diperlukan"),
  password: z.string().min(1, "Password diperlukan"),
});

export async function registerUser(formData: FormData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const fullName = formData.get("fullName");
  const phoneNumber = formData.get("phoneNumber") as string | null;
  const role = (formData.get("role") as UserRole) || UserRole.CUSTOMER;

  // Pengecekan null untuk field wajib
  if (!username || !email || !password || !fullName) {
    return { success: false, message: "Semua field wajib diisi" };
  }

  try {
    const validated = registerSchema.parse({
      username,
      email,
      password,
      fullName,
      phoneNumber,
      role,
    });

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: validated.username }, { email: validated.email }],
      },
    });

    if (existingUser) {
      return { success: false, message: "Username or email is already in use" };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    await prisma.user.create({
      data: {
        username: validated.username,
        email: validated.email,
        password: hashedPassword,
        fullName: validated.fullName,
        phoneNumber: validated.phoneNumber,
        role: validated.role,
        isActive: true,
      },
    });

    return { success: true, message: "RSuccessful registration, please login" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    return { success: false, message: "An unknown error occurred" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function loginUser(formData: FormData) {
  const emailOrUsername = formData.get("emailOrUsername");
  const password = formData.get("password");

  // Pengecekan null untuk field wajib
  if (!emailOrUsername || !password) {
    return {
      success: false,
      message: "Email/username and password are required",
    };
  }

  try {
    const validated = loginSchema.parse({ emailOrUsername, password });

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validated.emailOrUsername },
          { username: validated.emailOrUsername },
        ],
      },
    });

    if (!user || !(await bcrypt.compare(validated.password, user.password))) {
      return {
        success: false,
        message: "This credentials does not match our records",
      };
    }

    const token = sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 jam
    });

    return { success: true, message: "", role: user.role };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    return { success: false, message: "An unknown error occurred" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  try {
    const verified = await jwtVerify<UserJwtPayload>(token, JWT_SECRET);
    return verified.payload;
  } catch (error) {
    return null;
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  return { success: true, message: "Logout berhasil" };
}
