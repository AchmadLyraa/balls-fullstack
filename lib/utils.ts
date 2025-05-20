import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = new Intl.NumberFormat("id-ID").format;

export function formatMoney(amount: number) {
  return "Rp" + formatNumber(amount);
}

export function formatHM(date: Date) {
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  return `${hour}:${minute}`;
}

export const formatDate = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format;

export function ucFirst(str: string) {
  if (str === "") {
    return "";
  }

  return str[0]!.toUpperCase() + str.slice(1);
}

export function snakeCaseToTitleCase(str: string) {
  return str.split("_").map(ucFirst).join(" ");
}
