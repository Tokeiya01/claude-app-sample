import { Attempt, WeaknessData, CategoryId } from '../types';
import { CATEGORIES } from '../categories';

export function analyzeWeakness(attempts: Attempt[]): WeaknessData[] {
  return CATEGORIES.map(cat => {
    const catAttempts = attempts.filter(a => a.category === cat.id);
    const recent = catAttempts.slice(-10);
    const prev10 = catAttempts.slice(-20, -10);

    const total = catAttempts.length;
    const correct = catAttempts.filter(a => a.is_correct).length;
    const recentCorrect = recent.filter(a => a.is_correct).length;
    const hardAttempts = catAttempts.filter(a => a.difficulty === 'hard');
    const hardCorrect = hardAttempts.filter(a => a.is_correct).length;

    const accuracyRate = total > 0 ? correct / total : 0.5;
    const recentAccuracyRate = recent.length > 0 ? recentCorrect / recent.length : accuracyRate;
    const hardAccuracyRate = hardAttempts.length > 0 ? hardCorrect / hardAttempts.length : accuracyRate;
    const avgResponseSec = total > 0
      ? catAttempts.reduce((s, a) => s + a.response_time_sec, 0) / total
      : 60;

    // Consecutive wrong streak (from most recent)
    let consecutiveWrong = 0;
    for (let i = catAttempts.length - 1; i >= 0; i--) {
      if (!catAttempts[i].is_correct) consecutiveWrong++;
      else break;
    }

    // Recent decline (compare recent 10 vs prev 10)
    const prevAccuracy = prev10.length > 0
      ? prev10.filter(a => a.is_correct).length / prev10.length
      : recentAccuracyRate;
    const recentDecline = Math.max(0, prevAccuracy - recentAccuracyRate);

    // weakness_score formula
    const errorRate = 1 - accuracyRate;
    const continuousScore = Math.min(consecutiveWrong / 5, 1.0);
    // Time over score: 1 if avg is 50% over estimated 65s, else proportional
    const timeOverScore = Math.min(Math.max(0, (avgResponseSec - 65) / 65), 1.0);
    const recencyScore = Math.min(recentDecline * 2, 1.0);

    const weakness_score = total === 0
      ? 0.3  // unknown = moderate weakness
      : errorRate * 0.45
      + continuousScore * 0.20
      + timeOverScore * 0.15
      + recencyScore * 0.20;

    return {
      category: cat.id as CategoryId,
      categoryName: cat.name,
      totalAnswered: total,
      correctCount: correct,
      accuracyRate,
      recentAccuracyRate,
      hardAccuracyRate,
      avgResponseSec,
      consecutiveWrong,
      recentDecline,
      weakness_score: Math.min(weakness_score, 1.0),
    };
  });
}
