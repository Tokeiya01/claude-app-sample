'use client';
import Link from 'next/link';
import { Trophy, Clock, Target, ChevronRight, RefreshCcw } from 'lucide-react';
import { ExamSession, Question } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { HorizontalBarChart } from '@/components/ui/charts/BarChart';
import { CATEGORIES } from '@/lib/categories';
import { formatTime, accuracyToColor } from '@/lib/utils';

interface Props {
  session: ExamSession;
  questions: Question[];
  answers: Record<string, string>;
  elapsedSec: number;
  onExit: () => void;
}

export default function ResultScreen({ session, questions, answers, elapsedSec, onExit }: Props) {
  const accuracy = session.accuracy ?? 0;
  const score = session.score ?? 0;
  const answeredCount = Object.keys(answers).length;
  const correctCount = Math.round(accuracy * answeredCount);

  const modeLabel = session.mode === 'mock' ? '模試' : session.mode === 'daily' ? '今日の練習' : '弱点克服';

  // Category breakdown
  const catItems = CATEGORIES.map(cat => {
    const breakdown = session.category_breakdown?.[cat.id];
    if (!breakdown || breakdown.total === 0) return null;
    return {
      label: cat.name,
      value: breakdown.total > 0 ? breakdown.correct / breakdown.total : 0,
      count: breakdown.total,
    };
  }).filter(Boolean) as { label: string; value: number; count: number }[];

  catItems.sort((a, b) => b.value - a.value);

  // Weakest categories
  const weakCats = [...catItems].sort((a, b) => a.value - b.value).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero score */}
      <div className={`px-4 pt-8 pb-6 text-white ${
        accuracy >= 0.8 ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
        : accuracy >= 0.6 ? 'bg-gradient-to-br from-blue-500 to-blue-700'
        : 'bg-gradient-to-br from-amber-500 to-orange-600'
      }`}>
        <div className="text-center">
          <p className="text-sm font-medium opacity-80 mb-1">{modeLabel}結果</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy size={28} />
          </div>
          {session.mode === 'mock' ? (
            <>
              <p className="text-5xl font-extrabold mb-1">{score}<span className="text-2xl font-bold ml-1">点</span></p>
              <p className="text-lg font-semibold opacity-90">正答率 {Math.round(accuracy * 100)}%</p>
            </>
          ) : (
            <>
              <p className="text-5xl font-extrabold mb-1">{Math.round(accuracy * 100)}<span className="text-2xl font-bold ml-0.5">%</span></p>
              <p className="text-lg font-semibold opacity-90">{correctCount}/{answeredCount}問 正解</p>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <Clock size={16} className="mx-auto mb-1 opacity-80" />
            <p className="text-lg font-bold">{formatTime(elapsedSec)}</p>
            <p className="text-xs opacity-80">所要時間</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <Target size={16} className="mx-auto mb-1 opacity-80" />
            <p className="text-lg font-bold">{correctCount}/{answeredCount}</p>
            <p className="text-xs opacity-80">正答数</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Category breakdown */}
        {catItems.length > 0 && (
          <Card>
            <p className="text-base font-bold text-gray-800 mb-4">カテゴリ別正答率</p>
            <HorizontalBarChart items={catItems} />
          </Card>
        )}

        {/* Weak areas */}
        {weakCats.length > 0 && weakCats[0].value < 0.7 && (
          <Card className="border-amber-200 bg-amber-50">
            <p className="text-base font-bold text-amber-800 mb-3">弱点カテゴリ（要復習）</p>
            {weakCats.filter(w => w.value < 0.7).map((w, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-amber-100 last:border-0">
                <span className="text-sm font-medium text-amber-900">{w.label}</span>
                <span className={`text-sm font-bold ${accuracyToColor(w.value)}`}>
                  {Math.round(w.value * 100)}%
                </span>
              </div>
            ))}
            <Link
              href="/weak"
              className="flex items-center justify-center gap-2 mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl py-3 text-sm transition-colors"
            >
              弱点克服100問で練習する
              <ChevronRight size={16} />
            </Link>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {session.mode === 'mock' && (
            <button
              onClick={onExit}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-4 text-base transition-colors"
            >
              <RefreshCcw size={18} />
              もう一度模試を受ける
            </button>
          )}
          <button
            onClick={onExit}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl py-3 text-base transition-colors"
          >
            {session.mode === 'mock' ? 'ホームに戻る' : '練習を終了する'}
          </button>
          <Link
            href="/analysis"
            className="flex items-center justify-center gap-2 border-2 border-blue-200 text-blue-600 font-bold rounded-xl py-3 text-base hover:bg-blue-50 transition-colors"
          >
            詳細分析を見る
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
