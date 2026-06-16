# --- ビルドステージ ---
FROM node:20-alpine AS builder

WORKDIR /app

# 依存モジュールのインストール（キャッシュ活用）
COPY package.json package-lock.json* ./
RUN npm ci

# ソースコードのコピーとビルド
COPY . .

# スタンドアローン出力でビルド（next.config.js で output: 'standalone' 設定済み）
RUN npm run build

# --- 実行ステージ ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 非rootユーザーで実行
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# スタンドアローンビルド成果物のコピー
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public 2>/dev/null || true

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
