import type { FullConfig } from "@playwright/test";

const WARMUP_ROUTES = [
  "/",
  "/blog",
  "/write",
  "/blog/react-18-concurrent-features",
  "/write/warmup-route",
  "/about",
  "/projects",
  "/sitemap.xml",
  "/robots.txt",
  "/feed.xml",
];

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL ?? "http://localhost:3100";

  for (const route of WARMUP_ROUTES) {
    try {
      await fetch(`${baseURL}${route}`);
    } catch {
      // 워밍업 실패는 무시 — 실제 컴파일 여부는 본 테스트가 검증한다
    }
  }
}
