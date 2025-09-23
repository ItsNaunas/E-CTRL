import { test, expect } from '@playwright/test'

test.describe('Guest Access Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should show guest access option', async ({ page }) => {
    // Wait for page to load
    await expect(page.locator('h1')).toBeVisible()
    
    // Should show guest access option
    await expect(page.locator('[data-testid="guest-access"]')).toBeVisible()
  })

  test('should allow guest access with email only', async ({ page }) => {
    // Click guest access
    await page.click('[data-testid="guest-access"]')
    
    // Should show guest form
    await expect(page.locator('[data-testid="guest-form"]')).toBeVisible()
    
    // Enter email only
    await page.fill('[data-testid="guest-email-input"]', 'guest@example.com')
    
    // Submit guest form
    await page.click('[data-testid="guest-submit"]')
    
    // Should show limited results
    await expect(page.locator('[data-testid="guest-results"]')).toBeVisible({ timeout: 10000 })
    
    // Should show upgrade prompt
    await expect(page.locator('[data-testid="upgrade-prompt"]')).toBeVisible()
  })

  test('should validate guest email format', async ({ page }) => {
    // Click guest access
    await page.click('[data-testid="guest-access"]')
    
    // Enter invalid email
    await page.fill('[data-testid="guest-email-input"]', 'invalid-email')
    
    // Try to submit
    await page.click('[data-testid="guest-submit"]')
    
    // Should show validation error
    await expect(page.locator('[data-testid="guest-email-error"]')).toBeVisible()
  })

  test('should show limited results for guest', async ({ page }) => {
    // Complete guest flow
    await page.click('[data-testid="guest-access"]')
    await page.fill('[data-testid="guest-email-input"]', 'guest@example.com')
    await page.click('[data-testid="guest-submit"]')
    
    // Wait for results
    await expect(page.locator('[data-testid="guest-results"]')).toBeVisible({ timeout: 10000 })
    
    // Should show limited information
    await expect(page.locator('[data-testid="partial-score"]')).toBeVisible()
    await expect(page.locator('[data-testid="partial-highlights"]')).toBeVisible()
    
    // Should NOT show full recommendations
    await expect(page.locator('[data-testid="full-recommendations"]')).not.toBeVisible()
    
    // Should show upgrade prompt
    await expect(page.locator('[data-testid="upgrade-prompt"]')).toBeVisible()
  })

  test('should allow upgrade from guest to account', async ({ page }) => {
    // Complete guest flow first
    await page.click('[data-testid="guest-access"]')
    await page.fill('[data-testid="guest-email-input"]', 'guest@example.com')
    await page.click('[data-testid="guest-submit"]')
    
    // Wait for guest results
    await expect(page.locator('[data-testid="guest-results"]')).toBeVisible({ timeout: 10000 })
    
    // Click upgrade button
    await page.click('[data-testid="upgrade-button"]')
    
    // Should show account creation form
    await expect(page.locator('[data-testid="account-creation-form"]')).toBeVisible()
    
    // Should pre-fill email from guest session
    const emailValue = await page.locator('[data-testid="register-email-input"]').inputValue()
    expect(emailValue).toBe('guest@example.com')
  })

  test('should create account from guest upgrade', async ({ page }) => {
    // Complete guest flow and upgrade
    await page.click('[data-testid="guest-access"]')
    await page.fill('[data-testid="guest-email-input"]', 'guest@example.com')
    await page.click('[data-testid="guest-submit"]')
    
    await expect(page.locator('[data-testid="guest-results"]')).toBeVisible({ timeout: 10000 })
    await page.click('[data-testid="upgrade-button"]')
    
    // Fill account creation form
    await page.fill('[data-testid="register-name-input"]', 'Guest User')
    await page.fill('[data-testid="register-password-input"]', 'password123')
    
    // Submit account creation
    await page.click('[data-testid="register-submit"]')
    
    // Should show success message
    await expect(page.locator('[data-testid="account-created"]')).toBeVisible({ timeout: 10000 })
    
    // Should now show full results
    await expect(page.locator('[data-testid="full-results"]')).toBeVisible()
  })

  test('should validate account creation from guest', async ({ page }) => {
    // Complete guest flow and upgrade
    await page.click('[data-testid="guest-access"]')
    await page.fill('[data-testid="guest-email-input"]', 'guest@example.com')
    await page.click('[data-testid="guest-submit"]')
    
    await expect(page.locator('[data-testid="guest-results"]')).toBeVisible({ timeout: 10000 })
    await page.click('[data-testid="upgrade-button"]')
    
    // Try to submit without filling required fields
    await page.click('[data-testid="register-submit"]')
    
    // Should show validation errors
    await expect(page.locator('[data-testid="register-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="register-password-error"]')).toBeVisible()
  })

  test('should handle duplicate email in guest upgrade', async ({ page }) => {
    // Mock existing user
    await page.route('**/api/register', route => {
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'User with this email already exists' })
      })
    })
    
    // Complete guest flow and upgrade
    await page.click('[data-testid="guest-access"]')
    await page.fill('[data-testid="guest-email-input"]', 'existing@example.com')
    await page.click('[data-testid="guest-submit"]')
    
    await expect(page.locator('[data-testid="guest-results"]')).toBeVisible({ timeout: 10000 })
    await page.click('[data-testid="upgrade-button"]')
    
    // Fill account creation form
    await page.fill('[data-testid="register-name-input"]', 'Existing User')
    await page.fill('[data-testid="register-password-input"]', 'password123')
    
    // Submit account creation
    await page.click('[data-testid="register-submit"]')
    
    // Should show error message
    await expect(page.locator('[data-testid="register-error"]')).toBeVisible({ timeout: 10000 })
    
    const errorMessage = await page.locator('[data-testid="register-error"]').textContent()
    expect(errorMessage).toContain('already exists')
  })

  test('should send welcome email to guest', async ({ page }) => {
    // Mock email sending
    let emailSent = false
    await page.route('**/api/email', route => {
      emailSent = true
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, messageId: 'test-message-id' })
      })
    })
    
    // Complete guest flow
    await page.click('[data-testid="guest-access"]')
    await page.fill('[data-testid="guest-email-input"]', 'guest@example.com')
    await page.click('[data-testid="guest-submit"]')
    
    // Wait for results
    await expect(page.locator('[data-testid="guest-results"]')).toBeVisible({ timeout: 10000 })
    
    // Should show email confirmation
    await expect(page.locator('[data-testid="email-sent-confirmation"]')).toBeVisible()
    
    // Verify email was sent
    expect(emailSent).toBe(true)
  })

  test('should show guest results with proper styling', async ({ page }) => {
    // Complete guest flow
    await page.click('[data-testid="guest-access"]')
    await page.fill('[data-testid="guest-email-input"]', 'guest@example.com')
    await page.click('[data-testid="guest-submit"]')
    
    // Wait for results
    await expect(page.locator('[data-testid="guest-results"]')).toBeVisible({ timeout: 10000 })
    
    // Should have proper styling for limited results
    const guestResults = page.locator('[data-testid="guest-results"]')
    await expect(guestResults).toHaveClass(/guest|limited|partial/)
    
    // Upgrade prompt should be prominent
    const upgradePrompt = page.locator('[data-testid="upgrade-prompt"]')
    await expect(upgradePrompt).toBeVisible()
    await expect(upgradePrompt).toHaveClass(/upgrade|cta|prominent/)
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Complete guest flow on mobile
    await page.click('[data-testid="guest-access"]')
    await expect(page.locator('[data-testid="guest-form"]')).toBeVisible()
    
    await page.fill('[data-testid="guest-email-input"]', 'guest@example.com')
    await page.click('[data-testid="guest-submit"]')
    
    // Should work on mobile
    await expect(page.locator('[data-testid="guest-results"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="upgrade-prompt"]')).toBeVisible()
    
    // Upgrade flow should work on mobile
    await page.click('[data-testid="upgrade-button"]')
    await expect(page.locator('[data-testid="account-creation-form"]')).toBeVisible()
  })
})
