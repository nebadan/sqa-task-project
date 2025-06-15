# Playwright Testing Guide - Basics

## What is Playwright?

Playwright is a modern end-to-end testing framework that allows you to test web applications across different browsers (Chromium, Firefox, Safari/WebKit) and devices. It can simulate real user interactions like clicking buttons, filling forms, and navigating pages.

## Key Concepts

### 1. **Test Runner**
Playwright comes with its own test runner that executes your tests and provides detailed reports.

### 2. **Browser Context**
Each test runs in an isolated browser context (like an incognito window) to ensure tests don't interfere with each other.

### 3. **Page Object**
Represents a web page in the browser. You use this to interact with elements on the page.

### 4. **Locators**
Ways to find elements on a page (by ID, class, text content, etc.).

### 5. **Assertions**
Statements that verify expected behavior (e.g., "this button should be visible").

## Basic Playwright Commands

### Installation Commands
```bash
# Install Playwright
npm install @playwright/test

# Install browsers
npx playwright install

# Run all tests
npx playwright test

# Run tests in a specific file
npx playwright test tests/auth.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run tests in UI mode (interactive)
npx playwright test --ui

# Update visual snapshots
npx playwright test --update-snapshots

# Run tests on specific browser
npx playwright test --project=chromium

# Generate test report
npx playwright show-report
```

### Common Test Structure
```javascript
import { test, expect } from '@playwright/test';

test('test name', async ({ page }) => {
  // Navigate to page
  await page.goto('http://localhost:3000');
  
  // Interact with elements
  await page.click('button');
  await page.fill('input', 'text');
  
  // Make assertions
  await expect(page.locator('h1')).toBeVisible();
});
```

## Common Locator Strategies

```javascript
// By data-testid (recommended)
page.locator('[data-testid="login-button"]')

// By text content
page.locator('text=Login')

// By CSS selector
page.locator('.login-form')

// By ID
page.locator('#login-form')

// By role
page.getByRole('button', { name: 'Login' })

// By placeholder
page.getByPlaceholder('Enter email')

// By label
page.getByLabel('Email')
```

## Common Actions

```javascript
// Navigation
await page.goto('/login');

// Clicking
await page.click('[data-testid="button"]');

// Typing
await page.fill('[data-testid="input"]', 'text');
await page.type('[data-testid="input"]', 'text'); // Types character by character

// Waiting
await page.waitForSelector('[data-testid="element"]');
await page.waitForTimeout(1000); // Wait 1 second

// Screenshots
await page.screenshot({ path: 'screenshot.png' });
```

## Common Assertions

```javascript
// Visibility
await expect(page.locator('[data-testid="element"]')).toBeVisible();
await expect(page.locator('[data-testid="element"]')).not.toBeVisible();

// Text content
await expect(page.locator('[data-testid="element"]')).toHaveText('Expected text');
await expect(page.locator('[data-testid="element"]')).toContainText('Partial text');

// URL
await expect(page).toHaveURL('/dashboard');

// Attributes
await expect(page.locator('[data-testid="element"]')).toHaveClass('active');
await expect(page.locator('[data-testid="element"]')).toHaveAttribute('disabled');

// Count
await expect(page.locator('.task-item')).toHaveCount(3);
```

Now let's dive into each test file to see these concepts in action! 