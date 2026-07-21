import { requireAuthor } from "@/lib/auth/author";
import AuthorOnlyNotice from "@/components/write/AuthorOnlyNotice";
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
    return <AuthorOnlyNotice mode="create" />;
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
