import { test, expect } from "@playwright/test";

test.describe("접근성", () => {
  test("본문으로 건너뛰기 링크가 첫 포커스로 나타난다", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: "본문으로 건너뛰기" });
    await expect(skipLink).toBeFocused();

    await skipLink.click();
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("검색 입력창에 접근 가능한 이름이 있다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "검색" }).click();
    await expect(
      page.getByRole("textbox", { name: "포스트 검색" }),
    ).toBeVisible();
  });
});
