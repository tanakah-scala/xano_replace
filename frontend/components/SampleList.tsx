/**
 * サンプルリスト表示コンポーネント（純粋 View）
 *
 * 責任：Sample[] を受け取りリストとして描画するだけ
 * - 状態・副作用・データ取得は持ちません
 * - "use client" 不要（hooks を使わない純粋な描画）
 */
import type { Sample } from "@/types";

interface SampleListProps {
  samples: Sample[];
}

export function SampleList({ samples }: SampleListProps) {
  if (samples.length === 0) return null;

  return (
    <ul className="mt-4 space-y-2">
      {samples.map((s) => (
        <li
          key={s.id}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm"
        >
          <span className="text-gray-400 font-mono">#{s.id}</span>
          <span className="font-medium">{s.name}</span>
          <span className="ml-auto text-gray-400 text-xs">
            {new Date(s.created_at).toLocaleString("ja-JP")}
          </span>
        </li>
      ))}
    </ul>
  );
}
