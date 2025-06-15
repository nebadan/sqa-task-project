# Playwright Configuration Explained (`playwright.config.ts`)

The Playwright configuration file controls how your tests run, which browsers to use, and various testing settings. This file is the control center for your entire test suite.

## File Structure Breakdown

### 1. Imports
```typescript
import { defineConfig, devices } from '@playwright/test';
```
**What this does:**
- `defineConfig`: Function that provides TypeScript support and validation for the config
- `devices`: Pre-configured settings for different browsers and devices
- These come from the Playwright library

### 2. Configuration Export
```typescript
export default defineConfig({
```
**What this does:**
- Exports the configuration object that Playwright will use
- `defineConfig()` wraps our settings and provides type checking

## Basic Configuration Settings

### 1. Test Directory
```typescript
testDir: './tests',
```
**What this does:**
- Tells Playwright where to find your test files
- All `.spec.ts` files in the `./tests` folder will be discovered and run
- **Can be changed**: You could use `./e2e` or `./playwright-tests` instead

### 2. Parallel Execution
```typescript
fullyParallel: true,
```
**What this does:**
- Runs tests in parallel across multiple workers (processes)
- **Faster execution**: Tests run simultaneously instead of one-by-one
- **Isolation**: Each test gets its own browser context
- **Trade-off**: Uses more system resources but completes faster

### 3. Test Failure Behavior
```typescript
forbidOnly: !!process.env.CI,
```
**What this does:**
- `test.only()` runs just one test (useful during development)
- `!!process.env.CI`: Converts CI environment variable to boolean
- **In CI**: Fails the build if someone accidentally left `test.only()`
- **Locally**: Allows `test.only()` for debugging

### 4. Retry Configuration
```typescript
retries: process.env.CI ? 2 : 0,
```
**What this does:**
- **In CI**: Retries failed tests up to 2 times (flaky test protection)
- **Locally**: No retries (0) for faster feedback during development
- **Why different**: CI environments can be less stable than local development

### 5. Worker Configuration
```typescript
workers: process.env.CI ? 1 : undefined,
```
**What this does:**
- **In CI**: Uses 1 worker (sequential execution)
- **Locally**: Uses default (usually CPU cores / 2)
- **Why limit in CI**: CI environments often have limited resources

## Reporter Configuration

### 1. Reporter Settings
```typescript
reporter: [
  ['html'],
  ['list']
],
```
**What this does:**
- **html**: Generates an interactive HTML report with screenshots and videos
- **list**: Shows test results in the terminal as they run
- **Multiple reporters**: You can use several at once

### 2. Other Reporter Options
```typescript
// Other available reporters:
reporter: [
  ['json', { outputFile: 'test-results.json' }],  // JSON output
  ['junit', { outputFile: 'results.xml' }],       // JUnit XML
  ['github'],                                      // GitHub Actions integration
  ['dot'],                                         // Minimal dot output
  ['line']                                         // One line per test
],
```

## Global Test Settings

### 1. Base URL
```typescript
use: {
  baseURL: 'http://localhost:5173',
```
**What this does:**
- Sets the default URL for all tests
- `page.goto('/login')` becomes `page.goto('http://localhost:5173/login')`
- **Convenience**: No need to repeat the full URL in every test

### 2. Tracing
```typescript
trace: 'on-first-retry',
```
**What this does:**
- Records detailed execution traces for debugging
- **on-first-retry**: Only records traces when a test fails and retries
- **Other options**: `'on'`, `'off'`, `'retain-on-failure'`
- **Traces include**: Screenshots, network requests, console logs, DOM snapshots

### 3. Screenshots
```typescript
screenshot: 'only-on-failure',
```
**What this does:**
- Takes screenshots when tests fail
- **Other options**: `'on'`, `'off'`
- **Helpful for debugging**: See exactly what the page looked like when it failed

### 4. Video Recording
```typescript
video: 'retain-on-failure',
```
**What this does:**
- Records video of test execution
- **retain-on-failure**: Keeps videos only for failed tests
- **Other options**: `'on'`, `'off'`
- **Storage consideration**: Videos take up disk space

## Browser Projects Configuration

### 1. Chromium Project
```typescript
{
  name: 'chromium',
  use: { ...devices['Desktop Chrome'] },
},
```
**What this does:**
- Defines a test project that runs on Chromium (Chrome/Edge engine)
- `devices['Desktop Chrome']`: Pre-configured settings for Chrome
- **Includes**: Viewport size, user agent, device capabilities

### 2. Firefox Project
```typescript
{
  name: 'firefox',
  use: { ...devices['Desktop Firefox'] },
},
```
**What this does:**
- Runs tests on Firefox browser
- Uses Firefox-specific settings and capabilities
- **Cross-browser testing**: Ensures your app works in different browsers

### 3. WebKit Project
```typescript
{
  name: 'webkit',
  use: { ...devices['Desktop Safari'] },
},
```
**What this does:**
- Runs tests on WebKit (Safari engine)
- **Important for Mac/iOS users**: Safari has different behavior than Chrome/Firefox

### 4. Mobile Chrome Project
```typescript
{
  name: 'Mobile Chrome',
  use: { ...devices['Pixel 5'] },
},
```
**What this does:**
- Simulates mobile Chrome on a Pixel 5 device
- **Mobile testing**: Different viewport size, touch interactions
- **Responsive design**: Ensures your app works on mobile devices

## Web Server Configuration

### 1. Development Server
```typescript
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:5173',
  reuseExistingServer: !process.env.CI,
},
```
**What this does:**
- **command**: Starts your development server before running tests
- **url**: The URL where your app will be available
- **reuseExistingServer**: 
  - **Locally**: Uses existing server if already running (faster)
  - **In CI**: Always starts fresh server (more reliable)

## Advanced Configuration Options

### 1. Global Setup/Teardown
```typescript
globalSetup: require.resolve('./global-setup'),
globalTeardown: require.resolve('./global-teardown'),
```
**What this does:**
- Runs setup code once before all tests
- Runs teardown code once after all tests
- **Use cases**: Database seeding, authentication tokens, cleanup

### 2. Test Timeout
```typescript
use: {
  actionTimeout: 10000,    // 10 seconds for actions
  navigationTimeout: 30000, // 30 seconds for page loads
},
```
**What this does:**
- Sets maximum time to wait for actions
- Prevents tests from hanging indefinitely
- **Adjust based on your app**: Slow apps need longer timeouts

### 3. Browser Context Options
```typescript
use: {
  viewport: { width: 1280, height: 720 },
  ignoreHTTPSErrors: true,
  permissions: ['geolocation'],
  geolocation: { latitude: 41.8781, longitude: -87.6298 },
},
```
**What this does:**
- **viewport**: Sets browser window size
- **ignoreHTTPSErrors**: Useful for testing with self-signed certificates
- **permissions**: Grants browser permissions
- **geolocation**: Sets fake location for testing

### 4. Network Interception
```typescript
use: {
  extraHTTPHeaders: {
    'Authorization': 'Bearer token123'
  },
  httpCredentials: {
    username: 'user',
    password: 'pass'
  },
},
```

## Running Tests with Different Configurations

### 1. All Projects
```bash
npx playwright test
```
**What this does:**
- Runs tests on all configured browsers (chromium, firefox, webkit, mobile)

### 2. Specific Project
```bash
npx playwright test --project=chromium
```
**What this does:**
- Runs tests only on Chromium browser

### 3. Multiple Projects
```bash
npx playwright test --project=chromium --project=firefox
```
**What this does:**
- Runs tests on both Chromium and Firefox

### 4. Headed Mode
```bash
npx playwright test --headed
```
**What this does:**
- Shows browser windows during test execution
- Useful for debugging and development

## Configuration Best Practices

### 1. **Environment-Specific Settings**
```typescript
const config = {
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
  }
};
```

### 2. **Conditional Projects**
```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  // Only run mobile tests in CI
  ...(process.env.CI ? [
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } }
  ] : [])
],
```

### 3. **Test Organization**
```typescript
projects: [
  {
    name: 'auth-tests',
    testMatch: '**/auth.spec.ts',
    use: { ...devices['Desktop Chrome'] }
  },
  {
    name: 'visual-tests', 
    testMatch: '**/visual.spec.ts',
    use: { ...devices['Desktop Chrome'] }
  }
],
```

## Common Configuration Patterns

### 1. **API Testing Setup**
```typescript
{
  name: 'api-tests',
  testMatch: '**/api.spec.ts',
  use: {
    baseURL: 'https://api.example.com',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    }
  }
}
```

### 2. **Visual Testing Optimization**
```typescript
{
  name: 'visual-tests',
  testMatch: '**/visual.spec.ts',
  use: {
    ...devices['Desktop Chrome'],
    // Disable animations for consistent screenshots
    reducedMotion: 'reduce'
  }
}
```

The configuration file is powerful and flexible. Start with the basics and add more advanced features as your testing needs grow. The key is to balance thorough testing with reasonable execution time and resource usage. 