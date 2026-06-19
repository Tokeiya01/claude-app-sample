import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function calcStreak(studyDays: string[]): number {
  if (!studyDays.length) return 0;
  const sorted = [...studyDays].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  let streak = 0;
  let current = today;
  for (const day of sorted) {
    if (day === current) {
      streak++;
      const d = new Date(current);
      d.setDate(d.getDate() - 1);
      current = d.toISOString().slice(0, 10);
    } else if (day < current) {
      break;
    }
  }
  return streak;
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function scoreToLevel(accuracy: number): string {
  if (accuracy >= 0.85) return '優秀';
  if (accuracy >= 0.70) return '良好';
  if (accuracy >= 0.55) return '普通';
  if (accuracy >= 0.40) return '要努力';
  return '要強化';
}

export function accuracyToColor(accuracy: number): string {
  if (accuracy >= 0.80) return 'text-emerald-600';
  if (accuracy >= 0.65) return 'text-blue-600';
  if (accuracy >= 0.50) return 'text-amber-600';
  return 'text-red-600';
}

export function accuracyToBg(accuracy: number): string {
  if (accuracy >= 0.80) return 'bg-emerald-100 text-emerald-800';
  if (accuracy >= 0.65) return 'bg-blue-100 text-blue-800';
  if (accuracy >= 0.50) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
}

export function difficultyLabel(d: string): string {
  return d === 'easy' ? '基礎' : d === 'medium' ? '標準' : '応用';
}

export function difficultyColor(d: string): string {
  return d === 'easy'
    ? 'bg-green-100 text-green-700'
    : d === 'medium'
    ? 'bg-yellow-100 text-yellow-700'
    : 'bg-red-100 text-red-700';
}
