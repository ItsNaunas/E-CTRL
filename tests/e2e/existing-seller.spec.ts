import { test, expect } from '@playwright/test'

test.describe('Existing Seller Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete full existing seller audit flow', async ({ page }) => {
    // Wait for page to load
    await expect(page.locator('h1')).toBeVisible()

    // Switch to audit mode (existing seller)
    await page.click('[data-testid="mode-toggle"]')
    await expect(page.locator('[data-testid="audit-mode"]')).toBeVisible()

    // Enter valid ASIN
    await page.fill('[data-testid="asin-input"]', 'B08N5WRWNW')
    
    // Fill required form fields
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    
    // Add keywords
    await page.fill('[data-testid="keywords-input"]', 'test, product, amazon')
    
    // Select fulfilment method
    await page.selectOption('[data-testid="fulfilment-select"]', 'FBA')
    
    // Submit form
    await page.click('[data-testid="submit-button"]')
    
    // Wait for loading state
    await expect(page.locator('[data-testid="loading"]')).toBeVisible()
    
    // Wait for results (with longer timeout for AI analysis)
    await expect(page.locator('[data-testid="results"]')).toBeVisible({ timeout: 30000 })
    
    // Verify results content
    await expect(page.locator('[data-testid="score"]')).toBeVisible()
    await expect(page.locator('[data-testid="highlights"]')).toBeVisible()
    await expect(page.locator('[data-testid="recommendations"]')).toBeVisible()
    
    // Verify score is displayed
    const scoreText = await page.locator('[data-testid="score"]').textContent()
    expect(scoreText).toMatch(/\d+/)
  })

  test('should handle invalid ASIN input', async ({ page }) => {
    // Switch to audit mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Enter invalid ASIN
    await page.fill('[data-testid="asin-input"]', 'invalid-asin')
    
    // Fill other required fields
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    
    // Try to submit
    await page.click('[data-testid="submit-button"]')
    
    // Should show validation error
    await expect(page.locator('[data-testid="asin-error"]')).toBeVisible()
  })

  test('should handle Amazon URL input', async ({ page }) => {
    // Switch to audit mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Enter Amazon URL instead of ASIN
    await page.fill('[data-testid="asin-input"]', 'https://www.amazon.com/dp/B08N5WRWNW')
    
    // Fill other required fields
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    
    // Submit form
    await page.click('[data-testid="submit-button"]')
    
    // Should proceed without validation error
    await expect(page.locator('[data-testid="asin-error"]')).not.toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Switch to audit mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Try to submit without filling required fields
    await page.click('[data-testid="submit-button"]')
    
    // Should show validation errors
    await expect(page.locator('[data-testid="name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="asin-error"]')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    // Switch to audit mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Fill form with invalid email
    await page.fill('[data-testid="asin-input"]', 'B08N5WRWNW')
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'invalid-email')
    
    // Try to submit
    await page.click('[data-testid="submit-button"]')
    
    // Should show email validation error
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
  })

  test('should handle keyword limit', async ({ page }) => {
    // Switch to audit mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Fill form with too many keywords
    await page.fill('[data-testid="asin-input"]', 'B08N5WRWNW')
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="keywords-input"]', 'a, b, c, d, e, f, g, h, i, j') // 10 keywords
    
    // Try to submit
    await page.click('[data-testid="submit-button"]')
    
    // Should show keyword limit error
    await expect(page.locator('[data-testid="keywords-error"]')).toBeVisible()
  })

  test('should show loading state during analysis', async ({ page }) => {
    // Switch to audit mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Fill form
    await page.fill('[data-testid="asin-input"]', 'B08N5WRWNW')
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    
    // Submit form
    await page.click('[data-testid="submit-button"]')
    
    // Should show loading state
    await expect(page.locator('[data-testid="loading"]')).toBeVisible()
    
    // Loading state should have appropriate text
    const loadingText = await page.locator('[data-testid="loading"]').textContent()
    expect(loadingText).toContain('analyzing')
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/report', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      })
    })
    
    // Switch to audit mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Fill form
    await page.fill('[data-testid="asin-input"]', 'B08N5WRWNW')
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    
    // Submit form
    await page.click('[data-testid="submit-button"]')
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible({ timeout: 10000 })
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Switch to audit mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Verify form is still usable on mobile
    await expect(page.locator('[data-testid="asin-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="name-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible()
    
    // Fill form on mobile
    await page.fill('[data-testid="asin-input"]', 'B08N5WRWNW')
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    
    // Submit should work on mobile
    await page.click('[data-testid="submit-button"]')
    
    // Should show loading state
    await expect(page.locator('[data-testid="loading"]')).toBeVisible()
  })
})
