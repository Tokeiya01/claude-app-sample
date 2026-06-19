'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Trophy, Target, BarChart2, Flame, TrendingUp, ChevronRight, BookOpen, Settings } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getAttempts, getSessions, getProfile } from '@/lib/store';
import { computeLearningStats } from '@/lib/analytics/analyticsEngine';
import { analyzeWeakness } from '@/lib/analytics/weaknessAnalyzer';
import { CATEGORIES } from '@/lib/categories';

export default function DashboardPage() {
  const [stats, setStats] = useState<ReturnType<typeof computeLearningStats> | null>(null);
  const [topWeak, setTopWeak] = useState<{ categoryName: string; weakness_score: number } | null>(null);
  const [profile, setProfile] = useState({ display_name: 'ゲスト', goal_score: 700, study_days: [] as string[] });
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    const attempts = getAttempts();
    const sessions = getSessions();
    const prof = getProfile();
    setProfile(prof);
    const s = computeLearningStats(attempts, sessions, prof.study_days);
    setStats(s);
    const weakness = analyzeWeakness(attempts);
    const sorted = weakness.sort((a, b) => b.weakness_score - a.weakness_score);
    if (sorted[0] && sorted[0].totalAnswered > 0) setTopWeak(sorted[0]);
    setTodayDate(new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' }));
  }, []);

  const accuracy = stats ? Math.round(stats.overallAccuracy * 100) : 0;
  const todayGoal = 50;
  const todayDone = stats?.todayAnswered ?? 0;

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* ヘッダー */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{todayDate}</p>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-0.5">KeizaiSense</h1>
          <p className="text-gray-500 text-sm">日経TEST対策アプリ</p>
        </div>
        <div className="flex items-center gap-2">
          {(profile.study_days?.length ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
              <Flame size={18} className="text-orange-500" />
              <span className="text-orange-700 text-sm font-bold">{profile.study_days?.length ?? 0}日連続</span>
            </div>
          )}
          <Link href="/settings" className="p-2 text-gray-400 hover:text-gray-600">
            <Settings size={22} />
          </Link>
        </div>
      </div>

      {/* 今日のサマリー */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center">
          <p className="text-2xl font-extrabold text-blue-600">{todayDone}</p>
          <p className="text-xs text-blue-500 mt-1 font-medium">今日の回答</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
          <p className="text-2xl font-extrabold text-emerald-600">{accuracy}%</p>
          <p className="text-xs text-emerald-500 mt-1 font-medium">正答率</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-3 text-center">
          <p className="text-2xl font-extrabold text-purple-600">{stats?.totalAnswered ?? 0}</p>
          <p className="text-xs text-purple-500 mt-1 font-medium">累計回答</p>
        </div>
      </div>

      {/* 今日の練習進捗 */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} />
              <span className="text-sm font-semibold opacity-90">今日の練習50問</span>
            </div>
            <p className="text-xl font-bold">{todayDone < todayGoal ? `残り ${todayGoal - todayDone}問` : '完了！'}</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <BookOpen size={24} />
          </div>
        </div>
        <ProgressBar value={todayDone} max={todayGoal} barClassName="bg-white" className="mb-3" />
        <Link
          href="/daily"
          className="flex items-center justify-center gap-2 bg-white text-blue-600 font-bold rounded-xl py-3 text-base"
        >
          {todayDone === 0 ? '練習を始める' : '練習を続ける'}
          <ChevronRight size={18} />
        </Link>
      </Card>

      {/* 3モードへのリンク */}
      <div>
        <h2 className="text-base font-bold text-gray-700 mb-3">学習メニュー</h2>
        <div className="grid grid-cols-1 gap-3">
          <Link href="/mock">
            <Card className="flex items-center gap-4">
              <div className="bg-yellow-100 rounded-xl p-3 flex-shrink-0">
                <Trophy size={24} className="text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-gray-900">模試100問</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {stats?.lastMockScore ? `前回スコア：${stats.lastMockScore}点` : '本番想定の100問・制限時間あり'}
                </p>
              </div>
              <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
            </Card>
          </Link>

          <Link href="/weak">
            <Card className="flex items-center gap-4">
              <div className="bg-red-100 rounded-xl p-3 flex-shrink-0">
                <Target size={24} className="text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-gray-900">弱点克服100問</p>
                {topWeak ? (
                  <p className="text-sm text-red-500 mt-0.5">
                    要強化：{topWeak.categoryName}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-0.5">苦手分野を集中練習</p>
                )}
              </div>
              <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
            </Card>
          </Link>

          <Link href="/analysis">
            <Card className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-xl p-3 flex-shrink-0">
                <BarChart2 size={24} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-gray-900">学習分析</p>
                <p className="text-sm text-gray-500 mt-0.5">カテゴリ別成績・弱点・推移</p>
              </div>
              <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
            </Card>
          </Link>
        </div>
      </div>

      {/* 目標スコア */}
      <Card>
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp size={18} className="text-blue-600" />
          <span className="text-base font-bold text-gray-800">目標スコア達成度</span>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-extrabold text-gray-900">
            {stats?.lastMockScore ?? '---'}
          </span>
          <span className="text-gray-500 text-sm mb-1">/ {profile.goal_score}点目標</span>
        </div>
        {stats?.lastMockScore && (
          <ProgressBar
            value={stats.lastMockScore}
            max={profile.goal_score}
            barClassName={stats.lastMockScore >= profile.goal_score ? 'bg-emerald-500' : 'bg-blue-500'}
            showLabel
          />
        )}
        {!stats?.lastMockScore && (
          <p className="text-sm text-gray-400">まず模試を受けてスコアを確認しましょう</p>
        )}
      </Card>

      {/* カテゴリ早見表 */}
      <div>
        <h2 className="text-base font-bold text-gray-700 mb-3">出題カテゴリ</h2>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={`/daily?cat=${cat.id}`}>
              <div className={`${cat.color} ${cat.textColor} rounded-xl p-3`}>
                <p className="text-sm font-bold">{cat.name}</p>
                <p className="text-xs opacity-70 mt-0.5 line-clamp-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
