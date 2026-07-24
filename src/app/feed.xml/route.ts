import { NextResponse } from "next/server";
import { getPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const posts = await getPosts();

  const items = posts
    .map((post) => {
      const link = `${siteUrl}/blog/${post.slug}`;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.published_at!).toUTCString()}</pubDate>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>donny.log</title>
    <link>${siteUrl}</link>
    <description>프론트엔드 개발자의 기술 노트</description>
    <language>ko</language>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
