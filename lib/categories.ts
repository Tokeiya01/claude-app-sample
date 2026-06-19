import { Category, CategoryId } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'macro',
    name: 'マクロ経済',
    description: 'GDP・景気循環・インフレ・金融政策',
    color: 'bg-blue-100',
    textColor: 'text-blue-800',
  },
  {
    id: 'micro',
    name: 'ミクロ経済',
    description: '需要供給・市場・価格・競争理論',
    color: 'bg-cyan-100',
    textColor: 'text-cyan-800',
  },
  {
    id: 'finance',
    name: '金融・為替',
    description: '株式・債券・為替・金融機関',
    color: 'bg-emerald-100',
    textColor: 'text-emerald-800',
  },
  {
    id: 'fiscal',
    name: '財政・税制',
    description: '財政政策・税制・国債・社会保障',
    color: 'bg-teal-100',
    textColor: 'text-teal-800',
  },
  {
    id: 'global',
    name: '国際経済',
    description: '貿易・国際収支・為替レート・WTO',
    color: 'bg-indigo-100',
    textColor: 'text-indigo-800',
  },
  {
    id: 'strategy',
    name: '企業戦略',
    description: '経営戦略・M&A・組織・コーポレートガバナンス',
    color: 'bg-violet-100',
    textColor: 'text-violet-800',
  },
  {
    id: 'industry',
    name: '産業動向',
    description: 'DX・サプライチェーン・半導体・新産業',
    color: 'bg-amber-100',
    textColor: 'text-amber-800',
  },
  {
    id: 'tech',
    name: 'テクノロジー・AI',
    description: 'AI・DX・フィンテック・テクノロジー',
    color: 'bg-sky-100',
    textColor: 'text-sky-800',
  },
  {
    id: 'geopolitics',
    name: '政治・地政学と経済',
    description: '地政学リスク・政策・制裁・貿易摩擦',
    color: 'bg-orange-100',
    textColor: 'text-orange-800',
  },
  {
    id: 'esg',
    name: 'ESG・サステナビリティ',
    description: 'ESG投資・脱炭素・サプライチェーン倫理',
    color: 'bg-green-100',
    textColor: 'text-green-800',
  },
  {
    id: 'stats',
    name: '統計・指標の読み取り',
    description: '経済指標・統計・データ解釈・指数',
    color: 'bg-purple-100',
    textColor: 'text-purple-800',
  },
  {
    id: 'news',
    name: '時事ニュース理解',
    description: '最新経済ニュース・時事問題',
    color: 'bg-rose-100',
    textColor: 'text-rose-800',
  },
];

export const getCategoryById = (id: CategoryId): Category =>
  CATEGORIES.find(c => c.id === id) ?? CATEGORIES[0];

export const categoryBadgeClass = (id: CategoryId): string => {
  const cat = getCategoryById(id);
  return `${cat.color} ${cat.textColor}`;
};

export const MOCK_EXAM_DISTRIBUTION: Record<CategoryId, number> = {
  macro: 12,
  micro: 8,
  finance: 12,
  fiscal: 8,
  global: 8,
  strategy: 10,
  industry: 8,
  tech: 8,
  geopolitics: 6,
  esg: 6,
  stats: 6,
  news: 8,
};
