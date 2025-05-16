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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Registrasi</h2>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        <form action={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              name="username" // Pastikan sesuai
              type="text"
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email" // Pastikan sesuai
              type="email"
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password" // Pastikan sesuai
              type="password"
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              name="fullName" // Pastikan sesuai
              type="text"
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nomor Telepon (Opsional)</label>
            <input
              name="phoneNumber" // Pastikan sesuai
              type="text"
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Registrasi
          </button>
        </form>
      </div>
    </div>
  );
}