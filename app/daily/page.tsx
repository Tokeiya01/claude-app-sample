'use client';
import { useState, useEffect } from 'react';
import { Calendar, BookOpen, ChevronRight, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import ExamSessionComponent from '@/components/ExamSession';
import { QUESTIONS } from '@/lib/data/questions';
import { getAttempts, getSessions, createSession } from '@/lib/store';
import { buildDailyPractice } from '@/lib/generators/dailyPracticeBuilder';
import { todayStr } from '@/lib/utils';

type Phase = 'start' | 'exam';

export default function DailyPage() {
  const [phase, setPhase] = useState<Phase>('start');
  const [questions, setQuestions] = useState<typeof QUESTIONS>([]);
  const [session, setSession] = useState<ReturnType<typeof createSession> | null>(null);
  const [todayProgress, setTodayProgress] = useState(0);
  const [todayCorrect, setTodayCorrect] = useState(0);

  const today = todayStr();

  useEffect(() => {
    const attempts = getAttempts();
    const todayAttempts = attempts.filter(a => a.answered_at.slice(0, 10) === today);
    setTodayProgress(todayAttempts.length);
    setTodayCorrect(todayAttempts.filter(a => a.is_correct).length);
  }, [today]);

  const handleStart = () => {
    const attempts = getAttempts();
    const qs = buildDailyPractice(QUESTIONS, today, attempts);
    const s = createSession('daily', qs.map(q => q.id));
    setQuestions(qs);
    setSession(s);
    setPhase('exam');
  };

  if (phase === 'exam' && session && questions.length > 0) {
    return (
      <ExamSessionComponent
        session={session}
        questions={questions}
        mode="daily"
        showImmediateFeedback={true}
        onExit={() => setPhase('start')}
      />
    );
  }

  const goal = 50;
  const isDone = todayProgress >= goal;

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">今日の練習</h1>
        <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
      </div>

      {/* 今日の進捗 */}
      <Card className={isDone ? 'border-emerald-300 bg-emerald-50' : ''}>
        <div className="flex items-center gap-3 mb-4">
          {isDone
            ? <CheckCircle size={22} className="text-emerald-600" />
            : <Calendar size={22} className="text-blue-600" />
          }
          <div>
            <p className="text-base font-bold text-gray-900">
              {isDone ? '今日の練習完了！' : '今日の練習50問'}
            </p>
            <p className="text-sm text-gray-500">{todayProgress}/{goal}問 完了</p>
          </div>
        </div>
        <ProgressBar
          value={todayProgress}
          max={goal}
          barClassName={isDone ? 'bg-emerald-500' : 'bg-blue-500'}
          showLabel
        />
        {todayProgress > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            正答率：{Math.round((todayCorrect / todayProgress) * 100)}%（{todayCorrect}/{todayProgress}問）
          </p>
        )}
      </Card>

      {/* 出題情報 */}
      <Card>
        <h2 className="text-base font-bold text-gray-800 mb-3">本日の出題内容</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span>出題数</span><span className="font-semibold text-gray-900">50問</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span>ニュース問題</span><span className="font-semibold text-gray-900">約10問</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span>基礎・応用問題</span><span className="font-semibold text-gray-900">約40問</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span>カテゴリ</span><span className="font-semibold text-gray-900">全12分野</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span>適応制御</span><span className="font-semibold text-blue-600">弱点分野を優先出題</span>
          </div>
        </div>
      </Card>

      {/* 特徴 */}
      <Card className="bg-blue-50 border-blue-100">
        <div className="flex gap-3">
          <BookOpen size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-900 mb-1">毎日自動更新</p>
            <p className="text-sm text-blue-700">
              今日の問題は日付をもとに自動生成されます。毎日問題が変わり、前日の内容と重複しません。苦手分野は重点的に出題されます。
            </p>
          </div>
        </div>
      </Card>

      <Button
        onClick={handleStart}
        className="w-full"
        size="lg"
      >
        {todayProgress === 0 ? '今日の練習を始める' : isDone ? 'もう一度練習する' : '練習を再開する'}
        <ChevronRight size={20} className="ml-2" />
      </Button>
    </div>
  );
}
