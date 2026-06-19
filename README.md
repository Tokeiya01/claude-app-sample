# KeizaiSense — 日経TEST対策アプリ

日経TESTの本番対策・日次演習・弱点克服を1つの学習体験で提供するWebアプリです。

## 機能

| モード | 説明 |
|--------|------|
| **今日の練習50問** | 日付seedによる決定論的出題。弱点カテゴリを重み付きで優先出題 |
| **模試100問** | 全12カテゴリ・90分制限・本番想定構成。自動採点・詳細結果表示 |
| **弱点克服100問** | weakness_scoreで苦手分野を特定し集中出題 |
| **学習分析** | レーダーチャート・棒グラフ・折れ線グラフで成績を可視化 |
| **設定** | 目標スコア・難易度・プロフィール管理 |

## 出題カテゴリ（12分野）

マクロ経済 / ミクロ経済 / 金融・為替 / 財政・税制 / 国際経済 / 企業戦略 / 産業動向 / テクノロジー・AI / 政治・地政学と経済 / ESG・サステナビリティ / 統計・指標の読み取り / 時事ニュース理解

## 技術スタック

- **Next.js 16** (App Router)
- **TypeScript 5**
- **Tailwind CSS v4**
- **LocalStorage** — バックエンド不要のMVP構成
- **SVGグラフ** — 外部ライブラリ不使用の自製チャート

## 主要ロジック

### 日次50問選定（seeded random）
```
daily_seed = YYYY-MM-DD
mulberry32(hash(seed)) → 決定論的50問選択
弱点カテゴリに +50〜100% 重み付け（上限: 8問/カテゴリ）
```

### 弱点スコア計算
```
weakness_score = 誤答率×0.45 + 継続誤答回数×0.20 + 回答時間超過×0.15 + 直近低迷度×0.20
```

### カテゴリ習熟スコア
```
mastery_score = 正答率×0.50 + 難問正答率×0.20 + 改善率×0.10 + 速度補正×0.10 + 安定度×0.10
```

## 起動方法

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開く。

## ディレクトリ構成

```
app/           # Next.js pages（dashboard/daily/mock/weak/analysis/settings）
components/    # UI components（ExamSession, QuestionCard, ResultScreen, charts）
lib/
  data/        # 216問の問題データ
  generators/  # 問題選定エンジン（seededRandom, daily/mock/weakBuilder）
  analytics/   # 分析エンジン（analyticsEngine, weaknessAnalyzer）
  store.ts     # LocalStorage永続化
  types.ts     # 型定義
```

## 拡張案

1. **Claude API連携** — 最新ニュースから問題を自動生成
2. **バックエンド追加** — Next.js API Route + PostgreSQL/SQLite
3. **プッシュ通知** — 毎日の学習リマインダー
4. **マルチユーザー** — 認証追加（NextAuth等）
5. **英語ニュース問題** — Financial Times等の英文記事からの出題

