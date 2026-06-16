package db

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq" // PostgreSQL ドライバー
)

// New は PostgreSQL データベースへの接続を初期化して返します。
// マイグレーション実行は migrate.go の Migrate() に委譲します。
func New(databaseURL string) (*sql.DB, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("データベースオープンエラー: %w", err)
	}

	// 接続確認の ping を実行
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("データベース ping エラー: %w", err)
	}

	return db, nil
}
