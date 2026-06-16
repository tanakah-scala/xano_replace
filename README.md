# cd-replace

> **このリポジトリは個人の学習・検証用です。。**

サービスを Xano 置き換え前提で構築した仮リポジトリです。  
最小構成（Hello World レベル）で ECS Fargate / Cloud Run 等のクラウドリソースへデプロイ可能な状態を目指しています。

---

## システム構成図

```
┌─────────────────────────────────────────────────┐
│                  クライアント                     │
│            ブラウザ (localhost:3000)              │
└───────────────────┬─────────────────────────────┘
                    │ HTTP
┌───────────────────▼─────────────────────────────┐
│           フロントエンド (Next.js 15)             │
│               frontend:3000                      │
└───────────────────┬─────────────────────────────┘
                    │ HTTP (API呼び出し)
┌───────────────────▼─────────────────────────────┐
│           バックエンド (Go + Echo v4)             │
│               backend:8080                       │
└───────────────────┬─────────────────────────────┘
                    │ SQL
┌───────────────────▼─────────────────────────────┐
│             データベース (PostgreSQL 16)           │
│                  db:5432                         │
└─────────────────────────────────────────────────┘
```

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Next.js 15 (App Router) + TypeScript + Tailwind CSS |
| バックエンド | Go 1.23+ + Echo v4 |
| データベース | PostgreSQL 16 |
| インフラ | Docker / docker-compose / ECS Fargate |

## ディレクトリ構成

```
xano-replace/
├── README.md
├── .gitignore
├── docker-compose.yml
├── frontend/               # Next.js 15 アプリ
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── lib/
│   │   └── api.ts
│   └── Dockerfile
├── backend/                # Go + Echo v4 API サーバー
│   ├── cmd/server/main.go
│   ├── internal/
│   │   ├── handler/
│   │   ├── repository/
│   │   ├── model/
│   │   └── db/
│   ├── migrations/
│   └── Dockerfile
└── docs/
    └── tech-selection.md   # 技術選定ドキュメント
```

## セットアップ & 起動手順

### 前提条件
- Docker Desktop がインストール済み・起動済みであること

### ローカル起動（一発）

```bash
git clone <repo-url>
cd xano-replace
docker-compose up
```

- フロントエンド: http://localhost:3000
- バックエンド API: http://localhost:8080
- ヘルスチェック: http://localhost:8080/health

### 動作確認

1. ブラウザで http://localhost:3000 を開く
2. **「API 疎通確認」** ボタンを押して `{"status":"ok","db":"connected"}` が表示されることを確認
3. **「サンプルデータ取得」** ボタンを押して初期データ2件がリスト表示されることを確認

### 終了

```bash
docker-compose down        # コンテナ停止
docker-compose down -v     # コンテナ停止 + ボリューム削除（DB初期化）
```

## API エンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/health` | ヘルスチェック（DB接続確認含む） |
| GET | `/api/samples` | samples テーブル全件取得 |
| POST | `/api/samples` | samples テーブルに1件追加 |

## デプロイ手順の概要

### AWS ECS Fargate

```bash
# 1. ECR にイメージをプッシュ
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.ap-northeast-1.amazonaws.com
docker build -t api-server ./backend
docker tag api-server:latest <account>.dkr.ecr.ap-northeast-1.amazonaws.com/api-server:latest
docker push <account>.dkr.ecr.ap-northeast-1.amazonaws.com/api-server:latest

# 2. ECS タスク定義の環境変数に以下を設定
#    DATABASE_URL=postgres://user:pass@<rds-endpoint>:5432/appdb
#    PORT=8080

# 3. ECS サービスのヘルスチェックパス: /health
```

### Google Cloud Run

```bash
# バックエンド
gcloud run deploy api-server \
  --image gcr.io/<project>/api-server \
  --set-env-vars DATABASE_URL=postgres://...  \
  --port 8080 \
  --region asia-northeast1

# フロントエンド
gcloud run deploy app-frontend \
  --image gcr.io/<project>/app-frontend \
  --set-env-vars NEXT_PUBLIC_API_BASE_URL=https://api-server-xxx.run.app \
  --port 3000 \
  --region asia-northeast1
```

### 環境変数一覧

| 変数名 | 説明 | デフォルト |
|--------|------|-----------|
| `DATABASE_URL` | PostgreSQL 接続文字列 | `postgres://appuser:apppass@db:5432/appdb` |
| `PORT` | バックエンド起動ポート | `8080` |
| `NEXT_PUBLIC_API_BASE_URL` | フロントからのAPI接続先 | `http://localhost:8080` |

## 次のステップ

- [ ] 認証機能の追加（JWT / Cookie ベース）
- [ ] シェフ・レストラン等のドメインモデル追加
- [ ] GitHub Actions による CI/CD パイプライン構築
- [ ] ECS Fargate / Cloud Run へのデプロイ実施
- [ ] データベースマイグレーションツール（golang-migrate）の導入
- [ ] 構造化ログ（zerolog 等）の導入

---

> 技術選定の詳細は [docs/tech-selection.md](./docs/tech-selection.md) を参照
