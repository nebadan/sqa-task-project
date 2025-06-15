# Component Tests Explained (`tests/components.spec.ts`)

Component testing focuses on testing individual UI components in isolation, separate from the full application. This approach helps verify that components work correctly on their own before integrating them into the larger system.

## What is Component Testing?

Component testing isolates individual pieces of your UI (like a task card, form, or button) and tests them independently. This is different from end-to-end testing, which tests the entire application flow.

**Benefits:**
- Faster test execution (no full app loading)
- Easier debugging (isolated failures)
- Better test coverage of edge cases
- Components can be tested before full integration

## File Structure Breakdown

### 1. Imports
```javascript
import { test, expect } from '@playwright/test';
```
**What this does:**
- Same Playwright testing imports as other files
- Component tests use the same framework as E2E tests

### 2. Test Suite Declaration
```javascript
test.describe('Component Tests', () => {
```
**What this does:**
- Groups all component-related tests together
- Organizes test output for better readability

## Individual Component Tests Explained

### Test 1: Task Card Component
```javascript
test('TaskCard component should render correctly', async ({ page }) => {
  await page.goto('/components/TaskCard.html');
```
**What this does:**
- Navigates to a standalone page that only contains the TaskCard component
- `/components/TaskCard.html` is a separate HTML file we created for testing
- **Why separate page**: Isolates the component from the full application

```javascript
const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'This is a test task',
  status: 'pending',
  dueDate: '2024-12-31'
};
```
**What this does:**
- Creates test data for the component
- Matches the structure our TaskCard component expects
- **Consistent data**: Same format as real application data

```javascript
await page.evaluate((task) => {
  window.renderTaskCard(task);
}, mockTask);
```
**What this does:**
- `page.evaluate()`: Runs JavaScript code in the browser
- Calls a global function `renderTaskCard()` that we defined in TaskCard.html
- Passes our mock task data to the function
- **Result**: The component renders with our test data

```javascript
await expect(page.locator('[data-testid="task-title"]')).toHaveText(mockTask.title);
await expect(page.locator('[data-testid="task-description"]')).toHaveText(mockTask.description);
await expect(page.locator('[data-testid="task-status"]')).toHaveText(mockTask.status);
```
**What this does:**
- Verifies that the component displays the correct data
- Checks each piece of information separately
- Uses the same `data-testid` attributes as the main application

### Test 2: Task Card Actions
```javascript
test('TaskCard component should handle actions correctly', async ({ page }) => {
  await page.goto('/components/TaskCard.html');
  
  const mockTask = {
    id: 2,
    title: 'Actionable Task',
    description: 'Task with actions',
    status: 'pending',
    dueDate: '2024-12-31'
  };
  
  await page.evaluate((task) => {
    window.renderTaskCard(task);
  }, mockTask);
```
**What this does:**
- Same setup as previous test
- Creates a task specifically for testing actions
- Different ID and title to avoid conflicts

```javascript
await page.click('button:has-text("Complete")');
await expect(page.locator('[data-testid^="task-status-"]')).toHaveText('completed');
```
**What this does:**
- Clicks the "Complete" button on the task card
- Verifies that the status changes to "completed"
- `[data-testid^="task-status-"]`: Finds elements whose testid starts with "task-status-"
- **Tests interaction**: Ensures the component responds to user actions

### Test 3: Task Form Component
```javascript
test('TaskForm component should validate required fields', async ({ page }) => {
  await page.goto('/components/TaskForm.html');
```
**What this does:**
- Navigates to the standalone TaskForm component page
- Tests the form in isolation from the full application

```javascript
await page.click('[data-testid="save-task-button"]');
```
**What this does:**
- Tries to submit the form without filling any fields
- Tests the validation behavior

```javascript
await expect(page.locator('[data-testid="title-error"]')).toBeVisible();
await expect(page.locator('[data-testid="description-error"]')).toBeVisible();
```
**What this does:**
- Checks that error messages appear for required fields
- `toBeVisible()`: Ensures the error messages are actually displayed
- **Tests validation**: Verifies form doesn't accept empty required fields

### Test 4: Task Form Submission
```javascript
test('TaskForm component should submit valid data', async ({ page }) => {
  await page.goto('/components/TaskForm.html');
  
  const validTask = {
    title: 'Valid Task',
    description: 'This is a valid task',
    dueDate: '2024-12-31'
  };
  
  await page.fill('[data-testid="task-title-input"]', validTask.title);
  await page.fill('[data-testid="task-description-input"]', validTask.description);
  await page.fill('[data-testid="task-due-date-input"]', validTask.dueDate);
```
**What this does:**
- Creates valid test data
- Fills in all required form fields
- **Positive test case**: Tests that valid data works correctly

```javascript
await page.click('[data-testid="save-task-button"]');
```
**What this does:**
- Submits the form with valid data
- Should succeed (no validation errors)

```javascript
await expect(page.locator('[data-testid="title-error"]')).not.toBeVisible();
await expect(page.locator('[data-testid="description-error"]')).not.toBeVisible();
```
**What this does:**
- Verifies that no error messages are shown
- `not.toBeVisible()`: Confirms error messages are hidden
- **Confirms success**: Valid data should not trigger validation errors

## Component Test Architecture

### 1. **Standalone Component Pages**
We created separate HTML files for each component:
- `/components/TaskCard.html`
- `/components/TaskForm.html`

These pages contain:
- Minimal HTML structure
- Component-specific CSS
- JavaScript functions to render/interact with components
- No full application dependencies

### 2. **Global Functions**
Each component page exposes global functions:
```javascript
// In TaskCard.html
window.renderTaskCard = function(task) {
  // Render the task card with provided data
};

// In TaskForm.html  
window.validateForm = function() {
  // Validate form fields
};
```

### 3. **Test Data Injection**
```javascript
await page.evaluate((data) => {
  window.renderComponent(data);
}, testData);
```
**How this works:**
- `page.evaluate()` runs code in the browser context
- We pass test data from the test into the browser
- The browser function uses this data to render the component

## Advanced Component Testing Concepts

### 1. **Component State Testing**
```javascript
test('component should handle state changes', async ({ page }) => {
  await page.goto('/components/TaskCard.html');
  
  // Test initial state
  await page.evaluate(() => {
    window.renderTaskCard({ status: 'pending' });
  });
  await expect(page.locator('.task-card')).toHaveClass(/pending/);
  
  // Test state change
  await page.click('button:has-text("Complete")');
  await expect(page.locator('.task-card')).toHaveClass(/completed/);
});
```

### 2. **Component Props Testing**
```javascript
test('component should handle different props', async ({ page }) => {
  const testCases = [
    { priority: 'high', expectedClass: 'high-priority' },
    { priority: 'low', expectedClass: 'low-priority' }
  ];
  
  for (const testCase of testCases) {
    await page.evaluate((props) => {
      window.renderComponent(props);
    }, testCase);
    
    await expect(page.locator('.component')).toHaveClass(testCase.expectedClass);
  }
});
```

### 3. **Component Event Testing**
```javascript
test('component should emit events correctly', async ({ page }) => {
  await page.goto('/components/TaskCard.html');
  
  // Listen for custom events
  const eventPromise = page.evaluate(() => {
    return new Promise(resolve => {
      document.addEventListener('taskCompleted', (e) => {
        resolve(e.detail);
      });
    });
  });
  
  await page.click('button:has-text("Complete")');
  const eventData = await eventPromise;
  
  expect(eventData.taskId).toBe(1);
});
```

## Benefits of Component Testing

### 1. **Isolation**
- Tests one thing at a time
- Easier to identify what's broken
- No dependencies on other parts of the app

### 2. **Speed**
- Faster than full E2E tests
- No need to load entire application
- Quick feedback during development

### 3. **Edge Cases**
- Easy to test unusual scenarios
- Can mock any data combination
- Test error conditions safely

### 4. **Reusability**
- Components tested once work everywhere
- Confidence when reusing components
- Regression protection

## Running Component Tests

```bash
# Run all component tests
npx playwright test tests/components.spec.ts

# Run a specific component test
npx playwright test tests/components.spec.ts -g "TaskCard"

# Run in headed mode to see components
npx playwright test tests/components.spec.ts --headed

# Debug component behavior
npx playwright test tests/components.spec.ts --debug
```

## Best Practices for Component Testing

### 1. **Test Component Interface**
- Focus on inputs (props) and outputs (rendered HTML, events)
- Don't test internal implementation details
- Test the component's public API

### 2. **Use Realistic Data**
- Test with data similar to production
- Include edge cases (empty strings, null values)
- Test boundary conditions

### 3. **Test User Interactions**
- Click buttons, fill forms, hover elements
- Verify the component responds correctly
- Test keyboard navigation and accessibility

### 4. **Keep Tests Simple**
- One concept per test
- Clear test names that describe what's being tested
- Minimal setup and teardown

### 5. **Mock External Dependencies**
- Don't rely on APIs or databases
- Mock complex dependencies
- Focus on the component's behavior

Component testing bridges the gap between unit tests (testing individual functions) and E2E tests (testing entire user flows). It provides confidence that your UI components work correctly in isolation, making your overall test suite more robust and maintainable. 