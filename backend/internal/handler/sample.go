package handler

import (
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/takashivan/xano-replace/backend/internal/model"
	"github.com/takashivan/xano-replace/backend/internal/usecase"
)

// sampleUseCaser は SampleHandler が必要とするユースケース操作を定義するインターフェースです。
type sampleUseCaser interface {
	List() ([]model.Sample, error)
	Create(name string) (*model.Sample, error)
}

// SampleHandler は samples エンドポイントを提供するハンドラーです。
// HTTP の関心（バインド・レスポンス・エラーコード判定）のみを担い、
// バリデーションやビジネスロジックは usecase に委譲します。
type SampleHandler struct {
	uc sampleUseCaser
}

// NewSampleHandler は SampleHandler のインスタンスを生成します。
func NewSampleHandler(uc sampleUseCaser) *SampleHandler {
	return &SampleHandler{uc: uc}
}

// createSampleRequest は POST /api/samples のリクエストボディ構造体です。
type createSampleRequest struct {
	Name string `json:"name"`
}

// List は GET /api/samples エンドポイントのハンドラーです。
func (h *SampleHandler) List(c echo.Context) error {
	samples, err := h.uc.List()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "データ取得に失敗しました",
		})
	}
	return c.JSON(http.StatusOK, samples)
}

// Create は POST /api/samples エンドポイントのハンドラーです。
// バリデーションエラーは 422 Unprocessable Entity、それ以外は 500 を返します。
func (h *SampleHandler) Create(c echo.Context) error {
	var req createSampleRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストの解析に失敗しました",
		})
	}

	sample, err := h.uc.Create(req.Name)
	if err != nil {
		// ValidationError かどうかを型で判定（文字列マッチに依存しない）
		var ve *usecase.ValidationError
		if errors.As(err, &ve) {
			return c.JSON(http.StatusUnprocessableEntity, map[string]string{
				"error": ve.Message,
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "データ作成に失敗しました",
		})
	}

	return c.JSON(http.StatusCreated, sample)
}
