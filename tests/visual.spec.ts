import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('login page should match snapshot', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('user dashboard should match snapshot', async ({ page }) => {
    // Clear any existing auth state
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch (e) {
        console.log('localStorage not available');
      }
    });
    
    // Login as regular user
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'user@test.com');
    await page.fill('[data-testid="password-input"]', 'user123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveScreenshot('user-dashboard.png');
  });

  test('admin dashboard should match snapshot', async ({ page }) => {
    // Clear any existing auth state
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch (e) {
        console.log('localStorage not available');
      }
    });
    
    // Login as admin
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@test.com');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/admin');
    await expect(page).toHaveScreenshot('admin-dashboard.png');
  });

  test('task list with various statuses should match snapshot', async ({ page }) => {
    // Clear any existing auth state
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch (e) {
        console.log('localStorage not available');
      }
    });
    
    // Login and create tasks with different statuses
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'user@test.com');
    await page.fill('[data-testid="password-input"]', 'user123');
    await page.click('[data-testid="login-button"]');

    // Create a pending task
    await page.click('[data-testid="new-task-button"]');
    await page.fill('[data-testid="task-title-input"]', 'Pending Task');
    await page.fill('[data-testid="task-description-input"]', 'This is pending');
    await page.fill('[data-testid="task-due-date-input"]', '2024-12-31');
    await page.click('[data-testid="save-task-button"]');

    // Create and complete a task
    await page.click('[data-testid="new-task-button"]');
    await page.fill('[data-testid="task-title-input"]', 'Completed Task');
    await page.fill('[data-testid="task-description-input"]', 'This is completed');
    await page.fill('[data-testid="task-due-date-input"]', '2024-12-31');
    await page.click('[data-testid="save-task-button"]');
    
    // Wait for task to be created and complete it
    await expect(page.locator(`[data-testid="task-title"]:has-text("Completed Task")`)).toBeVisible();
    const completedTaskCard = page.locator(`[data-testid^="task-card-"]:has([data-testid="task-title"]:has-text("Completed Task"))`);
    await completedTaskCard.locator('button:has-text("Complete")').click();

    await expect(page).toHaveScreenshot('task-list.png');
  });
}); 