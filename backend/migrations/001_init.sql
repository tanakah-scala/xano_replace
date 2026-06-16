-- samplesテーブルの作成
CREATE TABLE IF NOT EXISTS samples (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 初期データの挿入
INSERT INTO samples (name) VALUES ('初期データ1'), ('初期データ2');
