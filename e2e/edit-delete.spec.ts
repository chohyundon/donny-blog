import { test, expect } from "@playwright/test";

test.describe("글 수정 / 삭제", () => {
  test("작성자가 글을 수정하고 삭제할 수 있다", async ({ page, context }) => {
    await context.addCookies([
      {
        name: "e2e-author",
        value: "1",
        url: "http://localhost:3100",
      },
    ]);

    const slug = `e2e-edit-delete-${Date.now()}`;
    const title = `E2E 수정 테스트 ${Date.now()}`;
    const updatedTitle = `${title} (수정됨)`;

    await page.goto("/write");
    await page.getByPlaceholder("글 제목").fill(title);
    await page.getByPlaceholder("my-post-slug").fill(slug);
    await page.getByPlaceholder("목록에 보일 짧은 소개").fill("E2E 요약");
    await page.locator('textarea[name="content"]').fill("원본 본문입니다.");
    await page.getByRole("button", { name: "글 발행" }).click();
    await expect(page).toHaveURL(new RegExp(`/blog/${slug}`), {
      timeout: 15_000,
    });

    // 수정: 기존 값이 채워진 폼으로 진입해 제목을 바꾼다
    await page.getByRole("link", { name: "수정" }).click();
    await expect(page).toHaveURL(new RegExp(`/write/${slug}`));
    await expect(page.getByPlaceholder("글 제목")).toHaveValue(title);
    await expect(page.getByPlaceholder("my-post-slug")).toHaveAttribute(
      "readonly",
      "",
    );

    await page.getByPlaceholder("글 제목").fill(updatedTitle);
    await page.getByRole("button", { name: "수정 저장" }).click();

    await expect(page).toHaveURL(new RegExp(`/blog/${slug}`), {
      timeout: 15_000,
    });
    await expect(
      page.getByRole("heading", { level: 1, name: updatedTitle }),
    ).toBeVisible();

    // 삭제: 확인 토스트를 거쳐야 삭제된다
    await page.getByRole("button", { name: "삭제" }).click();
    await expect(page.getByText("정말 삭제하시겠습니까?")).toBeVisible();
    await page
      .locator(".Toastify__toast")
      .getByRole("button", { name: "삭제" })
      .click();

    await expect(page).toHaveURL(/\/blog$/, { timeout: 15_000 });

    const response = await page.goto(`/blog/${slug}`);
    expect(response?.status()).toBe(404);
  });

  test("비로그인 상태에서는 수정/삭제 버튼이 보이지 않는다", async ({
    page,
  }) => {
    await page.goto("/blog/react-18-concurrent-features");
    await expect(page.getByRole("link", { name: "수정" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "삭제" })).toHaveCount(0);
  });
});
