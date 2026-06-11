// ============================================================
// FSRS-inspired Spaced Repetition Logic
// Simplified implementation for 日経TEST app
// ============================================================
import { ReviewState, FSRSRating } from './types';

const STABILITY_INITIAL: Record<FSRSRating, number> = {
  1: 0.4,  // Again
  2: 1.5,  // Hard
  3: 3.5,  // Good
  4: 7.0,  // Easy
};

const DIFFICULTY_INITIAL: Record<FSRSRating, number> = {
  1: 0.9,
  2: 0.7,
  3: 0.5,
  4: 0.3,
};

const RETENTION_TARGET = 0.9; // 90%保持率目標

function retrievability(stability: number, daysSinceReview: number): number {
  return Math.pow(1 + daysSinceReview / (9 * stability), -1);
}

function nextInterval(stability: number): number {
  return Math.max(1, Math.round(stability * 9 * (RETENTION_TARGET / (1 - RETENTION_TARGET))));
}

export function initReviewState(questionId: string, rating: FSRSRating): ReviewState {
  const stability = STABILITY_INITIAL[rating];
  const difficulty = DIFFICULTY_INITIAL[rating];
  const interval = nextInterval(stability);
  const due = new Date();
  due.setDate(due.getDate() + interval);

  return {
    questionId,
    stability,
    difficulty,
    dueDate: due.toISOString(),
    reviewCount: 1,
    lapseCount: rating === 1 ? 1 : 0,
    lastReviewedAt: new Date().toISOString(),
  };
}

export function updateReviewState(state: ReviewState, rating: FSRSRating): ReviewState {
  const daysSince = (Date.now() - new Date(state.lastReviewedAt).getTime()) / 86400000;
  const r = retrievability(state.stability, daysSince);

  let newStability: number;
  let newDifficulty: number;
  let lapseCount = state.lapseCount;

  if (rating === 1) {
    // Again: reset
    newStability = STABILITY_INITIAL[1];
    newDifficulty = Math.min(1, state.difficulty + 0.2);
    lapseCount += 1;
  } else {
    // Hard/Good/Easy: increase stability
    const ratingFactor = { 2: 0.8, 3: 1.0, 4: 1.3 }[rating] ?? 1.0;
    newStability = state.stability * (1 + Math.exp(ratingFactor) * (11 - state.difficulty) * Math.pow(state.stability, -0.2) * (Math.exp((1 - r) * ratingFactor) - 1));
    newDifficulty = Math.max(0.1, state.difficulty + (rating === 2 ? 0.05 : rating === 4 ? -0.1 : 0));
  }

  const interval = nextInterval(newStability);
  const due = new Date();
  due.setDate(due.getDate() + interval);

  return {
    ...state,
    stability: newStability,
    difficulty: newDifficulty,
    dueDate: due.toISOString(),
    reviewCount: state.reviewCount + 1,
    lapseCount,
    lastReviewedAt: new Date().toISOString(),
  };
}

export function isDue(state: ReviewState): boolean {
  return new Date(state.dueDate) <= new Date();
}

export function daysUntilDue(state: ReviewState): number {
  const ms = new Date(state.dueDate).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}

// 日本語UIラベル
export const FSRS_LABELS: Record<FSRSRating, { label: string; color: string; description: string }> = {
  1: { label: 'もう一度', color: 'bg-red-700 hover:bg-red-600', description: '全く思い出せなかった' },
  2: { label: '難しい', color: 'bg-orange-600 hover:bg-orange-500', description: '正解したが自信がなかった' },
  3: { label: '正解', color: 'bg-emerald-700 hover:bg-emerald-600', description: '正しく答えられた' },
  4: { label: '完璧', color: 'bg-blue-700 hover:bg-blue-600', description: 'すぐに思い出せた' },
};
