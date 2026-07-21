import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import TabBar from "@/components/home/TabBar";
import PostCard from "@/components/ui/PostCard";
import { getPosts } from "@/lib/posts";
import { getAndIncrementVisitorCount, getVisitorHistory } from "@/lib/stats";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [posts, visitorCount, visitorHistory] = await Promise.all([
    getPosts(),
    getAndIncrementVisitorCount(),
    getVisitorHistory(7),
  ]);

  return (
    <div className="pt-16">
      <HeroSection
        visitorCount={visitorCount}
        visitorHistory={visitorHistory}
      />

      {/* Articles section */}
      <section className="mt-4">
        <Suspense fallback={null}>
          <TabBar />
        </Suspense>

        <div className="mx-auto max-w-7xl px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              view all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} priority={index < 3} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
