// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/shared/providers";
import Header from "@/widgets/header/ui/Header"; // ✅ 올바른 경로로 Header 추가

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Problem Bank",
  description: "A platform for managing problem banks.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Header />  {/* ✅ 모든 페이지에서 공통으로 적용되는 Header */}
          {/* 상단 여백 추가하여 Header와 컨텐츠 간 간격 확보 */}
          <main className="container mx-auto pt-3">{children}</main>  
        </Providers>
      </body>
    </html>
  );
}
