import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatNumberFormatter = new Intl.NumberFormat("id-ID", {});

export function formatNumber(amount: number) {
  return formatNumberFormatter.format(amount);
}

export function formatMoney(amount: number) {
  return "Rp" + formatNumber(amount);
}

export function formatHM(date: Date) {
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  return `${hour}:${minute}`;
}

const formatDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(date: Date) {
  return formatDateFormatter.format(date);
}

export function ucFirst(str: string) {
  if (str === "") {
    return "";
  }

  return str[0]!.toUpperCase() + str.slice(1);
}
