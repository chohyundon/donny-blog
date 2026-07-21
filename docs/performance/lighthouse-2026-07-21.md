# Lighthouse 측정 리포트

- 측정일: 2026-07-21
- 대상: 프로덕션 빌드 (`pnpm build` + `pnpm start`, localhost:3000)
- 도구: `lighthouse@13.4.1` (desktop preset), 카테고리: Performance / Accessibility / Best Practices / SEO
- 측정 페이지: 홈(`/`), 블로그 목록(`/blog`), 포스트 상세(`/blog/[slug]`)

> 주의: 개발 서버(`pnpm dev`)가 아닌 프로덕션 빌드 기준으로 측정했습니다. `next dev`는 최적화/압축이 빠져 있어 실제 성능과 차이가 큽니다.

---

## 종합 점수

| 페이지                       | Performance | Accessibility | Best Practices | SEO |
| ---------------------------- | ----------- | ------------- | -------------- | --- |
| 홈 (`/`)                     | 99          | 93            | 100            | 100 |
| 블로그 목록 (`/blog`)        | 100         | 96            | 100            | 100 |
| 포스트 상세 (`/blog/[slug]`) | 100         | 91            | 100            | 100 |

## 핵심 성능 지표

| 페이지      | FCP  | LCP  | TBT | CLS   | Speed Index |
| ----------- | ---- | ---- | --- | ----- | ----------- |
| 홈          | 0.3s | 0.9s | 0ms | 0.012 | 0.5s        |
| 블로그 목록 | 0.2s | 0.7s | 0ms | 0     | 0.2s        |
| 포스트 상세 | 0.2s | 0.6s | 0ms | 0     | 0.3s        |

전반적으로 Core Web Vitals는 매우 양호합니다 (LCP < 1s, CLS ≈ 0, TBT 0ms). SEO/Best Practices는 3개 페이지 모두 만점입니다. 아래는 Accessibility와 Performance 세부 항목에서 실제로 감점된 항목과 원인입니다.

---

## 🔴 Accessibility 이슈 (실제 감점 원인)

### 1. 푸터 소셜 아이콘 링크에 접근 가능한 이름 없음

- **위치**: `src/components/layout/Footer.tsx:41-57`
- **영향 페이지**: 홈, 블로그 목록, 포스트 상세 (공통 레이아웃이므로 전 페이지)
- **문제**: GitHub, X(Twitter), RSS 아이콘 링크가 `<GitFork>`, `<X>`, `<Rss>` 아이콘만 렌더링하고 텍스트/`aria-label`이 없어 스크린 리더 사용자가 링크 목적을 알 수 없음.
- **개선안**: 각 `<a>`/`<Link>`에 `aria-label` 추가.
  ```tsx
  <a href="https://github.com" aria-label="GitHub" ... >
  <a href="https://twitter.com" aria-label="X (Twitter)" ... >
  <Link href="/feed.xml" aria-label="RSS 피드" ... >
  ```

### 2. 홈 탭(TabBar) 텍스트 색상 대비 부족

- **위치**: `src/components/ui/tabs.tsx` (TabsTrigger 기본 텍스트 색상), 사용처 `src/components/home/TabBar.tsx`
- **영향 페이지**: 홈
- **문제**: 비활성 탭("최신", "React", "TypeScript", "Next.js", "CSS") 텍스트 색상 `#75777e` vs 배경 `#10101a`의 대비가 4.22:1로, WCAG AA 기준(4.5:1)에 미달.
- **개선안**: 비활성 탭 텍스트 색상을 좀 더 밝은 톤(예: `text-white/70` 이상)으로 조정.

### 3. 포스트 본문 헤딩 순서 오류 (h2 없이 h3 등장)

- **위치**: 포스트 상세 페이지, MDX 본문 내 `<h3>그래서 이렇게 바꿨습니다.</h3>`, `<h3>그래서 구조 자체를 바꿨습니다.</h3>` (컴포넌트 코드가 아닌 **글 원문(MDX) 콘텐츠**의 헤딩 레벨 문제)
- **영향 페이지**: 포스트 상세 (`nextjs-하이드레이션-에러-우아하게-처리하기` 등 일부 글)
- **문제**: h2를 건너뛰고 h3가 나오는 등 헤딩 레벨이 순차적이지 않음.
- **개선안**: 코드 수정이 아니라 **글 작성 시 헤딩 레벨을 순서대로(h2 → h3) 사용**하도록 컨벤션 정리, 필요하면 기존 글 원고 수정.

### 4. (홈에서만) 색상 대비 부족 항목 1건은 위 #2와 동일 원인

---

## 🟡 Performance 세부 진단 (점수엔 큰 영향 없지만 개선 여지)

### 1. PostCard 썸네일 이미지가 전부 `loading="lazy"` — LCP 이미지도 지연 로드됨

- **위치**: `src/components/ui/PostCard.tsx:29-35`
- **문제**: `next/image`에 `priority`를 지정하지 않아 모든 카드 이미지가 기본 lazy-load. Lighthouse가 **LCP 요소로 지목한 이미지**(`Next.js font와 icon 최적화 시켜보기` 카드, 뷰포트 내 최초 노출 이미지)도 lazy 상태라 `lcp-discovery-insight` 항목이 0점.
- **개선안**: 홈/블로그 목록에서 **뷰포트 최초 진입 시 보이는 카드(그리드 첫 줄, 대략 처음 2~3개)** 에만 `priority` prop 전달.
  ```tsx
  <Image src={...} alt={...} fill priority={index < 3} ... />
  ```
  (PostCard가 `index`를 props로 받지 않으므로, 호출부에서 `index`를 넘겨줘야 함)

### 2. 미사용 JavaScript 83~84KB

- **문제**: `unused-javascript` 감사에서 두 개의 청크(`32tx3g04xrc4t.js` 75KB 중 58KB 미사용, `3nbdkkyjpnjpn.js` 71KB 중 27KB 미사용)가 실제 사용량 대비 큼.
- **원인 추정**: `@base-ui/react`, `lucide-react` 등 클라이언트 컴포넌트에서 필요 이상으로 넓게 import하고 있을 가능성. 정확한 원인은 번들 분석(`next build --experimental-turbo-trace` 또는 `@next/bundle-analyzer`)으로 확인 필요.
- **개선안**: 아이콘은 `lucide-react`에서 개별 컴포넌트만 import(이미 그렇게 하고 있다면 트리쉐이킹 설정 확인), `@base-ui/react` 관련 client 컴포넌트가 서버 컴포넌트로 전환 가능한지 검토.

### 3. Legacy JavaScript ~13KB (구형 브라우저 호환 코드 포함)

- **문제**: 번들에 `Array.prototype.at/flat/flatMap`, `Object.fromEntries` 등에 대한 polyfill/변환 코드가 포함되어 최신 브라우저에는 불필요한 바이트가 전송됨.
- **개선안**: `next.config.ts`의 `browserslist`/타겟 설정을 확인해 지원 브라우저 범위를 최신 evergreen 브라우저로 좁히는 것을 검토(트래픽 특성상 구형 브라우저 지원이 불필요하다면).

### 4. Render-blocking CSS 1건 (15.4KB)

- **문제**: `_next/static/chunks/*.css` 하나가 렌더 블로킹으로 잡힘. 다만 LCP가 이미 1초 미만이라 실질 영향은 미미.
- **개선안**: 우선순위 낮음. 필요 시 critical CSS 인라인화 검토.

### 5. bf-cache(뒤로가기 캐시) 비활성화 — "Not actionable"

- **문제**: 메인 리소스 응답에 `Cache-Control: no-store`가 설정되어 브라우저 뒤로가기/앞으로가기 캐시에 페이지가 저장되지 않음.
- **원인**: 페이지가 동적 렌더링(`ƒ`)이고 Supabase 세션 쿠키를 다루는 미들웨어(`src/middleware.ts`) 특성상 캐시 방지 헤더가 붙는 것으로 보임 — 인증이 걸린 블로그 구조상 의도된 동작에 가까움.
- **개선안**: 이 프로젝트 특성상(로그인 세션 기반 글쓰기 권한 체크) 우선순위 낮음. Lighthouse도 "Not actionable"로 표시.

---

## 우선순위 정리

| 순위 | 항목                                        | 영향              | 난이도        |
| ---- | ------------------------------------------- | ----------------- | ------------- |
| 1    | 푸터 소셜 아이콘 `aria-label` 추가          | 접근성, 전 페이지 | 매우 낮음     |
| 2    | TabBar 비활성 탭 텍스트 대비 개선           | 접근성, 홈        | 낮음          |
| 3    | PostCard 최초 노출 이미지에 `priority` 지정 | LCP 최적화        | 낮음          |
| 4    | MDX 본문 헤딩 레벨 정리(콘텐츠)             | 접근성, 해당 글   | 낮음 (컨벤션) |
| 5    | 미사용 JS 번들 분석 및 축소                 | 성능(현재도 우수) | 중간          |
| 6    | Legacy JS polyfill 제거 검토                | 성능(경미)        | 낮음~중간     |

---

## 원본 리포트 파일

측정 원본(HTML/JSON)은 아래 경로에 남겨두었습니다 (프로젝트 저장소에는 포함되지 않음):

```
/private/tmp/claude-501/-Users-johyeondon-donny-blog/e1bc8258-c5de-4544-bd05-847469ddc4ee/scratchpad/lighthouse/
  home.report.html / home.report.json
  blog-list.report.html / blog-list.report.json
  post-detail.report.html / post-detail.report.json
```
