/**
 * ヘルスチェック API クライアント
 *
 * 責任：HTTP リクエストの送受信のみ
 * - ビジネスロジック・状態管理・エラー表示は持ちません
 * - 呼び出し元（Server Component / カスタムフック）が try/catch を担います
 */
import { API_BASE_URL } from "./config";
import type { HealthResponse } from "@/types";

/**
 * GET /health
 * バックエンドのヘルスチェックを実行します
 */
export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/health`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`ヘルスチェック失敗: ${res.status}`);
  }
  return res.json() as Promise<HealthResponse>;
}
