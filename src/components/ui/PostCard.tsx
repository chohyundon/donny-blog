import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTimeAgo } from "@/lib/utils";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  priority?: boolean;
}

export default function PostCard({ post, priority }: PostCardProps) {
  const timeAgo = formatTimeAgo(post.published_at!);

  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="group block">
        <Card className="card-hover h-full gap-0 overflow-hidden rounded-2xl border border-border bg-card py-0 ring-0">
          {/* Thumbnail */}
          <div
            className="relative h-44 overflow-hidden"
            style={{ backgroundColor: post.thumbnail_color }}>
            {post.thumbnail_url ? (
              <Image
                src={post.thumbnail_url}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority={priority}
              />
            ) : (
              <>
                {/* Decorative circles */}
                <div
                  className="absolute -top-8 right-0 h-52 w-52 rounded-full opacity-40"
                  style={{ backgroundColor: post.thumbnail_accent }}
                />
                <div className="absolute bottom-0 -left-6 h-24 w-24 rounded-full bg-white/10" />
              </>
            )}

            {/* Tag badge */}
            <Badge className="absolute bottom-4 left-4 h-auto rounded-full border-0 bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {post.tag}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-3 p-5">
            <h2 className="line-clamp-2 text-[15px] font-bold leading-snug text-foreground/90 transition-colors group-hover:text-foreground">
              {post.title}
            </h2>
            <p className="line-clamp-2 text-xs leading-relaxed text-foreground/45">
              {post.excerpt}
            </p>

            {/* Footer */}
            <div className="mt-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <div
                  className="h-6 w-6 rounded-full"
                  style={{ backgroundColor: post.thumbnail_color }}
                />
                <span className="text-xs text-foreground/55">
                  donny · {timeAgo}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-rose-400/80">
                  <Heart size={12} />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1 text-xs text-foreground/55">
                  <MessageCircle size={12} />
                  {post.comments_count}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </article>
  );
}
