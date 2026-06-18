'use client';
import { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, ChevronRight, BookOpen } from 'lucide-react';
import { Question } from '@/lib/types';
import { getCategoryById, categoryBadgeClass } from '@/lib/categories';
import { Badge } from '@/components/ui/Badge';
import { difficultyLabel, difficultyColor } from '@/lib/utils';

export interface QuestionCardAnswer {
  questionId: string;
  choiceId: string;
  isCorrect: boolean;
  responseTimeSec: number;
}

interface Props {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: QuestionCardAnswer) => void;
  onNext: () => void;
  showImmediateFeedback?: boolean;
  answered?: boolean;
  selectedChoice?: string;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  showImmediateFeedback = true,
  answered = false,
  selectedChoice,
}: Props) {
  const [selected, setSelected] = useState<string | null>(selectedChoice ?? null);
  const [showExplanation, setShowExplanation] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    setSelected(selectedChoice ?? null);
    setShowExplanation(false);
    startTimeRef.current = Date.now();
  }, [question.id, selectedChoice]);

  const isAnswered = answered || selected !== null;
  const isCorrect = selected !== null && selected === question.answer;

  const handleSelect = (choiceId: string) => {
    if (isAnswered) return;
    setSelected(choiceId);
    const responseTimeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
    onAnswer({
      questionId: question.id,
      choiceId,
      isCorrect: choiceId === question.answer,
      responseTimeSec,
    });
  };

  const cat = getCategoryById(question.category);

  return (
    <div className="space-y-4">
      {/* カテゴリ・難易度バッジ */}
      <div className="flex flex-wrap gap-2 items-center">
        <Badge className={categoryBadgeClass(question.category)}>{cat.name}</Badge>
        <Badge className={difficultyColor(question.difficulty)}>
          {difficultyLabel(question.difficulty)}
        </Badge>
        {question.source_type === 'news' && (
          <Badge className="bg-rose-100 text-rose-700">時事問題</Badge>
        )}
        <span className="ml-auto text-sm text-gray-400 font-medium">
          {questionNumber}/{totalQuestions}
        </span>
      </div>

      {/* 問題文 */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
        <p className="text-gray-900 text-[18px] leading-[1.75] font-medium">{question.question}</p>
      </div>

      {/* 選択肢 */}
      <div className="space-y-3">
        {question.choices.map(choice => {
          const isSelected = selected === choice.id;
          const isRightAnswer = choice.id === question.answer;

          let base = 'w-full text-left rounded-2xl border-2 p-4 transition-all text-[17px] leading-[1.6] font-medium';
          let style = '';

          if (!isAnswered) {
            style = 'border-gray-200 bg-white text-gray-800 hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100';
          } else if (isRightAnswer) {
            style = 'border-emerald-500 bg-emerald-50 text-emerald-900';
          } else if (isSelected && !isRightAnswer) {
            style = 'border-red-400 bg-red-50 text-red-900';
          } else {
            style = 'border-gray-200 bg-white text-gray-400';
          }

          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice.id)}
              disabled={isAnswered}
              className={`${base} ${style}`}
            >
              <div className="flex items-start gap-3">
                <span className="font-bold text-lg leading-none mt-0.5 flex-shrink-0 w-6">
                  {choice.id}.
                </span>
                <span className="flex-1">{choice.text}</span>
                {isAnswered && isRightAnswer && (
                  <CheckCircle size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                )}
                {isAnswered && isSelected && !isRightAnswer && (
                  <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 即時フィードバック */}
      {isAnswered && showImmediateFeedback && (
        <div className={`rounded-2xl p-4 border-2 ${isCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect
              ? <CheckCircle size={20} className="text-emerald-600" />
              : <XCircle size={20} className="text-red-600" />
            }
            <span className={`font-bold text-lg ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
              {isCorrect ? '正解！' : `不正解　正解は「${question.answer}」`}
            </span>
          </div>

          {/* 解説 */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 text-blue-600 text-base font-semibold mt-1"
          >
            <BookOpen size={16} />
            解説を{showExplanation ? '閉じる' : '見る'}
          </button>

          {showExplanation && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-gray-800 text-[17px] leading-[1.7]">{question.explanation}</p>
              {question.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {question.tags.map(tag => (
                    <span key={tag} className="bg-white border border-gray-300 text-gray-600 text-sm px-2.5 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {question.source_title && question.source_type !== 'concept' && (
                <p className="text-sm text-gray-500 mt-2">
                  出典：{question.source_title}
                  {question.source_date ? ` (${question.source_date})` : ''}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 次へボタン */}
      {isAnswered && (
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 text-[17px] font-bold transition-colors"
        >
          次の問題へ
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
