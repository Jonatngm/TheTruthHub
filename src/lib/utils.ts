import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCount = (n?: number | null) => {
  if (n == null) return '0';
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${Math.round((n / 1000) * 10) / 10}k`;
  return `${Math.round((n / 1_000_000) * 10) / 10}M`;
};

