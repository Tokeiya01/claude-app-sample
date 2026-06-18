'use client';
import { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, Target, Calendar, BookOpen, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { HorizontalBarChart, DifficultyBar } from '@/components/ui/charts/BarChart';
import { RadarChart } from '@/components/ui/charts/RadarChart';
import { LineChart } from '@/components/ui/charts/LineChart';
import { getAttempts, getSessions, getProfile } from '@/lib/store';
import { computeLearningStats, computeCategoryMastery, computeMockScoreHistory, computeDifficultyBreakdown } from '@/lib/analytics/analyticsEngine';
import { analyzeWeakness } from '@/lib/analytics/weaknessAnalyzer';
import { accuracyToColor, accuracyToBg, calcStreak } from '@/lib/utils';

export default function AnalysisPage() {
  const [stats, setStats] = useState<ReturnType<typeof computeLearningStats> | null>(null);
  const [mastery, setMastery] = useState<ReturnType<typeof computeCategoryMastery>>([]);
  const [weakness, setWeakness] = useState<ReturnType<typeof analyzeWeakness>>([]);
  const [mockHistory, setMockHistory] = useState<ReturnType<typeof computeMockScoreHistory>>([]);
  const [diffBreakdown, setDiffBreakdown] = useState<ReturnType<typeof computeDifficultyBreakdown>>({
    easy: { total: 0, correct: 0 },
    medium: { total: 0, correct: 0 },
    hard: { total: 0, correct: 0 },
  });

  useEffect(() => {
    const attempts = getAttempts();
    const sessions = getSessions();
    const profile = getProfile();
    setStats(computeLearningStats(attempts, sessions, profile.study_days));
    setMastery(computeCategoryMastery(attempts));
    setWeakness(analyzeWeakness(attempts).sort((a, b) => b.weakness_score - a.weakness_score));
    setMockHistory(computeMockScoreHistory(sessions));
    setDiffBreakdown(computeDifficultyBreakdown(attempts));
  }, []);

  const totalAnswered = stats?.totalAnswered ?? 0;
  const overallAcc = stats ? Math.round(stats.overallAccuracy * 100) : 0;
  const streak = stats?.streakDays ?? 0;

  // BarChart data
  const masteryBarItems = mastery
    .filter(m => m.accuracy > 0)
    .map(m => ({ label: m.categoryName, value: m.accuracy, count: undefined as undefined }))
    .sort((a, b) => b.value - a.value);

  // Radar data
  const radarItems = mastery.map(m => ({
    label: m.categoryName.slice(0, 6),
    value: m.mastery_score,
  }));

  // Mock history line
  const lineData = mockHistory.map(h => ({
    label: h.date.slice(5), // MM-DD
    value: h.score,
  }));

  const topWeak = weakness.filter(w => w.totalAnswered > 0).slice(0, 3);

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">学習分析</h1>
        <p className="text-gray-500 text-sm mt-1">あなたの学習状況を可視化</p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center">
          <p className="text-2xl font-extrabold text-blue-600">{totalAnswered}</p>
          <p className="text-xs text-blue-500 mt-1 font-medium">総回答数</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
          <p className={`text-2xl font-extrabold ${accuracyToColor(overallAcc / 100)}`}>{overallAcc}%</p>
          <p className="text-xs text-emerald-500 mt-1 font-medium">全体正答率</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 text-center">
          <p className="text-2xl font-extrabold text-orange-600">{streak}</p>
          <p className="text-xs text-orange-500 mt-1 font-medium">連続学習日</p>
        </div>
      </div>

      {/* レーダーチャート */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Award size={18} className="text-purple-600" />
          <h2 className="text-base font-bold text-gray-800">カテゴリ習熟レーダー</h2>
        </div>
        {totalAnswered > 0 ? (
          <div className="flex justify-center">
            <RadarChart items={radarItems} size={280} />
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">問題を解くとレーダーが表示されます</p>
        )}
      </Card>

      {/* カテゴリ別正答率 */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={18} className="text-blue-600" />
          <h2 className="text-base font-bold text-gray-800">カテゴリ別正答率</h2>
        </div>
        {masteryBarItems.length > 0 ? (
          <HorizontalBarChart items={masteryBarItems} />
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">問題を解くとグラフが表示されます</p>
        )}
      </Card>

      {/* 難易度別成績 */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={18} className="text-amber-600" />
          <h2 className="text-base font-bold text-gray-800">難易度別成績</h2>
        </div>
        {totalAnswered > 0 ? (
          <DifficultyBar
            easy={diffBreakdown.easy}
            medium={diffBreakdown.medium}
            hard={diffBreakdown.hard}
          />
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">問題を解くと表示されます</p>
        )}
      </Card>

      {/* 模試スコア推移 */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-emerald-600" />
          <h2 className="text-base font-bold text-gray-800">模試スコア推移</h2>
        </div>
        {lineData.length >= 2 ? (
          <LineChart data={lineData} unit="点" color="#10b981" />
        ) : lineData.length === 1 ? (
          <div className="text-center py-4">
            <p className="text-3xl font-extrabold text-emerald-600">{lineData[0].value}点</p>
            <p className="text-sm text-gray-400 mt-1">前回の模試スコア</p>
            <p className="text-xs text-gray-400 mt-2">2回以上受けると推移グラフが表示されます</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">模試を受けるとスコア推移が表示されます</p>
        )}
      </Card>

      {/* 弱点ランキング */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-red-500" />
          <h2 className="text-base font-bold text-gray-800">弱点TOP3</h2>
        </div>
        {topWeak.length > 0 ? (
          <div className="space-y-3">
            {topWeak.map((w, i) => (
              <div key={w.category} className="flex items-center gap-3">
                <span className={`text-sm font-bold w-6 flex-shrink-0 ${
                  i === 0 ? 'text-red-500' : i === 1 ? 'text-orange-500' : 'text-amber-500'
                }`}>{i + 1}位</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{w.categoryName}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${w.accuracyRate < 0.5 ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.round(w.accuracyRate * 100)}%` }}
                    />
                  </div>
                </div>
                <span className={`text-sm font-bold flex-shrink-0 ${accuracyToColor(w.accuracyRate)}`}>
                  {Math.round(w.accuracyRate * 100)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">問題を解くと弱点が判定されます</p>
        )}
      </Card>

      {/* 模試統計 */}
      {stats?.mockSessionCount && stats.mockSessionCount > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-gray-800">模試統計</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-extrabold text-gray-900">{stats.mockSessionCount}</p>
              <p className="text-xs text-gray-500 mt-1">受験回数</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className={`text-xl font-extrabold ${accuracyToColor((stats.lastMockScore ?? 300) / 900)}`}>
                {stats.lastMockScore ?? '---'}点
              </p>
              <p className="text-xs text-gray-500 mt-1">直近スコア</p>
            </div>
          </div>
        </Card>
      )}

      {/* 学習アドバイス */}
      <Card className="bg-blue-50 border-blue-100">
        <h2 className="text-base font-bold text-blue-900 mb-3">学習アドバイス</h2>
        <div className="space-y-2 text-sm text-blue-800">
          {totalAnswered === 0 && (
            <p>まず「今日の練習50問」から始めましょう。毎日続けることで弱点が分かります。</p>
          )}
          {totalAnswered > 0 && streak === 0 && (
            <p>毎日継続することが重要です。今日も練習をしましょう！</p>
          )}
          {topWeak[0] && topWeak[0].accuracyRate < 0.5 && (
            <p>「{topWeak[0].categoryName}」の正答率が低めです。弱点克服100問で集中練習しましょう。</p>
          )}
          {stats?.lastMockScore && stats.lastMockScore >= 700 && (
            <p>模試スコアが700点を超えています。好調です！引き続き応用問題に挑戦しましょう。</p>
          )}
          {stats?.lastMockScore && stats.lastMockScore < 500 && (
            <p>基礎固めが重要です。「今日の練習」で基礎問題（易）を中心に毎日練習しましょう。</p>
          )}
          {!stats?.lastMockScore && totalAnswered > 30 && (
            <p>そろそろ模試を受けてみましょう。現在の実力を確認できます。</p>
          )}
        </div>
      </Card>
    </div>
  );
}
