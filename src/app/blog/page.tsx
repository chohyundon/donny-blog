import type { Metadata } from "next";
import PostGrid from "@/components/ui/PostGrid";
import { Badge } from "@/components/ui/badge";
import { getPosts, getTrendingPosts } from "@/lib/posts";
import { POST_TAGS } from "@/lib/tags";

const TAGS = ["전체", ...POST_TAGS];

interface BlogPageProps {
  searchParams: Promise<{
    tag?: string;
    tab?: string;
    q?: string | string[];
  }>;
}

function normalizeQuery(q: string | string[] | undefined): string | undefined {
  return Array.isArray(q) ? q[0] : q;
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const { tag, q: rawQ } = await searchParams;
  const q = normalizeQuery(rawQ);
  const activeTag = tag && tag !== "전체" ? tag : undefined;

  const title = q
    ? `"${q}" 검색 결과 — donny.log`
    : activeTag
      ? `${activeTag} 태그 글 목록 — donny.log`
      : "블로그 — donny.log";
  const description = q
    ? `donny.log에서 "${q}"에 대한 검색 결과예요.`
    : activeTag
      ? `donny.log에서 ${activeTag} 태그가 붙은 글을 모아봤어요.`
      : "React, TypeScript, Next.js 그리고 좋은 코드에 대한 이야기";

  return {
    title,
    description,
    alternates: {
      canonical: q
        ? `/blog?q=${encodeURIComponent(q)}`
        : activeTag
          ? `/blog?tag=${activeTag}`
          : "/blog",
    },
    openGraph: { title, description },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag, tab, q: rawQ } = await searchParams;
  const q = normalizeQuery(rawQ);
  const activeTag = tag ?? "전체";
  const activeTagValue = tag && tag !== "전체" ? tag : undefined;

  const posts = q
    ? await getPosts(activeTagValue, q)
    : tab === "trending"
      ? await getTrendingPosts()
      : await getPosts(activeTagValue);

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-foreground">
            {q ? `"${q}" 검색 결과` : "블로그"}
          </h1>
          <p className="mt-3 text-base text-foreground/45">
            {q
              ? `${posts.length}개의 글을 찾았어요.`
              : "React, TypeScript, Next.js 그리고 좋은 코드에 대한 이야기"}
          </p>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {TAGS.map((t) => {
            const qSuffix = q ? `&q=${encodeURIComponent(q)}` : "";
            const href =
              t === "전체"
                ? q
                  ? `/blog?q=${encodeURIComponent(q)}`
                  : "/blog"
                : `/blog?tag=${t}${qSuffix}`;
            return (
              <Badge
                key={t}
                render={<a href={href} />}
                className={`h-auto cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTag === t
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-surface-subtle text-foreground/50 hover:bg-surface-hover hover:text-foreground"
                }`}>
                {t}
              </Badge>
            );
          })}
        </div>

        {/* Grid */}
        <PostGrid
          posts={posts}
          emptyMessage={
            q ? `"${q}"에 대한 검색 결과가 없어요.` : undefined
          }
        />
      </div>
    </div>
  );
}
