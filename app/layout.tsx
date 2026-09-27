import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "AI Playground · Từ zero đến aha!",
  description:
    "26 bước tương tác giúp developer hiểu tìm kiếm, vector, model, RAG và Generative AI.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
