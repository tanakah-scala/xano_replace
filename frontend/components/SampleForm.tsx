"use client";

/**
 * サンプル追加フォームコンポーネント（View + フォームローカル状態）
 *
 * 責任：入力フォームの描画と「入力中の文字列」という一時的な UI 状態の管理
 * - フォーム内の name 入力はフォーム自身の表示状態（アプリケーション状態ではない）
 * - サブミット処理（addSample）は props 経由で受け取り、ここには持ちません
 * - アプリケーション状態（samples 配列）には一切触れません
 */
import { useState } from "react";

interface SampleFormProps {
  onSubmit: (name: string) => Promise<void>;
  loading: boolean;
}

export function SampleForm({ onSubmit, loading }: SampleFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onSubmit(name.trim());
    setName("");
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="名前を入力..."
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !name.trim()}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg transition"
      >
        {loading ? "追加中..." : "POST /api/samples"}
      </button>
    </div>
  );
}
