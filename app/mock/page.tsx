'use client';
import { useState, useEffect } from 'react';
import { Trophy, Clock, BookOpen, ChevronRight, BarChart2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ExamSessionComponent from '@/components/ExamSession';
import { QUESTIONS } from '@/lib/data/questions';
import { getSessions, createSession } from '@/lib/store';
import { buildMockExam } from '@/lib/generators/mockExamBuilder';
import { formatTime, formatDate, accuracyToColor } from '@/lib/utils';
import { ExamSession } from '@/lib/types';

type Phase = 'start' | 'exam';

const MOCK_TIME = 90 * 60; // 90 minutes

export default function MockPage() {
  const [phase, setPhase] = useState<Phase>('start');
  const [questions, setQuestions] = useState<typeof QUESTIONS>([]);
  const [session, setSession] = useState<ReturnType<typeof createSession> | null>(null);
  const [pastSessions, setPastSessions] = useState<ExamSession[]>([]);

  useEffect(() => {
    const sessions = getSessions().filter(s => s.mode === 'mock' && s.finished_at);
    setPastSessions(sessions.reverse().slice(0, 5));
  }, [phase]);

  const handleStart = () => {
    const qs = buildMockExam(QUESTIONS);
    const s = createSession('mock', qs.map(q => q.id), MOCK_TIME);
    setQuestions(qs);
    setSession(s);
    setPhase('exam');
  };

  if (phase === 'exam' && session && questions.length > 0) {
    return (
      <ExamSessionComponent
        session={session}
        questions={questions}
        mode="mock"
        timeLimitSec={MOCK_TIME}
        showImmediateFeedback={false}
        onExit={() => setPhase('start')}
      />
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">模試</h1>
        <p className="text-gray-500 text-sm mt-1">本番想定・100問・90分</p>
      </div>

      {/* 模試概要 */}
      <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-100 rounded-xl p-3">
            <Trophy size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">日経TEST本番形式</p>
            <p className="text-sm text-gray-500">全12カテゴリから出題</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-xl font-extrabold text-gray-900">100</p>
            <p className="text-xs text-gray-500 mt-0.5">問</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-xl font-extrabold text-gray-900">90</p>
            <p className="text-xs text-gray-500 mt-0.5">分</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-xl font-extrabold text-gray-900">4択</p>
            <p className="text-xs text-gray-500 mt-0.5">形式</p>
          </div>
        </div>
      </Card>

      {/* 出題配分 */}
      <Card>
        <h2 className="text-base font-bold text-gray-800 mb-3">出題配分</h2>
        <div className="space-y-1.5 text-sm">
          {[
            { name: 'マクロ経済', n: 12 },
            { name: 'ミクロ経済', n: 8 },
            { name: '金融・為替', n: 12 },
            { name: '財政・税制', n: 8 },
            { name: '国際経済', n: 8 },
            { name: '企業戦略', n: 10 },
            { name: '産業動向', n: 8 },
            { name: 'テクノロジー・AI', n: 8 },
            { name: '政治・地政学', n: 6 },
            { name: 'ESG・サステナ', n: 6 },
            { name: '統計・指標', n: 6 },
            { name: '時事ニュース', n: 8 },
          ].map(({ name, n }) => (
            <div key={name} className="flex items-center gap-2">
              <span className="text-gray-600 flex-1">{name}</span>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden w-24">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${n}%` }} />
              </div>
              <span className="text-gray-700 font-semibold w-8 text-right">{n}問</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 注意事項 */}
      <Card className="bg-blue-50 border-blue-100">
        <div className="flex gap-3">
          <Clock size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-900 mb-1">受験にあたって</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 制限時間90分（自動終了）</li>
              <li>• 途中でも「終了」から結果確認可能</li>
              <li>• 問題ごとに回答後、次へ進みます</li>
              <li>• 前の問題には戻れません</li>
            </ul>
          </div>
        </div>
      </Card>

      <Button onClick={handleStart} className="w-full" size="lg">
        模試を開始する
        <ChevronRight size={20} className="ml-2" />
      </Button>

      {/* 過去の結果 */}
      {pastSessions.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">過去の模試結果</h2>
          <div className="space-y-3">
            {pastSessions.map((s, i) => (
              <Card key={s.id} className="flex items-center gap-3">
                <div className={`text-2xl font-extrabold flex-shrink-0 ${accuracyToColor(s.accuracy ?? 0)}`}>
                  {s.score}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">{formatDate(s.finished_at!)}</p>
                  <p className="text-sm font-semibold text-gray-700">
                    正答率 {Math.round((s.accuracy ?? 0) * 100)}%
                    {s.elapsed_sec && ` · ${formatTime(s.elapsed_sec)}`}
                  </p>
                </div>
                <BarChart2 size={18} className="text-gray-300 flex-shrink-0" />
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
