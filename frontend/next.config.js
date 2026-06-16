/** @type {import('next').NextConfig} */
const nextConfig = {
  // ECS Fargate / Cloud Run などへのデプロイ時に軽量化
  output: "standalone",
};

module.exports = nextConfig;
