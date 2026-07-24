import { test, expect } from '@playwright/test'

test.describe('네비게이션', () => {
  test('로고 클릭 시 홈으로 이동한다', async ({ page }) => {
    await page.goto('/blog')
    await page.getByRole('link', { name: 'donny.log' }).first().click()
    await expect(page).toHaveURL('/')
  })

  test('검색 버튼 클릭 시 검색창이 열린다', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '검색' }).click()
    await expect(page.getByPlaceholder('포스트 검색...')).toBeVisible()
  })

  test('검색창 닫기(X) 버튼이 동작한다', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '검색' }).click()
    await page.getByPlaceholder('포스트 검색...').waitFor()
    await page.getByRole('button', { name: '검색 닫기' }).click()
    await expect(page.getByPlaceholder('포스트 검색...')).not.toBeVisible()
  })
})

test.describe('모바일 내비게이션', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('햄버거 버튼 클릭 시 메뉴가 열리고 카테고리 링크가 보인다', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '메뉴 열기' }).click()
    const drawer = page.getByRole('dialog', { name: '메뉴' })
    await expect(drawer.getByRole('link', { name: 'Featured' })).toBeVisible()
  })

  test('메뉴에서 카테고리 링크 클릭 시 이동하고 메뉴가 닫힌다', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '메뉴 열기' }).click()
    const drawer = page.getByRole('dialog', { name: '메뉴' })
    await drawer.getByRole('link', { name: 'React' }).click()
    await expect(page).toHaveURL('/blog?tag=React')
    await expect(drawer).not.toBeVisible()
  })

  test('ESC 키로 메뉴가 닫힌다', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '메뉴 열기' }).click()
    const drawer = page.getByRole('dialog', { name: '메뉴' })
    await expect(drawer).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(drawer).not.toBeVisible()
  })
})
