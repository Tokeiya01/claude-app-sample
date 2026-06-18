'use client';
import { Attempt, ExamSession, UserProfile, Question } from './types';
import { todayStr } from './utils';

const KEYS = {
  attempts: 'ks2_attempts',
  sessions: 'ks2_sessions',
  profile: 'ks2_profile',
};

const DEFAULT_PROFILE: UserProfile = {
  display_name: 'ゲスト',
  goal_score: 700,
  preferred_difficulty: 'mixed',
  study_days: [],
  last_active_at: new Date().toISOString(),
};

export function getProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  const raw = localStorage.getItem(KEYS.profile);
  return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
}

export function saveProfile(profile: Partial<UserProfile>): void {
  const current = getProfile();
  localStorage.setItem(KEYS.profile, JSON.stringify({ ...current, ...profile }));
}

export function markStudyDay(): void {
  const profile = getProfile();
  const today = todayStr();
  if (!profile.study_days.includes(today)) {
    profile.study_days = [...profile.study_days, today];
    profile.last_active_at = new Date().toISOString();
    localStorage.setItem(KEYS.profile, JSON.stringify(profile));
  }
}

export function getAttempts(): Attempt[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.attempts);
  return raw ? JSON.parse(raw) : [];
}

export function saveAttempt(attempt: Attempt): void {
  const list = getAttempts();
  list.push(attempt);
  localStorage.setItem(KEYS.attempts, JSON.stringify(list.slice(-2000)));
  markStudyDay();
}

export function createAttempt(
  sessionId: string,
  questionId: string,
  mode: Attempt['mode'],
  selectedChoice: string,
  isCorrect: boolean,
  responseTimeSec: number,
  category: Attempt['category'],
  subcategory: string,
  difficulty: Attempt['difficulty']
): Attempt {
  return {
    id: 'a_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    session_id: sessionId,
    question_id: questionId,
    mode,
    selected_choice: selectedChoice,
    is_correct: isCorrect,
    answered_at: new Date().toISOString(),
    response_time_sec: responseTimeSec,
    category,
    subcategory,
    difficulty,
  };
}

export function getSessions(): ExamSession[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.sessions);
  return raw ? JSON.parse(raw) : [];
}

export function saveSession(session: ExamSession): void {
  const list = getSessions();
  const idx = list.findIndex(s => s.id === session.id);
  if (idx >= 0) list[idx] = session;
  else list.push(session);
  localStorage.setItem(KEYS.sessions, JSON.stringify(list.slice(-50)));
}

export function createSession(
  mode: ExamSession['mode'],
  questionIds: string[],
  timeLimitSec?: number
): ExamSession {
  return {
    id: 's_' + Date.now(),
    mode,
    started_at: new Date().toISOString(),
    question_ids: questionIds,
    answers: {},
    time_limit_sec: timeLimitSec,
  };
}

export function finishSession(
  session: ExamSession,
  answers: Record<string, string>,
  questions: Question[],
  elapsedSec: number
): ExamSession {
  const qMap = Object.fromEntries(questions.map(q => [q.id, q]));
  let correct = 0;
  const catBreakdown: Record<string, { correct: number; total: number }> = {};

  session.question_ids.forEach(qId => {
    const q = qMap[qId];
    if (!q) return;
    const isCorrect = answers[qId] === q.answer;
    if (isCorrect) correct++;
    const cat = q.category;
    if (!catBreakdown[cat]) catBreakdown[cat] = { correct: 0, total: 0 };
    catBreakdown[cat].total++;
    if (isCorrect) catBreakdown[cat].correct++;
  });

  const total = session.question_ids.length;
  const accuracy = total > 0 ? correct / total : 0;
  const score = Math.round(300 + accuracy * 600);

  return {
    ...session,
    answers,
    finished_at: new Date().toISOString(),
    score,
    accuracy,
    category_breakdown: catBreakdown,
    elapsed_sec: elapsedSec,
  };
}

export function clearAllData(): void {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
