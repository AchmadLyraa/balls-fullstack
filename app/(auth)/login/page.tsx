"use client";

import { useState } from "react";
import { loginUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { getUser } from '@/app/actions/auth';

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
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
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        <form action={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email atau Username</label>
            <input
              name="emailOrUsername" // Pastikan nama ini sesuai
              type="text"
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password" // Pastikan nama ini sesuai
              type="password"
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}