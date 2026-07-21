import type { Metadata } from "next";
import PostGrid from "@/components/ui/PostGrid";
import { Badge } from "@/components/ui/badge";
import { getPosts, getTrendingPosts } from "@/lib/posts";
import { POST_TAGS } from "@/lib/tags";

const TAGS = ["전체", ...POST_TAGS];

interface BlogPageProps {
  searchParams: Promise<{ tag?: string; tab?: string }>;
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const { tag } = await searchParams;
  const activeTag = tag && tag !== "전체" ? tag : undefined;

  const title = activeTag
    ? `${activeTag} 태그 글 목록 — donny.log`
    : "블로그 — donny.log";
  const description = activeTag
    ? `donny.log에서 ${activeTag} 태그가 붙은 글을 모아봤어요.`
    : "React, TypeScript, Next.js 그리고 좋은 코드에 대한 이야기";

  return {
    title,
    description,
    alternates: {
      canonical: activeTag ? `/blog?tag=${activeTag}` : "/blog",
    },
    openGraph: { title, description },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag, tab } = await searchParams;
  const activeTag = tag ?? "전체";

  const posts =
    tab === "trending"
      ? await getTrendingPosts()
      : await getPosts(tag && tag !== "전체" ? tag : undefined);

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-white">블로그</h1>
          <p className="mt-3 text-base text-white/45">
            React, TypeScript, Next.js 그리고 좋은 코드에 대한 이야기
          </p>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {TAGS.map((t) => (
            <Badge
              key={t}
              render={<a href={t === "전체" ? "/blog" : `/blog?tag=${t}`} />}
              className={`h-auto cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTag === t
                  ? "bg-indigo-500 text-white"
                  : "border border-white/[0.1] bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white"
              }`}>
              {t}
            </Badge>
          ))}
        </div>

        {/* Grid */}
        <PostGrid posts={posts} />
      </div>
    </div>
  );
}
