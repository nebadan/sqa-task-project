// Mock data
const MOCK_USERS = {
    'admin@test.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
    'user@test.com': { password: 'user123', role: 'user', name: 'Regular User' }
};

let currentUser = null;
let tasks = [];

// DOM Elements
const loginPage = document.getElementById('login-page');
const dashboardPage = document.getElementById('dashboard-page');
const adminPage = document.getElementById('admin-page');
const loginForm = document.getElementById('login-form');
const taskList = document.getElementById('task-list');
const newTaskButton = document.getElementById('new-task-button');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const deleteModal = document.getElementById('delete-modal');
const welcomeMessage = document.getElementById('welcome-message');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
newTaskButton.addEventListener('click', () => showModal(taskModal));
taskForm.addEventListener('submit', handleTaskSubmit);
document.getElementById('cancel-task').addEventListener('click', () => hideModal(taskModal));
document.getElementById('cancel-delete').addEventListener('click', () => hideModal(deleteModal));
document.getElementById('logout-button').addEventListener('click', handleLogout);
document.getElementById('admin-logout-button').addEventListener('click', handleLogout);

// Close modals when clicking outside
taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) {
        hideModal(taskModal);
    }
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        hideModal(deleteModal);
    }
});

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (MOCK_USERS[email] && MOCK_USERS[email].password === password) {
        currentUser = {
            email,
            role: MOCK_USERS[email].role,
            name: MOCK_USERS[email].name
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Route based on role and intended destination
        const path = window.location.pathname;
        if (path === '/admin' && currentUser.role === 'admin') {
            showAdminDashboard();
        } else if (path === '/admin' && currentUser.role !== 'admin') {
            // Redirect non-admin users away from admin page
            showDashboard();
            showError('Access denied. Admin privileges required.');
        } else {
            showDashboard();
        }
    } else {
        errorMessage.textContent = 'Invalid email or password';
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginPage();
}

function showDashboard() {
    loginPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
    adminPage.classList.add('hidden');
    welcomeMessage.textContent = `Welcome, ${currentUser.name}!`;
    loadTasks();
    // Update URL without page reload
    window.history.pushState({}, '', '/dashboard');
}

function showAdminDashboard() {
    loginPage.classList.add('hidden');
    dashboardPage.classList.add('hidden');
    adminPage.classList.remove('hidden');
    loadUsers();
    // Update URL without page reload
    window.history.pushState({}, '', '/admin');
}

function showLoginPage() {
    loginPage.classList.remove('hidden');
    dashboardPage.classList.add('hidden');
    adminPage.classList.add('hidden');
    loginForm.reset();
    document.getElementById('error-message').textContent = '';
    // Update URL without page reload
    window.history.pushState({}, '', '/login');
}

// Task Management Functions
function handleTaskSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-description').value.trim();
    const dueDate = document.getElementById('task-due-date').value;

    // Clear previous errors
    document.querySelector('[data-testid="title-error"]').textContent = '';
    document.querySelector('[data-testid="description-error"]').textContent = '';

    // Validate form
    let hasErrors = false;
    if (!title) {
        document.querySelector('[data-testid="title-error"]').textContent = 'Title is required';
        hasErrors = true;
    }
    if (!description) {
        document.querySelector('[data-testid="description-error"]').textContent = 'Description is required';
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }

    const editingTaskId = taskForm.dataset.editingTaskId;
    
    if (editingTaskId) {
        // Edit existing task
        const task = tasks.find(t => t.id === editingTaskId);
        if (task) {
            task.title = title;
            task.description = description;
            task.dueDate = dueDate;
        }
        delete taskForm.dataset.editingTaskId;
    } else {
        // Create new task
        const task = {
            id: Date.now().toString(),
            title,
            description,
            dueDate,
            status: 'pending',
            userId: currentUser.email
        };
        tasks.push(task);
    }

    saveTasks();
    renderTasks();
    hideModal(taskModal);
    taskForm.reset();
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    const userTasks = tasks.filter(task => task.userId === currentUser.email);

    userTasks.forEach(task => {
        const taskCard = createTaskCard(task);
        taskList.appendChild(taskCard);
    });
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.status === 'completed' ? 'completed' : ''}`;
    card.setAttribute('data-testid', `task-card-${task.title}`);

    card.innerHTML = `
        <h3 class="task-title" data-testid="task-title">${task.title}</h3>
        <p class="task-description">${task.description}</p>
        <div class="task-meta">
            <span>Due: ${new Date(task.dueDate).toLocaleDateString()}</span>
            <span class="task-status" data-testid="task-status-${task.title}">${task.status}</span>
        </div>
        <div class="task-actions">
            <button onclick="editTask('${task.id}')" data-testid="edit-task-${task.id}">Edit</button>
            <button onclick="deleteTask('${task.id}')" data-testid="delete-task-${task.id}">Delete</button>
            ${task.status === 'pending' ? 
                `<button onclick="completeTask('${task.id}')" data-testid="complete-task-${task.id}">Complete</button>` : 
                ''}
        </div>
    `;

    return card;
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-due-date').value = task.dueDate;
        showModal(taskModal);
        
        // Store the task ID for editing
        taskForm.dataset.editingTaskId = taskId;
    }
}

function deleteTask(taskId) {
    showModal(deleteModal);
    document.getElementById('confirm-delete').onclick = () => {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
        hideModal(deleteModal);
    };
}

function completeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'completed';
        saveTasks();
        renderTasks();
    }
}

// UI Helper Functions
function showModal(modal) {
    modal.classList.remove('hidden');
}

function hideModal(modal) {
    modal.classList.add('hidden');
}

function showError(message) {
    // Remove any existing error messages first
    const existingErrors = document.querySelectorAll('.floating-error-message');
    existingErrors.forEach(error => error.remove());
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'floating-error-message';
    errorDiv.setAttribute('data-testid', 'error-message');
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #e74c3c; color: white; padding: 1rem; border-radius: 4px; z-index: 1000;';
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
        }
    }, 3000);
}

// User Management Functions
function loadUsers() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    Object.entries(MOCK_USERS).forEach(([email, user]) => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.innerHTML = `
            <span>${user.name} (${email})</span>
            <span>Role: ${user.role}</span>
        `;
        userList.appendChild(userItem);
    });
}

// Routing and access control
function handleRouting() {
    const path = window.location.pathname;
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        
        switch (path) {
            case '/admin':
                if (currentUser.role === 'admin') {
                    showAdminDashboard();
                } else {
                    showDashboard();
                    showError('Access denied. Admin privileges required.');
                }
                break;
            case '/dashboard':
                showDashboard();
                break;
            case '/login':
                if (currentUser.role === 'admin') {
                    showAdminDashboard();
                } else {
                    showDashboard();
                }
                break;
            default:
                showDashboard();
                break;
        }
    } else {
        // Not authenticated - redirect to login for protected routes
        if (path === '/dashboard' || path === '/admin') {
            showLoginPage();
        } else {
            showLoginPage();
        }
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', handleRouting);

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // Ensure modals are hidden on page load
    hideModal(taskModal);
    hideModal(deleteModal);
    handleRouting();
}); 