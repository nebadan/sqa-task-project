import { test, expect } from '@playwright/test';

// Mock user data
const MOCK_USERS = {
  admin: { email: 'admin@test.com', password: 'admin123', role: 'admin' },
  user: { email: 'user@test.com', password: 'user123', role: 'user' },
};

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch (e) {
        // Handle security errors in some browsers
        console.log('localStorage not available');
      }
    });
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', MOCK_USERS.user.email);
    await page.fill('[data-testid="password-input"]', MOCK_USERS.user.password);
    await page.click('[data-testid="login-button"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'wrong@test.com');
    await page.fill('[data-testid="password-input"]', 'wrongpass');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('#error-message[data-testid="error-message"]')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('should redirect unauthenticated users from protected pages', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
    
    await page.goto('/admin');
    await expect(page).toHaveURL('/login');
  });

  test('should allow admin access to admin page', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', MOCK_USERS.admin.email);
    await page.fill('[data-testid="password-input"]', MOCK_USERS.admin.password);
    await page.click('[data-testid="login-button"]');
    
    // Access admin page
    await page.goto('/admin');
    await expect(page).toHaveURL('/admin');
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
  });

  test('should prevent regular users from accessing admin page', async ({ page }) => {
    // Login as regular user
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', MOCK_USERS.user.email);
    await page.fill('[data-testid="password-input"]', MOCK_USERS.user.password);
    await page.click('[data-testid="login-button"]');
    
    // Try to access admin page
    await page.goto('/admin');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('.floating-error-message[data-testid="error-message"]')).toBeVisible();
  });
}); 