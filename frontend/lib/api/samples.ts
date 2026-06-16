/**
 * サンプルデータ API クライアント
 *
 * 責任：HTTP リクエストの送受信のみ
 * - バリデーション・状態管理・エラー表示は持ちません
 * - Server Component・Server Action・カスタムフックから呼び出されます
 */
import { API_BASE_URL } from "./config";
import type { Sample } from "@/types";

/**
 * GET /api/samples
 * samples テーブルの全件を取得します
 */
export async function fetchSamples(): Promise<Sample[]> {
  const res = await fetch(`${API_BASE_URL}/api/samples`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`サンプル取得失敗: ${res.status}`);
  }
  return res.json() as Promise<Sample[]>;
}

/**
 * POST /api/samples
 * samples テーブルに 1 件追加します
 */
export async function createSample(name: string): Promise<Sample> {
  const res = await fetch(`${API_BASE_URL}/api/samples`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error(`サンプル作成失敗: ${res.status}`);
  }
  return res.json() as Promise<Sample>;
}
