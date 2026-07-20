import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — donny.log",
  description: "donny가 만든 프로젝트 모음",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-8">
        <h1 className="text-5xl font-extrabold text-white">Projects</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
          준비 중입니다. 곧 만든 프로젝트들을 이곳에 정리해서 올릴게요.
        </p>
      </div>
    </div>
  );
}
