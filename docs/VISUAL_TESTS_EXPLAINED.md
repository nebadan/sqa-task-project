# Visual Regression Tests Explained (`tests/visual.spec.ts`)

Visual regression testing compares screenshots of your application to detect unintended visual changes. This is crucial for maintaining consistent UI appearance across different browsers and updates.

## What is Visual Regression Testing?

Visual regression testing takes screenshots of your application and compares them to previously approved "baseline" images. If there are differences, the test fails, alerting you to potential visual bugs.

**Use cases:**
- Detect CSS changes that break layout
- Ensure consistent appearance across browsers
- Catch visual bugs that functional tests might miss
- Verify responsive design works correctly

## File Structure Breakdown

### 1. Imports
```javascript
import { test, expect } from '@playwright/test';
```
**What this does:**
- Same imports as other test files
- Playwright's visual testing uses the same framework

### 2. Test Suite Declaration
```javascript
test.describe('Visual Regression Tests', () => {
```
**What this does:**
- Groups all visual tests together
- Helps organize test output

### 3. Setup Before Each Test
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
});
```
**What this does:**
- Clears browser storage before each test
- Ensures consistent starting state for visual comparisons
- **Why important**: Leftover data could affect visual appearance

## Individual Visual Tests Explained

### Test 1: Login Page Screenshot
```javascript
test('login page should match visual baseline', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveScreenshot('login-page.png');
});
```
**What this does:**
- Navigates to the login page
- Takes a full-page screenshot
- Compares it to the baseline image `login-page.png`
- **First run**: Creates the baseline image
- **Subsequent runs**: Compares against the baseline

### Test 2: Dashboard After Login
```javascript
test('dashboard should match visual baseline after login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'user@test.com');
  await page.fill('[data-testid="password-input"]', 'user123');
  await page.click('[data-testid="login-button"]');
  
  await expect(page).toHaveScreenshot('dashboard-logged-in.png');
});
```
**What this does:**
- Performs a complete login flow
- Takes a screenshot of the dashboard
- **Why login first**: Dashboard looks different when authenticated
- Captures the "logged in" state of the application

### Test 3: Task Creation Modal
```javascript
test('task creation modal should match visual baseline', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'user@test.com');
  await page.fill('[data-testid="password-input"]', 'user123');
  await page.click('[data-testid="login-button"]');
  
  // Open task creation modal
  await page.click('[data-testid="new-task-button"]');
  
  await expect(page).toHaveScreenshot('task-creation-modal.png');
});
```
**What this does:**
- Logs in to access task features
- Opens the task creation modal
- Screenshots the modal state
- **Why useful**: Modals are common UI components that can break visually

### Test 4: Admin Page (Admin User)
```javascript
test('admin page should match visual baseline', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'admin@test.com');
  await page.fill('[data-testid="password-input"]', 'admin123');
  await page.click('[data-testid="login-button"]');
  
  await page.goto('/admin');
  await expect(page).toHaveScreenshot('admin-page.png');
});
```
**What this does:**
- Logs in as an admin user (different from previous tests)
- Navigates to the admin page
- Screenshots the admin interface
- **Why separate**: Admin pages often have different layouts/styling

## Advanced Visual Testing Concepts

### 1. **Screenshot Options**
```javascript
await expect(page).toHaveScreenshot('filename.png', {
  fullPage: true,        // Capture entire page, not just viewport
  animations: 'disabled', // Disable animations for consistent screenshots
  threshold: 0.2,        // Allow 20% pixel difference before failing
  maxDiffPixels: 100     // Allow up to 100 different pixels
});
```

### 2. **Element-Specific Screenshots**
```javascript
// Screenshot just a specific element
await expect(page.locator('.task-card')).toHaveScreenshot('task-card.png');
```

### 3. **Masking Dynamic Content**
```javascript
await expect(page).toHaveScreenshot('page.png', {
  mask: [page.locator('.timestamp')] // Hide elements that change frequently
});
```

## How Visual Testing Works

### 1. **First Run (Baseline Creation)**
```bash
npx playwright test tests/visual.spec.ts
```
- Creates baseline images in `test-results/` folder
- All tests pass (nothing to compare against yet)

### 2. **Subsequent Runs (Comparison)**
```bash
npx playwright test tests/visual.spec.ts
```
- Takes new screenshots
- Compares pixel-by-pixel with baselines
- Fails if differences exceed threshold

### 3. **Updating Baselines**
```bash
npx playwright test tests/visual.spec.ts --update-snapshots
```
- Updates baseline images with current screenshots
- Use when visual changes are intentional

## Cross-Browser Visual Testing

Our `playwright.config.ts` runs visual tests on multiple browsers:
- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)
- **Mobile Chrome**

Each browser creates its own baseline images because:
- Fonts render differently
- CSS support varies
- Mobile layouts differ

## Visual Test Failures

When a visual test fails, Playwright provides:

### 1. **Diff Images**
- Shows exactly what changed
- Highlights differences in red
- Helps identify the problem area

### 2. **Actual vs Expected**
- Current screenshot (actual)
- Baseline screenshot (expected)
- Difference overlay

### 3. **HTML Report**
```bash
npx playwright show-report
```
- Interactive comparison tool
- Zoom in on differences
- Accept or reject changes

## Common Visual Testing Scenarios

### 1. **Layout Changes**
```javascript
test('responsive layout on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('mobile-dashboard.png');
});
```

### 2. **Component States**
```javascript
test('button hover state', async ({ page }) => {
  await page.goto('/login');
  await page.hover('[data-testid="login-button"]');
  await expect(page).toHaveScreenshot('button-hover.png');
});
```

### 3. **Error States**
```javascript
test('form validation errors', async ({ page }) => {
  await page.goto('/login');
  await page.click('[data-testid="login-button"]'); // Submit empty form
  await expect(page).toHaveScreenshot('validation-errors.png');
});
```

## Best Practices for Visual Testing

### 1. **Stable Test Data**
- Use consistent test data
- Avoid timestamps or random content
- Mock dynamic content when possible

### 2. **Wait for Stability**
```javascript
// Wait for animations to complete
await page.waitForTimeout(500);
await expect(page).toHaveScreenshot();
```

### 3. **Meaningful Test Names**
- Use descriptive screenshot filenames
- Include state information (logged-in, mobile, etc.)

### 4. **Selective Testing**
- Don't screenshot every page
- Focus on critical UI components
- Test different states/variations

## Running Visual Tests

```bash
# Run all visual tests
npx playwright test tests/visual.spec.ts

# Run on specific browser
npx playwright test tests/visual.spec.ts --project=chromium

# Update all baselines
npx playwright test tests/visual.spec.ts --update-snapshots

# Run in headed mode to see what's happening
npx playwright test tests/visual.spec.ts --headed

# Generate HTML report with visual diffs
npx playwright test tests/visual.spec.ts
npx playwright show-report
```

## Troubleshooting Visual Tests

### 1. **Tests Fail on First Run**
- Normal behavior - baselines don't exist yet
- Run with `--update-snapshots` to create baselines

### 2. **Tests Fail After Code Changes**
- Review the diff images in the HTML report
- If changes are intentional, update baselines
- If unintentional, fix the CSS/layout issue

### 3. **Cross-Browser Differences**
- Each browser has separate baselines
- Some differences are expected (fonts, rendering)
- Adjust threshold if minor differences are acceptable

Visual regression testing is powerful for catching UI bugs that functional tests miss. It's especially valuable for maintaining design consistency across browsers and preventing accidental layout breaks. 