import { expect, test } from '@playwright/test'

test('home page redirects to current year after December 1st', async ({ page }) => {
  const currentYear = new Date().getFullYear()

  // Mock the date to December 1st
  await page.goto('/')

  // Should redirect to /post/YYYY
  await expect(page).toHaveURL(`/post/${currentYear}`)
})

test('navigating all the way to a post works as expected', async ({ page }) => {
  await page.goto('/post/2024')

  await expect(page).toHaveURL('/post/2024')

  const dayOne = page.getByLabel('Luke 1', { exact: true })
  await expect(dayOne).toBeVisible()
  await dayOne.click()

  await expect(page).toHaveURL('/post/2024/01')

  await expect(page.getByRole('heading', { name: '1. desember' })).toBeVisible()
  await expect(page.getByText('Velkommen til en helt ny julefeiring')).toBeVisible()
  await page.getByText('Velkommen til en helt ny julefeiring').click()

  await expect(page).toHaveURL('/post/2024/01/velkommen-til-en-helt-ny-julefeiring')
  await expect(page).toHaveTitle('Velkommen til en helt ny julefeiring | Bekk Christmas')
  await expect(page.getByRole('heading', { name: 'Velkommen til en helt ny julefeiring', level: 1 })).toBeVisible()
})
