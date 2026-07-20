import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "donny.log — 프론트엔드 개발 블로그",
  description:
    "React, TypeScript, Next.js 그리고 더 나은 웹을 위한 실전 경험과 인사이트",
  openGraph: {
    title: "donny.log",
    description: "프론트엔드 개발자의 기술 노트",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "donny.log",
    description: "프론트엔드 개발자의 기술 노트",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black">
          본문으로 건너뛰기
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <ToastContainer theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
