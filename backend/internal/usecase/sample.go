package usecase

import (
	"fmt"
	"strings"

	"github.com/takashivan/xano-replace/backend/internal/model"
)

// SampleStore は samples テーブルへの DB 操作を抽象化するインターフェースです。
// usecase 層が repository の具体型に依存しないよう、ここで定義します。
type SampleStore interface {
	FindAll() ([]model.Sample, error)
	Create(name string) (*model.Sample, error)
}

// ValidationError はドメインのバリデーション失敗を表すエラー型です。
// handler 層でこの型を識別し、適切な HTTP ステータスコードを返します。
type ValidationError struct {
	Field   string
	Message string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("validation error [%s]: %s", e.Field, e.Message)
}

// SampleUseCase はサンプルデータに関するビジネスロジックを担当します。
// バリデーションやビジネスルールはここに集約し、handler や repository には書きません。
type SampleUseCase struct {
	store SampleStore
}

// NewSampleUseCase は SampleUseCase のインスタンスを生成します。
func NewSampleUseCase(store SampleStore) *SampleUseCase {
	return &SampleUseCase{store: store}
}

// List は全サンプルデータを取得します。
func (uc *SampleUseCase) List() ([]model.Sample, error) {
	return uc.store.FindAll()
}

// Create はバリデーションを行ったうえでサンプルデータを1件作成します。
// バリデーション失敗時は *ValidationError を返します。
func (uc *SampleUseCase) Create(name string) (*model.Sample, error) {
	name = strings.TrimSpace(name)

	if name == "" {
		return nil, &ValidationError{Field: "name", Message: "name は必須です"}
	}
	if len([]rune(name)) > 255 {
		return nil, &ValidationError{Field: "name", Message: "name は 255 文字以内で入力してください"}
	}

	return uc.store.Create(name)
}
