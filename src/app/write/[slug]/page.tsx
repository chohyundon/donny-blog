import { notFound } from "next/navigation";
import { requireAuthor } from "@/lib/auth/author";
import { getPostBySlugForAuthor } from "@/lib/posts";
import AuthorOnlyNotice from "@/components/write/AuthorOnlyNotice";
import WriteForm from "@/components/write/WriteForm";

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}

export const metadata = {
  title: "글 수정 — donny.log",
};

export default async function EditPostPage({
  params,
  searchParams,
}: EditPostPageProps) {
  const author = await requireAuthor();
  const { error } = await searchParams;

  if (!author) {
    return <AuthorOnlyNotice mode="edit" />;
  }

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getPostBySlugForAuthor(slug);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-24 sm:px-8">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.16em] text-white/30">
          Edit Post
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">글 수정</h1>
        <p className="mt-2 text-sm text-white/40">{author.email}로 로그인 중</p>
      </div>

      <WriteForm initialError={error} initialPost={post} />
    </div>
  );
}
