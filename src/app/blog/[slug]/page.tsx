import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import CommentSection from "@/components/comments/CommentSection";
import LikeButton from "@/components/blog/LikeButton";
import TableOfContents from "@/components/blog/TableOfContents";
import PostActions from "@/components/blog/PostActions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAuthContext } from "@/lib/auth/author";
import { getCommentsBySlug, mapUserToCommentAuthor } from "@/lib/comments";
import { renderMarkdown } from "@/lib/markdown/render";
import { getPostBySlug } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = `${post.title} — donny.log`;

  return {
    title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at,
      images: post.thumbnail_url ? [post.thumbnail_url] : undefined,
    },
    twitter: {
      card: post.thumbnail_url ? "summary_large_image" : "summary",
      title,
      description: post.excerpt,
      images: post.thumbnail_url ? [post.thumbnail_url] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const [comments, { user, author }] = await Promise.all([
    getCommentsBySlug(slug),
    getAuthContext(),
  ]);
  const commentAuthor = user ? mapUserToCommentAuthor(user) : null;

  const timeAgo = formatDistanceToNow(new Date(post.published_at), {
    addSuffix: true,
    locale: ko,
  });

  const hasMarkdownBody =
    !!post.content &&
    post.content.trim().length > 0 &&
    !post.content.trim().endsWith("...");

  const { content: markdownContent, headings } = hasMarkdownBody
    ? await renderMarkdown(post.content)
    : { content: null, headings: [] };

  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.published_at,
    url: `${siteUrl}/blog/${slug}`,
    image: post.thumbnail_url ?? undefined,
    author: {
      "@type": "Person",
      name: "donny",
    },
  };

  return (
    <div className="pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-8">
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-auto gap-2 p-0 text-sm text-foreground/40 hover:bg-transparent hover:text-foreground",
            )}>
            <ArrowLeft size={15} />
            블로그로 돌아가기
          </Link>
          {author && <PostActions slug={slug} />}
        </div>

        <div
          className="relative mb-10 h-56 overflow-hidden rounded-2xl"
          style={{ backgroundColor: post.thumbnail_color }}>
          {post.thumbnail_url ? (
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
              priority
            />
          ) : (
            <>
              <div
                className="absolute -top-10 right-0 h-64 w-64 rounded-full opacity-40"
                style={{ backgroundColor: post.thumbnail_accent }}
              />
              <div className="absolute bottom-0 -left-8 h-32 w-32 rounded-full bg-white/10" />
            </>
          )}
          <div className="absolute bottom-5 left-6">
            <Badge className="h-auto rounded-full border-0 bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {post.tag}
            </Badge>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4 text-sm text-foreground/55">
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded-full"
              style={{ backgroundColor: post.thumbnail_color }}
            />
            <span>donny</span>
          </div>
          <span>·</span>
          <span>{timeAgo}</span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {post.read_time}분 읽기
          </span>
        </div>

        <h1 className="mb-8 text-4xl font-extrabold leading-tight text-foreground">
          {post.title}
        </h1>
      </div>

      {hasMarkdownBody ? (
        <div className="mx-auto max-w-3xl px-8 xl:max-w-5xl xl:grid xl:grid-cols-[minmax(0,1fr)_200px] xl:items-start xl:gap-12">
          <div className="prose-blog max-w-[65ch]">{markdownContent}</div>
          <TableOfContents
            headings={headings}
            className="sticky top-24 hidden xl:block"
          />
        </div>
      ) : (
        <div className="mx-auto max-w-3xl px-8">
          <article className="prose-blog space-y-6 text-foreground/80">
            <p>{post.excerpt}</p>
          </article>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-8">
        <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
          <div className="flex items-center gap-4">
            <LikeButton
              postId={post.id}
              slug={slug}
              initialLikes={post.likes}
            />
            <a
              href="#comments"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "gap-2 rounded-xl border-border bg-surface-subtle px-4 py-2.5 text-sm text-foreground/40 hover:bg-surface-hover hover:text-foreground",
              )}>
              <MessageCircle size={15} />
              {comments.length} 댓글
            </a>
          </div>
          <Link
            href="/blog"
            className="text-sm text-foreground/55 transition-colors hover:text-foreground">
            다른 글 보기 →
          </Link>
        </div>

        <CommentSection
          postSlug={slug}
          initialComments={comments}
          user={commentAuthor}
        />
      </div>
    </div>
  );
}
