# Authentication Tests Explained (`tests/auth.spec.ts`)

This file tests the login system and access control of our task management application.

## File Structure Breakdown

### 1. Imports
```javascript
import { test, expect } from '@playwright/test';
```
**What this does:**
- `test`: Function to define individual test cases
- `expect`: Function to make assertions (check if something is true)
- These come from the Playwright testing library

### 2. Mock Data
```javascript
const MOCK_USERS = {
  admin: { email: 'admin@test.com', password: 'admin123', role: 'admin' },
  user: { email: 'user@test.com', password: 'user123', role: 'user' },
};
```
**What this does:**
- Creates fake user data for testing
- We have two users: an admin and a regular user
- This data matches what's in our application's `app.js` file

### 3. Test Suite Declaration
```javascript
test.describe('Authentication Tests', () => {
```
**What this does:**
- Groups related tests together
- `test.describe()` creates a test suite (collection of tests)
- All authentication-related tests will be inside this block

### 4. Setup Before Each Test
```javascript
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
```
**What this does:**
- `test.beforeEach()`: Runs before every individual test
- `page.evaluate()`: Runs JavaScript code in the browser
- `localStorage.clear()`: Removes any saved login information
- `try/catch`: Handles errors if localStorage isn't available (mobile browsers)
- **Why needed**: Ensures each test starts fresh without previous login data

## Individual Tests Explained

### Test 1: Valid Login
```javascript
test('should login with valid credentials', async ({ page }) => {
```
**What this does:**
- Defines a test case with a descriptive name
- `async ({ page })`: Gets a browser page to interact with

```javascript
await page.goto('/login');
```
**What this does:**
- Navigates to the login page
- `await`: Waits for the navigation to complete

```javascript
await page.fill('[data-testid="email-input"]', MOCK_USERS.user.email);
await page.fill('[data-testid="password-input"]', MOCK_USERS.user.password);
```
**What this does:**
- `page.fill()`: Types text into input fields
- `[data-testid="email-input"]`: Finds the email input by its test ID
- Uses the mock user's email and password

```javascript
await page.click('[data-testid="login-button"]');
```
**What this does:**
- Clicks the login button
- Triggers the login process

```javascript
await expect(page).toHaveURL('/dashboard');
```
**What this does:**
- Checks that the page URL changed to `/dashboard`
- This confirms the login was successful

### Test 2: Invalid Login
```javascript
test('should show error with invalid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'wrong@test.com');
  await page.fill('[data-testid="password-input"]', 'wrongpass');
  await page.click('[data-testid="login-button"]');
  
  await expect(page.locator('#error-message[data-testid="error-message"]')).toBeVisible();
  await expect(page).toHaveURL('/login');
});
```
**What this does:**
- Tests what happens with wrong credentials
- Fills in incorrect email and password
- Checks that an error message appears
- Verifies we stay on the login page (no redirect)

### Test 3: Redirect Unauthenticated Users
```javascript
test('should redirect unauthenticated users from protected pages', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login');
});
```
**What this does:**
- Tries to access a protected page without logging in
- Verifies that we get redirected to the login page
- Tests the security of our application

### Test 4: Admin Access
```javascript
test('should allow admin access to admin page', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', MOCK_USERS.admin.email);
  await page.fill('[data-testid="password-input"]', MOCK_USERS.admin.password);
  await page.click('[data-testid="login-button"]');
  
  await page.goto('/admin');
  await expect(page).toHaveURL('/admin');
});
```
**What this does:**
- Logs in as an admin user
- Tries to access the admin page
- Verifies that admin users can access admin features

### Test 5: Block Regular Users from Admin
```javascript
test('should prevent regular users from accessing admin page', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', MOCK_USERS.user.email);
  await page.fill('[data-testid="password-input"]', MOCK_USERS.user.password);
  await page.click('[data-testid="login-button"]');
  
  await page.goto('/admin');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('.floating-error-message[data-testid="error-message"]')).toBeVisible();
});
```
**What this does:**
- Logs in as a regular user
- Tries to access the admin page
- Verifies that regular users get redirected to dashboard
- Checks that an error message is shown

## Key Testing Concepts Demonstrated

### 1. **Test Isolation**
Each test starts fresh with `beforeEach` clearing localStorage.

### 2. **User Flows**
Tests simulate real user actions: navigate → fill forms → click buttons → verify results.

### 3. **Security Testing**
Tests verify that unauthorized users can't access protected areas.

### 4. **Error Handling**
Tests check that appropriate error messages are shown.

### 5. **Role-Based Access**
Tests verify different user roles have different permissions.

## Running These Tests

```bash
# Run all auth tests
npx playwright test tests/auth.spec.ts

# Run a specific test
npx playwright test tests/auth.spec.ts -g "should login with valid credentials"

# Run in headed mode to see the browser
npx playwright test tests/auth.spec.ts --headed

# Debug mode (pauses execution)
npx playwright test tests/auth.spec.ts --debug
```

## Common Patterns in These Tests

1. **Arrange**: Set up test data and navigate to page
2. **Act**: Perform user actions (fill forms, click buttons)
3. **Assert**: Verify expected outcomes (URL changes, elements visible)

This pattern is called **AAA (Arrange, Act, Assert)** and is fundamental to good testing. 