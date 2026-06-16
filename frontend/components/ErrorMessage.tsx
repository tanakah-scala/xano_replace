/**
 * エラーメッセージ表示コンポーネント（純粋 View）
 *
 * 責任：エラー文字列を受け取り赤いバナーとして表示するだけ
 * - 状態・副作用・データ取得は持ちません
 * - "use client" 不要（hooks を使わない純粋な描画）
 */
interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
      ❌ {message}
    </div>
  );
}
