# Task Management Tests Explained (`tests/tasks.spec.ts`)

This file tests the core functionality of our task management system: creating, editing, deleting, and completing tasks.

## File Structure Breakdown

### 1. Imports
```javascript
import { test, expect } from '@playwright/test';
```
**What this does:**
- Same as auth tests - imports the testing functions from Playwright

### 2. Mock Task Data
```javascript
const MOCK_TASK = {
  title: 'Test Task',
  description: 'This is a test task',
  dueDate: '2024-12-31',
};
```
**What this does:**
- Creates a sample task for testing
- Contains all the fields our task form expects
- `dueDate` is in YYYY-MM-DD format (HTML date input format)

### 3. Test Suite Declaration
```javascript
test.describe('Task Management Tests', () => {
```
**What this does:**
- Groups all task-related tests together
- Makes test output more organized

### 4. Login Before Each Test
```javascript
test.beforeEach(async ({ page }) => {
  // Clear any existing auth state
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch (e) {
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
```
**What this does:**
- Runs before every task test
- Clears any previous login data
- Automatically logs in as a regular user
- Verifies we're on the dashboard
- **Why needed**: Task features require authentication

## Individual Tests Explained

### Test 1: Create a New Task
```javascript
test('should create a new task', async ({ page }) => {
```
**What this does:**
- Tests the basic task creation functionality

```javascript
await page.click('[data-testid="new-task-button"]');
```
**What this does:**
- Clicks the "New Task" button
- This should open a modal/form for creating tasks

```javascript
await page.fill('[data-testid="task-title-input"]', MOCK_TASK.title);
await page.fill('[data-testid="task-description-input"]', MOCK_TASK.description);
await page.fill('[data-testid="task-due-date-input"]', MOCK_TASK.dueDate);
```
**What this does:**
- Fills in the task form with our mock data
- `page.fill()` clears the field and types new text
- Each field is found by its `data-testid` attribute

```javascript
await page.click('[data-testid="save-task-button"]');
```
**What this does:**
- Submits the form by clicking the save button
- Should create the task and close the modal

```javascript
await expect(page.locator(`[data-testid="task-title"]:has-text("${MOCK_TASK.title}")`)).toBeVisible();
```
**What this does:**
- Verifies the task appears in the task list
- `:has-text()` finds elements containing specific text
- `toBeVisible()` checks the element is displayed on screen

### Test 2: Edit an Existing Task
```javascript
test('should edit an existing task', async ({ page }) => {
  const updatedTitle = 'Updated Task Title';
  
  // Create a task first
  await page.click('[data-testid="new-task-button"]');
  await page.fill('[data-testid="task-title-input"]', MOCK_TASK.title);
  await page.fill('[data-testid="task-description-input"]', MOCK_TASK.description);
  await page.fill('[data-testid="task-due-date-input"]', MOCK_TASK.dueDate);
  await page.click('[data-testid="save-task-button"]');
```
**What this does:**
- First creates a task (same as previous test)
- We need an existing task to edit

```javascript
await expect(page.locator(`[data-testid="task-title"]:has-text("${MOCK_TASK.title}")`)).toBeVisible();
```
**What this does:**
- Waits for the task to appear in the list
- Ensures the task was created before trying to edit it

```javascript
const taskCard = page.locator(`[data-testid^="task-card-"]:has([data-testid="task-title"]:has-text("${MOCK_TASK.title}"))`);
await taskCard.locator('button:has-text("Edit")').click();
```
**What this does:**
- `[data-testid^="task-card-"]`: Finds elements whose testid starts with "task-card-"
- `:has()`: Finds task cards that contain our specific task title
- `.locator('button:has-text("Edit")')`: Finds the Edit button within that task card
- This complex selector ensures we click the right Edit button

```javascript
await page.waitForSelector('[data-testid="task-title-input"]', { state: 'visible' });
```
**What this does:**
- Waits for the edit form to appear
- `state: 'visible'` ensures the input is actually visible, not just present in DOM

```javascript
await page.fill('[data-testid="task-title-input"]', updatedTitle);
await page.click('[data-testid="save-task-button"]');
```
**What this does:**
- Changes the task title to the new value
- Saves the changes

```javascript
await expect(page.locator(`[data-testid="task-title"]:has-text("${updatedTitle}")`)).toBeVisible();
```
**What this does:**
- Verifies the task now shows the updated title
- Confirms the edit was successful

### Test 3: Delete a Task
```javascript
test('should delete a task', async ({ page }) => {
  // Create a task first
  // ... (same creation steps as before)
  
  // Delete the task - find the delete button within the task card
  const taskCard = page.locator(`[data-testid^="task-card-"]:has([data-testid="task-title"]:has-text("${MOCK_TASK.title}"))`);
  await taskCard.locator('button:has-text("Delete")').click();
```
**What this does:**
- Creates a task first
- Finds the specific task card
- Clicks the Delete button for that task

```javascript
await page.waitForSelector('[data-testid="confirm-delete-button"]', { state: 'visible' });
await page.click('[data-testid="confirm-delete-button"]');
```
**What this does:**
- Waits for the delete confirmation dialog to appear
- Clicks the confirm button to actually delete the task
- **Why needed**: Good UX practice to confirm destructive actions

```javascript
await expect(page.locator(`[data-testid="task-title"]:has-text("${MOCK_TASK.title}")`)).not.toBeVisible();
```
**What this does:**
- Verifies the task is no longer visible in the list
- `not.toBeVisible()` checks that the element is gone

### Test 4: Mark Task as Complete
```javascript
test('should mark a task as done', async ({ page }) => {
  // Create a task first
  // ... (same creation steps)
  
  // Mark task as done - find the complete button within the task card
  const taskCard = page.locator(`[data-testid^="task-card-"]:has([data-testid="task-title"]:has-text("${MOCK_TASK.title}"))`);
  await taskCard.locator('button:has-text("Complete")').click();
```
**What this does:**
- Creates a task first
- Finds the Complete button for that specific task
- Clicks it to mark the task as done

```javascript
await expect(taskCard.locator('[data-testid^="task-status-"]')).toHaveText('completed');
await expect(taskCard).toHaveClass(/completed/);
```
**What this does:**
- Checks that the task status text changed to "completed"
- Checks that the task card got a "completed" CSS class
- `/completed/` is a regular expression that matches any class containing "completed"

## Advanced Concepts Demonstrated

### 1. **Complex Locators**
```javascript
page.locator(`[data-testid^="task-card-"]:has([data-testid="task-title"]:has-text("${MOCK_TASK.title}"))`)
```
**Breaking this down:**
- `[data-testid^="task-card-"]`: Elements with testid starting with "task-card-"
- `:has()`: That contain...
- `[data-testid="task-title"]`: An element with testid "task-title"
- `:has-text()`: That contains specific text

### 2. **Test Dependencies**
Most tests create a task first, then perform actions on it. This shows:
- How to set up test data within the test
- How to chain multiple actions together

### 3. **Waiting Strategies**
```javascript
await page.waitForSelector('[data-testid="task-title-input"]', { state: 'visible' });
```
**Why this matters:**
- Web apps are dynamic - elements appear and disappear
- We need to wait for elements to be ready before interacting
- `state: 'visible'` is more reliable than just checking if element exists

### 4. **State Verification**
Tests check multiple aspects of state changes:
- Text content changes
- CSS classes change
- Elements appear/disappear

## Common Patterns in Task Tests

### 1. **Setup → Action → Verify**
1. Create a task (setup)
2. Perform action (edit, delete, complete)
3. Verify the result

### 2. **Scoped Actions**
Instead of clicking any Edit button, we find the Edit button within a specific task card.

### 3. **Multiple Assertions**
Tests often check multiple things to ensure the action worked completely.

## Running These Tests

```bash
# Run all task tests
npx playwright test tests/tasks.spec.ts

# Run a specific test
npx playwright test tests/tasks.spec.ts -g "should create a new task"

# Run in headed mode to see what's happening
npx playwright test tests/tasks.spec.ts --headed

# Debug a specific test
npx playwright test tests/tasks.spec.ts -g "should edit" --debug
```

## Tips for Writing Similar Tests

1. **Use descriptive test names** that explain what you're testing
2. **Set up test data** within each test for clarity
3. **Use specific locators** to avoid clicking the wrong elements
4. **Wait for elements** to be ready before interacting
5. **Verify multiple aspects** of the result to ensure completeness 