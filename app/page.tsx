"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <Image
        src="/BASland.jpg"
        alt="Borneo Anfield Stadium"
        fill
        className="object-cover object-top"
        priority
      />

      {/* Overlay & Content */}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center px-4">
        <div className="bg-black/60 p-10 rounded-lg max-w-4xl text-center">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold uppercase drop-shadow-lg">
            Welcome
          </h1>
          <h2 className="mt-4 text-white text-2xl md:text-3xl uppercase font-normal drop-shadow-md">
            Keeping the game beautiful
          </h2>
          <h3 className="mt-8 text-white text-xl md:text-2xl drop-shadow-sm">
            Borneo Anfield Stadium
          </h3>
          <Link
            href="/login"
            className="mt-6 inline-block px-8 py-3 bg-red-600 border-2 border-yellow-400 text-white text-lg rounded-lg transition-colors duration-300 hover:bg-red-700"
          >
            Lets Play
          </Link>
        </div>
      </div>
    </div>
  );
}