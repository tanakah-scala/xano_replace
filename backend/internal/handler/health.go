package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/takashivan/xano-replace/backend/internal/usecase"
)

// healthUseCaser は HealthHandler が必要とするユースケース操作を定義するインターフェースです。
// handler 層が usecase の具体型に依存しないよう、consumer 側で宣言します。
type healthUseCaser interface {
	Check() usecase.HealthStatus
}

// HealthHandler はヘルスチェックエンドポイントを提供するハンドラーです。
// HTTP の関心（バインド・レスポンス）のみを担い、ビジネスロジックは usecase に委譲します。
type HealthHandler struct {
	uc healthUseCaser
}

// NewHealthHandler は HealthHandler のインスタンスを生成します。
func NewHealthHandler(uc healthUseCaser) *HealthHandler {
	return &HealthHandler{uc: uc}
}

// healthResponse はヘルスチェックのレスポンス構造体です。
type healthResponse struct {
	Status string `json:"status"`
	DB     string `json:"db"`
}

// Health は GET /health エンドポイントのハンドラーです。
func (h *HealthHandler) Health(c echo.Context) error {
	status := h.uc.Check()

	resp := healthResponse{Status: status.Status, DB: status.DB}
	if status.Status == "ng" {
		return c.JSON(http.StatusServiceUnavailable, resp)
	}
	return c.JSON(http.StatusOK, resp)
}
