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
