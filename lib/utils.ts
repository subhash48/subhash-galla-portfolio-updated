import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Zero-padded index label, e.g. 3 -> "03". */
export function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}
