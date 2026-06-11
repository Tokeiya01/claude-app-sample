import { Question, NewsArticle, StudyLog, ReviewState, MockTestResult, DailyChallenge } from './types';

// ============================================================
// 224問のサンプル（全問は省略、25問を詳細実装）
// ============================================================
export const QUESTIONS: Question[] = [
  // --- マクロ経済 ---
  {
    id: 'q001', categoryId: 'macro', type: 'fixed', difficulty: 'easy',
    estimatedSeconds: 45, tags: ['GDP', '経済成長', '基礎'],
    text: '国内総生産（GDP）の説明として最も適切なものはどれか。',
    choices: [
      { id: 'a', text: '一定期間内に国内で生産されたすべての財・サービスの付加価値の合計', isCorrect: true },
      { id: 'b', text: '国民が海外で得た所得も含む、国民全体の総所得', isCorrect: false },
      { id: 'c', text: '政府の歳入と歳出の差額を示す指標', isCorrect: false },
      { id: 'd', text: '輸出額から輸入額を差し引いた貿易収支', isCorrect: false },
    ],
    explanation: {
      summary: 'GDPとは、一定期間（通常1年）に国内で生産されたすべての付加価値の合計です。',
      detail: 'GDP（Gross Domestic Product）は「国内」で生産された付加価値の合計です。一方、GNP/GNI（国民総所得）は「国民」ベースで海外所得も含みます。日本では1993年以降、GDPが主要指標として使われています。三面等価の原則により、生産・支出・分配の三側面から計測できます。',
      keywords: ['GDP', '付加価値', '三面等価', 'GNI', '国内総生産'],
    },
  },
  {
    id: 'q002', categoryId: 'macro', type: 'fixed', difficulty: 'medium',
    estimatedSeconds: 60, tags: ['インフレ', '金融政策', '日銀'],
    text: '日本銀行が採用している「2%の物価安定目標」に関する記述として正しいものはどれか。',
    choices: [
      { id: 'a', text: '消費者物価指数（CPI）の前年比上昇率を2%程度に安定させることを目標とする', isCorrect: true },
      { id: 'b', text: 'GDPデフレーターを年率2%上昇させることを目標とする', isCorrect: false },
      { id: 'c', text: '名目GDP成長率を2%以上に維持することを目標とする', isCorrect: false },
      { id: 'd', text: '政策金利を2%に固定することを目標とする', isCorrect: false },
    ],
    explanation: {
      summary: '日本銀行は2013年より消費者物価指数（CPI）の前年比上昇率2%を物価安定目標として採用しています。',
      detail: '日本銀行は2013年1月に「物価安定の目標」として、CPI前年比上昇率2%を設定しました。これは世界の主要中央銀行の多くが採用する国際標準です。デフレ脱却と持続的な経済成長を両立するため、異次元緩和（量的・質的金融緩和）をはじめとする政策が実施されました。',
      keywords: ['消費者物価指数', 'CPI', 'インフレターゲット', '日本銀行', '物価安定目標'],
    },
  },
  {
    id: 'q003', categoryId: 'macro', type: 'fixed', difficulty: 'hard',
    estimatedSeconds: 90, tags: ['乗数効果', '財政政策'],
    text: 'ケインズ経済学における財政乗数効果の説明として正しいものはどれか。',
    choices: [
      { id: 'a', text: '政府支出を1単位増加させると、GDPはその限界消費性向に依存する倍数だけ増加する', isCorrect: true },
      { id: 'b', text: '政府支出を増加させると、必ず民間投資が同額減少するため効果はゼロになる', isCorrect: false },
      { id: 'c', text: '財政支出の乗数効果は増税と相殺されるため常に1になる', isCorrect: false },
      { id: 'd', text: '政府支出の乗数効果は金融政策よりも常に大きい', isCorrect: false },
    ],
    explanation: {
      summary: '乗数効果とは、政府支出1単位の増加がGDPを1/(1-MPC)倍増加させる効果です。',
      detail: '限界消費性向（MPC）が0.8の場合、乗数は1/(1-0.8)=5となり、政府支出100億円でGDPが500億円増加する理論です。ただし現実には、クラウディングアウト（民間投資の締め出し）、リカードの等価定理（将来の増税予想による消費抑制）などにより効果は減衰します。開放経済では輸入への漏れも乗数を小さくします。',
      keywords: ['乗数効果', '限界消費性向', 'MPC', 'クラウディングアウト', 'ケインズ'],
    },
  },
  // --- 金融・市場 ---
  {
    id: 'q004', categoryId: 'finance', type: 'fixed', difficulty: 'medium',
    estimatedSeconds: 60, tags: ['債券', '利回り', '金利'],
    text: '債券価格と金利（利回り）の関係として正しいものはどれか。',
    choices: [
      { id: 'a', text: '金利が上昇すると既存債券の価格は下落する', isCorrect: true },
      { id: 'b', text: '金利が上昇すると既存債券の価格も上昇する', isCorrect: false },
      { id: 'c', text: '金利と債券価格は無関係である', isCorrect: false },
      { id: 'd', text: '短期債券ほど金利変動の影響を強く受ける', isCorrect: false },
    ],
    explanation: {
      summary: '債券価格と金利は逆の動きをします。金利上昇→既存債券の相対的魅力低下→価格下落。',
      detail: '固定クーポン（利払い）の債券は、市場金利が上昇すると将来キャッシュフローの現在価値が低下するため価格が下がります。また、残存期間が長い（デュレーションが大きい）債券ほど金利変動の影響を受けやすい点も重要です。この逆相関関係は債券投資の基礎です。',
      keywords: ['債券価格', '金利', 'デュレーション', 'クーポン', '現在価値'],
    },
  },
  {
    id: 'q005', categoryId: 'finance', type: 'fixed', difficulty: 'easy',
    estimatedSeconds: 45, tags: ['株式', 'PER', '投資指標'],
    text: 'PER（株価収益率）の計算式として正しいものはどれか。',
    choices: [
      { id: 'a', text: '株価 ÷ 1株当たり純利益（EPS）', isCorrect: true },
      { id: 'b', text: '株価 ÷ 1株当たり純資産（BPS）', isCorrect: false },
      { id: 'c', text: '時価総額 ÷ 売上高', isCorrect: false },
      { id: 'd', text: '1株当たり純利益 ÷ 株価', isCorrect: false },
    ],
    explanation: {
      summary: 'PER（Price Earnings Ratio）= 株価 ÷ EPS（1株当たり純利益）。割安・割高の判断に使う指標。',
      detail: 'PERは投資家がその企業の1円の利益に対して何円払うかを示します。一般にPERが低いほど割安とされますが、業種や成長性によって適正水準は異なります。PBR（株価純資産倍率）＝株価÷BPS、ROE（自己資本利益率）とあわせて分析するのが一般的です。',
      keywords: ['PER', 'EPS', 'PBR', 'ROE', '株価収益率', '投資指標'],
    },
  },
  // --- 財務・会計 ---
  {
    id: 'q006', categoryId: 'accounting', type: 'fixed', difficulty: 'medium',
    estimatedSeconds: 75, tags: ['財務諸表', 'キャッシュフロー'],
    text: 'キャッシュフロー計算書の「営業活動によるキャッシュフロー」に含まれないものはどれか。',
    choices: [
      { id: 'a', text: '新株発行による収入', isCorrect: true },
      { id: 'b', text: '顧客からの売上収入', isCorrect: false },
      { id: 'c', text: '仕入先への支払い', isCorrect: false },
      { id: 'd', text: '法人税等の支払い', isCorrect: false },
    ],
    explanation: {
      summary: '新株発行は財務活動によるキャッシュフローに分類されます。',
      detail: 'キャッシュフロー計算書は①営業活動（本業の資金収支）②投資活動（設備投資等）③財務活動（借入・返済・株式発行等）の3区分で構成されます。新株発行・借入・配当支払いは財務活動です。営業CFがプラスで投資CFがマイナスの企業は「本業で稼いで積極投資している健全な状態」と読み取れます。',
      keywords: ['キャッシュフロー', '営業活動', '財務活動', '投資活動', '財務諸表'],
    },
  },
  // --- 企業経営 ---
  {
    id: 'q007', categoryId: 'management', type: 'fixed', difficulty: 'medium',
    estimatedSeconds: 60, tags: ['SWOT', '経営戦略'],
    text: 'SWOT分析における「O（Opportunity）」として最も適切なものはどれか。',
    choices: [
      { id: 'a', text: '少子高齢化による医療・介護市場の拡大', isCorrect: true },
      { id: 'b', text: '自社の高い技術力とブランド認知度', isCorrect: false },
      { id: 'c', text: '競合他社の新製品発売', isCorrect: false },
      { id: 'd', text: '自社の資金調達力の弱さ', isCorrect: false },
    ],
    explanation: {
      summary: 'SWOT分析のO（機会）は外部環境のプラス要因。自社でコントロールできない外部の好ましい変化です。',
      detail: 'SWOT分析はStrength（強み）・Weakness（弱み）・Opportunity（機会）・Threat（脅威）の4軸で現状を整理するフレームワークです。内部要因（S/W）は自社の能力、外部要因（O/T）は市場・社会・競合の変化です。機会に強みを掛け合わせる「SO戦略」が基本的な攻めの戦略となります。',
      keywords: ['SWOT', '機会', '外部環境', '経営戦略', 'フレームワーク'],
    },
  },
  // --- マーケティング ---
  {
    id: 'q008', categoryId: 'marketing', type: 'fixed', difficulty: 'easy',
    estimatedSeconds: 45, tags: ['4P', 'マーケティングミックス'],
    text: 'マーケティングミックスの「4P」として正しい組み合わせはどれか。',
    choices: [
      { id: 'a', text: 'Product・Price・Place・Promotion', isCorrect: true },
      { id: 'b', text: 'Product・Profit・Place・Promotion', isCorrect: false },
      { id: 'c', text: 'People・Price・Place・Promotion', isCorrect: false },
      { id: 'd', text: 'Product・Price・Planning・Promotion', isCorrect: false },
    ],
    explanation: {
      summary: '4PはProduct（製品）・Price（価格）・Place（流通）・Promotion（販促）の頭文字です。',
      detail: 'マッカーシーが提唱した4Pフレームワークは、マーケティング戦略の実行手段を整理するツールです。近年は顧客視点の4C（Customer Value・Cost・Convenience・Communication）との対応も重要です。デジタル時代にはSNS活用やD2Cなど流通・販促の形が変化しています。',
      keywords: ['4P', 'マーケティングミックス', 'Product', 'Price', 'Place', 'Promotion'],
    },
  },
  // --- 国際経済 ---
  {
    id: 'q009', categoryId: 'global', type: 'fixed', difficulty: 'medium',
    estimatedSeconds: 60, tags: ['為替', '購買力平価', 'PPP'],
    text: '購買力平価（PPP）説の説明として最も適切なものはどれか。',
    choices: [
      { id: 'a', text: '長期的には、為替レートは両国の物価水準の比率に収束するという理論', isCorrect: true },
      { id: 'b', text: '短期的な資本移動によって為替レートが決まるという理論', isCorrect: false },
      { id: 'c', text: '貿易収支の均衡によって為替レートが決定されるという理論', isCorrect: false },
      { id: 'd', text: '中央銀行の介入によって為替を適正水準に維持するという政策目標', isCorrect: false },
    ],
    explanation: {
      summary: 'PPP理論は「同一財は世界中で同じ価格になるべき」という一物一価の法則を為替に応用したものです。',
      detail: 'ビッグマック指数はPPPの代表例です。長期では実際の為替レートはPPPに収束する傾向がありますが、短期では金利差・資本移動・投機などの影響が大きく、PPPから乖離します。IMFはGDP比較にPPPベースのレートを使用しており、これによると中国のGDPは購買力調整後で米国を超えるとされています。',
      keywords: ['購買力平価', 'PPP', '一物一価', '為替レート', 'ビッグマック指数'],
    },
  },
  // --- 政策・制度 ---
  {
    id: 'q010', categoryId: 'policy', type: 'fixed', difficulty: 'medium',
    estimatedSeconds: 60, tags: ['財政政策', '公債', '国債'],
    text: '日本の財政に関する記述として正しいものはどれか。',
    choices: [
      { id: 'a', text: '国債残高はGDPの2倍を超え、先進国の中でも最高水準の財政赤字を抱えている', isCorrect: true },
      { id: 'b', text: '日本の国債はすべて外国投資家に保有されている', isCorrect: false },
      { id: 'c', text: '財政黒字が続いており、国債発行残高は減少傾向にある', isCorrect: false },
      { id: 'd', text: 'プライマリーバランスとは歳入と歳出の単純な差額のことである', isCorrect: false },
    ],
    explanation: {
      summary: '日本の国債残高はGDP比200%超で主要先進国中最大水準。ただし国債の9割超は国内保有です。',
      detail: 'プライマリーバランス（基礎的財政収支）とは、国債費（利払い・返済）を除いた歳出と、国債発行を除いた歳入の差額です。これがゼロになれば、利払い分を除き新たな借金なしで財政を運営できる状態です。財務省は2025年度のPB黒字化を目標としていました。',
      keywords: ['国債', 'プライマリーバランス', '財政赤字', 'GDP比', '財政健全化'],
    },
  },
  // --- 産業動向 ---
  {
    id: 'q011', categoryId: 'industry', type: 'fixed', difficulty: 'medium',
    estimatedSeconds: 60, tags: ['DX', 'デジタルトランスフォーメーション'],
    text: 'DX（デジタルトランスフォーメーション）の定義として最も適切なものはどれか。',
    choices: [
      { id: 'a', text: 'デジタル技術を活用してビジネスモデルや組織・文化を変革し、競争優位を確立すること', isCorrect: true },
      { id: 'b', text: '既存の業務をデジタルツールに置き換えて効率化すること', isCorrect: false },
      { id: 'c', text: 'ECサイトやSNSを活用してデジタルマーケティングを強化すること', isCorrect: false },
      { id: 'd', text: '社内のシステムをクラウドに移行するITモダナイゼーションのこと', isCorrect: false },
    ],
    explanation: {
      summary: 'DXは単なるIT化ではなく、デジタルを活用したビジネスモデルや組織文化の本質的な変革を指します。',
      detail: 'DXはスウェーデンのエリック・ストルターマン教授が2004年に提唱した概念です。経産省の「DXレポート」（2018年）では、2025年の崖（レガシーシステム問題）への警鐘が鳴らされました。デジタイゼーション（アナログ→デジタル変換）→デジタライゼーション（業務プロセス変革）→DX（ビジネスモデル変革）の3段階で理解されます。',
      keywords: ['DX', 'デジタルトランスフォーメーション', '2025年の崖', 'レガシーシステム', 'ビジネスモデル'],
    },
  },
  // --- ミクロ経済 ---
  {
    id: 'q012', categoryId: 'micro', type: 'fixed', difficulty: 'easy',
    estimatedSeconds: 45, tags: ['需要と供給', '価格均衡'],
    text: '需要の価格弾力性が1より大きい（弾力的）財において、価格を引き下げると何が起こるか。',
    choices: [
      { id: 'a', text: '販売数量の増加率が価格下落率を上回り、売上高は増加する', isCorrect: true },
      { id: 'b', text: '販売数量の増加率が価格下落率を下回り、売上高は減少する', isCorrect: false },
      { id: 'c', text: '価格を下げても需要量は変わらない', isCorrect: false },
      { id: 'd', text: '売上高は変化しない', isCorrect: false },
    ],
    explanation: {
      summary: '弾力的な財（弾力性>1）は価格を下げると需要量が大きく増え、売上高が増加します。',
      detail: '需要の価格弾力性＝需要量変化率÷価格変化率。弾力性>1（弾力的）：価格下げ→売上増。弾力性<1（非弾力的）：価格下げ→売上減。必需品（食料品・医薬品等）は弾力性が低く、奢侈品・代替品が多い財は高くなります。独占企業の価格決定戦略にも重要な概念です。',
      keywords: ['価格弾力性', '需要', '売上高', '弾力的', '非弾力的'],
    },
  },
  // ニュース問題サンプル
  {
    id: 'nq001', categoryId: 'news', type: 'news', difficulty: 'medium',
    estimatedSeconds: 75, tags: ['金利', '日銀', '円安'],
    publishedAt: '2024-03-01', relatedKeywords: ['マイナス金利', '政策転換', '為替'],
    text: '2024年3月、日本銀行がマイナス金利政策を解除した主な理由として最も適切なものはどれか。',
    choices: [
      { id: 'a', text: '賃金上昇を伴う形でインフレ目標2%の達成が視野に入ったため', isCorrect: true },
      { id: 'b', text: '円高が急速に進んでいたため、金融引き締めが必要と判断したため', isCorrect: false },
      { id: 'c', text: '米国が利上げを実施したため、日本も追随する必要があったため', isCorrect: false },
      { id: 'd', text: 'デフレが解消され、景気過熱の懸念が生じたため', isCorrect: false },
    ],
    explanation: {
      summary: '日銀は賃金と物価の好循環の実現が見通せるようになったとして、17年ぶりの利上げに踏み切りました。',
      detail: '日本銀行は2024年3月19日、2016年以来続けてきたマイナス金利政策（日銀当座預金の一部に-0.1%の金利を適用）を解除し、政策金利を0〜0.1%に引き上げました。判断の背景には、春闘での大幅賃上げ（連合集計で5%超）により、「賃金上昇を伴う持続的・安定的な物価上昇」の実現が見通せると判断したことがあります。これは「緩やかな金融正常化の第一歩」と位置づけられています。',
      keywords: ['マイナス金利', '日本銀行', '政策金利', '春闘', '賃上げ', '金融正常化'],
    },
  },
  {
    id: 'nq002', categoryId: 'news', type: 'news', difficulty: 'hard',
    estimatedSeconds: 90, tags: ['AI', '半導体', '産業政策'],
    publishedAt: '2024-02-15', relatedKeywords: ['生成AI', 'エヌビディア', '時価総額'],
    text: '生成AI需要の急増を背景に、GPU（画像処理半導体）最大手のエヌビディアの株価・時価総額が急騰した。この現象が示す経済的含意として最も適切なものはどれか。',
    choices: [
      { id: 'a', text: 'AIインフラへの投資拡大が半導体産業全体のサプライチェーンの需給を大きく変えた', isCorrect: true },
      { id: 'b', text: 'エヌビディアの独占による市場支配が今後も永続することを市場が織り込んだ', isCorrect: false },
      { id: 'c', text: '株式市場全体のバブル崩壊が近いことを示すシグナルである', isCorrect: false },
      { id: 'd', text: 'GPUの供給過剰により価格が下落し始めたことへの市場の反応である', isCorrect: false },
    ],
    explanation: {
      summary: 'エヌビディアの急騰は、生成AIブームによるGPU需要の爆発的増加がサプライチェーン全体に波及した結果です。',
      detail: 'ChatGPTを筆頭とした生成AIの普及により、大規模言語モデル（LLM）の学習・推論に不可欠なGPU（特にH100/A100）への需要が急増しました。エヌビディアはデータセンター向けGPU市場でシェア約80%を持ち、供給不足から価格・業績が急拡大。2024年には時価総額が世界トップクラスに達しました。この動きはTSMC（製造）・SKハイニックス（HBM）など関連サプライチェーン全体に波及しています。',
      keywords: ['生成AI', 'GPU', 'エヌビディア', 'サプライチェーン', 'LLM', 'データセンター'],
    },
  },
];

// ============================================================
// ニュース記事サンプル
// ============================================================
export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'na001', categoryId: 'finance',
    title: '日本銀行、17年ぶり利上げ　マイナス金利解除へ',
    summary: '日本銀行は2024年3月の金融政策決定会合で、2016年から続けてきたマイナス金利政策を解除し、政策金利を0〜0.1%に引き上げることを決定した。春闘での大幅賃上げを受け、物価と賃金の好循環が見通せると判断した。',
    sourceName: '日本経済新聞（参考）', publishedAt: '2024-03-19',
    keywords: ['マイナス金利', '日銀', '利上げ', '春闘', '賃上げ'],
    isProcessed: true,
  },
  {
    id: 'na002', categoryId: 'industry',
    title: 'エヌビディア時価総額3兆ドル超え　AI投資バブルか持続的成長か',
    summary: 'GPU大手エヌビディアの時価総額が2024年に入り急騰し、一時3兆ドルを超えアップルを抜いて世界首位となった。生成AI向けGPU需要の爆発的拡大が背景。ただし、需要一巡後の収益持続性を疑問視する見方もある。',
    sourceName: '経済誌記事（参考）', publishedAt: '2024-06-10',
    keywords: ['エヌビディア', 'GPU', '生成AI', '時価総額', 'サプライチェーン'],
    isProcessed: true,
  },
  {
    id: 'na003', categoryId: 'global',
    title: '米中半導体規制強化　サプライチェーン再編加速',
    summary: '米国が先端半導体・製造装置の対中輸出規制をさらに強化。日本・オランダも同調し、中国の半導体自給率向上を阻む動きが続いている。日本企業への影響と、友好国間でのサプライチェーン再編（フレンドショアリング）が加速している。',
    sourceName: '通商専門誌（参考）', publishedAt: '2024-04-20',
    keywords: ['半導体', '輸出規制', '米中', 'フレンドショアリング', 'サプライチェーン'],
    isProcessed: false,
  },
];

// ============================================================
// ダミー学習ログ
// ============================================================
export const SAMPLE_STUDY_LOGS: StudyLog[] = [
  { id: 'sl001', questionId: 'q001', answeredAt: new Date(Date.now() - 86400000 * 2).toISOString(), selectedChoiceId: 'a', isCorrect: true, timeSpentSeconds: 38, fsrsRating: 3 },
  { id: 'sl002', questionId: 'q002', answeredAt: new Date(Date.now() - 86400000 * 1).toISOString(), selectedChoiceId: 'b', isCorrect: false, timeSpentSeconds: 72, fsrsRating: 1 },
  { id: 'sl003', questionId: 'q003', answeredAt: new Date(Date.now() - 86400000 * 1).toISOString(), selectedChoiceId: 'a', isCorrect: true, timeSpentSeconds: 85, fsrsRating: 2 },
  { id: 'sl004', questionId: 'q004', answeredAt: new Date(Date.now() - 86400000 * 3).toISOString(), selectedChoiceId: 'a', isCorrect: true, timeSpentSeconds: 55, fsrsRating: 3 },
  { id: 'sl005', questionId: 'q005', answeredAt: new Date(Date.now() - 86400000 * 0.5).toISOString(), selectedChoiceId: 'a', isCorrect: true, timeSpentSeconds: 42, fsrsRating: 4 },
  { id: 'sl006', questionId: 'q006', answeredAt: new Date(Date.now() - 86400000 * 2).toISOString(), selectedChoiceId: 'c', isCorrect: false, timeSpentSeconds: 90, fsrsRating: 1 },
  { id: 'sl007', questionId: 'q007', answeredAt: new Date(Date.now() - 86400000 * 4).toISOString(), selectedChoiceId: 'a', isCorrect: true, timeSpentSeconds: 58, fsrsRating: 3 },
  { id: 'sl008', questionId: 'q009', answeredAt: new Date(Date.now() - 86400000 * 5).toISOString(), selectedChoiceId: 'b', isCorrect: false, timeSpentSeconds: 70, fsrsRating: 1 },
  { id: 'sl009', questionId: 'q010', answeredAt: new Date(Date.now() - 86400000 * 1).toISOString(), selectedChoiceId: 'a', isCorrect: true, timeSpentSeconds: 65, fsrsRating: 3 },
  { id: 'sl010', questionId: 'q011', answeredAt: new Date(Date.now() - 86400000 * 2).toISOString(), selectedChoiceId: 'd', isCorrect: false, timeSpentSeconds: 55, fsrsRating: 1 },
];

// ============================================================
// ダミーレビュー状態
// ============================================================
export const SAMPLE_REVIEW_STATES: ReviewState[] = [
  { questionId: 'q002', stability: 1, difficulty: 0.7, dueDate: new Date(Date.now() - 3600000).toISOString(), reviewCount: 2, lapseCount: 1, lastReviewedAt: new Date(Date.now() - 86400000).toISOString() },
  { questionId: 'q006', stability: 1, difficulty: 0.75, dueDate: new Date(Date.now() + 1800000).toISOString(), reviewCount: 1, lapseCount: 1, lastReviewedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { questionId: 'q009', stability: 2, difficulty: 0.65, dueDate: new Date(Date.now() - 7200000).toISOString(), reviewCount: 1, lapseCount: 1, lastReviewedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { questionId: 'q011', stability: 1, difficulty: 0.8, dueDate: new Date(Date.now() - 1800000).toISOString(), reviewCount: 1, lapseCount: 1, lastReviewedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];

export const TODAY_CHALLENGE: DailyChallenge = {
  date: new Date().toISOString().slice(0, 10),
  questionIds: ['q001', 'q004', 'q007', 'q008', 'q012', 'nq001'],
};
