import { expect, test } from '@playwright/test'

test('Studioet på /studio viser innloggingen uten feil', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  await page.goto('/studio')

  await expect(page.getByText('Bekk Login')).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  // Nettsidens header skal ikke vises i Studioet
  await expect(page.locator('body > div.bg-soft-pink')).toHaveCount(0)
  expect(errors).toEqual([])
})
