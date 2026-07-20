import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — donny.log",
  description: "donny.log를 쓰는 프론트엔드 개발자 donny 소개",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-8">
        <h1 className="text-5xl font-extrabold text-white">About</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
          안녕하세요, donny입니다. React, TypeScript, Next.js를 중심으로 프론트엔드
          개발을 하며 겪은 것들을 이 블로그에 기록하고 있습니다.
        </p>
      </div>
    </div>
  );
}
