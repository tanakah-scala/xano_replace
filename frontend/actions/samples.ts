"use server";

/**
 * サンプルデータ Server Action（BFF 層）
 *
 * 責任：クライアントからの変更リクエストをサーバーサイドで処理する
 * - "use server" によりこの関数はサーバー上で実行されます
 * - バックエンド API への呼び出しは内部ネットワーク（API_BASE_URL）経由になります
 * - 戻り値を Result 型にすることで、クライアント側の try/catch を排除します
 *
 * Server Action を使う理由：
 * - クライアントから直接バックエンド API を叩く代わりに Next.js サーバーを経由させる
 * - 将来的な認証トークンの付与・レート制限をここ 1 箇所で管理できる
 */
import { createSample } from "@/lib/api/samples";
import type { Sample } from "@/types";

type ActionResult<T> = { data: T; error: null } | { data: null; error: string };

/**
 * サンプルデータを 1 件作成する Server Action
 * エラーは例外でなく { error: string } として返し、クライアント側の分岐を型で解決します
 */
export async function createSampleAction(
  name: string,
): Promise<ActionResult<Sample>> {
  try {
    const sample = await createSample(name);
    return { data: sample, error: null };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : "不明なエラー",
    };
  }
}
