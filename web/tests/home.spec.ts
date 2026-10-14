import { expect, test } from '@playwright/test'

import { getLatestCalendarYear, getOsloDate, isTeaserPeriod, parseIsoDate } from '../utils/calendar'

test('forsiden viser nedtelling før desember, og ellers siste kalender', async ({ page }) => {
  const today = getOsloDate()
  await page.goto('/')

  if (isTeaserPeriod(today)) {
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByText('Dager')).toBeVisible()
    // Teaseren lenker til fjorårets kalender mens man venter
    await expect(page.locator(`a[href="/post/${getLatestCalendarYear(today)}"]`)).toBeVisible()
  } else {
    await expect(page).toHaveURL(new RegExp(`/post/${getLatestCalendarYear(today)}$`))
  }
})

test('navigering fra 2024-kalenderen til en artikkel fungerer', async ({ page }) => {
  await page.goto('/post/2024')

  const dayOne = page.getByLabel('Luke 1', { exact: true })
  await expect(dayOne).toBeVisible()
  await dayOne.click()

  await expect(page).toHaveURL('/post/2024/01')
  await expect(page.getByRole('heading', { name: '1. desember' })).toBeVisible()
  await page.getByText('Velkommen til en helt ny julefeiring').click()

  await expect(page).toHaveURL('/post/2024/01/velkommen-til-en-helt-ny-julefeiring', { timeout: 60_000 })
  await expect(page).toHaveTitle('Velkommen til en helt ny julefeiring | Bekk Christmas')
  await expect(page.getByRole('heading', { name: 'Velkommen til en helt ny julefeiring', level: 1 })).toBeVisible()
})

test('luker i fremtiden er låst', async ({ page }) => {
  const nextYear = parseIsoDate(getOsloDate()).year + 1

  const response = await page.goto(`/post/${nextYear}/01`)
  expect(response?.status()).toBe(425)
  expect(response?.headers()['cache-control']).toContain('no-store')
})

test('ugyldige sidetall gir 400, ikke 500', async ({ request }) => {
  const response = await request.get('/kategori/arkitektur?page=abc')
  expect(response.status()).toBe(400)
})

test('RSS-feeden har gyldige lenker', async ({ request }) => {
  const response = await request.get('/rss.xml')
  expect(response.ok()).toBe(true)

  const feed = await response.text()
  expect(feed).not.toContain('[object Object]')

  const firstLink = feed.match(/<item>[\s\S]*?<link>([^<]+)<\/link>/)?.[1]
  expect(firstLink).toBeDefined()
  const article = await request.get(new URL(firstLink!).pathname)
  expect(article.status()).toBe(200)
})

test('artikler finnes som markdown, og lenkes til fra HTML-versjonen', async ({ request }) => {
  const feed = await (await request.get('/rss.xml')).text()
  const firstLink = feed.match(/<item>[\s\S]*?<link>([^<]+)<\/link>/)?.[1]
  expect(firstLink).toBeDefined()
  const path = new URL(firstLink!).pathname

  const markdown = await request.get(`${path}.md`)
  expect(markdown.status()).toBe(200)
  expect(markdown.headers()['content-type']).toContain('text/markdown')
  expect(markdown.headers()['link']).toContain('rel="canonical"')
  expect(await markdown.text()).toMatch(/^---\ntitle: /)

  const html = await (await request.get(path)).text()
  expect(html).toContain(`type="text/markdown" href="https://www.bekk.christmas${path}.md"`)
})

test('markdown-versjoner av uåpnede luker er låst', async ({ request }) => {
  const nextYear = parseIsoDate(getOsloDate()).year + 1
  const response = await request.get(`/post/${nextYear}/01/hva-som-helst.md`)
  expect(response.status()).toBe(425)
})

test('llms.txt lenker til markdown-versjonene', async ({ request }) => {
  const response = await request.get('/llms.txt')
  expect(response.ok()).toBe(true)

  const firstLink = (await response.text()).match(/\]\((https?:[^)]+\.md)\)/)?.[1]
  expect(firstLink).toBeDefined()
  const markdown = await request.get(new URL(firstLink!).pathname)
  expect(markdown.status()).toBe(200)
})
