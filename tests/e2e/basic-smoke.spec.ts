import { test, expect } from '@playwright/test'

test.describe('Basic Smoke Tests', () => {
  test('should load homepage', async ({ page }) => {
    // This is a basic smoke test that doesn't rely on specific test IDs
    await page.goto('/')
    
    // Check that the page loads
    await expect(page).toHaveTitle(/E-CTRL|Amazon/)
    
    // Check for basic elements that should be present
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('button')).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    await page.goto('/')
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('h1')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('h1')).toBeVisible()
  })
})
