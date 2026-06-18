'use client';
import { useState, useEffect } from 'react';
import { Target, ChevronRight, AlertTriangle, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import ExamSessionComponent from '@/components/ExamSession';
import { QUESTIONS } from '@/lib/data/questions';
import { getAttempts, createSession } from '@/lib/store';
import { analyzeWeakness } from '@/lib/analytics/weaknessAnalyzer';
import { buildWeakPractice, buildWeakCategoryBreakdown } from '@/lib/generators/weakPracticeBuilder';
import { WeaknessData } from '@/lib/types';
import { accuracyToColor } from '@/lib/utils';

type Phase = 'start' | 'exam';

export default function WeakPage() {
  const [phase, setPhase] = useState<Phase>('start');
  const [questions, setQuestions] = useState<typeof QUESTIONS>([]);
  const [session, setSession] = useState<ReturnType<typeof createSession> | null>(null);
  const [weakness, setWeakness] = useState<WeaknessData[]>([]);
  const [breakdown, setBreakdown] = useState<{ category: string; name: string; count: number; score: number }[]>([]);

  useEffect(() => {
    const attempts = getAttempts();
    const w = analyzeWeakness(attempts).sort((a, b) => b.weakness_score - a.weakness_score);
    setWeakness(w);
    setBreakdown(buildWeakCategoryBreakdown(w));
  }, [phase]);

  const handleStart = () => {
    const attempts = getAttempts();
    const w = analyzeWeakness(attempts);
    const qs = buildWeakPractice(QUESTIONS, w);
    const s = createSession('weak', qs.map(q => q.id));
    setQuestions(qs);
    setSession(s);
    setPhase('exam');
  };

  if (phase === 'exam' && session && questions.length > 0) {
    return (
      <ExamSessionComponent
        session={session}
        questions={questions}
        mode="weak"
        showImmediateFeedback={true}
        onExit={() => setPhase('start')}
      />
    );
  }

  const topWeak = weakness.slice(0, 5).filter(w => w.totalAnswered > 0 || true);
  const hasData = weakness.some(w => w.totalAnswered > 0);

  const weaknessBar = (score: number) => {
    const pct = Math.round(score * 100);
    const color = score > 0.7 ? 'bg-red-500' : score > 0.5 ? 'bg-amber-500' : score > 0.3 ? 'bg-yellow-400' : 'bg-emerald-400';
    return { pct, color };
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">弱点克服</h1>
        <p className="text-gray-500 text-sm mt-1">苦手分野を集中的に強化する100問</p>
      </div>

      {/* 弱点ランキング */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-amber-500" />
          <h2 className="text-base font-bold text-gray-800">弱点ランキング</h2>
        </div>
        {topWeak.map((w, i) => {
          const { pct, color } = weaknessBar(w.weakness_score);
          const accPct = Math.round(w.accuracyRate * 100);
          return (
            <div key={w.category} className="py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold w-5 ${i === 0 ? 'text-red-500' : i === 1 ? 'text-orange-500' : 'text-amber-500'}`}>
                    {i + 1}位
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{w.categoryName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {w.totalAnswered === 0 ? (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">未学習</span>
                  ) : (
                    <span className={`text-sm font-bold ${accuracyToColor(w.accuracyRate)}`}>{accPct}%</span>
                  )}
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
              {w.totalAnswered > 0 && (
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{w.totalAnswered}問回答済み</span>
                  {w.consecutiveWrong > 2 && (
                    <span className="text-red-400">{w.consecutiveWrong}問連続不正解</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {!hasData && (
          <p className="text-sm text-gray-400 text-center py-4">
            練習・模試を解くと弱点が判定されます
          </p>
        )}
      </Card>

      {/* 出題構成 */}
      <Card>
        <h2 className="text-base font-bold text-gray-800 mb-3">出題構成（100問）</h2>
        <div className="space-y-2">
          {breakdown.slice(0, 6).map((item, i) => (
            <div key={item.category} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 flex-1 min-w-0 truncate">{item.name}</span>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden w-20">
                <div
                  className={`h-full rounded-full ${i < 3 ? 'bg-red-400' : 'bg-blue-400'}`}
                  style={{ width: `${item.count}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">{item.count}問</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">弱点度スコアに応じて動的に配分</p>
      </Card>

      {/* 弱点判定について */}
      <Card className="bg-red-50 border-red-100">
        <div className="flex gap-3">
          <TrendingDown size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-900 mb-1">弱点判定ロジック</p>
            <p className="text-sm text-red-700">
              誤答率・連続誤答・回答時間・直近の落ち込みを組み合わせて弱点スコアを算出します。
              練習・模試を解くほど精度が上がります。
            </p>
          </div>
        </div>
      </Card>

      <Button onClick={handleStart} className="w-full" size="lg" variant="danger">
        弱点克服100問を開始する
        <ChevronRight size={20} className="ml-2" />
      </Button>

      <p className="text-xs text-gray-400 text-center">
        100問完了後に弱点が再判定されます
      </p>
    </div>
  );
}
