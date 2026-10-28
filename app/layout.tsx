import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Điểm danh Buổi họp 332 | BNI Mountain",
  description: "Điểm danh nhanh dành cho thành viên BNI Mountain tại Buổi họp số 332.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
