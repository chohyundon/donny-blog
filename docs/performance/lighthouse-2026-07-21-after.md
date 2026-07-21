# Lighthouse 개선 리포트 (조치 후)

- 측정일: 2026-07-21
- 기준 리포트: `docs/performance/lighthouse-2026-07-21.md`
- 대상: 프로덕션 빌드 (`pnpm build` + `pnpm start`, localhost:3000)
- 조치 항목: 원본 리포트 우선순위 1~6번 전부 적용

---

## 종합 점수 비교

| 페이지                       | Performance (전/후) | Accessibility (전/후) | Best Practices | SEO |
| ---------------------------- | -------------------- | ---------------------- | --------------- | --- |
| 홈 (`/`)                     | 99 → 99               | 93 → **100**            | 100              | 100 |
| 블로그 목록 (`/blog`)        | 100 → 100             | 96 → **100**            | 100              | 100 |
| 포스트 상세 (`/blog/[slug]`) | 100 → 100             | 91 → 96                 | 100              | 100 |

홈/블로그 목록은 접근성 100점 달성. 포스트 상세는 91→96점으로 개선됐지만, 아래(신규 발견 2번) 사유로 100점에는 못 미침.

---

## 적용한 변경 사항

1. **푸터 소셜 아이콘 `aria-label` 추가** — `src/components/layout/Footer.tsx`. GitHub/X/RSS 링크에 접근 가능한 이름 부여.
2. **TabBar 비활성 탭 텍스트 대비 개선** — `src/components/home/TabBar.tsx`. `text-white/40` → `text-white/70`.
   - 주의: 이 프로젝트는 `<html class="dark">`가 항상 붙는 다크 테마 고정 구조라 `TabsTrigger` 기본 클래스의 `dark:text-muted-foreground`가 별도 variant로 살아남아 있었음. `dark:` variant 없이 `text-white/70`만 주면 실제로는 `dark:text-muted-foreground`(`#75777e`, 여전히 대비 미달)가 우선 적용돼 있었음. `dark:text-white/70`을 추가로 명시해 두 variant 모두 덮어써야 실제로 반영됨.
3. **PostCard 최초 노출 이미지에 `priority` 지정** — `src/components/ui/PostCard.tsx`, `src/app/page.tsx`, `src/app/blog/page.tsx`. 그리드 첫 줄(인덱스 0~2)에만 `priority` 전달.
4. **MDX 헤딩 레벨** — 코드 변경 대상 아님(원본 리포트 확인). 컨벤션으로만 관리.
5. **번들 분석** — `@next/bundle-analyzer` devDependency 추가, `next.config.ts`에 `ANALYZE=true` 조건부 래핑. Turbopack 기본 빌드는 analyzer 미지원이라 `ANALYZE=true npx next build --webpack`로 분석 실행. 결과는 아래 "신규 발견 1번" 참고.
6. **Legacy JS 대상 브라우저 지정** — `package.json`에 `browserslist`(최근 2개 버전의 Chrome/Firefox/Safari/Edge) 추가.

---

## 신규 발견 (원본 리포트 범위 밖 — 이번 라운드에서 코드 변경 안 함)

### 1. "미사용 JS"의 실제 원인은 `@base-ui/react`가 아니라 `Navbar`의 클라이언트 사이드 Supabase 세션 체크

원본 리포트는 `@base-ui/react`/`lucide-react`를 미사용 JS의 추정 원인으로 지목했으나, 실제 빌드 산출물(RSC client-reference-manifest, 웹팩 번들 분석)을 확인한 결과:

- `Select`/`Checkbox`(무거운 `@base-ui/react` 프리미티브)는 **오직 `src/components/write/WriteForm.tsx`에서만** 쓰이고, 홈/블로그 목록 페이지의 클라이언트 청크에는 전혀 포함되지 않음(Next.js의 라우트별 코드 스플리팅이 이미 정상 동작 중). → 이 부분은 **추가 조치 불필요**.
- 대신 `src/components/layout/Navbar.tsx`(루트 레이아웃에 포함되어 **모든 페이지**에서 렌더링되는 클라이언트 컴포넌트)가 `@/lib/supabase/client`의 `createClient()`를 호출해 `supabase.auth.getUser()` / `onAuthStateChange`로 로그인 상태를 클라이언트에서 확인함. 이 때문에 `@supabase/supabase-js` + `@supabase/ssr` 전체가 익명 방문자를 포함한 모든 페이지 로드에 포함됨(Lighthouse가 측정한 `unused-javascript` 잠재 절감량 ~112~113 KiB의 실제 근원).
- **왜 이번 라운드에서 고치지 않았는지**: 이 블로그는 단일 작성자 구조로 `Navbar`가 로그인 상태에 따라 "글쓰기" 버튼을 보여주고, OAuth 로그인/로그아웃 직후 새로고침 없이 UI를 갱신해야 함(`onAuthStateChange` 리스너). 이걸 서버 컴포넌트 초기 렌더 + 클라이언트 최소 리스너로 분리하는 건 인증 흐름을 건드리는 별도 스코프의 아키텍처 변경이라, 원본 6개 우선순위 항목과 별개로 취급해 이번엔 손대지 않음. 필요하면 별도 계획으로 진행 권장.

### 2. 포스트 상세 페이지 댓글 섹션의 색상 대비 문제 (원본 리포트에 없던 항목)

포스트 상세 페이지(`/blog/[slug]`)에서 `color-contrast` 감사가 여전히 실패. 원본 리포트가 언급한 TabBar 케이스와는 다른 요소들:

- "블로그로 돌아가기" 링크, "끝까지 읽어주셔서 감사합니다..." 안내 문구: `#707076` vs `#10101a`, 대비 3.84
- "0 댓글": `#74747a` vs `#171721`, 대비 3.82
- "댓글을 남기려면 GitHub 로그인이 필요합니다.": `#7e7e84` vs `#15151f`, 대비 4.49
- "아직 댓글이 없습니다.": `#58585f` vs `#10101a`, 대비 2.67 (가장 심각)

원본 리포트가 작성될 당시 이미 존재했을 가능성이 높지만 별도 항목으로 기재되지 않았음(footer 링크 이슈가 더 두드러져 묻혔을 것으로 추정). `src/components/comments/CommentSection.tsx`와 포스트 상세 페이지 자체의 텍스트 opacity 클래스(`text-white/3x` 계열) 조정이 필요 — TabBar와 동일한 패턴(다크 모드 전용 variant도 함께 지정)으로 고칠 수 있음. 이번 라운드는 원본 리포트의 6개 항목으로 스코프를 한정했기 때문에 별도 확인 후 처리 권장.

---

## 검증 방법

```bash
pnpm build && pnpm start
npx lighthouse http://localhost:3000/ --preset=desktop
npx lighthouse http://localhost:3000/blog --preset=desktop
npx lighthouse "http://localhost:3000/blog/<slug>" --preset=desktop
```

번들 분석이 필요하면:
```bash
ANALYZE=true npx next build --webpack   # .next/analyze/*.html 생성
npx next experimental-analyze -o        # Turbopack 네이티브 분석(.next/diagnostics/analyze)
```
