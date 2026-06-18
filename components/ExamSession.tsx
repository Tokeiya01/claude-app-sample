'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, X } from 'lucide-react';
import { Question, ExamMode } from '@/lib/types';
import { saveAttempt, createAttempt, saveSession, finishSession } from '@/lib/store';
import QuestionCard, { QuestionCardAnswer } from '@/components/QuestionCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatTime } from '@/lib/utils';
import ResultScreen from '@/components/ResultScreen';

interface Props {
  session: import('@/lib/types').ExamSession;
  questions: Question[];
  mode: ExamMode;
  timeLimitSec?: number;
  showImmediateFeedback?: boolean;
  onExit: () => void;
}

export default function ExamSession({
  session,
  questions,
  mode,
  timeLimitSec,
  showImmediateFeedback = true,
  onExit,
}: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(session.answers ?? {});
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finishedSession, setFinishedSession] = useState<import('@/lib/types').ExamSession | null>(null);
  const [answerTimes, setAnswerTimes] = useState<Record<string, number>>({});
  const startedAt = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Auto-finish when time is up
  useEffect(() => {
    if (timeLimitSec && elapsed >= timeLimitSec && !finished) {
      handleFinish();
    }
  }, [elapsed, timeLimitSec, finished]);

  const handleFinish = useCallback(() => {
    if (finished) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);
    const done = finishSession(session, answers, questions, elapsed);
    saveSession(done);
    setFinishedSession(done);
  }, [finished, session, answers, questions, elapsed]);

  const handleAnswer = useCallback((answer: QuestionCardAnswer) => {
    setAnswers(prev => ({ ...prev, [answer.questionId]: answer.choiceId }));
    setAnswerTimes(prev => ({ ...prev, [answer.questionId]: answer.responseTimeSec }));

    const q = questions.find(q => q.id === answer.questionId);
    if (!q) return;
    const attempt = createAttempt(
      session.id,
      q.id,
      mode,
      answer.choiceId,
      answer.isCorrect,
      answer.responseTimeSec,
      q.category,
      q.subcategory,
      q.difficulty
    );
    saveAttempt(attempt);
  }, [questions, session.id, mode]);

  const handleNext = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      handleFinish();
    }
  }, [currentIdx, questions.length, handleFinish]);

  if (finished && finishedSession) {
    return (
      <ResultScreen
        session={finishedSession}
        questions={questions}
        answers={answers}
        elapsedSec={elapsed}
        onExit={onExit}
      />
    );
  }

  const current = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const timeLeft = timeLimitSec ? timeLimitSec - elapsed : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Progress header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onExit} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            {timeLeft !== null && (
              <div className={`flex items-center gap-1.5 text-sm font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                <Clock size={15} />
                {formatTime(Math.max(0, timeLeft))}
              </div>
            )}
            <span className="text-sm font-medium text-gray-600">
              {currentIdx + 1} / {questions.length}
            </span>
          </div>
        </div>
        <ProgressBar value={answeredCount} max={questions.length} barClassName="bg-blue-500" />
      </div>

      {/* Question */}
      <div className="px-4 py-5">
        {current && (
          <QuestionCard
            key={current.id}
            question={current}
            questionNumber={currentIdx + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
            showImmediateFeedback={showImmediateFeedback}
            answered={!!answers[current.id]}
            selectedChoice={answers[current.id]}
          />
        )}
      </div>

      {/* Finish button */}
      {answeredCount >= Math.min(questions.length, 5) && !finished && (
        <div className="px-4 pb-4">
          <button
            onClick={handleFinish}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl py-3 text-base transition-colors"
          >
            終了して結果を見る ({answeredCount}/{questions.length}問回答済み)
          </button>
        </div>
      )}
    </div>
  );
}
