/**
 * ホームページ（Server Component）
 *
 * 責任：初期データのサーバーサイドフェッチとページレイアウトの組み立て
 * - "use client" を持たない Server Component として機能します
 * - 初回レンダリング時にサーバー側でサンプルデータを取得し、
 *   Client Component（SampleSection）へ initialSamples として渡します
 * - インタラクティブな操作（ボタン・フォーム）は各 Client Component が担います
 *
 * Server Component を使う理由：
 * - 初期 HTML にデータを埋め込めるため、クライアントで余分なフェッチが発生しない
 * - バンドルサイズを削減できる（useState / useEffect がページ本体に不要）
 */
import { HealthCheckSection } from "@/components/HealthCheckSection";
import { SampleSection } from "@/components/SampleSection";
import { fetchSamples } from "@/lib/api/samples";
import type { Sample } from "@/types";

export default async function HomePage() {
  // サーバーサイドで初期データを取得
  // 失敗してもページ自体は表示し、クライアントから再取得可能にする
  let initialSamples: Sample[] = [];
  try {
    initialSamples = await fetchSamples();
  } catch {
    // バックエンドが未起動などの場合は空配列でフォールバック
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      {/* ヘッダー */}
      <h1 className="text-4xl font-bold text-center mb-2 text-indigo-700">
        🍽️ Xano Replace
      </h1>
      <p className="text-center text-gray-500 mb-10 text-sm">
        学習・検証用リポジトリ — Go + Echo + Next.js 15 + PostgreSQL
      </p>

      {/* ヘルスチェック（Client Component：ボタン押下で on-demand 実行） */}
      <HealthCheckSection />

      {/* サンプルデータ（initialSamples はサーバーサイドで取得済み） */}
      <SampleSection initialSamples={initialSamples} />
    </main>
  );
}
