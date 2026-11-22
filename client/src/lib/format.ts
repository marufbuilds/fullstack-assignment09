// Tiny formatting helpers shared by every page.

import type { BookingStatus } from "./types";

export function money(value: number): string {
  const amount = Number(value || 0);
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateRange(start?: string, end?: string): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

/** Days between two yyyy-mm-dd strings (always at least 1). */
export function daysBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const from = new Date(`${start}T00:00:00`).getTime();
  const to = new Date(`${end}T00:00:00`).getTime();
  if (!Number.isFinite(from) || !Number.isFinite(to)) return 0;
  return Math.max(0, Math.ceil((to - from) / 86400000));
}

export function rentalUnit(rentalType?: string): string {
  const value = (rentalType || "daily").toLowerCase();
  if (value.includes("hour")) return "hour";
  if (value.includes("week")) return "week";
  return "day";
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending approval",
  confirmed: "Confirmed",
  rejected: "Rejected",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const LISTING_STATUS_LABELS: Record<string, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

export function initials(name?: string): string {
  if (!name) return "E";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function rentalDays(startDate: string, endDate: string): number {
  return Math.max(1, daysBetween(startDate, endDate));
}
