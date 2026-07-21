import PostCard from "@/components/ui/PostCard";
import type { Post } from "@/types";

interface PostGridProps {
  posts: Post[];
  emptyMessage?: string;
}

export default function PostGrid({
  posts,
  emptyMessage = "아직 포스트가 없어요.",
}: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center text-foreground/50">{emptyMessage}</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} priority={index < 3} />
      ))}
    </div>
  );
}
