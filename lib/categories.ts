import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'macro',      name: 'マクロ経済',   description: 'GDP・景気・インフレ・金融政策など', color: 'blue' },
  { id: 'micro',      name: 'ミクロ経済',   description: '需要供給・市場・価格・競争理論',       color: 'cyan' },
  { id: 'finance',    name: '金融・市場',   description: '株式・債券・為替・金融機関',           color: 'emerald' },
  { id: 'accounting', name: '財務・会計',   description: '財務諸表・原価・キャッシュフロー',     color: 'teal' },
  { id: 'management', name: '企業経営',     description: '経営戦略・組織・コーポレートガバナンス', color: 'violet' },
  { id: 'marketing',  name: 'マーケティング', description: 'STP・4P・ブランド・デジタルマーケ', color: 'purple' },
  { id: 'global',     name: '国際経済',     description: '貿易・国際収支・為替レート・WTO',     color: 'indigo' },
  { id: 'policy',     name: '政策・制度',   description: '財政政策・税制・規制・社会保障',       color: 'orange' },
  { id: 'industry',   name: '産業動向',     description: 'DX・脱炭素・サプライチェーン・新産業', color: 'amber' },
  { id: 'news',       name: '時事・ニュース', description: '最新経済ニュース・時事問題',         color: 'rose' },
];

export const getCategoryById = (id: string): Category | undefined =>
  CATEGORIES.find(c => c.id === id);

export const categoryColorMap: Record<string, string> = {
  macro:      'bg-blue-900/60 text-blue-200 border-blue-700',
  micro:      'bg-cyan-900/60 text-cyan-200 border-cyan-700',
  finance:    'bg-emerald-900/60 text-emerald-200 border-emerald-700',
  accounting: 'bg-teal-900/60 text-teal-200 border-teal-700',
  management: 'bg-violet-900/60 text-violet-200 border-violet-700',
  marketing:  'bg-purple-900/60 text-purple-200 border-purple-700',
  global:     'bg-indigo-900/60 text-indigo-200 border-indigo-700',
  policy:     'bg-orange-900/60 text-orange-200 border-orange-700',
  industry:   'bg-amber-900/60 text-amber-200 border-amber-700',
  news:       'bg-rose-900/60 text-rose-200 border-rose-700',
};

export const heatmapColor = (score: number): string => {
  // score 0=strong(green), 1=weak(red)
  if (score < 0.2) return 'bg-emerald-800 text-emerald-100';
  if (score < 0.4) return 'bg-yellow-700 text-yellow-100';
  if (score < 0.6) return 'bg-orange-700 text-orange-100';
  if (score < 0.8) return 'bg-red-700 text-red-100';
  return 'bg-red-900 text-red-100';
};
