import { Suspense } from "react";
import type { Metadata } from "next";
import PostCard from "@/components/ui/PostCard";
import { Badge } from "@/components/ui/badge";
import { getPosts } from "@/lib/posts";

const TAGS = [
  "전체",
  "React",
  "TypeScript",
  "Next.js",
  "CSS",
  "성능최적화",
  "개발일지",
];

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

  const posts = await getPosts(tag && tag !== "전체" ? tag : undefined);

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-foreground">블로그</h1>
          <p className="mt-3 text-base text-foreground/45">
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
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-surface-subtle text-foreground/50 hover:bg-surface-hover hover:text-foreground"
              }`}>
              {t}
            </Badge>
          ))}
        </div>

        {/* Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} priority={index < 3} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-foreground/50">
            아직 포스트가 없어요.
          </div>
        )}
      </div>
    </div>
  );
}
