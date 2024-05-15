import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function daysFromToday(date: Date) {
  const now = new Date();
  const differenceMs = Math.abs(date.getTime() - now.getTime());
  return Math.round(differenceMs / (1000 * 3600 * 24));
}
