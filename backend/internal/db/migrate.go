package db

import (
	"database/sql"
	"fmt"
	"log"
)

// Migrate は初期マイグレーション SQL を実行します。
// DB 接続の確立とは関心が異なるため、New とは別ファイルで管理します。
func Migrate(db *sql.DB) error {
	log.Println("マイグレーション開始...")

	// samples テーブルの作成
	createTable := `
	CREATE TABLE IF NOT EXISTS samples (
		id         SERIAL PRIMARY KEY,
		name       VARCHAR(255) NOT NULL,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`

	if _, err := db.Exec(createTable); err != nil {
		return fmt.Errorf("テーブル作成エラー: %w", err)
	}

	// 初期データの挿入（重複挿入を避けるため件数を確認）
	var count int
	if err := db.QueryRow("SELECT COUNT(*) FROM samples").Scan(&count); err != nil {
		return fmt.Errorf("件数確認エラー: %w", err)
	}

	if count == 0 {
		insertData := `INSERT INTO samples (name) VALUES ('初期データ1'), ('初期データ2');`
		if _, err := db.Exec(insertData); err != nil {
			return fmt.Errorf("初期データ挿入エラー: %w", err)
		}
		log.Println("初期データを挿入しました")
	}

	log.Println("マイグレーション完了")
	return nil
}
