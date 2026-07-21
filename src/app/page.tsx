import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import TabBar from "@/components/home/TabBar";
import PostGrid from "@/components/ui/PostGrid";
import { getPosts, getTrendingPosts } from "@/lib/posts";
import { getAndIncrementVisitorCount, getVisitorHistory } from "@/lib/stats";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

interface HomePageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { tab } = await searchParams;
  const activeTab = tab ?? "트렌딩";

  const [posts, visitorCount, visitorHistory] = await Promise.all([
    activeTab === "트렌딩" ? getTrendingPosts() : getPosts(activeTab),
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

          <PostGrid posts={posts} />
        </div>
      </section>
    </div>
  );
}
