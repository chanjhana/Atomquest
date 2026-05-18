import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatDate(value?: string | Date | null): string {
  if (!value) return "—";
  return format(new Date(value), "dd MMM yyyy");
}

export function formatDateTime(value?: string | Date | null): string {
  if (!value) return "—";
  return format(new Date(value), "dd MMM yyyy, h:mm a");
}

export function formatRelative(value?: string | Date | null): string {
  if (!value) return "—";
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}
