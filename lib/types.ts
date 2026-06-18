// ============================================================
// KeizaiSense — Core Type Definitions
// ============================================================

export type CategoryId =
  | 'macro'        // マクロ経済
  | 'micro'        // ミクロ経済
  | 'finance'      // 金融・為替
  | 'fiscal'       // 財政・税制
  | 'global'       // 国際経済
  | 'strategy'     // 企業戦略
  | 'industry'     // 産業動向
  | 'tech'         // テクノロジー・AI
  | 'geopolitics'  // 政治・地政学と経済
  | 'esg'          // ESG・サステナビリティ
  | 'stats'        // 統計・指標の読み取り
  | 'news';        // 時事ニュース理解

export type Difficulty = 'easy' | 'medium' | 'hard';
export type SourceType = 'news' | 'concept' | 'mixed';
export type ExamMode = 'mock' | 'daily' | 'weak';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  color: string;       // Tailwind bg color class (light theme)
  textColor: string;   // Tailwind text color class
}

export interface Choice {
  id: string;  // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface Question {
  id: string;
  modes: ExamMode[];
  title?: string;
  question: string;
  choices: Choice[];
  answer: string;          // Choice id of correct answer
  explanation: string;     // Full explanation
  category: CategoryId;
  subcategory: string;
  difficulty: Difficulty;
  source_type: SourceType;
  source_title: string;
  source_url?: string;
  source_date?: string;
  generated_at: string;
  freshness_score: number;  // 0-1, higher = fresher
  quality_score: number;    // 0-1
  relevance_score: number;  // 0-1
  tags: string[];
  estimatedSeconds: number;
}

export interface Attempt {
  id: string;
  session_id: string;
  question_id: string;
  mode: ExamMode;
  selected_choice: string;
  is_correct: boolean;
  answered_at: string;  // ISO8601
  response_time_sec: number;
  category: CategoryId;
  subcategory: string;
  difficulty: Difficulty;
}

export interface ExamSession {
  id: string;
  mode: ExamMode;
  started_at: string;
  finished_at?: string;
  question_ids: string[];
  answers: Record<string, string>;  // questionId → choiceId
  score?: number;
  accuracy?: number;
  category_breakdown?: Record<string, { correct: number; total: number }>;
  weak_area_snapshot?: WeaknessData[];
  time_limit_sec?: number;
  elapsed_sec?: number;
}

export interface UserProfile {
  display_name: string;
  goal_score: number;
  preferred_difficulty: Difficulty | 'mixed';
  study_days: string[];  // YYYY-MM-DD[]
  last_active_at: string;
}

export interface WeaknessData {
  category: CategoryId;
  categoryName: string;
  totalAnswered: number;
  correctCount: number;
  accuracyRate: number;        // 0-1
  recentAccuracyRate: number;  // last 10 answers
  hardAccuracyRate: number;    // hard difficulty accuracy
  avgResponseSec: number;
  consecutiveWrong: number;
  recentDecline: number;       // 0-1, higher = more decline recently
  weakness_score: number;      // 0-1, higher = weaker
}

export interface CategoryMastery {
  category: CategoryId;
  categoryName: string;
  mastery_score: number;  // 0-1
  accuracy: number;
  hardAccuracy: number;
  improvement: number;
  speedBonus: number;
  stability: number;
}

export interface LearningStats {
  totalAnswered: number;
  totalCorrect: number;
  overallAccuracy: number;
  streakDays: number;
  todayAnswered: number;
  todayCorrect: number;
  mockSessionCount: number;
  lastMockScore?: number;
  lastMockDate?: string;
}
