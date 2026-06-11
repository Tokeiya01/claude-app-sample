'use client';
import Link from 'next/link';
import { BookOpen, BarChart2, Trophy, Newspaper, Flame, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SAMPLE_REVIEW_STATES } from '@/lib/sampleData';
import { isDue } from '@/lib/fsrs';
import { CATEGORIES } from '@/lib/categories';

const overdueCount = SAMPLE_REVIEW_STATES.filter(s => isDue(s)).length;
const today = new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' });

export default function HomePage() {
  return (
    <div className="px-4 pt-6 space-y-5">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{today}</p>
          <h1 className="text-xl font-bold text-gray-100">KeizaiSense</h1>
          <p className="text-gray-500 text-xs">日経TEST対策アプリ</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-900/30 border border-orange-800 rounded-lg px-3 py-2">
          <Flame size={16} className="text-orange-400" />
          <span className="text-orange-300 text-sm font-bold">3日連続</span>
        </div>
      </div>

      {/* 今日の学習サマリー */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">5</p>
          <p className="text-xs text-gray-400 mt-1">今日解いた</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{overdueCount}</p>
          <p className="text-xs text-gray-400 mt-1">要復習</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-emerald-400">72%</p>
          <p className="text-xs text-gray-400 mt-1">正答率</p>
        </div>
      </div>

      {/* デイリーチャレンジ */}
      <Link href="/study/daily">
        <Card className="bg-gradient-to-r from-blue-950 to-indigo-950 border-blue-800 hover:border-blue-600 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame size={14} className="text-orange-400" />
                <span className="text-xs text-orange-300 font-medium">デイリーチャレンジ</span>
              </div>
              <p className="text-gray-100 font-semibold">今日の6問を解こう</p>
              <p className="text-gray-400 text-xs mt-1">推定時間 約5分</p>
            </div>
            <div className="bg-blue-600 rounded-full p-3">
              <BookOpen size={20} className="text-white" />
            </div>
          </div>
        </Card>
      </Link>

      {/* 今日のおすすめ */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-1">
          <Clock size={14} className="text-blue-400" />
          今日のおすすめ学習
        </h2>
        <div className="space-y-2">
          {overdueCount > 0 && (
            <Link href="/review">
              <Card className="flex items-center gap-3 hover:border-red-700">
                <div className="bg-red-900/40 rounded-lg p-2">
                  <AlertCircle size={18} className="text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-100">復習が {overdueCount}問 溜まっています</p>
                  <p className="text-xs text-gray-500">忘れる前に復習しましょう</p>
                </div>
                <Badge className="bg-red-900/40 text-red-300 border-red-700">急ぎ</Badge>
              </Card>
            </Link>
          )}
          <Link href="/study?category=macro">
            <Card className="flex items-center gap-3">
              <div className="bg-blue-900/40 rounded-lg p-2">
                <BookOpen size={18} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-100">マクロ経済を強化</p>
                <p className="text-xs text-gray-500">正答率が低い分野です</p>
              </div>
              <Badge className="bg-blue-900/40 text-blue-300 border-blue-700">弱点</Badge>
            </Card>
          </Link>
          <Link href="/news">
            <Card className="flex items-center gap-3">
              <div className="bg-rose-900/40 rounded-lg p-2">
                <Newspaper size={18} className="text-rose-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-100">今日の時事問題</p>
                <p className="text-xs text-gray-500">最新ニュースから出題</p>
              </div>
              <Badge className="bg-rose-900/40 text-rose-300 border-rose-700">NEW</Badge>
            </Card>
          </Link>
        </div>
      </div>

      {/* カテゴリ別 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 mb-2">カテゴリ別学習</h2>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.slice(0, 4).map(cat => (
            <Link key={cat.id} href={`/study?category=${cat.id}`}>
              <Card className="hover:border-gray-600">
                <p className="text-sm font-medium text-gray-200">{cat.name}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{cat.description}</p>
              </Card>
            </Link>
          ))}
        </div>
        <Link href="/study" className="block mt-2 text-center text-xs text-blue-400 hover:text-blue-300 py-2">
          全カテゴリを見る →
        </Link>
      </div>

      {/* 模試・弱点分析 */}
      <div className="grid grid-cols-2 gap-2 pb-2">
        <Link href="/mock">
          <Card className="flex items-center gap-3 hover:border-yellow-700">
            <Trophy size={20} className="text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-gray-100">模試を受ける</p>
              <p className="text-xs text-gray-500">20問・30分</p>
            </div>
          </Card>
        </Link>
        <Link href="/analysis">
          <Card className="flex items-center gap-3 hover:border-purple-700">
            <BarChart2 size={20} className="text-purple-400" />
            <div>
              <p className="text-sm font-medium text-gray-100">弱点分析</p>
              <p className="text-xs text-gray-500">ヒートマップ表示</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
