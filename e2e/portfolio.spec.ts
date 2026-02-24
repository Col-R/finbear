import { test, expect } from '@playwright/test'

const TEST_EMAIL = process.env.E2E_TEST_EMAIL || 'test@finbear.dev'
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || 'testpassword123'

test.describe('Portfolio CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('you@example.com').fill(TEST_EMAIL)
    await page.getByPlaceholder('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForURL('**/dashboard**', { timeout: 15000 })
  })

  test('create portfolio', async ({ page }) => {
    const name = `Test Portfolio ${Date.now()}`
    await page.getByPlaceholder('Pretax, Crypto, Retirement...').fill(name)
    await page.getByRole('button', { name: /new portfolio/i }).click()
    await expect(page.getByText(name)).toBeVisible({ timeout: 10000 })
  })

  test('rename portfolio', async ({ page }) => {
    const firstRenameButton = page.getByLabel('Rename portfolio').first()
    await expect(firstRenameButton).toBeVisible({ timeout: 10000 })
    await firstRenameButton.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const newName = `Renamed ${Date.now()}`
    const input = dialog.locator('input[name="name"]')
    await input.clear()
    await input.fill(newName)
    await dialog.getByRole('button', { name: /save/i }).click()

    await expect(dialog).not.toBeVisible({ timeout: 10000 })
    await expect(page.getByText(newName)).toBeVisible({ timeout: 10000 })
  })

  test('delete portfolio', async ({ page }) => {
    const name = `ToDelete ${Date.now()}`
    await page.getByPlaceholder('Pretax, Crypto, Retirement...').fill(name)
    await page.getByRole('button', { name: /new portfolio/i }).click()
    await expect(page.getByText(name)).toBeVisible({ timeout: 10000 })

    const card = page.locator('[class*="card"]', { hasText: name })
    await card.getByLabel('Delete portfolio').click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: /delete/i }).click()

    await expect(dialog).not.toBeVisible({ timeout: 10000 })
    await expect(page.getByText(name)).not.toBeVisible({ timeout: 10000 })
  })
})
