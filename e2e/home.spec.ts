import { test, expect } from '@playwright/test'

test.describe('홈 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('헤더와 푸터가 렌더링된다', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })

  test('히어로 섹션 제목이 보인다', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1 })
    ).toContainText('프론트엔드')
  })

  test('방문자 뱃지가 렌더링된다', async ({ page }) => {
    await expect(page.getByText(/명이 다녀갔어요/)).toBeVisible()
  })

  test('포스트 카드가 1개 이상 렌더링된다', async ({ page }) => {
    const cards = page.locator('article')
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('포스트 카드 클릭 시 상세 페이지로 이동한다', async ({ page }) => {
    await page.locator('article').first().click()
    await expect(page).toHaveURL(/\/blog\/.+/)
  })

  test('"글 목록 보기" 링크가 /blog로 이동한다', async ({ page }) => {
    await page.getByRole('link', { name: '글 목록 보기' }).click()
    await expect(page).toHaveURL('/blog')
  })
})
