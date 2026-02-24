import { test, expect } from '@playwright/test'

const TEST_EMAIL = process.env.E2E_TEST_EMAIL || 'test@finbear.dev'
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || 'testpassword123'

test.describe('Position CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('you@example.com').fill(TEST_EMAIL)
    await page.getByPlaceholder('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForURL('**/dashboard**', { timeout: 15000 })

    const portfolioLink = page.locator('a[href*="/dashboard/portfolios/"]').first()
    const hasPortfolio = await portfolioLink.isVisible({ timeout: 5000 }).catch(() => false)

    if (hasPortfolio) {
      await portfolioLink.click()
    } else {
      const name = `Positions Test ${Date.now()}`
      await page.getByPlaceholder('Pretax, Crypto, Retirement...').fill(name)
      await page.getByRole('button', { name: /new portfolio/i }).click()
      await expect(page.getByText(name)).toBeVisible({ timeout: 10000 })
      await page.locator('a[href*="/dashboard/portfolios/"]', { hasText: name }).click()
    }
    await page.waitForURL('**/dashboard/portfolios/**', { timeout: 10000 })
  })

  test('add position', async ({ page }) => {
    await page.getByPlaceholder('Ticker (e.g., AAPL)').fill('AAPL')
    await page.getByPlaceholder('Shares').fill('10')
    await page.getByPlaceholder('Cost basis ($)').fill('150.00')
    await page.getByRole('button', { name: /add position/i }).click()
    await expect(page.getByText('AAPL')).toBeVisible({ timeout: 10000 })
  })

  test('edit position', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
    const editButton = page.getByLabel('Edit position').first()
    await editButton.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const sharesInput = dialog.locator('input[name="shares"]')
    await sharesInput.clear()
    await sharesInput.fill('20')
    await dialog.getByRole('button', { name: /save/i }).click()

    await expect(dialog).not.toBeVisible({ timeout: 10000 })
  })

  test('delete position', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
    const rowsBefore = await page.locator('table tbody tr').count()

    const deleteButton = page.getByLabel('Delete position').first()
    await deleteButton.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: /delete/i }).click()

    await expect(dialog).not.toBeVisible({ timeout: 10000 })

    if (rowsBefore > 1) {
      await expect(page.locator('table tbody tr')).toHaveCount(rowsBefore - 1, {
        timeout: 10000,
      })
    }
  })
})
