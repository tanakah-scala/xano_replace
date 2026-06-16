# xano-replace backend

Go + Echo v4 によるバックエンド API サーバーです。

## API エンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/health` | ヘルスチェック（DB接続確認） |
| GET | `/api/samples` | samples テーブル全件取得 |
| POST | `/api/samples` | samples テーブルに1件追加 |

## ローカル起動（単独）

```bash
# PostgreSQL が起動している前提
export DATABASE_URL=postgres://appuser:apppass@localhost:5432/appdb?sslmode=disable
go run ./cmd/server
```

## ビルド

```bash
go build -o server ./cmd/server
./server
```
