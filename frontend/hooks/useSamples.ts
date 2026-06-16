"use client";

/**
 * サンプルデータの状態管理フック
 *
 * 責任：サンプルデータに関する「状態」と「副作用」のみ
 * - UI の描画（JSX）は持ちません → SampleSection へ
 * - HTTP 呼び出しの詳細は持ちません → lib/api/samples / actions/samples へ
 *
 * initialSamples を受け取ることで、Server Component からの初期データを
 * クライアント状態として引き継ぎます（ハイドレーションパターン）。
 */
import { useState, useCallback } from "react";
import { fetchSamples } from "@/lib/api/samples";
import { createSampleAction } from "@/actions/samples";
import type { Sample } from "@/types";

interface UseSamplesReturn {
  samples: Sample[];
  fetchError: string | null;
  fetchLoading: boolean;
  createError: string | null;
  createLoading: boolean;
  loadSamples: () => Promise<void>;
  addSample: (name: string) => Promise<void>;
}

export function useSamples(initialSamples: Sample[] = []): UseSamplesReturn {
  const [samples, setSamples] = useState<Sample[]>(initialSamples);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  /** サンプルデータを再取得します（クライアントサイドフェッチ） */
  const loadSamples = useCallback(async () => {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const data = await fetchSamples();
      setSamples(data);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "不明なエラー");
    } finally {
      setFetchLoading(false);
    }
  }, []);

  /**
   * サンプルデータを 1 件追加します（Server Action 経由）
   * Result 型で受け取るため、try/catch を使わず型で分岐します。
   */
  const addSample = useCallback(async (name: string) => {
    setCreateLoading(true);
    setCreateError(null);
    const result = await createSampleAction(name);
    if (result.error !== null) {
      setCreateError(result.error);
    } else {
      const created = result.data;
      setSamples((prev) => [...prev, created]);
    }
    setCreateLoading(false);
  }, []);

  return {
    samples,
    fetchError,
    fetchLoading,
    createError,
    createLoading,
    loadSamples,
    addSample,
  };
}
