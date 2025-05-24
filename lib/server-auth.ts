import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = (globalForPrisma.prisma ??= new PrismaClient({
  log: [{ level: "query", emit: "stdout" }],
}));

// Secret key for JWT
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    (() => {
      throw new Error("JWT_SECRET not set");
    })(),
);

export type UserJwtPayload = {
  id: string;
  email: string;
  role: UserRole;
  username: string;
};

export async function signUp(
  username: string,
  email: string,
  password: string,
  fullName: string,
  phoneNumber: string | null,
  role: UserRole,
) {
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email already exists");
    }
    if (existingUser.username === username) {
      throw new Error("Username already exists");
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      fullName,
      phoneNumber,
      role,
    },
  });

  return user;
}

export async function signIn(emailOrUsername: string, password: string) {
  // Find user by email or username
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  // Create JWT token
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  // Set cookie dengan await
  (await cookies()).set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 86400, // 24 hours
    path: "/",
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
  };
}

export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("auth-token");
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      phoneNumber: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function getUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify<UserJwtPayload>(token, JWT_SECRET);

    return verified.payload;
  } catch {
    return null;
  }
}

export type User = NonNullable<Awaited<ReturnType<typeof getUser>>>;

export async function requireAuth(role: UserRole) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  } else if (user.role !== role) {
    const suffix = role === "CUSTOMER" ? "" : "-admin";

    redirect("/login" + suffix);
  }

  return user;
}
