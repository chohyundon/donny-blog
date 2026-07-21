import Link from "next/link";
import VisitorChart from "@/components/home/VisitorChart";
import type { DailyVisit } from "@/lib/stats";

interface HeroSectionProps {
  visitorCount: number;
  visitorHistory: DailyVisit[];
}

export default function HeroSection({
  visitorCount,
  visitorHistory,
}: HeroSectionProps) {
  const formatted = visitorCount.toLocaleString("ko-KR");
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <section className="mx-auto max-w-7xl px-6 pt-20 pb-14 sm:px-8 sm:pt-24">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:items-end lg:gap-14">
        {/* 소개 */}
        <div>
          <p className="text-sm text-foreground/55">안녕하세요, Donny입니다.</p>

          <h1 className="mt-4 text-3xl font-semibold leading-snug tracking-tight text-foreground sm:text-4xl">
            프론트엔드 하면서 겪은 것들을 적어둡니다.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/50">
            React, TypeScript, Next.js 위주로요. 디버깅하다 막혔던 것, 나중에
            다시 보려고 정리한 것들이 대부분입니다.
          </p>

          <div className="mt-8 flex items-center gap-5 text-sm">
            <Link
              href="/blog"
              className="text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground/60">
              글 목록 보기
            </Link>
            <span className="text-foreground/20">·</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-foreground/50 transition-colors hover:text-foreground/80">
              GitHub
            </a>
          </div>
        </div>

        {/* 방문자 + 그래프 */}
        {visitorCount > 0 && (
          <div className="min-w-0">
            <p className="text-sm text-foreground/45">
              지금까지{" "}
              <span className="font-medium text-foreground/80">{formatted}명</span>이
              다녀갔어요
            </p>
            <VisitorChart data={visitorHistory} todayStr={todayStr} />
          </div>
        )}
      </div>
    </section>
  );
}
