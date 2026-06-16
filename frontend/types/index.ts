/**
 * ドメイン型定義
 *
 * - この層はロジックを持たない「型の境界」として機能します
 * - lib/api・hooks・components はこのファイルから型をインポートします
 * - バックエンドの model 層と 1:1 対応させることで、型ずれを最小化します
 */

/** ヘルスチェックのレスポンス型 */
export interface HealthResponse {
  status: string;
  db: string;
}

/** サンプルデータの型 */
export interface Sample {
  id: number;
  name: string;
  created_at: string;
}
