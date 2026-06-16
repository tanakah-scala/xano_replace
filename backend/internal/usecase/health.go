package usecase

// Pinger は DB 疎通確認を抽象化するインターフェースです。
// usecase 層がインフラ層（repository）の具体型に依存しないよう、
// 呼び出し側（usecase）でインターフェースを定義します（依存性逆転の原則）。
type Pinger interface {
	Ping() error
}

// HealthStatus はヘルスチェックの結果を表す値オブジェクトです。
type HealthStatus struct {
	Status string
	DB     string
}

// HealthUseCase はアプリケーションのヘルスチェックを担当します。
type HealthUseCase struct {
	pinger Pinger
}

// NewHealthUseCase は HealthUseCase のインスタンスを生成します。
func NewHealthUseCase(pinger Pinger) *HealthUseCase {
	return &HealthUseCase{pinger: pinger}
}

// Check は DB への疎通確認を行い、結果を HealthStatus として返します。
// エラーを返さず値として返すことで、ハンドラー側の分岐を最小化します。
func (uc *HealthUseCase) Check() HealthStatus {
	if err := uc.pinger.Ping(); err != nil {
		return HealthStatus{Status: "ng", DB: "disconnected"}
	}
	return HealthStatus{Status: "ok", DB: "connected"}
}
