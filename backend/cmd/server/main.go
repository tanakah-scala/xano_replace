package main

import (
	"log"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/takashivan/xano-replace/backend/internal/db"
	"github.com/takashivan/xano-replace/backend/internal/handler"
	"github.com/takashivan/xano-replace/backend/internal/repository"
	"github.com/takashivan/xano-replace/backend/internal/usecase"
)

func main() {
	// 環境変数からデータベース接続文字列を取得
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		databaseURL = "postgres://appuser:apppass@localhost:5432/appdb?sslmode=disable"
	}

	// ポート番号を環境変数から取得
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// DB 接続の初期化
	database, err := db.New(databaseURL)
	if err != nil {
		log.Fatalf("データベース接続に失敗しました: %v", err)
	}
	defer database.Close()

	log.Println("データベース接続に成功しました")

	// マイグレーションの実行（接続確立とは独立した関心）
	if err := db.Migrate(database); err != nil {
		log.Fatalf("マイグレーションに失敗しました: %v", err)
	}

	log.Println("マイグレーションが完了しました")

	// ── 依存関係の組み立て（DI） ──────────────────────────────
	// repository 層：DB 操作のみ
	sampleRepo := repository.NewSampleRepository(database)
	healthRepo := repository.NewHealthRepository(database)

	// usecase 層：ビジネスロジック（repository インターフェース経由で注入）
	sampleUC := usecase.NewSampleUseCase(sampleRepo)
	healthUC := usecase.NewHealthUseCase(healthRepo)

	// handler 層：HTTP の関心のみ（usecase インターフェース経由で注入）
	healthHandler := handler.NewHealthHandler(healthUC)
	sampleHandler := handler.NewSampleHandler(sampleUC)
	// ──────────────────────────────────────────────────────────

	// Echo インスタンスの作成
	e := echo.New()

	// ミドルウェアの設定
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
	}))

	// ルーティング設定
	e.GET("/health", healthHandler.Health)
	e.GET("/api/samples", sampleHandler.List)
	e.POST("/api/samples", sampleHandler.Create)

	// サーバー起動
	log.Printf("サーバーをポート %s で起動します", port)
	if err := e.Start(":" + port); err != nil {
		log.Fatalf("サーバー起動に失敗しました: %v", err)
	}
}
