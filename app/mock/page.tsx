'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Timer, Trophy } from 'lucide-react';
import { QUESTIONS } from '@/lib/sampleData';
import { Question } from '@/lib/types';
import { CATEGORIES, categoryColorMap } from '@/lib/categories';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

type MockMode = 'standard' | 'news-mix';
type Phase = 'setup' | 'test' | 'result';

const MOCK_DURATION = 30 * 60; // 30分

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestions(mode: MockMode): Question[] {
  const fixed = QUESTIONS.filter(q => q.type === 'fixed');
  const news = QUESTIONS.filter(q => q.type === 'news');
  if (mode === 'standard') return shuffle(fixed).slice(0, 20);
  return [...shuffle(fixed).slice(0, 16), ...shuffle(news).slice(0, 4)];
}

export default function MockPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [mode, setMode] = useState<MockMode>('standard');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MOCK_DURATION);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (phase !== 'test') return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); setPhase('result'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const startMock = () => {
    const qs = buildQuestions(mode);
    setQuestions(qs);
    setAnswers({});
    setCurrentIdx(0);
    setTimeLeft(MOCK_DURATION);
    setPhase('test');
  };

  const selectAnswer = (qId: string, choiceId: string) => {
    if (answers[qId]) return;
    setAnswers(a => ({ ...a, [qId]: choiceId }));
    if (currentIdx < questions.length - 1) {
      setTimeout(() => setCurrentIdx(i => i + 1), 400);
    }
  };

  const finish = () => setPhase('result');

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  if (phase === 'setup') {
    return (
      <div className="px-4 pt-6 space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-200"><ArrowLeft size={20} /></Link>
          <h1 className="text-lg font-bold text-gray-100">模試モード</h1>
        </div>

        <div className="space-y-3">
          {(['standard', 'news-mix'] as MockMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${mode === m ? 'border-blue-600 bg-blue-950/40' : 'border-gray-700 bg-gray-900'}`}
            >
              <p className="font-semibold text-gray-100">
                {m === 'standard' ? '標準模試' : '応用模試（ニュース混合）'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {m === 'standard' ? '固定問題20問・30分・カテゴリバランス出題' : '固定16問＋時事4問・30分・実戦型'}
              </p>
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-200">模試の条件</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• 問題数：20問</li>
            <li>• 制限時間：30分</li>
            <li>• 途中終了可能</li>
            <li>• 結果は学習履歴に反映</li>
          </ul>
        </div>

        <button
          onClick={startMock}
          className="w-full bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl py-4 text-base font-bold"
        >
          模試を開始する
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    const correct = questions.filter(q => {
      const ans = answers[q.id];
      return ans && q.choices.find(c => c.id === ans)?.isCorrect;
    }).length;
    const score = Math.round((correct / questions.length) * 100);
    const catScores: Record<string, { correct: number; total: number }> = {};
    CATEGORIES.forEach(c => { catScores[c.id] = { correct: 0, total: 0 }; });
    questions.forEach(q => {
      catScores[q.categoryId].total++;
      if (q.choices.find(c => c.id === answers[q.id])?.isCorrect) catScores[q.categoryId].correct++;
    });

    return (
      <div className="px-4 pt-6 space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-100">模試結果</h1>
        </div>

        <div className="bg-gradient-to-br from-yellow-950 to-orange-950 border border-yellow-800 rounded-xl p-6 text-center">
          <Trophy size={32} className="text-yellow-400 mx-auto mb-2" />
          <p className="text-5xl font-bold text-yellow-300">{score}<span className="text-2xl">点</span></p>
          <p className="text-gray-400 text-sm mt-2">{correct} / {questions.length} 問正解</p>
          <p className="text-xs text-gray-500 mt-1">
            {score >= 80 ? '優秀！このまま維持しましょう' : score >= 60 ? '合格圏内。弱点を潰しましょう' : '基礎の見直しが必要です'}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-300 mb-2">カテゴリ別スコア</h2>
          <div className="space-y-2">
            {CATEGORIES.filter(c => catScores[c.id].total > 0).map(c => {
              const { correct, total } = catScores[c.id];
              const pct = Math.round((correct / total) * 100);
              return (
                <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">{c.name}</span>
                    <span className="text-gray-400">{correct}/{total} ({pct}%)</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2">
          <Link href="/analysis" className="flex-1 bg-purple-700 hover:bg-purple-600 text-white rounded-xl py-3 text-sm font-medium text-center">
            弱点分析へ
          </Link>
          <button onClick={() => setPhase('setup')} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-xl py-3 text-sm font-medium">
            もう一度
          </button>
        </div>
      </div>
    );
  }

  // test phase
  const q = questions[currentIdx];
  return (
    <div className="px-4 pt-4 space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{currentIdx + 1} / {questions.length}</span>
        </div>
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5">
          <Timer size={14} className="text-orange-400" />
          <span className={`text-sm font-mono font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-gray-200'}`}>
            {minutes}:{seconds}
          </span>
        </div>
      </div>

      {/* 進捗バー */}
      <div className="bg-gray-800 rounded-full h-1">
        <div
          className="bg-yellow-500 h-1 rounded-full transition-all"
          style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
        />
      </div>

      {/* 問題 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <Badge className={`${categoryColorMap[q.categoryId]} mb-2`}>
          {CATEGORIES.find(c => c.id === q.categoryId)?.name}
        </Badge>
        <p className="text-sm text-gray-100 leading-relaxed">{q.text}</p>
      </div>

      {/* 選択肢 */}
      <div className="space-y-2">
        {q.choices.map(choice => {
          const selected = answers[q.id] === choice.id;
          return (
            <button
              key={choice.id}
              onClick={() => selectAnswer(q.id, choice.id)}
              disabled={!!answers[q.id]}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${
                selected ? 'border-yellow-600 bg-yellow-900/30 text-yellow-100' :
                answers[q.id] ? 'border-gray-800 bg-gray-900 text-gray-600' :
                'border-gray-700 bg-gray-900 text-gray-200 hover:border-gray-500'
              }`}
            >
              <span className="font-bold mr-2">{choice.id.toUpperCase()}.</span>
              {choice.text}
            </button>
          );
        })}
      </div>

      {/* ナビゲーション */}
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white rounded-xl py-2.5 text-sm"
        >
          ← 前の問題
        </button>
        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(i => i + 1)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-xl py-2.5 text-sm"
          >
            次の問題 →
          </button>
        ) : (
          <button
            onClick={finish}
            className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl py-2.5 text-sm font-medium"
          >
            採点する
          </button>
        )}
      </div>

      {/* 問題一覧ミニマップ */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((ques, i) => (
          <button
            key={ques.id}
            onClick={() => setCurrentIdx(i)}
            className={`w-7 h-7 rounded text-xs font-medium border transition-colors ${
              i === currentIdx ? 'border-yellow-500 bg-yellow-900/50 text-yellow-300' :
              answers[ques.id] ? 'border-gray-600 bg-gray-700 text-gray-300' :
              'border-gray-700 bg-gray-900 text-gray-500'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button onClick={finish} className="w-full text-xs text-gray-500 hover:text-gray-300 py-2">
        途中終了して採点
      </button>
    </div>
  );
}
