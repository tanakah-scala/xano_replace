import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xano Replace",
  description: "Xano 置き換えサービスの仮リポジトリ（学習・検証用）",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
