package repository

import "database/sql"

// HealthRepository は DB 疎通確認に特化したリポジトリです。
// HealthHandler が *sql.DB に直接依存しないよう抽象化します。
type HealthRepository struct {
	db *sql.DB
}

// NewHealthRepository は HealthRepository のインスタンスを生成します。
func NewHealthRepository(db *sql.DB) *HealthRepository {
	return &HealthRepository{db: db}
}

// Ping は DB への疎通確認を行います。
func (r *HealthRepository) Ping() error {
	return r.db.Ping()
}
