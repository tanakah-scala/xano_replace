/**
 * @deprecated
 * このファイルは後方互換のための re-export バレルです。
 * 新しいコードでは以下を直接インポートしてください：
 *   - 型定義  → @/types
 *   - HTTP 関数 → @/lib/api/health または @/lib/api/samples
 */
export type { HealthResponse, Sample } from "@/types";
export { fetchHealth } from "./api/health";
export { fetchSamples, createSample } from "./api/samples";
