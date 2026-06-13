import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

// ======================= WIB DATE FORMATTING =======================

const WIB_TIMEZONE = "Asia/Jakarta";

/** Format tanggal pendek: "13 Jun 2026" */
export function formatDateWIB(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: WIB_TIMEZONE,
  }).format(new Date(date));
}

/** Format tanggal panjang: "13 Juni 2026" */
export function formatDateLongWIB(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: WIB_TIMEZONE,
  }).format(new Date(date));
}

/** Format tanggal medium: "13 Jun 2026" (dateStyle: medium) */
export function formatDateMediumWIB(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: WIB_TIMEZONE,
  }).format(new Date(date));
}

/** Format bulan & tahun: "Juni 2026" */
export function formatMonthYearWIB(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: WIB_TIMEZONE,
  }).format(new Date(date));
}

/** Format tanggal + waktu: "13 Jun 2026, 20:30 WIB" */
export function formatDateTimeWIB(date: Date | string): string {
  const formatted = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: WIB_TIMEZONE,
  }).format(new Date(date));
  return `${formatted} WIB`;
}

/** Format waktu saja: "20:30" */
export function formatTimeWIB(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: WIB_TIMEZONE,
  }).format(new Date(date));
}

