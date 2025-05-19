import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import type { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Secret key for JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-at-least-32-characters-long");

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
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
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
export function useAuth() {
  const router = useRouter();
  
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      router.refresh(); // Refresh the page to clear the session
      router.push("/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return { logout };
}

export async function signOut() {
  // Delete cookie dengan await
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