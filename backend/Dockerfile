# --- ビルドステージ ---
FROM golang:1.23-alpine AS builder

WORKDIR /app

# 依存モジュールのダウンロード（キャッシュ活用）
COPY go.mod go.sum ./
RUN go mod download

# ソースコードのコピーとビルド
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/server

# --- 実行ステージ ---
FROM alpine:3.20

# セキュリティアップデートとCA証明書のインストール
RUN apk --no-cache add ca-certificates wget

WORKDIR /app

# ビルド済みバイナリをコピー
COPY --from=builder /app/server .

# 非rootユーザーで実行
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8080

# ヘルスチェック設定（ECS対応）
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["./server"]
