import { test, expect } from "@playwright/test";

// Extend the Window interface to include renderTaskCard
declare global {
  interface Window {
    renderTaskCard: (task: {
      id: string;
      title: string;
      description: string;
      status: string;
      dueDate: string;
    }) => void;
  }
}

test.describe("Component Tests", () => {
  test("TaskCard should render correctly", async ({ page }) => {
    await page.goto("/components/TaskCard");

    // Test rendering with different props
    await page.evaluate(() => {
      const task = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        dueDate: "2024-12-31",
      };
      window.renderTaskCard(task);
    });

    await expect(page.locator('[data-testid="task-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="task-title"]')).toHaveText(
      "Test Task"
    );
    await expect(page.locator('[data-testid="task-status"]')).toHaveText(
      "pending"
    );
  });

  test("TaskForm should handle input correctly", async ({ page }) => {
    await page.goto("/components/TaskForm");

    // Test form inputs
    await page.fill('[data-testid="task-title-input"]', "New Task");
    await page.fill(
      '[data-testid="task-description-input"]',
      "New Description"
    );
    await page.fill('[data-testid="task-due-date-input"]', "2024-12-31");

    // Verify input values
    await expect(page.locator('[data-testid="task-title-input"]')).toHaveValue(
      "New Task"
    );
    await expect(
      page.locator('[data-testid="task-description-input"]')
    ).toHaveValue("New Description");
    await expect(
      page.locator('[data-testid="task-due-date-input"]')
    ).toHaveValue("2024-12-31");
  });

  test("TaskForm should validate required fields", async ({ page }) => {
    await page.goto("/components/TaskForm");

    // Try to submit without filling required fields
    await page.click('[data-testid="save-task-button"]');

    // Verify validation messages
    await expect(page.locator('[data-testid="title-error"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="description-error"]')
    ).toBeVisible();
  });

  test("TaskCard should handle status changes", async ({ page }) => {
    await page.goto("/components/TaskCard");

    // Render task with pending status
    await page.evaluate(() => {
      const task = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        dueDate: "2024-12-31",
      };
      window.renderTaskCard(task);
    });

    // Click complete button
    await page.click('[data-testid="complete-task-button"]');

    // Verify status change
    await expect(page.locator('[data-testid="task-status"]')).toHaveText(
      "completed"
    );
    await expect(page.locator('[data-testid="task-card"]')).toHaveClass(
      /completed/
    );
  });
});
