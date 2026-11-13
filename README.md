# みらい議会＠八潮市

八潮市議会で検討されている議案を、わかりやすく伝えるためのサイトです。

公開URL: （デプロイ後に更新）

> [!NOTE]
> 現在は「サイトの枠」だけの状態です。議案などのデータは登録していません。
> AIチャット・AIインタビュー・レポートなど、外部AI APIを使う機能はオフにしています。
> 公開前に差し替える項目は [docs/yashio/公開前チェックリスト.md](docs/yashio/公開前チェックリスト.md) を参照してください。

## 注意事項

- このプロジェクトは「チームみらい」が開発・公開している「みらい議会」をForkして作成したものです。
- **非公式**のサイトです。不具合や気になる点は、党公式ではなく運営者にご連絡ください。

## ライセンス

このプロジェクトは [GNU AGPL v3](LICENSE) で提供されています。改変して公開サイトとして運用する場合は、利用者がソースコードを入手できるようにする必要があります（このサイトはフッターにGitHubへのリンクを置いています）。

## 他地方議会向けForkガイド

- [fork手順](docs/kawasaki/20260304_1000_別地域向けfork手順.md)

## 次回の起動方法（データベースあり・推奨）

セットアップ済みのパソコンで、2回目以降に起動する手順です。

1. **Docker Desktop を起動**し、左下が「Engine running」になるまで待ちます。
2. ターミナルで次を実行します。

```bash
cd C:\tempMirai\mirai-gikai-yashio-city

# Supabase（データベース）を起動。2回目以降は db:reset は不要
npx supabase start

# web と admin を起動
pnpm dev
```

- web: **http://localhost:3002** / admin: http://localhost:3001
- Supabase Studio（DB管理画面）: http://127.0.0.1:54423
- 止めるとき: `Ctrl+C` のあと、`npx supabase stop`
- DBを初期状態に戻したいとき（ローカルDBの中身が消えます）: `pnpm db:reset`
- Git Bash で `docker` が見つからないときは、PATH に `C:\Program Files\Docker\Docker\resources\bin` を追加します。

## 次回の起動方法（議案なしの画面だけ確認する・Docker不要）

データベースなしで画面の枠だけ確認する手順です。

```bash
# 1. プロジェクトのフォルダに移動
cd C:\tempMirai\mirai-gikai-yashio-city

# 2. （初回のみ）環境変数ファイルを作る。作成済みなら不要
cp .env.example .env

# 3. （初回・依存関係が変わったときのみ）パッケージをインストール
pnpm install

# 4. webだけを起動
cd web
npx dotenv -e ../.env -- next dev --turbopack --port 3002
```

起動したら、ブラウザで **http://localhost:3002** を開きます。止めるときは、起動したターミナルで `Ctrl+C` を押します。

- ポート番号は `web` が **3002**、`admin`（管理画面）が **3001** です（`pnpm dev` で両方を同時に起動できます）。
- データベース（Supabase）を起動していない間は、ターミナルに「fetch failed」のエラーが出ます。画面は議案0件の状態で表示されるので、無視して構いません。
- Googleフォントを取得できない環境では、標準フォントで表示されます。
- 議案・定例会の表示や、管理画面へのログインにはデータベースが必要です。次のセットアップ手順で用意します。

## ローカル環境のセットアップ

**前提条件**: Node.js 20+ / pnpm / Docker

```bash
# 環境変数を設定
cp .env.example .env

# パッケージインストール
pnpm install

# Supabase 起動 + DB 初期化（会派・委員会・タグの枠だけが入ります）
npx supabase start
pnpm db:reset

# 開発サーバー起動
pnpm dev   # web(:3002) + admin(:3001)
```

開発用 Admin アカウント: `admin@example.com` / `admin123456`（開発用DB専用。本番では使わない）

`.env` に外部AIのAPIキーを設定する必要はありません（AI機能はオフです）。

## ブランチ

- 開発ブランチ: `yashio-city-develop`

## よく使うコマンド

| コマンド | 内容 |
|---------|------|
| `pnpm dev` | web + admin 同時起動 |
| `pnpm test` | 全テスト実行 |
| `pnpm lint` | Biome フォーマット + Lint |
| `pnpm typecheck` | TypeScript 型チェック |
| `pnpm db:migrate` | マイグレーション実行 + 型ファイル更新 |
| `pnpm db:types:gen` | Supabase 型定義を再生成 |

## プロジェクト構成

```
web/src/
├── app/            # Next.js ルーティング
├── components/     # 共通UIコンポーネント
├── features/       # 機能別モジュール（bills / committee-minutes / general-questions 等）
└── lib/            # 共通ユーティリティ

admin/src/          # データ管理の管理画面

packages/
├── supabase/       # Supabase クライアント・型定義
└── seed/           # 初期データ（会派・委員会・タグ）投入スクリプト

supabase/migrations/ # DB マイグレーションファイル
docs/                # 設計ドキュメント
```

## 設定ファイル

- `web/src/config/site.config.ts` — サイト名、議会URL、運営者情報、機能のオン/オフ
- `admin/src/config/site.config.ts` — 管理画面の設定、AI機能のオン/オフ

## マイグレーション

```bash
npx supabase migration new マイグレーション名
pnpm db:migrate
```

## Adminユーザーの作成

1. Supabase Studio の Authentication > Add User からユーザーを作成
2. 以下のSQLを実行

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"roles": ["admin"]}'::jsonb
WHERE email = '<作成したユーザーのemail>';
```

## 関連ドキュメント

- [CLAUDE.md](CLAUDE.md) — AI（Claude Code）で開発する場合のルール
