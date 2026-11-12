---
name: db-access
description: 八潮市版のDB接続の規約。DBデータを参照・更新する際に必ず確認すること。
---

# DB接続規約（八潮市版）

## 重要：操作してよいのはローカルDBだけ

- 開発用DBは、Docker上のローカルSupabase（`127.0.0.1:54432`、API は `http://127.0.0.1:54421`）。
- **本番や外部のSupabaseプロジェクトには接続しない。** 本番DBはまだ用意していない。
- 操作の前に、`.env` の `SUPABASE_URL` などが `127.0.0.1` を指していることを確認する。`127.0.0.1` 以外を指していたら、操作せずユーザーに報告する。
- 本番用の URL・キー・プロジェクト ref は、このリポジトリに書かない。

## DBを操作する方法

- 確認・更新は、ローカルのDBコンテナに対して `psql` で行う。

```bash
# Git Bash で docker が見つからないときは PATH を追加する
export PATH="$PATH:/c/Program Files/Docker/Docker/resources/bin"

# 参照
docker exec supabase_db_mirai-gikai psql -U postgres -c "select bill_number, name from bills"

# SQLファイルを流す（トランザクションと ON_ERROR_STOP を付ける）
docker exec -i supabase_db_mirai-gikai psql -U postgres -v ON_ERROR_STOP=1 < bills.sql
```

- 事前に `npx supabase start`（Docker Desktop が起動していること）。
- 初期状態に戻すときは `pnpm db:reset`（ローカルDBの中身がすべて消える。実行前に、消してよいデータだけであることを確認する）。

## 関連

- 議案の取り込み手順: `yashio-import-bill` スキル
- 起動手順: README の「次回の起動方法」
