"use client";

/**
 * ヘルスチェックセクション（Client Component）
 *
 * 責任：useHealth フックと純粋 View を組み合わせてインタラクティブな UI を提供する
 * - データ取得ロジックは useHealth へ委譲
 * - 表示ロジックは HealthResult / ErrorMessage へ委譲
 * - このコンポーネントは「接着剤」として機能し、複雑な分岐を書きません
 */
import { useHealth } from "@/hooks/useHealth";
import { HealthResult } from "./HealthResult";
import { ErrorMessage } from "./ErrorMessage";

export function HealthCheckSection() {
  const { result, error, loading, checkHealth } = useHealth();

  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">🔌 API 疎通確認</h2>
      <button
        onClick={checkHealth}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg transition"
      >
        {loading ? "確認中..." : "GET /health"}
      </button>

      {result && <HealthResult result={result} />}
      {error && <ErrorMessage message={error} />}
    </section>
  );
}
