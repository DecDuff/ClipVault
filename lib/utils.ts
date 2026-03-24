import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatDownloads(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}

export function calculateEarnings(downloads: number): number {
  const earningsPerBatch = parseFloat(process.env.EARNINGS_PER_5K_DOWNLOADS || '0.99');
  const batches = Math.floor(downloads / 5000);
  let total = batches * earningsPerBatch;

  if (downloads >= 1000000) {
    total += parseFloat(process.env.BONUS_1M_DOWNLOADS || '500');
  } else if (downloads >= 100000) {
    total += parseFloat(process.env.BONUS_100K_DOWNLOADS || '50');
  }

  return total;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getNextBonusMilestone(downloads: number): { milestone: number; bonus: number } | null {
  if (downloads < 100000) {
    return {
      milestone: 100000,
      bonus: parseFloat(process.env.BONUS_100K_DOWNLOADS || '50'),
    };
  } else if (downloads < 1000000) {
    return {
      milestone: 1000000,
      bonus: parseFloat(process.env.BONUS_1M_DOWNLOADS || '500'),
    };
  }
  return null;
}
