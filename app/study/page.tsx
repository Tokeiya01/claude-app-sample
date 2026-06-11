'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { QUESTIONS } from '@/lib/sampleData';
import { CATEGORIES, categoryColorMap } from '@/lib/categories';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import QuestionCard from '@/components/QuestionCard';

function StudyContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryFilter || 'all');
  const [currentQ, setCurrentQ] = useState<string | null>(null);

  const filtered = QUESTIONS.filter(q =>
    activeCategory === 'all' ? q.type === 'fixed' : q.categoryId === activeCategory
  );

  if (currentQ) {
    const q = QUESTIONS.find(q => q.id === currentQ)!;
    return (
      <QuestionCard
        question={q}
        onBack={() => setCurrentQ(null)}
        onNext={() => {
          const idx = filtered.findIndex(fq => fq.id === currentQ);
          const next = filtered[idx + 1];
          if (next) setCurrentQ(next.id);
          else setCurrentQ(null);
        }}
      />
    );
  }

  return (
    <div className="px-4 pt-6 space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-gray-200">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-gray-100">問題演習</h1>
      </div>

      {/* カテゴリフィルター */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            activeCategory === 'all'
              ? 'bg-blue-700 text-white border-blue-600'
              : 'bg-gray-900 text-gray-400 border-gray-700'
          }`}
        >
          すべて
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              activeCategory === cat.id
                ? 'bg-blue-700 text-white border-blue-600'
                : 'bg-gray-900 text-gray-400 border-gray-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <p className="text-gray-500 text-xs">{filtered.length}問 表示中</p>

      <div className="space-y-2">
        {filtered.map(q => (
          <Card key={q.id} onClick={() => setCurrentQ(q.id)} className="hover:border-gray-600">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge className={categoryColorMap[q.categoryId]}>
                    {CATEGORIES.find(c => c.id === q.categoryId)?.name}
                  </Badge>
                  <Badge className={
                    q.difficulty === 'easy' ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700' :
                    q.difficulty === 'medium' ? 'bg-yellow-900/40 text-yellow-300 border-yellow-700' :
                    'bg-red-900/40 text-red-300 border-red-700'
                  }>
                    {q.difficulty === 'easy' ? '易' : q.difficulty === 'medium' ? '中' : '難'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-200 line-clamp-2">{q.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div className="p-4 text-gray-400">読み込み中...</div>}>
      <StudyContent />
    </Suspense>
  );
}
