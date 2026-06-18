import { Question, WeaknessData } from '../types';
import { CATEGORIES } from '../categories';
import { seededShuffle } from './seededRandom';

const TOTAL = 100;
const TOP_WEAK_COUNT = 3;
const TOP_WEAK_QUESTIONS = 20;  // each

export function buildWeakPractice(
  allQuestions: Question[],
  weaknessData: WeaknessData[]
): Question[] {
  const seed = `weak-${Date.now()}`;
  const sorted = [...weaknessData].sort((a, b) => b.weakness_score - a.weakness_score);
  const topWeak = sorted.slice(0, TOP_WEAK_COUNT);
  const restWeak = sorted.slice(TOP_WEAK_COUNT);

  const selected: Question[] = [];
  const usedIds = new Set<string>();

  // Top 3 weak categories: 20 questions each = 60
  topWeak.forEach(w => {
    const pool = allQuestions.filter(q => q.category === w.category);
    // Mix: hard questions first, then medium, then easy
    const hard = seededShuffle(pool.filter(q => q.difficulty === 'hard'), `${seed}-${w.category}-h`);
    const med = seededShuffle(pool.filter(q => q.difficulty === 'medium'), `${seed}-${w.category}-m`);
    const easy = seededShuffle(pool.filter(q => q.difficulty === 'easy'), `${seed}-${w.category}-e`);
    const ordered = [...hard, ...med, ...easy];

    ordered.slice(0, TOP_WEAK_QUESTIONS).forEach(q => {
      if (!usedIds.has(q.id)) {
        selected.push(q);
        usedIds.add(q.id);
      }
    });
  });

  // Remaining 40 questions: weighted by weakness_score from other categories
  const remaining = TOTAL - selected.length;
  if (remaining > 0 && restWeak.length > 0) {
    const totalScore = restWeak.reduce((s, w) => s + w.weakness_score, 0);
    restWeak.forEach(w => {
      const proportion = totalScore > 0 ? w.weakness_score / totalScore : 1 / restWeak.length;
      const n = Math.max(1, Math.round(proportion * remaining));
      const pool = allQuestions.filter(q => q.category === w.category && !usedIds.has(q.id));
      seededShuffle(pool, `${seed}-${w.category}-rest`)
        .slice(0, n)
        .forEach(q => {
          if (!usedIds.has(q.id)) {
            selected.push(q);
            usedIds.add(q.id);
          }
        });
    });
  }

  // Fill if still short
  if (selected.length < TOTAL) {
    const pool = allQuestions.filter(q => !usedIds.has(q.id));
    seededShuffle(pool, `${seed}-fill`)
      .slice(0, TOTAL - selected.length)
      .forEach(q => selected.push(q));
  }

  return seededShuffle(selected, `${seed}-final`).slice(0, TOTAL);
}

export function buildWeakCategoryBreakdown(
  weaknessData: WeaknessData[]
): { category: string; name: string; count: number; score: number }[] {
  const sorted = [...weaknessData].sort((a, b) => b.weakness_score - a.weakness_score);
  const totalScore = sorted.reduce((s, w) => s + w.weakness_score, 0);

  const topWeak = sorted.slice(0, TOP_WEAK_COUNT);
  const restWeak = sorted.slice(TOP_WEAK_COUNT);
  const restTotal = 40;
  const restScore = restWeak.reduce((s, w) => s + w.weakness_score, 0);

  return sorted.map(w => {
    const isTop = topWeak.some(t => t.category === w.category);
    const count = isTop
      ? TOP_WEAK_QUESTIONS
      : restScore > 0
      ? Math.max(1, Math.round((w.weakness_score / restScore) * restTotal))
      : Math.floor(restTotal / restWeak.length);
    return { category: w.category, name: w.categoryName, count, score: w.weakness_score };
  });
}
