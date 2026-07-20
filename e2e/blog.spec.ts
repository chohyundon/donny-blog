import { test, expect } from "@playwright/test";

test.describe("블로그 목록 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test('"블로그" 헤딩이 보인다', async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "블로그", exact: true }),
    ).toBeVisible();
  });

  test("태그 필터가 렌더링된다", async ({ page }) => {
    const main = page.getByRole("main");
    await expect(
      main.getByRole("link", { name: "전체", exact: true }),
    ).toBeVisible();
    await expect(
      main.getByRole("link", { name: "React", exact: true }),
    ).toBeVisible();
  });

  test("태그 클릭 시 URL searchParam이 변경된다", async ({ page }) => {
    await page
      .getByRole("main")
      .getByRole("link", { name: "TypeScript", exact: true })
      .click();
    await expect(page).toHaveURL("/blog?tag=TypeScript");
  });

  test("포스트 카드가 렌더링된다", async ({ page }) => {
    await expect(page.locator("article").first()).toBeVisible();
  });
});

test.describe("포스트 상세 페이지", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      { name: "e2e-author", value: "1", url: "http://localhost:3100" },
    ]);

    const slug = `e2e-detail-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    await page.goto("/write");
    await page.getByPlaceholder("글 제목").fill("E2E 상세 페이지 테스트");
    await page.getByPlaceholder("my-post-slug").fill(slug);
    await page.getByPlaceholder("목록에 보일 짧은 소개").fill("E2E 요약");
    await page.locator('textarea[name="content"]').fill("본문입니다.");
    await page.getByRole("button", { name: "글 발행" }).click();
    await expect(page).toHaveURL(new RegExp(`/blog/${slug}`), {
      timeout: 15_000,
    });
  });

  test("포스트 제목이 보인다", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test('"블로그로 돌아가기" 링크가 /blog로 이동한다', async ({ page }) => {
    await page.getByRole("link", { name: "블로그로 돌아가기" }).click();
    await expect(page).toHaveURL("/blog");
  });

  test("존재하지 않는 slug는 404를 반환한다", async ({ page }) => {
    const response = await page.goto("/blog/존재하지않는포스트");
    expect(response?.status()).toBe(404);
  });
});
