import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to login or show login form
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  test('should have accessible login form', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Check for form elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Check for proper labels
    const emailLabel = page.locator('label').filter({ hasText: /email/i });
    const passwordLabel = page.locator('label').filter({ hasText: /password/i });
    
    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should show validation errors
    const errorMessages = page.locator('[role="alert"], .error, .text-red-500');
    await expect(errorMessages).toHaveCount({ min: 1 });
  });

  test('should handle keyboard navigation in login form', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Navigate through form using Tab
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="email"]:focus')).toBeVisible();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="password"]:focus')).toBeVisible();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]:focus')).toBeVisible();
  });
});