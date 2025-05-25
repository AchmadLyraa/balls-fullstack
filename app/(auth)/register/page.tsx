"use client";

import { useState } from "react";
import { registerUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await registerUser(formData);
    setMessage(result.message);
    if (result.success) {
      router.push("/login");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Register</h2>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        <form action={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username" // Pastikan sesuai
              type="text"
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email" // Pastikan sesuai
              type="email"
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password" // Pastikan sesuai
              type="password"
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Fullname
            </label>
            <input
              name="fullName" // Pastikan sesuai
              type="text"
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone number
            </label>
            <input
              name="phoneNumber" // Pastikan sesuai
              type="text"
              className="mt-1 w-full rounded border p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
