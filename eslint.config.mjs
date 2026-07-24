import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Playwright test artifacts (gitignored, but present locally after test runs)
    "playwright-report/**",
    "test-results/**",
    // Cloudflare Workers 배포용 OpenNext 빌드 산출물 (중첩 worktree 포함 모든 깊이 매칭)
    "**/.open-next/**",
    // 다른 git worktree 산출물
    ".claude/worktrees/**",
  ]),
]);

export default eslintConfig;
