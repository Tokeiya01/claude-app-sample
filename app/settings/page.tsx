'use client';
import { useState, useEffect } from 'react';
import { Settings, User, Target, Trash2, ChevronRight, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getProfile, saveProfile, clearAllData } from '@/lib/store';

export default function SettingsPage() {
  const [name, setName] = useState('ゲスト');
  const [goalScore, setGoalScore] = useState(700);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const p = getProfile();
    setName(p.display_name);
    setGoalScore(p.goal_score);
    setDifficulty(p.preferred_difficulty as typeof difficulty);
  }, []);

  const handleSave = () => {
    saveProfile({ display_name: name, goal_score: goalScore, preferred_difficulty: difficulty });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    clearAllData();
    window.location.reload();
  };

  const goalOptions = [500, 600, 650, 700, 750, 800, 850, 900];
  const diffOptions = [
    { id: 'easy', label: '基礎中心', desc: '易問題を多めに出題' },
    { id: 'medium', label: '標準', desc: 'バランスよく出題' },
    { id: 'hard', label: '応用中心', desc: '難問を多めに出題' },
    { id: 'mixed', label: 'おまかせ', desc: '弱点に合わせて自動調整' },
  ] as const;

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">設定</h1>
        <p className="text-gray-500 text-sm mt-1">学習スタイルをカスタマイズ</p>
      </div>

      {/* プロフィール */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-blue-600" />
          <h2 className="text-base font-bold text-gray-800">プロフィール</h2>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">表示名</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="お名前"
          />
        </div>
      </Card>

      {/* 目標スコア */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-emerald-600" />
          <h2 className="text-base font-bold text-gray-800">目標スコア</h2>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {goalOptions.map(g => (
            <button
              key={g}
              onClick={() => setGoalScore(g)}
              className={`py-3 rounded-xl text-sm font-bold transition-colors ${
                goalScore === g
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          日経TESTのスコアは300〜900点。700点以上が上位レベルの目安。
        </p>
      </Card>

      {/* 難易度設定 */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Settings size={18} className="text-purple-600" />
          <h2 className="text-base font-bold text-gray-800">出題難易度</h2>
        </div>
        <div className="space-y-2">
          {diffOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setDifficulty(opt.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-colors ${
                difficulty === opt.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="text-left">
                <p className={`text-sm font-bold ${difficulty === opt.id ? 'text-blue-700' : 'text-gray-800'}`}>
                  {opt.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
              </div>
              {difficulty === opt.id && (
                <Check size={18} className="text-blue-600 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* 保存ボタン */}
      <Button
        onClick={handleSave}
        className="w-full"
        size="lg"
        variant={saved ? 'secondary' : 'primary'}
      >
        {saved ? '✓ 保存しました' : '設定を保存する'}
      </Button>

      {/* アプリ情報 */}
      <Card>
        <h2 className="text-base font-bold text-gray-800 mb-3">アプリ情報</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>アプリ名</span><span className="font-semibold text-gray-900">KeizaiSense</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>バージョン</span><span className="font-semibold text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>問題数</span><span className="font-semibold text-gray-900">216問</span>
          </div>
          <div className="flex justify-between py-2">
            <span>データ保存先</span><span className="font-semibold text-gray-900">ブラウザ内</span>
          </div>
        </div>
      </Card>

      {/* データリセット */}
      <Card className="border-red-200">
        <div className="flex items-center gap-2 mb-3">
          <Trash2 size={18} className="text-red-500" />
          <h2 className="text-base font-bold text-red-700">データリセット</h2>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          学習履歴・回答データをすべて削除します。この操作は取り消せません。
        </p>
        <button
          onClick={handleReset}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
            confirmReset
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-200'
          }`}
        >
          {confirmReset ? '⚠️ もう一度タップで完全削除' : 'データをリセットする'}
        </button>
        {confirmReset && (
          <button
            onClick={() => setConfirmReset(false)}
            className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            キャンセル
          </button>
        )}
      </Card>
    </div>
  );
}
