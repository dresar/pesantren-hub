import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(date: string | Date | undefined | null, formatStr: string = "dd MMMM yyyy"): string {
  if (!date) return "-";
  try {
    return format(new Date(date), formatStr, { locale: id });
  } catch (error) {
    return "-";
  }
}
export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return "-";
  try {
    return format(new Date(date), "dd MMMM yyyy HH:mm", { locale: id });
  } catch (error) {
    return "-";
  }
}
export function formatCurrency(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return "-";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     
    .replace(/[^\w\-]+/g, '') 
    .replace(/\-\-+/g, '-');  
}