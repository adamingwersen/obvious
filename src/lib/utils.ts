import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { transliterate } from "transliteration";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function daysFromToday(date: Date) {
  const now = new Date();
  const differenceMs = Math.abs(date.getTime() - now.getTime());
  return Math.round(differenceMs / (1000 * 3600 * 24));
}

export function transliterateFileName(fileName: string) {
  return transliterate(fileName);
}
