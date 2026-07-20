import { test, expect } from "@playwright/test";

test.describe("글쓰기 / 저장", () => {
  test("비로그인 시 작성자 제한 안내가 보인다", async ({ page }) => {
    await page.goto("/write");

    await expect(
      page.getByRole("heading", { name: "글쓰기는 작성자만 가능합니다" }),
    ).toBeVisible();
    await expect(page.getByText("gse06044@naver.com")).toBeVisible();
  });

  test("작성자로 글 저장 후 상세 페이지에 본문이 보인다", async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: "e2e-author",
        value: "1",
        url: "http://localhost:3100",
      },
    ]);

    const slug = `e2e-save-${Date.now()}`;
    const title = `E2E 저장 테스트 ${Date.now()}`;
    const body = "플레이라이트로 저장한 본문입니다.";

    await page.goto("/write");
    await expect(page.getByRole("heading", { name: "글쓰기" })).toBeVisible();

    await page.getByPlaceholder("글 제목").fill(title);
    await page.getByPlaceholder("my-post-slug").fill(slug);
    await page.getByPlaceholder("목록에 보일 짧은 소개").fill("E2E 요약");
    await page.locator('textarea[name="content"]').fill(
      `## 테스트\n\n${body}`,
    );

    await page.getByRole("button", { name: "글 발행" }).click();

    await expect(page).toHaveURL(new RegExp(`/blog/${slug}`), {
      timeout: 15_000,
    });
    await expect(
      page.getByRole("heading", { level: 1, name: title }),
    ).toBeVisible();
    await expect(page.getByText(body)).toBeVisible();
  });

  test("본문 입력 시 프리뷰가 실시간으로 렌더링된다", async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: "e2e-author",
        value: "1",
        url: "http://localhost:3100",
      },
    ]);

    await page.goto("/write");
    await expect(page.getByRole("heading", { name: "글쓰기" })).toBeVisible();

    await page
      .locator('textarea[name="content"]')
      .fill("## 프리뷰 테스트 제목\n\n**굵게 표시되는 문장**");

    await expect(
      page.getByRole("heading", { level: 2, name: "프리뷰 테스트 제목" }),
    ).toBeVisible();
    await expect(
      page.locator("strong", { hasText: "굵게 표시되는 문장" }),
    ).toBeVisible();
  });
});
