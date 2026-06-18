import { Attempt, ExamSession, LearningStats, CategoryMastery, CategoryId } from '../types';
import { CATEGORIES } from '../categories';
import { calcStreak, todayStr } from '../utils';

export function computeLearningStats(
  attempts: Attempt[],
  sessions: ExamSession[],
  studyDays: string[]
): LearningStats {
  const today = todayStr();
  const todayAttempts = attempts.filter(a => a.answered_at.slice(0, 10) === today);
  const mockSessions = sessions.filter(s => s.mode === 'mock' && s.finished_at);
  const lastMock = mockSessions[mockSessions.length - 1];

  return {
    totalAnswered: attempts.length,
    totalCorrect: attempts.filter(a => a.is_correct).length,
    overallAccuracy: attempts.length > 0
      ? attempts.filter(a => a.is_correct).length / attempts.length
      : 0,
    streakDays: calcStreak(studyDays),
    todayAnswered: todayAttempts.length,
    todayCorrect: todayAttempts.filter(a => a.is_correct).length,
    mockSessionCount: mockSessions.length,
    lastMockScore: lastMock?.score,
    lastMockDate: lastMock?.finished_at?.slice(0, 10),
  };
}

export function computeCategoryMastery(attempts: Attempt[]): CategoryMastery[] {
  return CATEGORIES.map(cat => {
    const catAttempts = attempts.filter(a => a.category === cat.id);
    const total = catAttempts.length;
    if (total === 0) {
      return {
        category: cat.id as CategoryId,
        categoryName: cat.name,
        mastery_score: 0,
        accuracy: 0,
        hardAccuracy: 0,
        improvement: 0,
        speedBonus: 0,
        stability: 0,
      };
    }

    const correct = catAttempts.filter(a => a.is_correct).length;
    const accuracy = correct / total;

    const hardAttempts = catAttempts.filter(a => a.difficulty === 'hard');
    const hardAccuracy = hardAttempts.length > 0
      ? hardAttempts.filter(a => a.is_correct).length / hardAttempts.length
      : 0;

    // Recent improvement: compare last 10 vs prev 10
    const recent = catAttempts.slice(-10);
    const prev = catAttempts.slice(-20, -10);
    const recentAcc = recent.length > 0 ? recent.filter(a => a.is_correct).length / recent.length : accuracy;
    const prevAcc = prev.length > 0 ? prev.filter(a => a.is_correct).length / prev.length : accuracy;
    const improvement = Math.max(-1, Math.min(1, (recentAcc - prevAcc) * 5 + 0.5));

    // Speed bonus: faster than estimated = bonus
    const avgTime = catAttempts.reduce((s, a) => s + a.response_time_sec, 0) / total;
    const speedBonus = Math.min(1, Math.max(0, 1 - (avgTime - 45) / 90));

    // Stability: low variance = stable
    const weeklyAccuracies = computeWeeklyAccuracies(catAttempts);
    const stability = weeklyAccuracies.length > 1
      ? Math.max(0, 1 - stddev(weeklyAccuracies))
      : 0.5;

    const mastery_score = Math.min(1, Math.max(0,
      accuracy * 0.50
      + hardAccuracy * 0.20
      + improvement * 0.10
      + speedBonus * 0.10
      + stability * 0.10
    ));

    return {
      category: cat.id as CategoryId,
      categoryName: cat.name,
      mastery_score,
      accuracy,
      hardAccuracy,
      improvement: recentAcc - prevAcc,
      speedBonus,
      stability,
    };
  });
}

function computeWeeklyAccuracies(attempts: Attempt[]): number[] {
  if (!attempts.length) return [];
  const byWeek: Record<string, Attempt[]> = {};
  attempts.forEach(a => {
    const d = new Date(a.answered_at);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    if (!byWeek[key]) byWeek[key] = [];
    byWeek[key].push(a);
  });
  return Object.values(byWeek).map(ws =>
    ws.filter(a => a.is_correct).length / ws.length
  );
}

function stddev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function computeMockScoreHistory(sessions: ExamSession[]): { date: string; score: number; accuracy: number }[] {
  return sessions
    .filter(s => s.mode === 'mock' && s.finished_at && s.accuracy !== undefined)
    .map(s => ({
      date: s.finished_at!.slice(0, 10),
      score: s.score ?? 0,
      accuracy: s.accuracy ?? 0,
    }))
    .slice(-10);
}

export function computeDifficultyBreakdown(attempts: Attempt[]): {
  easy: { total: number; correct: number };
  medium: { total: number; correct: number };
  hard: { total: number; correct: number };
} {
  const result = {
    easy: { total: 0, correct: 0 },
    medium: { total: 0, correct: 0 },
    hard: { total: 0, correct: 0 },
  };
  attempts.forEach(a => {
    const d = a.difficulty as keyof typeof result;
    result[d].total++;
    if (a.is_correct) result[d].correct++;
  });
  return result;
}
