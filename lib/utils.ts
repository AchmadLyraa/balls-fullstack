import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = new Intl.NumberFormat("id-ID").format;

export function formatMoney(amount: number) {
  return "Rp" + formatNumber(amount);
}

export function formatHM(date: Date, separator = ":") {
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  return hour + separator + minute;
}

export const formatDate = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format;

export function formatDateYMD(date: Date) {
  return (
    date.getUTCFullYear() +
    "-" +
    date.getUTCMonth().toString().padStart(2, "0") +
    "-" +
    date.getUTCDate().toString().padStart(2, "0")
  );
}

export function formatUtcDateDMY(date: Date) {
  return (
    date.getUTCDate().toString().padStart(2, "0") +
    "-" +
    date.getUTCMonth().toString().padStart(2, "0") +
    "-" +
    date.getUTCFullYear()
  );
}

export function formatDateDMY(date: Date) {
  return (
    date.getDate().toString().padStart(2, "0") +
    "-" +
    date.getMonth().toString().padStart(2, "0") +
    "-" +
    date.getFullYear()
  );
}

export function ucFirst(str: string) {
  if (str === "") {
    return "";
  }

  return str[0]!.toUpperCase() + str.slice(1);
}

export function snakeCaseToTitleCase(str: string) {
  return str.split("_").map(ucFirst).join(" ");
}

export function camelCaseToTitleCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export function parseDate(searchString: string | string[] | undefined) {
  if (typeof searchString === "string") {
    const result = new Date(searchString);
    if (isFinite(result.getTime())) {
      return result;
    }
  }
}
