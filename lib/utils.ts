import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(date: string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function isOverdue(date: string | null | undefined): boolean {
  if (!date) return false;
  return new Date(date) < new Date() && !isSameDay(date, new Date().toISOString());
}

export function isSameDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isToday(date: string | null | undefined): boolean {
  if (!date) return false;
  return isSameDay(date, new Date().toISOString());
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "critical":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    case "high":
      return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    case "medium":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    case "low":
      return "text-green-500 bg-green-500/10 border-green-500/20";
    default:
      return "text-gray-500 bg-gray-500/10 border-gray-500/20";
  }
}

export function getPriorityBg(priority: string): string {
  switch (priority) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "in-progress":
      return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    case "pending":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "archived":
      return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    default:
      return "text-gray-500 bg-gray-500/10 border-gray-500/20";
  }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateShort(date);
}

export function getDaysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil((e.getTime() - s.getTime()) / 86400000);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function getUserName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("taskora-user-name") || "";
}

export function setUserName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("taskora-user-name", name);
}
