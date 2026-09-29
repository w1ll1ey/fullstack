const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Testi Käyttäjä',
        username: 'testi',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('testi')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Testi Käyttäjä logged in')).toBeVisible()
    })

    test('fails with incorrect credentials', async ({ page }) => {
      await page.getByLabel('username').fill('testi')
      await page.getByLabel('password').fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('testi')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('Blogi')
      await page.getByLabel('author').fill('Kirjoittaja')
      await page.getByLabel('url').fill('www.nettisivu.com')
      await page.getByRole('button', { name: 'create' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('Uusi blogi')
      await page.getByLabel('author').fill('Kirjoittaja')
      await page.getByLabel('url').fill('www.nettisivu.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Uusi blogi Kirjoittaja')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be removed', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Blogi removed.')).toBeVisible()
    })

    test('only the creator of the blog can see the remove button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Toinen Testi Käyttäjä',
        username: 'toinen',
        password: 'salainen2'
        }
      })
      await page.getByRole('button', { name: 'logout' }).click()
      await page.getByLabel('username').fill('toinen')
      await page.getByLabel('password').fill('salainen2')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'view' }).click()
      
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered from most liked to least liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('Blogi2')
      await page.getByLabel('author').fill('Kirjoittaja2')
      await page.getByLabel('url').fill('www.nettisivu2.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('Blogi3')
      await page.getByLabel('author').fill('Kirjoittaja3')
      await page.getByLabel('url').fill('www.nettisivu3.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('Blogi2 Kirjoittaja2').getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('Blogi2 Kirjoittaja2').getByText('likes 1')).toBeVisible()

      await page.getByText('Blogi3 Kirjoittaja3').getByRole('button', { name: 'view' }).click()
      await page.getByText('Blogi3 Kirjoittaja3').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('Blogi3 Kirjoittaja3').getByText('likes 1')).toBeVisible()
      await page.getByText('Blogi3 Kirjoittaja3').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('Blogi3 Kirjoittaja3').getByText('likes 2')).toBeVisible()

      const blogs = await page.locator('.blog').allTextContents()
      await expect(blogs[0]).toContain('Blogi3')
      await expect(blogs[1]).toContain('Blogi2')
      await expect(blogs[2]).toContain('Blogi')
    })
  })
})