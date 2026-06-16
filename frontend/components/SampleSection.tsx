"use client";

/**
 * サンプルデータセクション（Client Component）
 *
 * 責任：useSamples フックと純粋 View を組み合わせてインタラクティブな UI を提供する
 * - サンプルデータの状態管理は useSamples へ委譲
 * - 表示ロジックは SampleList / SampleForm / ErrorMessage へ委譲
 * - initialSamples を受け取ることで、Server Component のサーバーサイドフェッチ結果を
 *   クライアント状態として引き継ぎます（初期表示をサーバーサイドで完結させる）
 */
import { useSamples } from "@/hooks/useSamples";
import { SampleList } from "./SampleList";
import { SampleForm } from "./SampleForm";
import { ErrorMessage } from "./ErrorMessage";
import type { Sample } from "@/types";

interface SampleSectionProps {
  initialSamples: Sample[];
}

export function SampleSection({ initialSamples }: SampleSectionProps) {
  const {
    samples,
    fetchError,
    fetchLoading,
    createError,
    createLoading,
    loadSamples,
    addSample,
  } = useSamples(initialSamples);

  return (
    <>
      {/* サンプルデータ取得セクション */}
      <section className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📋 サンプルデータ取得</h2>
        <button
          onClick={loadSamples}
          disabled={fetchLoading}
          className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg transition"
        >
          {fetchLoading ? "取得中..." : "GET /api/samples"}
        </button>

        {fetchError && <ErrorMessage message={fetchError} />}
        <SampleList samples={samples} />
      </section>

      {/* サンプルデータ追加セクション */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">➕ サンプルデータ追加</h2>
        <SampleForm onSubmit={addSample} loading={createLoading} />
        {createError && <ErrorMessage message={createError} />}
      </section>
    </>
  );
}
