/**
 * ヘルスチェック結果表示コンポーネント（純粋 View）
 *
 * 責任：HealthResponse を受け取り JSON プレビューとして表示するだけ
 * - 状態・副作用・データ取得は持ちません
 */
import type { HealthResponse } from "@/types";

interface HealthResultProps {
  result: HealthResponse;
}

export function HealthResult({ result }: HealthResultProps) {
  return (
    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm font-mono">
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
