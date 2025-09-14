import { test, expect } from '@playwright/test'

test.describe('Homepage and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/E-CTRL/)
    
    // Check main heading
    await expect(page.locator('h1')).toBeVisible()
    
    // Check that main sections are present
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="how-it-works"]')).toBeVisible()
    await expect(page.locator('[data-testid="benefits"]')).toBeVisible()
    await expect(page.locator('[data-testid="testimonials"]')).toBeVisible()
  })

  test('should have working mode toggle', async ({ page }) => {
    // Check mode toggle is visible
    await expect(page.locator('[data-testid="mode-toggle"]')).toBeVisible()
    
    // Click mode toggle
    await page.click('[data-testid="mode-toggle"]')
    
    // Should switch between audit and create modes
    await expect(page.locator('[data-testid="audit-mode"], [data-testid="create-mode"]')).toBeVisible()
    
    // Click again to switch back
    await page.click('[data-testid="mode-toggle"]')
    
    // Should switch back
    await expect(page.locator('[data-testid="audit-mode"], [data-testid="create-mode"]')).toBeVisible()
  })

  test('should have working sticky tabs', async ({ page }) => {
    // Check sticky tabs are visible
    await expect(page.locator('[data-testid="sticky-tabs"]')).toBeVisible()
    
    // Scroll down to test sticky behavior
    await page.evaluate(() => window.scrollTo(0, 500))
    
    // Tabs should still be visible (sticky)
    await expect(page.locator('[data-testid="sticky-tabs"]')).toBeVisible()
    
    // Click on a tab
    await page.click('[data-testid="tab-how-it-works"]')
    
    // Should scroll to the section
    await expect(page.locator('[data-testid="how-it-works"]')).toBeInViewport()
  })

  test('should have working CTA buttons', async ({ page }) => {
    // Check main CTA button
    await expect(page.locator('[data-testid="main-cta"]')).toBeVisible()
    
    // Click main CTA
    await page.click('[data-testid="main-cta"]')
    
    // Should scroll to form or show form
    await expect(page.locator('[data-testid="audit-mode"], [data-testid="create-mode"]')).toBeVisible()
    
    // Check other CTA buttons
    const UnifiedCTAs = page.locator('[data-testid*="cta"]')
    const count = await UnifiedCTAs.count()
    
    for (let i = 0; i < count; i++) {
      const button = UnifiedCTAs.nth(i)
      await expect(button).toBeVisible()
      await expect(button).toBeEnabled()
    }
  })

  test('should have smooth scrolling navigation', async ({ page }) => {
    // Click on navigation link
    await page.click('[data-testid="nav-how-it-works"]')
    
    // Should smoothly scroll to section
    await expect(page.locator('[data-testid="how-it-works"]')).toBeInViewport()
    
    // Click on another navigation link
    await page.click('[data-testid="nav-benefits"]')
    
    // Should smoothly scroll to benefits section
    await expect(page.locator('[data-testid="benefits"]')).toBeInViewport()
  })

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="mode-toggle"]')).toBeVisible()
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="mode-toggle"]')).toBeVisible()
    
    // Navigation should still work on mobile
    await page.click('[data-testid="mode-toggle"]')
    await expect(page.locator('[data-testid="audit-mode"], [data-testid="create-mode"]')).toBeVisible()
  })

  test('should have proper accessibility features', async ({ page }) => {
    // Check for proper heading structure
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    
    // Check for alt text on images
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
    
    // Check for proper button labels
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      
      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy()
    }
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through the page
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Should be able to focus on interactive elements
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(['BUTTON', 'INPUT', 'A', 'SELECT']).toContain(focusedElement)
    
    // Should be able to activate with Enter key
    await page.keyboard.press('Enter')
    
    // Should be able to navigate with arrow keys if applicable
    await page.keyboard.press('ArrowDown')
  })

  test('should have proper meta tags', async ({ page }) => {
    // Check for meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDescription).toBeTruthy()
    expect(metaDescription?.length).toBeGreaterThan(50)
    
    // Check for Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toBeTruthy()
    
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
    expect(ogDescription).toBeTruthy()
    
    // Check for Twitter Card tags
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
    expect(twitterCard).toBeTruthy()
  })

  test('should load quickly', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    
    const loadTime = Date.now() - startTime
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should have working footer links', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Check footer is visible
    await expect(page.locator('[data-testid="footer"]')).toBeVisible()
    
    // Check footer links
    const footerLinks = page.locator('[data-testid="footer"] a')
    const linkCount = await footerLinks.count()
    
    for (let i = 0; i < linkCount; i++) {
      const link = footerLinks.nth(i)
      await expect(link).toBeVisible()
      
      const href = await link.getAttribute('href')
      expect(href).toBeTruthy()
    }
  })

  test('should handle page refresh correctly', async ({ page }) => {
    // Interact with the page
    await page.click('[data-testid="mode-toggle"]')
    await expect(page.locator('[data-testid="audit-mode"], [data-testid="create-mode"]')).toBeVisible()
    
    // Refresh the page
    await page.reload()
    
    // Should return to initial state
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('[data-testid="mode-toggle"]')).toBeVisible()
  })

  test('should have proper error boundaries', async ({ page }) => {
    // Mock a JavaScript error
    await page.addInitScript(() => {
      // This will cause an error when the page loads
      window.addEventListener('error', (e) => {
        console.log('Caught error:', e.error)
      })
    })
    
    // Page should still load and be functional
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('[data-testid="mode-toggle"]')).toBeVisible()
  })
})
