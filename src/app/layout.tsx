import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "donny.log — 프론트엔드 개발 블로그",
  description:
    "React, TypeScript, Next.js 그리고 더 나은 웹을 위한 실전 경험과 인사이트",
  openGraph: {
    title: "donny.log",
    description: "프론트엔드 개발자의 기술 노트",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={cn("dark h-full", "font-sans", geist.variable)}>
      <body className="min-h-full antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
