# Task Management App Testing Guide

This guide explains how to run, debug, and extend the Playwright tests for the Task Management application.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test files
```bash
npx playwright test tests/auth.spec.ts
```

## Test Structure

The test suite is organized into several files:

1. `auth.spec.ts` - Authentication and authorization tests
   - Login functionality
   - Role-based access control
   - Protected route handling

2. `tasks.spec.ts` - Task management tests
   - CRUD operations
   - Task status updates
   - Task list management

3. `visual.spec.ts` - Visual regression tests
   - Page layout snapshots
   - Component appearance
   - Responsive design verification

4. `components.spec.ts` - Component-level tests
   - Individual component rendering
   - Component interaction
   - Form validation

## Writing New Tests

### Test File Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code
  });

  test('should do something specific', async ({ page }) => {
    // Test steps
    await page.goto('/some-path');
    await page.fill('[data-testid="input"]', 'value');
    await page.click('[data-testid="button"]');
    
    // Assertions
    await expect(page.locator('[data-testid="result"]')).toBeVisible();
  });
});
```

### Best Practices

1. **Use data-testid attributes**
   - Add `data-testid` attributes to elements you want to test
   - Example: `<button data-testid="save-button">Save</button>`

2. **Isolate tests**
   - Each test should be independent
   - Use `beforeEach` for common setup
   - Clean up after tests

3. **Write descriptive test names**
   - Use "should" statements
   - Be specific about the expected behavior

4. **Handle async operations**
   - Use `await` for all page interactions
   - Wait for elements to be ready before interacting

## Debugging Tests

1. **Using UI Mode**
   - Run `npm run test:ui`
   - Step through tests
   - View test traces
   - Inspect page state

2. **Using Debug Mode**
   - Run `npm run test:debug`
   - Use browser dev tools
   - Set breakpoints in test code

3. **Viewing Test Reports**
   - HTML reports are generated in `playwright-report/`
   - Screenshots are saved in `test-results/`

## Visual Regression Testing

1. **Taking Screenshots**
   ```typescript
   await expect(page).toHaveScreenshot('screenshot-name.png');
   ```

2. **Updating Screenshots**
   ```bash
   npx playwright test --update-snapshots
   ```

## Cross-Browser Testing

Tests run on:
- Chromium
- Firefox
- WebKit
- Mobile Chrome (iPhone 12 viewport)

To run tests on specific browsers:
```bash
npx playwright test --project=chromium
```

## Continuous Integration

The test suite is configured to run in CI environments:
- Uses CI-specific settings in `playwright.config.ts`
- Runs in headless mode
- Generates HTML reports
- Takes screenshots on failure

## Troubleshooting

Common issues and solutions:

1. **Tests failing in CI but passing locally**
   - Check viewport settings
   - Verify timing issues
   - Ensure proper cleanup

2. **Screenshot mismatches**
   - Run with `--update-snapshots` to update
   - Check for dynamic content
   - Verify viewport consistency

3. **Slow tests**
   - Use `test.describe.parallel()`
   - Optimize selectors
   - Reduce unnecessary waits

## Extending the Test Suite

1. **Adding New Test Files**
   - Create new `.spec.ts` file in `tests/` directory
   - Follow existing test patterns
   - Add to appropriate test group

2. **Adding New Test Cases**
   - Identify test scenarios
   - Write test steps
   - Add assertions
   - Update documentation

3. **Adding New Components**
   - Create component test file
   - Test rendering
   - Test interactions
   - Test edge cases 