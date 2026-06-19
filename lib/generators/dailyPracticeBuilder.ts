import { Question, CategoryId, Attempt } from '../types';
import { CATEGORIES } from '../categories';
import { seededShuffle, createSeededRng } from './seededRandom';

const TOTAL = 50;
const NEWS_COUNT = 10;
const CONCEPT_COUNT = 40;

export function buildDailyPractice(
  allQuestions: Question[],
  date: string,          // YYYY-MM-DD
  recentAttempts: Attempt[]
): Question[] {
  const rng = createSeededRng(date);
  const seed = `${date}-daily`;

  // Separate news and concept questions
  const newsQs = allQuestions.filter(q => q.source_type === 'news');
  const conceptQs = allQuestions.filter(q => q.source_type !== 'news');

  // Compute weakness weights per category
  const weights = computeCategoryWeights(recentAttempts);

  // Select concept questions with weighted category distribution
  const conceptSelected = selectWithWeights(conceptQs, CONCEPT_COUNT, weights, seed, rng);

  // Select news questions (pure random for freshness)
  const newsShuffled = seededShuffle(newsQs, `${seed}-news`);
  const newsSelected = newsShuffled.slice(0, Math.min(NEWS_COUNT, newsShuffled.length));

  // Fill remainder if news pool is small
  const remaining = TOTAL - newsSelected.length - conceptSelected.length;
  let extra: Question[] = [];
  if (remaining > 0) {
    const usedIds = new Set([...conceptSelected, ...newsSelected].map(q => q.id));
    const pool = allQuestions.filter(q => !usedIds.has(q.id));
    extra = seededShuffle(pool, `${seed}-extra`).slice(0, remaining);
  }

  // Merge and shuffle for final order
  const combined = [...conceptSelected, ...newsSelected, ...extra];
  return seededShuffle(combined, `${seed}-final`).slice(0, TOTAL);
}

function computeCategoryWeights(recentAttempts: Attempt[]): Record<CategoryId, number> {
  const base = 1.0;
  const weights: Record<string, number> = {};
  CATEGORIES.forEach(c => { weights[c.id] = base; });

  if (!recentAttempts.length) return weights as Record<CategoryId, number>;

  // Group recent attempts by category
  const byCat: Record<string, Attempt[]> = {};
  recentAttempts.slice(-100).forEach(a => {
    if (!byCat[a.category]) byCat[a.category] = [];
    byCat[a.category].push(a);
  });

  Object.entries(byCat).forEach(([cat, attempts]) => {
    const accuracy = attempts.filter(a => a.is_correct).length / attempts.length;
    // Weak categories get higher weight (more questions)
    if (accuracy < 0.5) weights[cat] = 2.0;
    else if (accuracy < 0.65) weights[cat] = 1.5;
    else if (accuracy > 0.85) weights[cat] = 0.7;
  });

  // Cap: no single category exceeds 8 questions (16% of 50)
  return weights as Record<CategoryId, number>;
}

function selectWithWeights(
  questions: Question[],
  total: number,
  weights: Record<CategoryId, number>,
  seed: string,
  rng: () => number
): Question[] {
  // Group by category
  const byCat: Record<string, Question[]> = {};
  questions.forEach(q => {
    if (!byCat[q.category]) byCat[q.category] = [];
    byCat[q.category].push(q);
  });

  // Compute allocations
  const totalWeight = Object.values(weights).reduce((s, w) => s + w, 0);
  const allocations: Record<string, number> = {};
  const MAX_PER_CAT = 8;

  CATEGORIES.forEach(c => {
    const raw = Math.round((weights[c.id] / totalWeight) * total);
    allocations[c.id] = Math.min(raw, MAX_PER_CAT);
  });

  // Select questions per category
  const selected: Question[] = [];
  const usedIds = new Set<string>();

  CATEGORIES.forEach(c => {
    const pool = (byCat[c.id] ?? []).filter(q => !usedIds.has(q.id));
    const shuffled = seededShuffle(pool, `${seed}-${c.id}`);
    const n = Math.min(allocations[c.id] ?? 4, shuffled.length);
    shuffled.slice(0, n).forEach(q => {
      selected.push(q);
      usedIds.add(q.id);
    });
  });

  // Fill remaining slots randomly
  if (selected.length < total) {
    const remaining = questions.filter(q => !usedIds.has(q.id));
    seededShuffle(remaining, `${seed}-fill`).slice(0, total - selected.length).forEach(q => {
      selected.push(q);
    });
  }

  return selected.slice(0, total);
}
