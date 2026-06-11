// ============================================================
// Core Types for 日経TEST対策アプリ「KeizaiSense」
// ============================================================

export type Difficulty = 'easy' | 'medium' | 'hard';
export type FSRSRating = 1 | 2 | 3 | 4; // Again / Hard / Good / Easy

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string; // tailwind color class
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Explanation {
  summary: string;
  detail: string;
  keywords: string[];
  references?: string[];
}

export interface Question {
  id: string;
  categoryId: string;
  text: string;
  choices: Choice[];
  explanation: Explanation;
  difficulty: Difficulty;
  estimatedSeconds: number;
  tags: string[];
  type: 'fixed' | 'news';
  // news-only fields
  newsSourceId?: string;
  newsArticleId?: string;
  publishedAt?: string;
  relatedKeywords?: string[];
  isArchived?: boolean;
}

export interface StudyLog {
  id: string;
  questionId: string;
  answeredAt: string;
  selectedChoiceId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  fsrsRating?: FSRSRating;
}

export interface ReviewState {
  questionId: string;
  stability: number;    // FSRS stability (days)
  difficulty: number;   // FSRS difficulty 0-1
  dueDate: string;      // ISO date
  reviewCount: number;
  lapseCount: number;
  lastReviewedAt: string;
}

export interface MockTestResult {
  id: string;
  takenAt: string;
  mode: 'standard' | 'news-mix';
  questionIds: string[];
  answers: { questionId: string; choiceId: string; isCorrect: boolean }[];
  durationSeconds: number;
  scorePercent: number;
  categoryScores: { categoryId: string; correct: number; total: number }[];
}

export interface DailyChallenge {
  date: string; // YYYY-MM-DD
  questionIds: string[];
  completedAt?: string;
  score?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl?: string;
  publishedAt: string;
  categoryId: string;
  keywords: string[];
  isProcessed: boolean;
}

export interface WeaknessData {
  categoryId: string;
  categoryName: string;
  totalAnswered: number;
  correctCount: number;
  accuracyRate: number;        // 0-1
  recentAccuracyRate: number;  // last 10 answers
  overdueReviewCount: number;
  avgTimeSeconds: number;
  score: number;               // weakness score 0-1 (higher = weaker)
  color: string;               // heatmap color
}

export interface LearningStats {
  todayCount: number;
  streakDays: number;
  totalAnswered: number;
  totalCorrect: number;
  overdueReviews: number;
  weeklyGoal: number;
  weeklyProgress: number;
}
