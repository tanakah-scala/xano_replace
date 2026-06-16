package model

import "time"

// Sample は samples テーブルのレコードを表す構造体です
type Sample struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}
