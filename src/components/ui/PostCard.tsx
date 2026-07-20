import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.published_at), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="card-hover h-full gap-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-card py-0 ring-0">
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
          <h2 className="line-clamp-2 text-[15px] font-bold leading-snug text-white/90 transition-colors group-hover:text-white">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-xs leading-relaxed text-white/45">
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
              <span className="text-xs text-white/40">donny · {timeAgo}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-rose-400/80">
                <Heart size={12} />
                {post.likes}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/35">
                <MessageCircle size={12} />
                {post.comments_count}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
