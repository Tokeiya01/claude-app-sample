'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Newspaper, Sparkles, ExternalLink } from 'lucide-react';
import { QUESTIONS, NEWS_ARTICLES } from '@/lib/sampleData';
import { NewsArticle, Question } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CATEGORIES, categoryColorMap } from '@/lib/categories';
import QuestionCard from '@/components/QuestionCard';

type Tab = 'questions' | 'articles';

// Simulated question generation from article
function generateQuestionFromArticle(article: NewsArticle): Question {
  // In production, this calls an AI API. Here we return a mock.
  const existing = QUESTIONS.find(q => q.newsArticleId === article.id || q.type === 'news');
  if (existing) return existing;
  return {
    id: `gen_${article.id}`,
    categoryId: article.categoryId,
    type: 'news',
    difficulty: 'medium',
    estimatedSeconds: 75,
    tags: article.keywords,
    publishedAt: article.publishedAt,
    relatedKeywords: article.keywords,
    text: `【${article.title}】に関する以下の説明のうち、最も適切なものはどれか。（※この問題はデモ生成です）`,
    choices: [
      { id: 'a', text: article.summary.slice(0, 60) + '...', isCorrect: true },
      { id: 'b', text: '上記の内容と反対の解釈が正しい', isCorrect: false },
      { id: 'c', text: 'このニュースは国内市場に影響しない', isCorrect: false },
      { id: 'd', text: '政府の方針とは無関係な動きである', isCorrect: false },
    ],
    explanation: {
      summary: article.summary,
      detail: `このニュースの背景：${article.title}。関連する経済用語・制度・市場への影響を理解することが重要です。`,
      keywords: article.keywords,
      references: [article.sourceName],
    },
  };
}

export default function NewsPage() {
  const [tab, setTab] = useState<Tab>('questions');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [generatedQ, setGeneratedQ] = useState<Question | null>(null);
  const [playQ, setPlayQ] = useState<Question | null>(null);

  const newsQuestions = QUESTIONS.filter(q => q.type === 'news');

  const handleGenerate = async (article: NewsArticle) => {
    setGeneratingId(article.id);
    await new Promise(r => setTimeout(r, 1500)); // simulate API call
    const q = generateQuestionFromArticle(article);
    setGeneratedQ(q);
    setGeneratingId(null);
  };

  if (playQ) {
    return (
      <QuestionCard
        question={playQ}
        onBack={() => setPlayQ(null)}
        onNext={() => setPlayQ(null)}
      />
    );
  }

  if (generatedQ) {
    return (
      <div className="px-4 pt-6 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setGeneratedQ(null)} className="text-gray-400 hover:text-gray-200">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-gray-100">生成された問題</h1>
          <Badge className="bg-rose-900/40 text-rose-300 border-rose-700">AI生成</Badge>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3">
          <Badge className={categoryColorMap[generatedQ.categoryId]}>
            {CATEGORIES.find(c => c.id === generatedQ.categoryId)?.name}
          </Badge>
          <p className="text-sm text-gray-100">{generatedQ.text}</p>
          <div className="space-y-1">
            {generatedQ.choices.map(c => (
              <p key={c.id} className={`text-xs px-3 py-2 rounded-lg border ${c.isCorrect ? 'border-emerald-700 bg-emerald-900/30 text-emerald-200' : 'border-gray-700 bg-gray-800 text-gray-400'}`}>
                {c.id.toUpperCase()}. {c.text} {c.isCorrect && '✓'}
              </p>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-3">
            <p className="text-xs text-gray-400 font-medium mb-1">解説</p>
            <p className="text-xs text-gray-300">{generatedQ.explanation.detail}</p>
          </div>
        </div>

        <button
          onClick={() => setPlayQ(generatedQ)}
          className="w-full bg-rose-700 hover:bg-rose-600 text-white rounded-xl py-3 text-sm font-medium"
        >
          この問題を解く
        </button>
        <button
          onClick={() => setGeneratedQ(null)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-xl py-2.5 text-sm"
        >
          戻る
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-gray-200"><ArrowLeft size={20} /></Link>
        <h1 className="text-lg font-bold text-gray-100">ニュース問題</h1>
      </div>

      {/* タブ */}
      <div className="flex border-b border-gray-800">
        {(['questions', 'articles'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-rose-500 text-rose-400' : 'border-transparent text-gray-500'
            }`}
          >
            {t === 'questions' ? '時事問題' : 'ニュース記事'}
          </button>
        ))}
      </div>

      {tab === 'questions' ? (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">最新ニュースから生成された問題です</p>
          {newsQuestions.map(q => (
            <Card key={q.id} onClick={() => setPlayQ(q)} className="hover:border-rose-700">
              <div className="flex items-start gap-3">
                <Newspaper size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex gap-1 flex-wrap mb-1">
                    <Badge className={categoryColorMap[q.categoryId]}>
                      {CATEGORIES.find(c => c.id === q.categoryId)?.name}
                    </Badge>
                    {q.publishedAt && (
                      <Badge className="bg-gray-800 text-gray-400 border-gray-700">
                        {q.publishedAt}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-200 line-clamp-2">{q.text}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {q.relatedKeywords?.slice(0, 3).map(kw => (
                      <span key={kw} className="text-xs text-gray-500">#{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">記事から問題を自動生成できます（AI機能）</p>
          {NEWS_ARTICLES.map(article => (
            <Card key={article.id}>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="flex gap-1 flex-wrap mb-1">
                      <Badge className={categoryColorMap[article.categoryId]}>
                        {CATEGORIES.find(c => c.id === article.categoryId)?.name}
                      </Badge>
                      <Badge className="bg-gray-800 text-gray-500 border-gray-700">{article.publishedAt}</Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-100">{article.title}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{article.summary}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {article.keywords.slice(0, 4).map(kw => (
                    <span key={kw} className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full border border-gray-700">
                      #{kw}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleGenerate(article)}
                  disabled={generatingId === article.id}
                  className="w-full flex items-center justify-center gap-2 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 rounded-lg py-2 text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {generatingId === article.id ? (
                    <>生成中...</>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      この記事から問題を生成する
                    </>
                  )}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
