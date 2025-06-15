import { test, expect } from '@playwright/test';

// Mock task data
const MOCK_TASK = {
  title: 'Test Task',
  description: 'This is a test task',
  dueDate: '2024-12-31',
};

test.describe('Task Management Tests', () => {
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
    
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'user@test.com');
    await page.fill('[data-testid="password-input"]', 'user123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create a new task', async ({ page }) => {
    await page.click('[data-testid="new-task-button"]');
    await page.fill('[data-testid="task-title-input"]', MOCK_TASK.title);
    await page.fill('[data-testid="task-description-input"]', MOCK_TASK.description);
    await page.fill('[data-testid="task-due-date-input"]', MOCK_TASK.dueDate);
    await page.click('[data-testid="save-task-button"]');

    // Verify task was created
    await expect(page.locator(`[data-testid="task-title"]:has-text("${MOCK_TASK.title}")`)).toBeVisible();
  });

  test('should edit an existing task', async ({ page }) => {
    const updatedTitle = 'Updated Task Title';
    
    // Create a task first
    await page.click('[data-testid="new-task-button"]');
    await page.fill('[data-testid="task-title-input"]', MOCK_TASK.title);
    await page.fill('[data-testid="task-description-input"]', MOCK_TASK.description);
    await page.fill('[data-testid="task-due-date-input"]', MOCK_TASK.dueDate);
    await page.click('[data-testid="save-task-button"]');

    // Wait for task to be created
    await expect(page.locator(`[data-testid="task-title"]:has-text("${MOCK_TASK.title}")`)).toBeVisible();
    
    // Edit the task - find the edit button within the task card
    const taskCard = page.locator(`[data-testid^="task-card-"]:has([data-testid="task-title"]:has-text("${MOCK_TASK.title}"))`);
    await taskCard.locator('button:has-text("Edit")').click();
    
    // Wait for modal to open and edit
    await page.waitForSelector('[data-testid="task-title-input"]', { state: 'visible' });
    await page.fill('[data-testid="task-title-input"]', updatedTitle);
    await page.click('[data-testid="save-task-button"]');

    // Verify task was updated
    await expect(page.locator(`[data-testid="task-title"]:has-text("${updatedTitle}")`)).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    // Create a task first
    await page.click('[data-testid="new-task-button"]');
    await page.fill('[data-testid="task-title-input"]', MOCK_TASK.title);
    await page.fill('[data-testid="task-description-input"]', MOCK_TASK.description);
    await page.fill('[data-testid="task-due-date-input"]', MOCK_TASK.dueDate);
    await page.click('[data-testid="save-task-button"]');

    // Wait for task to be created
    await expect(page.locator(`[data-testid="task-title"]:has-text("${MOCK_TASK.title}")`)).toBeVisible();

    // Delete the task - find the delete button within the task card
    const taskCard = page.locator(`[data-testid^="task-card-"]:has([data-testid="task-title"]:has-text("${MOCK_TASK.title}"))`);
    await taskCard.locator('button:has-text("Delete")').click();
    
    // Wait for delete modal and confirm
    await page.waitForSelector('[data-testid="confirm-delete-button"]', { state: 'visible' });
    await page.click('[data-testid="confirm-delete-button"]');

    // Verify task was deleted
    await expect(page.locator(`[data-testid="task-title"]:has-text("${MOCK_TASK.title}")`)).not.toBeVisible();
  });

  test('should mark a task as done', async ({ page }) => {
    // Create a task first
    await page.click('[data-testid="new-task-button"]');
    await page.fill('[data-testid="task-title-input"]', MOCK_TASK.title);
    await page.fill('[data-testid="task-description-input"]', MOCK_TASK.description);
    await page.fill('[data-testid="task-due-date-input"]', MOCK_TASK.dueDate);
    await page.click('[data-testid="save-task-button"]');

    // Wait for task to be created
    await expect(page.locator(`[data-testid="task-title"]:has-text("${MOCK_TASK.title}")`)).toBeVisible();

    // Mark task as done - find the complete button within the task card
    const taskCard = page.locator(`[data-testid^="task-card-"]:has([data-testid="task-title"]:has-text("${MOCK_TASK.title}"))`);
    await taskCard.locator('button:has-text("Complete")').click();

    // Verify task status
    await expect(taskCard.locator('[data-testid^="task-status-"]')).toHaveText('completed');
    await expect(taskCard).toHaveClass(/completed/);
  });
}); 