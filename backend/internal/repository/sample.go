package repository

import (
	"database/sql"
	"fmt"

	"github.com/takashivan/xano-replace/backend/internal/model"
)

// SampleRepository は samples テーブルへのDB操作をまとめたリポジトリです
type SampleRepository struct {
	db *sql.DB
}

// NewSampleRepository は SampleRepository のインスタンスを生成します
func NewSampleRepository(db *sql.DB) *SampleRepository {
	return &SampleRepository{db: db}
}

// FindAll は samples テーブルの全件を取得します
func (r *SampleRepository) FindAll() ([]model.Sample, error) {
	rows, err := r.db.Query("SELECT id, name, created_at FROM samples ORDER BY id ASC")
	if err != nil {
		return nil, fmt.Errorf("クエリ実行エラー: %w", err)
	}
	defer rows.Close()

	var samples []model.Sample
	for rows.Next() {
		var s model.Sample
		if err := rows.Scan(&s.ID, &s.Name, &s.CreatedAt); err != nil {
			return nil, fmt.Errorf("スキャンエラー: %w", err)
		}
		samples = append(samples, s)
	}

	// rowsのエラー確認
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows.Errエラー: %w", err)
	}

	// nilスライスの代わりに空スライスを返す
	if samples == nil {
		samples = []model.Sample{}
	}

	return samples, nil
}

// Create は samples テーブルに1件追加します
func (r *SampleRepository) Create(name string) (*model.Sample, error) {
	var s model.Sample
	err := r.db.QueryRow(
		"INSERT INTO samples (name) VALUES ($1) RETURNING id, name, created_at",
		name,
	).Scan(&s.ID, &s.Name, &s.CreatedAt)

	if err != nil {
		return nil, fmt.Errorf("インサートエラー: %w", err)
	}

	return &s, nil
}
