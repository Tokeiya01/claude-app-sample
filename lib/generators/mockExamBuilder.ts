import { Question, CategoryId } from '../types';
import { CATEGORIES, MOCK_EXAM_DISTRIBUTION } from '../categories';
import { seededShuffle } from './seededRandom';

export function buildMockExam(allQuestions: Question[]): Question[] {
  const seed = `mock-${Date.now()}`;
  const selected: Question[] = [];
  const usedIds = new Set<string>();

  // Build per-category with difficulty distribution
  CATEGORIES.forEach(cat => {
    const total = MOCK_EXAM_DISTRIBUTION[cat.id as CategoryId] ?? 8;
    const easyCount = Math.round(total * 0.34);
    const medCount = Math.round(total * 0.42);
    const hardCount = total - easyCount - medCount;

    const pool = allQuestions.filter(q => q.category === cat.id);
    const easy = seededShuffle(pool.filter(q => q.difficulty === 'easy'), `${seed}-${cat.id}-e`);
    const med = seededShuffle(pool.filter(q => q.difficulty === 'medium'), `${seed}-${cat.id}-m`);
    const hard = seededShuffle(pool.filter(q => q.difficulty === 'hard'), `${seed}-${cat.id}-h`);

    const pick = [
      ...easy.slice(0, easyCount),
      ...med.slice(0, medCount),
      ...hard.slice(0, hardCount),
    ];

    // Fill if not enough
    if (pick.length < total) {
      const all = seededShuffle(pool.filter(q => !pick.some(p => p.id === q.id)), `${seed}-${cat.id}-fill`);
      pick.push(...all.slice(0, total - pick.length));
    }

    pick.slice(0, total).forEach(q => {
      if (!usedIds.has(q.id)) {
        selected.push(q);
        usedIds.add(q.id);
      }
    });
  });

  // Final shuffle for random category order
  return seededShuffle(selected, `${seed}-final`).slice(0, 100);
}
