'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { QUESTIONS, SAMPLE_REVIEW_STATES } from '@/lib/sampleData';
import { isDue, daysUntilDue } from '@/lib/fsrs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CATEGORIES, categoryColorMap } from '@/lib/categories';
import QuestionCard from '@/components/QuestionCard';

export default function ReviewPage() {
  const dueStates = SAMPLE_REVIEW_STATES.filter(isDue);
  const dueQuestions = dueStates
    .map(s => QUESTIONS.find(q => q.id === s.questionId))
    .filter(Boolean) as typeof QUESTIONS;

  const upcomingStates = SAMPLE_REVIEW_STATES.filter(s => !isDue(s));

  const [currentIdx, setCurrentIdx] = useState<number | null>(null);

  if (currentIdx !== null) {
    const q = dueQuestions[currentIdx];
    return (
      <QuestionCard
        question={q}
        onBack={() => setCurrentIdx(null)}
        onNext={() => {
          if (currentIdx + 1 < dueQuestions.length) setCurrentIdx(currentIdx + 1);
          else setCurrentIdx(null);
        }}
      />
    );
  }

  return (
    <div className="px-4 pt-6 space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-gray-200">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-gray-100">復習キュー</h1>
      </div>

      {/* 今日の復習 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-300">復習すべき問題</h2>
          <Badge className="bg-red-900/40 text-red-300 border-red-700">{dueQuestions.length}問</Badge>
        </div>

        {dueQuestions.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-3">
            <CheckCircle size={40} className="text-emerald-400" />
            <p className="text-gray-400 text-sm">今日の復習は完了しています！</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dueQuestions.map((q, i) => (
              <Card key={q.id} onClick={() => setCurrentIdx(i)} className="hover:border-red-700">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-1 mb-1">
                      <Badge className={categoryColorMap[q.categoryId]}>
                        {CATEGORIES.find(c => c.id === q.categoryId)?.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-200 line-clamp-2">{q.text}</p>
                  </div>
                  <Badge className="bg-red-900/40 text-red-300 border-red-700 shrink-0">要復習</Badge>
                </div>
              </Card>
            ))}
            {dueQuestions.length > 0 && (
              <button
                onClick={() => setCurrentIdx(0)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-sm font-medium"
              >
                まとめて復習する ({dueQuestions.length}問)
              </button>
            )}
          </div>
        )}
      </div>

      {/* 今後の復習予定 */}
      {upcomingStates.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-300 mb-2">近日中の復習予定</h2>
          <div className="space-y-2">
            {upcomingStates.map(state => {
              const q = QUESTIONS.find(q => q.id === state.questionId);
              if (!q) return null;
              const days = daysUntilDue(state);
              return (
                <Card key={state.questionId} className="opacity-70">
                  <div className="flex items-center gap-3">
                    <Clock size={14} className="text-gray-500 shrink-0" />
                    <p className="text-sm text-gray-400 flex-1 line-clamp-1">{q.text}</p>
                    <span className="text-xs text-gray-500 shrink-0">{days}日後</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
