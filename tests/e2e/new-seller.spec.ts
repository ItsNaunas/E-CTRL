import { test, expect } from '@playwright/test'

test.describe('New Seller Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete full new seller flow with website URL', async ({ page }) => {
    // Wait for page to load
    await expect(page.locator('h1')).toBeVisible()

    // Switch to create mode (new seller)
    await page.click('[data-testid="mode-toggle"]')
    await expect(page.locator('[data-testid="create-mode"]')).toBeVisible()

    // Enter website URL
    await page.fill('[data-testid="website-url-input"]', 'https://www.example.com')
    
    // Fill required form fields
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    
    // Select category
    await page.selectOption('[data-testid="category-select"]', 'Electronics')
    
    // Fill product description
    await page.fill('[data-testid="description-input"]', 'This is a valid product description with enough characters to meet the minimum requirement.')
    
    // Add required keywords (2-5)
    await page.fill('[data-testid="keywords-input"]', 'test, product, electronics')
    
    // Select fulfilment intent
    await page.selectOption('[data-testid="fulfilment-intent-select"]', 'FBA')
    
    // Submit form
    await page.click('[data-testid="submit-button"]')
    
    // Wait for loading state
    await expect(page.locator('[data-testid="loading"]')).toBeVisible()
    
    // Wait for results
    await expect(page.locator('[data-testid="results"]')).toBeVisible({ timeout: 30000 })
    
    // Verify results content
    await expect(page.locator('[data-testid="score"]')).toBeVisible()
    await expect(page.locator('[data-testid="highlights"]')).toBeVisible()
    await expect(page.locator('[data-testid="recommendations"]')).toBeVisible()
  })

  test('should complete new seller flow with manual input', async ({ page }) => {
    // Switch to create mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Don't enter website URL, use manual input instead
    await page.fill('[data-testid="product-name-input"]', 'Test Product')
    
    // Fill required form fields
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    
    // Select category
    await page.selectOption('[data-testid="category-select"]', 'Electronics')
    
    // Fill product description
    await page.fill('[data-testid="description-input"]', 'This is a valid product description with enough characters to meet the minimum requirement.')
    
    // Add required keywords
    await page.fill('[data-testid="keywords-input"]', 'test, product')
    
    // Select fulfilment intent
    await page.selectOption('[data-testid="fulfilment-intent-select"]', 'FBA')
    
    // Submit form
    await page.click('[data-testid="submit-button"]')
    
    // Should proceed without validation errors
    await expect(page.locator('[data-testid="website-url-error"]')).not.toBeVisible()
  })

  test('should use AI keyword suggestions', async ({ page }) => {
    // Switch to create mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Fill basic info
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.selectOption('[data-testid="category-select"]', 'Electronics')
    await page.fill('[data-testid="description-input"]', 'This is a valid product description with enough characters to meet the minimum requirement.')
    
    // Click AI suggestions button
    await page.click('[data-testid="ai-suggestions-button"]')
    
    // Wait for suggestions to load
    await expect(page.locator('[data-testid="suggestions-loading"]')).toBeVisible()
    await expect(page.locator('[data-testid="suggestions"]')).toBeVisible({ timeout: 10000 })
    
    // Verify suggestions are populated
    const suggestions = await page.locator('[data-testid="suggestion-chip"]').count()
    expect(suggestions).toBeGreaterThan(0)
    expect(suggestions).toBeLessThanOrEqual(5)
    
    // Click on a suggestion to add it
    await page.click('[data-testid="suggestion-chip"]:first-child')
    
    // Verify keyword was added
    await expect(page.locator('[data-testid="keywords-input"]')).toHaveValue(/test/)
  })

  test('should validate required keywords count', async ({ page }) => {
    // Switch to create mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Fill form with too few keywords
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.selectOption('[data-testid="category-select"]', 'Electronics')
    await page.fill('[data-testid="description-input"]', 'This is a valid product description with enough characters.')
    await page.fill('[data-testid="keywords-input"]', 'single') // Only 1 keyword
    
    // Try to submit
    await page.click('[data-testid="submit-button"]')
    
    // Should show keyword validation error
    await expect(page.locator('[data-testid="keywords-error"]')).toBeVisible()
  })

  test('should validate description length', async ({ page }) => {
    // Switch to create mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Fill form with description that's too short
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.selectOption('[data-testid="category-select"]', 'Electronics')
    await page.fill('[data-testid="description-input"]', 'Too short') // Less than 12 characters
    await page.fill('[data-testid="keywords-input"]', 'test, product')
    
    // Try to submit
    await page.click('[data-testid="submit-button"]')
    
    // Should show description validation error
    await expect(page.locator('[data-testid="description-error"]')).toBeVisible()
  })

  test('should validate description max length', async ({ page }) => {
    // Switch to create mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Fill form with description that's too long
    const longDescription = 'A'.repeat(401) // Over 400 characters
    
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.selectOption('[data-testid="category-select"]', 'Electronics')
    await page.fill('[data-testid="description-input"]', longDescription)
    await page.fill('[data-testid="keywords-input"]', 'test, product')
    
    // Try to submit
    await page.click('[data-testid="submit-button"]')
    
    // Should show description validation error
    await expect(page.locator('[data-testid="description-error"]')).toBeVisible()
  })

  test('should validate website URL format', async ({ page }) => {
    // Switch to create mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Fill form with invalid URL
    await page.fill('[data-testid="website-url-input"]', 'not-a-valid-url')
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.selectOption('[data-testid="category-select"]', 'Electronics')
    await page.fill('[data-testid="description-input"]', 'This is a valid product description with enough characters.')
    await page.fill('[data-testid="keywords-input"]', 'test, product')
    
    // Try to submit
    await page.click('[data-testid="submit-button"]')
    
    // Should show URL validation error
    await expect(page.locator('[data-testid="website-url-error"]')).toBeVisible()
  })

  test('should handle website scraping failure', async ({ page }) => {
    // Mock scraping failure
    await page.route('**/api/preview', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Unable to scrape product data from this URL',
          code: 'URL_SCRAPING_FAILED',
          suggestion: 'manual_input'
        })
      })
    })
    
    // Switch to create mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Fill form with URL that will fail scraping
    await page.fill('[data-testid="website-url-input"]', 'https://www.example.com')
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.selectOption('[data-testid="category-select"]', 'Electronics')
    await page.fill('[data-testid="description-input"]', 'This is a valid product description with enough characters.')
    await page.fill('[data-testid="keywords-input"]', 'test, product')
    
    // Submit form
    await page.click('[data-testid="submit-button"]')
    
    // Should show scraping failure message
    await expect(page.locator('[data-testid="scraping-error"]')).toBeVisible({ timeout: 10000 })
    
    // Should suggest manual input
    const errorMessage = await page.locator('[data-testid="scraping-error"]').textContent()
    expect(errorMessage).toContain('manual input')
  })

  test('should require at least one input method', async ({ page }) => {
    // Switch to create mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Fill form without website URL, product name, or description
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.selectOption('[data-testid="category-select"]', 'Electronics')
    await page.fill('[data-testid="keywords-input"]', 'test, product')
    
    // Try to submit
    await page.click('[data-testid="submit-button"]')
    
    // Should show validation error
    await expect(page.locator('[data-testid="website-url-error"]')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Switch to create mode
    await page.click('[data-testid="mode-toggle"]')
    
    // Verify form is usable on mobile
    await expect(page.locator('[data-testid="website-url-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="name-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="category-select"]')).toBeVisible()
    
    // Fill form on mobile
    await page.fill('[data-testid="name-input"]', 'Test User')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.selectOption('[data-testid="category-select"]', 'Electronics')
    await page.fill('[data-testid="description-input"]', 'This is a valid product description with enough characters.')
    await page.fill('[data-testid="keywords-input"]', 'test, product')
    
    // Submit should work on mobile
    await page.click('[data-testid="submit-button"]')
    
    // Should show loading state
    await expect(page.locator('[data-testid="loading"]')).toBeVisible()
  })
})
