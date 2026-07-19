import Link from "next/link";
import { AUTHOR_EMAIL, requireAuthor } from "@/lib/auth/author";
import WriteForm from "@/components/write/WriteForm";

interface WritePageProps {
  searchParams: Promise<{ error?: string }>;
}

export const metadata = {
  title: "글쓰기 — donny.log",
};

export default async function WritePage({ searchParams }: WritePageProps) {
  const author = await requireAuthor();
  const { error } = await searchParams;

  if (!author) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 pt-24 text-center">
        <h1 className="text-2xl font-semibold text-white">
          글쓰기는 작성자만 가능합니다
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/45">
          <span className="text-white/70">{AUTHOR_EMAIL}</span> 계정으로
          로그인한 경우에만 글을 작성할 수 있어요.
        </p>
        <div className="mt-8 flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-white underline decoration-white/25 underline-offset-4 hover:decoration-white/60">
            홈으로
          </Link>
          <Link
            href="/blog"
            className="text-white/45 transition-colors hover:text-white/75">
            블로그
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-24 sm:px-8">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.16em] text-white/30">
          New Post
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">글쓰기</h1>
        <p className="mt-2 text-sm text-white/40">{author.email}로 로그인 중</p>
      </div>

      <WriteForm initialError={error} />
    </div>
  );
}
