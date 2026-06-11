'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { QUESTIONS, SAMPLE_STUDY_LOGS } from '@/lib/sampleData';
import { CATEGORIES, heatmapColor } from '@/lib/categories';
import { WeaknessData } from '@/lib/types';
import { Card } from '@/components/ui/Card';

function computeWeakness(): WeaknessData[] {
  return CATEGORIES.map(cat => {
    const catQuestions = QUESTIONS.filter(q => q.categoryId === cat.id);
    const qIds = new Set(catQuestions.map(q => q.id));
    const logs = SAMPLE_STUDY_LOGS.filter(l => qIds.has(l.questionId));
    const recent = logs.slice(-10);

    const total = logs.length;
    const correct = logs.filter(l => l.isCorrect).length;
    const recentCorrect = recent.filter(l => l.isCorrect).length;
    const accuracy = total > 0 ? correct / total : 0.5;
    const recentAccuracy = recent.length > 0 ? recentCorrect / recent.length : 0.5;
    const avgTime = total > 0 ? logs.reduce((s, l) => s + l.timeSpentSeconds, 0) / total : 60;
    const score = total === 0 ? 0.5 : (1 - recentAccuracy) * 0.7 + (1 - accuracy) * 0.3;

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      totalAnswered: total,
      correctCount: correct,
      accuracyRate: accuracy,
      recentAccuracyRate: recentAccuracy,
      overdueReviewCount: 0,
      avgTimeSeconds: avgTime,
      score,
      color: heatmapColor(score),
    };
  }).sort((a, b) => b.score - a.score);
}

export default function AnalysisPage() {
  const weaknessData = computeWeakness();

  return (
    <div className="px-4 pt-6 space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-gray-200">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-gray-100">弱点ヒートマップ</h1>
      </div>

      <p className="text-gray-400 text-xs">色が赤いほど弱点分野です。タップしてその分野を集中練習できます。</p>

      {/* ヒートマップグリッド */}
      <div className="grid grid-cols-2 gap-2">
        {weaknessData.map(w => (
          <Link key={w.categoryId} href={`/study?category=${w.categoryId}`}>
            <div className={`rounded-xl p-4 ${w.color} border border-white/10 hover:opacity-90 transition-opacity`}>
              <p className="font-semibold text-sm">{w.categoryName}</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs opacity-80">
                  <span>正答率</span>
                  <span>{w.totalAnswered === 0 ? '未学習' : `${Math.round(w.accuracyRate * 100)}%`}</span>
                </div>
                <div className="flex justify-between text-xs opacity-80">
                  <span>解答数</span>
                  <span>{w.totalAnswered}問</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 詳細リスト */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 mb-2">分野別詳細</h2>
        <div className="space-y-2">
          {weaknessData.map((w, i) => (
            <Card key={w.categoryId}>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs w-4">{i + 1}</span>
                <div className={`w-2 h-8 rounded-full ${w.score > 0.6 ? 'bg-red-500' : w.score > 0.3 ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-200">{w.categoryName}</p>
                  <p className="text-xs text-gray-500">
                    {w.totalAnswered === 0 ? '未学習' : `${w.totalAnswered}問 / 正答率 ${Math.round(w.accuracyRate * 100)}%`}
                  </p>
                </div>
                <Link
                  href={`/study?category=${w.categoryId}`}
                  className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 border border-blue-800 rounded-lg"
                >
                  練習
                </Link>
              </div>
              {w.totalAnswered > 0 && (
                <div className="mt-2 bg-gray-800 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${w.score > 0.6 ? 'bg-red-500' : w.score > 0.3 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                    style={{ width: `${w.accuracyRate * 100}%` }}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
