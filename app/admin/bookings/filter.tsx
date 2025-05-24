"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";

export function generateUrl(page: number, query: string) {
  const queries = [];

  if (page > 1) {
    queries.push(`page=${page}`);
  }
  if (query) {
    queries.push(`query=${encodeURIComponent(query)}`);
  }

  return "/admin/bookings" + (queries.length ? "?" + queries.join("&") : "");
}

export default function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = useDebouncedCallback((query: string) => {
    let page = parseInt(searchParams.get("page") || "1");
    if (isNaN(page) || page < 1) {
      page = 1;
    }

    router.push(generateUrl(page, query));
  }, 300);

  return (
    <div className="relative ml-auto w-64">
      <Input
        placeholder="Search..."
        defaultValue={searchParams.get("query") ?? ""}
        onChange={(e) => {
          search(e.target.value);
        }}
        className="pl-8"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
