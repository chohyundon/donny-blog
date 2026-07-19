# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 절대 규칙

- Supabase 클라이언트 혼용 금지 — Server Component는 `server.ts`, Client Component는 `client.ts`.
- 카운터/좋아요 등 숫자 변경은 반드시 Supabase RPC 함수로 원자적 처리 (직접 UPDATE 금지).
- 환경 변수는 용도별로 엄격히 구분한다.
  - `NEXT_PUBLIC_*` 접두사가 붙은 값만 클라이언트에 노출 가능 (Supabase URL, anon key 등).
  - 서비스 롤 키(Service Role Key) 등 민감 값은 서버 전용 환경 변수로만 사용하며, 절대 `NEXT_PUBLIC_*`로 노출하거나 클라이언트 번들에 포함하지 않는다.
  - `.env.local`은 git에 커밋하지 않으며, `.env.example`로 필요한 키 목록만 문서화한다.
- `any` 타입 사용 금지. 불가피한 경우 `// TODO: 타입 개선 필요` 주석과 함께 최소 범위로만 허용.
- Supabase 테이블에는 RLS(Row Level Security)를 기본 활성화하고, 클라이언트에서의 직접 쓰기 접근은 원칙적으로 차단한다 (쓰기는 Server Action / RPC를 통해서만).

---

## 아키텍처

**Next.js 16 App Router** 기반 기술 블로그. 모든 컴포넌트는 Server Component가 기본이며, 상호작용이 필요한 경우에만 `'use client'` 선언. 단일 작성자(author-only) 블로그로, Supabase Auth(Google OAuth) 로그인 사용자 중 `AUTHOR_EMAIL`과 일치하는 계정만 글쓰기 권한을 가진다.

### 폴더 구조

```
src/
  middleware.ts            — 전체 요청에서 Supabase 세션 갱신 (lib/supabase/middleware.ts 위임)
  app/
    layout.tsx              — Navbar + Footer 공통 레이아웃
    page.tsx                — 홈 (HeroSection + TabBar + PostCard 그리드, 목 데이터 사용)
    blog/
      page.tsx               — 블로그 목록 (tag/tab searchParams 필터링, 목 데이터 사용)
      [slug]/page.tsx         — 포스트 상세 (실 데이터 우선, 없으면 목 데이터 폴백)
    write/page.tsx           — 글쓰기 (requireAuthor() 게이트, WriteForm)
    auth/
      callback/route.ts      — Supabase OAuth 콜백 핸들러
      auth-code-error/page.tsx — 인증 실패 안내 페이지
  components/
    layout/                 — Navbar, Footer
    home/                   — HeroSection, TabBar, VisitorChart
    ui/                     — PostCard 등 재사용 컴포넌트
    blog/MarkdownContent.tsx — 포스트 본문 MDX 렌더링
    comments/CommentSection.tsx — 댓글 목록/작성
    write/WriteForm.tsx      — 글쓰기 폼 (이미지 업로드 포함)
  lib/
    posts.ts                — Supabase 쿼리 함수 (getPosts, getPostBySlug, getTrendingPosts 등)
    mock-posts.ts           — 홈/블로그 목록에서 아직 쓰는 목 데이터 (아래 "목 데이터 전환 현황" 참고)
    comments.ts              — 댓글 조회 + 현재 유저 조회
    stats.ts                — 방문자 수 증가+조회 (increment_visitor_count / get_visitor_history RPC)
    actions/                — Server Action (comments.ts, posts.ts, upload.ts)
    auth/
      author.ts              — requireAuthor() 등 작성자 권한 체크
      constants.ts            — AUTHOR_EMAIL, isAuthorEmail()
    e2e/mock-store.ts        — Playwright e2e용 mock DB (isE2EMockDbEnabled 등)
    supabase/
      server.ts              — Server Component / Server Action용 클라이언트
      client.ts               — Client Component용 클라이언트
      middleware.ts            — 미들웨어용 세션 갱신 로직
  types/index.ts            — Post, Tag 인터페이스 (Supabase 스키마와 1:1 대응)
```

### 목 데이터 전환 현황

- `posts.ts`의 실제 Supabase 쿼리, `supabase-schema.sql`의 테이블/RLS/RPC는 이미 배포되어 있고 상세 페이지(`blog/[slug]`)·좋아요·댓글·방문자수는 실 데이터로 동작한다.
- 다만 홈(`app/page.tsx`)과 블로그 목록(`app/blog/page.tsx`)은 아직 `mock-posts.ts`의 `MOCK_POSTS`를 그대로 쓴다 — 이 두 곳만 `getPosts()` 계열로 교체하면 전환이 끝난다.
- 전환 후 `mock-posts.ts`는 삭제하거나 `__mocks__/` 등 테스트 전용 디렉터리로 이동한다.

### 기술 스택

- **Framework** — Next.js 16 (App Router), React 19
- **Language** — TypeScript 5
- **Styling** — Tailwind CSS 4, PostCSS
- **Backend / Data** — Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **Content** — MDX (`next-mdx-remote`), `gray-matter`
- **UI / Utils** — `lucide-react`, `date-fns`
- **Tooling** — ESLint 9, `eslint-config-next`

---

## 빌드/테스트

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint
npx tsc --noEmit  # 타입 체크
pnpm test:e2e     # E2E 테스트 (Playwright) — e2e/*.spec.ts
pnpm test:e2e:ui  # Playwright UI 모드
```

---

## 개발 규칙

- **테스트 전략** : Playwright로 E2E 테스트(`e2e/*.spec.ts`)를 이미 운영 중이며, `lib/e2e/mock-store.ts`를 통해 Supabase 없이도 mock DB로 테스트할 수 있다. 단위/통합 테스트 프레임워크(Vitest 등)는 아직 도입 전이며, 커버리지 95% 이상은 도입 후 목표치로 취급한다.
- **컴포넌트 네이밍** : PascalCase로 유지
- **import** : 루트의 레이아웃 제외하고 나머지는 모두 절대경로로 유지
- **에러/로딩 처리** : 데이터를 불러오는 라우트에는 `loading.tsx`를 두고, slug가 존재하지 않는 경우 `notFound()`를 호출해 `not-found.tsx`로 처리한다. 예기치 않은 에러는 `error.tsx`에서 사용자 친화적으로 표시한다.
- **이미지 최적화** : 모든 콘텐츠/썸네일 이미지는 `next/image`를 사용한다. 외부 이미지 도메인은 `next.config.ts`의 `images.remotePatterns`에 명시적으로 등록한 것만 허용한다.
- **SEO / 메타데이터** : 포스트 상세 페이지는 `generateMetadata`로 title/description/OG 이미지를 채운다. 정적 페이지(`/`, `/blog`)도 기본 메타데이터를 갖춘다. `sitemap.ts`, `robots.ts`로 크롤링 설정을 관리한다.

## 파일구조 규칙

- `index.ts`로 export 모듈화

### 커밋

별도 커밋 컨벤션 미지정. PR 단위 작업 권장.
