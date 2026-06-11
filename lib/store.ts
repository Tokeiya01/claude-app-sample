'use client';
// ============================================================
// Simple in-memory + localStorage store (no backend for MVP)
// ============================================================
import { StudyLog, ReviewState, FSRSRating } from './types';
import { SAMPLE_STUDY_LOGS, SAMPLE_REVIEW_STATES } from './sampleData';
import { initReviewState, updateReviewState } from './fsrs';

const LOGS_KEY = 'ks_study_logs';
const REVIEWS_KEY = 'ks_review_states';

export function getLogs(): StudyLog[] {
  if (typeof window === 'undefined') return SAMPLE_STUDY_LOGS;
  const raw = localStorage.getItem(LOGS_KEY);
  return raw ? JSON.parse(raw) : SAMPLE_STUDY_LOGS;
}

export function getReviewStates(): ReviewState[] {
  if (typeof window === 'undefined') return SAMPLE_REVIEW_STATES;
  const raw = localStorage.getItem(REVIEWS_KEY);
  return raw ? JSON.parse(raw) : SAMPLE_REVIEW_STATES;
}

export function saveLog(log: StudyLog): void {
  const logs = getLogs();
  logs.push(log);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function recordAnswer(
  questionId: string,
  choiceId: string,
  isCorrect: boolean,
  timeSpentSeconds: number,
  rating: FSRSRating
): void {
  const log: StudyLog = {
    id: `sl_${Date.now()}`,
    questionId,
    answeredAt: new Date().toISOString(),
    selectedChoiceId: choiceId,
    isCorrect,
    timeSpentSeconds,
    fsrsRating: rating,
  };
  saveLog(log);

  // Update or create ReviewState
  const states = getReviewStates();
  const existingIdx = states.findIndex(s => s.questionId === questionId);
  if (existingIdx >= 0) {
    states[existingIdx] = updateReviewState(states[existingIdx], rating);
  } else {
    states.push(initReviewState(questionId, rating));
  }
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(states));
}

export function getWeaknessData() {
  const logs = getLogs();
  const states = getReviewStates();
  return { logs, states };
}
