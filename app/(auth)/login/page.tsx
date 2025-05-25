"use client";

import { useState } from "react";
import { loginUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { getUser } from "@/app/actions/auth";

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      const result = await loginUser(formData);
      setMessage(result.message);

      if (result.success) {
        const user = await getUser(); // Ambil data user untuk redirect berdasarkan role
        if (user?.role === "CUSTOMER") {
          router.push("/pengguna");
        } else if (user?.role === "ADMIN") {
          router.push("/admin");
        } else if (user?.role === "SUPER_ADMIN") {
          router.push("/super-admin");
        }
      }
    } catch {
      setMessage("An unknown error occurred");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        <form action={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email or Username
            </label>
            <input
              name="emailOrUsername" // Pastikan nama ini sesuai
              type="text"
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password" // Pastikan nama ini sesuai
              type="password"
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="h-10 w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
