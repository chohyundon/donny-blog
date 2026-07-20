import { test, expect } from "@playwright/test";

test.describe("SEO 라우트", () => {
  test("sitemap.xml이 유효한 XML이고 정적 라우트를 포함한다", async ({
    request,
  }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);

    const body = await res.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("/blog</loc>");
  });

  test("robots.txt가 sitemap을 참조한다", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);

    const body = await res.text();
    expect(body).toContain("Sitemap:");
    expect(body).toContain("/sitemap.xml");
  });

  test("feed.xml이 RSS 채널을 반환한다", async ({ request }) => {
    const res = await request.get("/feed.xml");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/rss+xml");

    const body = await res.text();
    expect(body).toContain("<rss");
    expect(body).toContain("<channel>");
  });

  test("포스트 상세 페이지에 BlogPosting JSON-LD가 포함된다", async ({
    page,
  }) => {
    await page.goto("/blog");
    await page.locator("article").first().click();
    await expect(page).toHaveURL(/\/blog\/.+/);

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const content = await jsonLd.textContent();
    expect(content).toContain('"@type":"BlogPosting"');
  });
});

test.describe("정적 페이지", () => {
  test("/about 페이지가 렌더링된다", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
  });

  test("/projects 페이지가 렌더링된다", async ({ page }) => {
    await page.goto("/projects");
    await expect(
      page.getByRole("heading", { name: "Projects" }),
    ).toBeVisible();
  });
});
