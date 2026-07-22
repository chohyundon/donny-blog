"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { Heart } from "lucide-react";
import { likePostAction } from "@/lib/actions/posts";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  slug: string;
  initialLikes: number;
}

const LIKED_POSTS_KEY = "liked-posts";

function getLikedSlugs(): string[] {
  try {
    const raw = localStorage.getItem(LIKED_POSTS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function subscribeNoop() {
  return () => {};
}

function getServerLiked() {
  return false;
}

export default function LikeButton({
  postId,
  slug,
  initialLikes,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [justLiked, setJustLiked] = useState(false);
  const [, startTransition] = useTransition();

  const alreadyLiked = useSyncExternalStore(
    subscribeNoop,
    () => getLikedSlugs().includes(slug),
    getServerLiked,
  );
  const liked = alreadyLiked || justLiked;

  const handleClick = () => {
    if (liked) return;
    setJustLiked(true);
    setLikes((n) => n + 1);
    localStorage.setItem(
      LIKED_POSTS_KEY,
      JSON.stringify([...getLikedSlugs(), slug]),
    );
    startTransition(async () => {
      await likePostAction(postId, slug);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={liked}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "gap-2 rounded-xl border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/20 disabled:opacity-100",
      )}>
      <Heart size={15} className={liked ? "fill-rose-400" : undefined} />
      {likes} 좋아요
    </button>
  );
}
