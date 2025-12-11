// --- DOM ELEMENTS ---
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggleRegister = document.getElementById('toggle-register');
const toggleLogin = document.getElementById('toggle-login');
const messageElement = document.getElementById('message');

// --- CONSTANTS ---
const USER_STORAGE_KEY = 'localUsersDB'; // Key for the mock user database

// --- UTILITY FUNCTIONS ---

/**
 * Loads the user database from localStorage.
 * @returns {Array} List of user objects.
 */
function loadUsers() {
    const usersJson = localStorage.getItem(USER_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
}

/**
 * Saves the user database to localStorage.
 * @param {Array} users List of user objects.
 */
function saveUsers(users) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Displays a temporary message to the user.
 * @param {string} text The message content.
 * @param {string} color The Tailwind CSS color class (e.g., 'text-red-500').
 */
function showMessage(text, color) {
    messageElement.textContent = text;
    messageElement.className = `text-center mb-4 font-medium ${color}`;
    messageElement.style.display = 'block';
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 4000);
}

// --- FORM TOGGLING ---

toggleRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden-form');
    registerForm.classList.remove('hidden-form');
    toggleRegister.classList.add('hidden');
    toggleLogin.classList.remove('hidden');
    messageElement.style.display = 'none';
});

toggleLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden-form');
    loginForm.classList.remove('hidden-form');
    toggleLogin.classList.add('hidden');
    toggleRegister.classList.remove('hidden');
    messageElement.style.display = 'none';
});


// --- REGISTRATION LOGIC ---

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const email = document.getElementById('reg-email').value.trim();
    
    if (!username || !password) {
        showMessage('Username and password are required.', 'text-red-600');
        return;
    }

    const users = loadUsers();
    
    // Check if user already exists
    if (users.find(user => user.username.toLowerCase() === username.toLowerCase())) {
        showMessage('User already exists. Please login.', 'text-yellow-600');
        return;
    }

    // Add new user (simulates writing to a file/database)
    const newUser = {
        username: username,
        password: password, // In a real app, this MUST be hashed!
        email: email,
        registrationDate: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);

    showMessage('Registration successful! You can now login.', 'text-green-600');
    
    // Automatically switch to login form
    document.getElementById('login-username').value = username;
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-email').value = '';
    toggleLogin.click();
});


// --- LOGIN LOGIC ---

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    const users = loadUsers();

    // Find user by username
    const user = users.find(
        u => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
        // User not found (simulates searching the local file and finding nothing)
        showMessage(`User '${username}' not found. Asking for registration details.`, 'text-red-600');
        
        // --- Requirement: If new user, switch to register form and pre-fill ---
        document.getElementById('reg-username').value = username;
        document.getElementById('reg-password').value = password;
        toggleRegister.click();
        return;
    }

    // Check password (simulates file check)
    if (user.password === password) {
        // --- Requirement: Redirect to index.html ---
        showMessage('Login successful!', 'text-green-600');
        // Store session data (optional, but good practice for redirect)
        sessionStorage.setItem('currentUsername', user.username);
        
        // Redirect after a slight delay to show success message
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } else {
        // --- Requirement: Show wrong username/password ---
        showMessage('Wrong password. Please try again.', 'text-red-600');
    }
});