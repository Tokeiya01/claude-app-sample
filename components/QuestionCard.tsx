'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Question, FSRSRating } from '@/lib/types';
import { FSRS_LABELS } from '@/lib/fsrs';
import { recordAnswer } from '@/lib/store';
import { CATEGORIES, categoryColorMap } from '@/lib/categories';
import { Badge } from '@/components/ui/Badge';

interface Props {
  question: Question;
  onBack: () => void;
  onNext: () => void;
}

export default function QuestionCard({ question, onBack, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime] = useState(Date.now());
  const ratingRef = useRef(false);

  useEffect(() => {
    setSelected(null);
    setShowExplanation(false);
    ratingRef.current = false;
  }, [question.id]);

  const handleSelect = (choiceId: string) => {
    if (selected) return;
    setSelected(choiceId);
  };

  const isCorrect = question.choices.find(c => c.id === selected)?.isCorrect ?? false;

  const handleRating = (rating: FSRSRating) => {
    if (ratingRef.current) return;
    ratingRef.current = true;
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    recordAnswer(question.id, selected!, isCorrect, elapsed, rating);
    onNext();
  };

  const category = CATEGORIES.find(c => c.id === question.categoryId);

  return (
    <div className="px-4 pt-6 space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-200">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2 flex-wrap">
          <Badge className={categoryColorMap[question.categoryId]}>{category?.name}</Badge>
          <Badge className="bg-gray-800 text-gray-400 border-gray-700">
            {question.type === 'news' ? '時事問題' : '基礎問題'}
          </Badge>
        </div>
      </div>

      {/* 問題文 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-gray-100 text-sm leading-relaxed">{question.text}</p>
      </div>

      {/* 選択肢 */}
      <div className="space-y-2">
        {question.choices.map(choice => {
          let style = 'bg-gray-900 border-gray-700 text-gray-200';
          if (selected) {
            if (choice.isCorrect) style = 'bg-emerald-900/50 border-emerald-600 text-emerald-100';
            else if (choice.id === selected) style = 'bg-red-900/50 border-red-600 text-red-100';
            else style = 'bg-gray-900 border-gray-800 text-gray-500';
          }
          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice.id)}
              disabled={!!selected}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${style}`}
            >
              <span className="font-bold mr-2">{choice.id.toUpperCase()}.</span>
              {choice.text}
            </button>
          );
        })}
      </div>

      {/* 結果 */}
      {selected && (
        <div className={`rounded-xl p-3 border ${isCorrect ? 'bg-emerald-900/30 border-emerald-700' : 'bg-red-900/30 border-red-700'}`}>
          <p className={`font-semibold text-sm ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
            {isCorrect ? '正解！' : '不正解'}
          </p>
        </div>
      )}

      {/* 解説 */}
      {selected && (
        <div>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mb-2"
          >
            <BookOpen size={14} />
            解説を{showExplanation ? '閉じる' : '見る'}
          </button>
          {showExplanation && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3">
              <p className="text-gray-100 text-sm font-semibold">{question.explanation.summary}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{question.explanation.detail}</p>
              <div className="flex flex-wrap gap-1">
                {question.explanation.keywords.map(kw => (
                  <span key={kw} className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full border border-gray-700">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FSRS評価ボタン */}
      {selected && (
        <div>
          <p className="text-xs text-gray-500 mb-2 text-center">この問題の理解度を評価してください</p>
          <div className="grid grid-cols-4 gap-2">
            {([1, 2, 3, 4] as FSRSRating[]).map(rating => {
              const { label, color, description } = FSRS_LABELS[rating];
              return (
                <button
                  key={rating}
                  onClick={() => handleRating(rating)}
                  className={`${color} text-white rounded-lg py-2 text-xs font-medium flex flex-col items-center gap-0.5`}
                  title={description}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 次へ（評価後にスキップ） */}
      {selected && (
        <button onClick={onNext} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 mx-auto">
          スキップして次へ <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
