/**
 * バックエンド API のベース URL 設定
 *
 * - サーバーサイド（Server Component / Server Action）では API_BASE_URL を優先します
 *   → Docker Compose では `API_BASE_URL=http://backend:8080` を設定してください
 * - クライアントサイド（Client Component）では NEXT_PUBLIC_API_BASE_URL を使用します
 *   → `NEXT_PUBLIC_*` はビルド時にバンドルへ埋め込まれます
 * - どちらも未設定の場合はローカル開発用のデフォルト値にフォールバックします
 */
export const API_BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8080";
