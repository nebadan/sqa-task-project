# Task Management Application

A modern task management application built with HTML, CSS, and JavaScript, featuring comprehensive Playwright tests.

## Features

- User authentication (admin and regular user roles)
- Task management (create, read, update, delete)
- Task status tracking
- Responsive design
- Role-based access control
- Local storage persistence

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-mgmt
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:5173
```

## Test Accounts

The application comes with two pre-configured accounts:

1. Admin User:
   - Email: admin@test.com
   - Password: admin123

2. Regular User:
   - Email: user@test.com
   - Password: user123

## Running Tests

1. Run all tests:
```bash
npm test
```

2. Run tests with UI mode:
```bash
npm run test:ui
```

3. Run tests in debug mode:
```bash
npm run test:debug
```

For more detailed information about testing, please refer to [TESTING_GUIDE.md](TESTING_GUIDE.md).

## Project Structure

```
task-mgmt/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── app.js             # Application logic
├── tests/             # Test files
│   ├── auth.spec.ts   # Authentication tests
│   ├── tasks.spec.ts  # Task management tests
│   ├── visual.spec.ts # Visual regression tests
│   └── components.spec.ts # Component tests
├── package.json       # Project configuration
└── playwright.config.ts # Playwright configuration
```

## Features Implemented

1. **Authentication**
   - Login with email/password
   - Role-based access control
   - Session persistence using localStorage

2. **Task Management**
   - Create new tasks
   - Edit existing tasks
   - Delete tasks
   - Mark tasks as complete
   - View task details

3. **User Interface**
   - Responsive design
   - Modal dialogs
   - Form validation
   - Error handling
   - Loading states

4. **Testing**
   - End-to-end tests
   - Component tests
   - Visual regression tests
   - Cross-browser testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 