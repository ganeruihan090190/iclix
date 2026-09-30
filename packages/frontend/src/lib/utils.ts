import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes?: number): string {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function formatYear(year: number): string {
  return year.toString();
}

export function formatProgress(seconds: number, durationMinutes?: number): string {
  if (!durationMinutes) return '';
  const total = durationMinutes * 60;
  const pct = Math.round((seconds / total) * 100);
  return `${pct}%`;
}

export function getImageFallback(seed: string, width = 400, height = 600): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
