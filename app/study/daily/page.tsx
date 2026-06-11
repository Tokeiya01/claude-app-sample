'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { QUESTIONS, TODAY_CHALLENGE } from '@/lib/sampleData';
import QuestionCard from '@/components/QuestionCard';

export default function DailyChallengePage() {
  const questions = TODAY_CHALLENGE.questionIds
    .map(id => QUESTIONS.find(q => q.id === id))
    .filter(Boolean) as typeof QUESTIONS;

  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  if (done || index >= questions.length) {
    return (
      <div className="px-4 pt-16 text-center space-y-4">
        <CheckCircle size={48} className="text-emerald-400 mx-auto" />
        <h2 className="text-xl font-bold text-gray-100">デイリーチャレンジ完了！</h2>
        <p className="text-gray-400 text-sm">今日の {questions.length} 問を解きました。<br />明日もまた挑戦しよう！</p>
        <Link href="/" className="inline-block mt-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-2 text-sm font-medium">
          ホームに戻る
        </Link>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div>
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <Link href="/" className="text-gray-400 hover:text-gray-200">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-xs text-gray-400">{index + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all"
            style={{ width: `${((index) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      <QuestionCard
        question={q}
        onBack={() => { if (index > 0) setIndex(i => i - 1); }}
        onNext={() => {
          if (index + 1 >= questions.length) setDone(true);
          else setIndex(i => i + 1);
        }}
      />
    </div>
  );
}
