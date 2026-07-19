import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import CommentSection from "@/components/comments/CommentSection";
import MarkdownContent from "@/components/blog/MarkdownContent";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCommentsBySlug, getCurrentUser } from "@/lib/comments";
import { getPostBySlug } from "@/lib/posts";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} — donny.log`, description: post.excerpt };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const [comments, user] = await Promise.all([
    getCommentsBySlug(slug),
    getCurrentUser(),
  ]);

  const timeAgo = formatDistanceToNow(new Date(post.published_at), {
    addSuffix: true,
    locale: ko,
  });

  const hasMarkdownBody =
    !!post.content &&
    post.content.trim().length > 0 &&
    !post.content.trim().endsWith("...");

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-8">
        <Link
          href="/blog"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "mb-10 h-auto gap-2 p-0 text-sm text-white/40 hover:bg-transparent hover:text-white",
          )}>
          <ArrowLeft size={15} />
          블로그로 돌아가기
        </Link>

        <div
          className="relative mb-10 h-56 overflow-hidden rounded-2xl"
          style={{ backgroundColor: post.thumbnail_color }}>
          <div
            className="absolute -top-10 right-0 h-64 w-64 rounded-full opacity-40"
            style={{ backgroundColor: post.thumbnail_accent }}
          />
          <div className="absolute bottom-0 -left-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute bottom-5 left-6">
            <Badge className="h-auto rounded-full border-0 bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {post.tag}
            </Badge>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4 text-sm text-white/35">
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

        <h1 className="mb-8 text-4xl font-extrabold leading-tight text-white">
          {post.title}
        </h1>

        {hasMarkdownBody ? (
          <MarkdownContent source={post.content} />
        ) : (
          <article className="prose-blog space-y-6 text-white/80">
            <p>{post.excerpt}</p>
          </article>
        )}

        <div className="mt-16 flex items-center justify-between border-t border-white/8 pt-8">
          <div className="flex items-center gap-4">
            <button
              className={cn(
                buttonVariants({ variant: "outline" }),
                "gap-2 rounded-xl border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/20",
              )}>
              <Heart size={15} />
              {post.likes} 좋아요
            </button>
            <a
              href="#comments"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "gap-2 rounded-xl border-white/10 bg-white/4 px-4 py-2.5 text-sm text-white/40 hover:bg-white/8 hover:text-white",
              )}>
              <MessageCircle size={15} />
              {comments.length} 댓글
            </a>
          </div>
          <Link
            href="/blog"
            className="text-sm text-white/35 transition-colors hover:text-white">
            다른 글 보기 →
          </Link>
        </div>

        <CommentSection
          postSlug={slug}
          initialComments={comments}
          user={user}
        />
      </div>
    </div>
  );
}
