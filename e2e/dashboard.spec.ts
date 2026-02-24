import { test, expect } from '@playwright/test'

const TEST_EMAIL = process.env.E2E_TEST_EMAIL || 'test@finbear.dev'
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || 'testpassword123'

test.describe('Dashboard Features', () => {
  test('landing page renders hero and CTA', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { level: 1, name: /track your investments/i })
    ).toBeVisible()

    const getStartedLink = page.locator('a[href="/signup"]', {
      hasText: /get started free/i,
    })
    await expect(getStartedLink).toBeVisible()
    await getStartedLink.click()
    await page.waitForURL('**/signup**', { timeout: 5000 })
    expect(page.url()).toContain('/signup')
  })

  test('dashboard shows portfolio list after login', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('you@example.com').fill(TEST_EMAIL)
    await page.getByPlaceholder('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForURL('**/dashboard**', { timeout: 15000 })

    await expect(
      page.getByRole('heading', { name: /your portfolios/i })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /new portfolio/i })
    ).toBeVisible()
  })
})
