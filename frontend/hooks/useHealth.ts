"use client";

/**
 * ヘルスチェックの状態管理フック
 *
 * 責任：ヘルスチェックに関する「状態（state）」と「副作用（effect）」のみ
 * - UI の描画（JSX）は持ちません → HealthCheckSection へ
 * - HTTP 呼び出しの詳細は持ちません → lib/api/health へ
 */
import { useState, useCallback } from "react";
import { fetchHealth } from "@/lib/api/health";
import type { HealthResponse } from "@/types";

interface UseHealthReturn {
  result: HealthResponse | null;
  error: string | null;
  loading: boolean;
  checkHealth: () => Promise<void>;
}

export function useHealth(): UseHealthReturn {
  const [result, setResult] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHealth();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "不明なエラー");
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, error, loading, checkHealth };
}
