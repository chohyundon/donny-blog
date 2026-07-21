# 이번 세션에서 정확히 수정한 내용

`docs/performance/lighthouse-2026-07-21.md`의 우선순위 1~6번을 적용한 실제 코드 변경 내역.

---

## 1. `src/components/layout/Footer.tsx` — 소셜 아이콘 `aria-label` 추가

```diff
               <a
                 href="https://github.com"
                 target="_blank"
                 rel="noreferrer"
-                className={socialIconClass}>
+                className={socialIconClass}
+                aria-label="GitHub">
                 <GitFork size={16} />
               </a>
               <a
                 href="https://twitter.com"
                 target="_blank"
                 rel="noreferrer"
-                className={socialIconClass}>
+                className={socialIconClass}
+                aria-label="X (Twitter)">
                 <X size={16} />
               </a>
-              <Link href="/feed.xml" className={socialIconClass}>
+              <Link
+                href="/feed.xml"
+                className={socialIconClass}
+                aria-label="RSS 피드">
                 <Rss size={16} />
               </Link>
```

## 2. `src/components/home/TabBar.tsx` — 비활성 탭 색상 대비 개선

```diff
               <TabsTrigger
                 key={tab}
                 value={tab}
-                className="shrink-0 rounded-none border-none px-4 py-4 text-sm font-medium text-white/40 data-active:text-white data-active:after:bg-primary! data-active:after:opacity-100">
+                className="shrink-0 rounded-none border-none px-4 py-4 text-sm font-medium text-white/70 dark:text-white/70 data-active:text-white data-active:after:bg-primary! data-active:after:opacity-100">
```

`dark:text-white/70`을 같이 넣은 이유: 이 프로젝트는 `<html class="dark">`가 항상 붙어 있어서, `tabs.tsx`의 기본 클래스에 있는 `dark:text-muted-foreground`가 `dark:` variant 없는 `text-white/70`보다 우선 적용됐음(다크 전용 규칙이라 별도로 덮어써야 함). `dark:` 없이만 바꿨을 땐 실제 렌더링 색이 그대로 `#75777e`(원래 문제 색)로 남는 걸 Lighthouse 재측정으로 확인하고 추가함.

## 3. `src/components/ui/PostCard.tsx` — `priority` prop 추가

```diff
 interface PostCardProps {
   post: Post;
+  priority?: boolean;
 }

-export default function PostCard({ post }: PostCardProps) {
+export default function PostCard({ post, priority }: PostCardProps) {
   ...
               <Image
                 src={post.thumbnail_url}
                 alt={post.title}
                 fill
                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                 className="object-cover"
+                priority={priority}
               />
```

## 3-1. `src/app/page.tsx`, `src/app/blog/page.tsx` — 호출부에서 `priority` 전달

```diff
-            {posts.map((post) => (
-              <PostCard key={post.id} post={post} />
+            {posts.map((post, index) => (
+              <PostCard key={post.id} post={post} priority={index < 3} />
             ))}
```

(두 파일 동일 패턴. 그리드 첫 줄=처음 3개 카드만 `priority` 적용.)

## 4. MDX 헤딩 레벨

코드 변경 없음 — 컴포넌트가 아니라 글 원고(MDX) 콘텐츠 문제라 이번 스코프에서 제외.

## 5. `next.config.ts` — 번들 분석기 연결

```diff
 import type { NextConfig } from "next";
+import withBundleAnalyzer from "@next/bundle-analyzer";

 const nextConfig: NextConfig = {
   images: { ... },
 };

-export default nextConfig;
+export default withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(
+  nextConfig,
+);
```

devDependency로 `@next/bundle-analyzer` 추가(`pnpm add -D @next/bundle-analyzer`). 평소 빌드(`pnpm build`, Turbopack)에는 영향 없음 — `ANALYZE=true` 일 때만 동작(단, Turbopack은 미지원이라 분석하려면 `ANALYZE=true npx next build --webpack` 필요).

분석 결과: 원본 리포트가 지목한 `@base-ui/react`는 실제 원인이 아니었고(Select/Checkbox는 이미 `/write` 페이지로만 코드 스플리팅되어 있었음), 진짜 원인은 `Navbar.tsx`가 모든 페이지에서 `@supabase/supabase-js`를 클라이언트로 로드하는 것이었음 — 이건 인증 아키텍처를 건드리는 별도 작업이라 이번엔 코드 변경 안 함(자세한 내용은 `lighthouse-2026-07-21-after.md` 참고).

## 6. `package.json` — `browserslist` 추가

```diff
+  "browserslist": [
+    "last 2 Chrome versions",
+    "last 2 Firefox versions",
+    "last 2 Safari versions",
+    "last 2 Edge versions"
+  ]
```

---

## 결과

| 페이지 | Accessibility 전 → 후 | Performance |
|---|---|---|
| 홈 (`/`) | 93 → **100** | 99 → 99 |
| 블로그 목록 (`/blog`) | 96 → **100** | 100 → 100 |
| 포스트 상세 (`/blog/[slug]`) | 91 → 96 | 100 → 100 |

포스트 상세가 96점에 그친 이유(댓글 섹션 별도 색상 대비 문제)와 미사용 JS의 실제 원인은 `lighthouse-2026-07-21-after.md`에 별도로 정리.
