// Auth functions for index.html
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const currentUser = Storage.getCurrentUser();
    if (currentUser && window.location.pathname.includes('index.html')) {
        window.location.href = 'app.html';
        return;
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegister();
        });
    }
});

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast(t('fillAllFields'));
        return;
    }
    
    const user = Storage.getUser(email);
    if (!user || user.password !== password) {
        showToast(t('invalidCredentials'));
        return;
    }
    
    Storage.setCurrentUser(user);
    window.location.href = 'app.html';
}

function handleRegister() {
    const email = document.getElementById('registerEmail').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const password2 = document.getElementById('registerPassword2').value;
    
    if (!email || !username || !password || !password2) {
        showToast(t('fillAllFields'));
        return;
    }
    
    if (!email.includes('@')) {
        showToast(t('invalidEmail'));
        return;
    }
    
    if (password !== password2) {
        showToast(t('passwordMismatch'));
        return;
    }
    
    if (password.length < 6) {
        showToast(t('passwordShort') || 'Şifre en az 6 karakter olmalı');
        return;
    }
    
    if (Storage.getUser(email)) {
        showToast(t('userExists'));
        return;
    }
    
    const userId = Math.random().toString(36).substr(2, 9);
    const tag = Math.floor(1000 + Math.random() * 9000);
    
    const user = {
        id: userId,
        email,
        username,
        tag,
        password,
        avatar: null,
        about: '',
        status: 'online',
        createdAt: new Date().toISOString()
    };
    
    Storage.saveUser(user);
    Storage.setCurrentUser(user);
    
    // Initialize empty friends list
    Storage.saveFriends(userId, []);
    Storage.saveServers(userId, []);
    
    window.location.href = 'app.html';
}

function showRegister() {
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('registerBox').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('registerBox').classList.add('hidden');
    document.getElementById('loginBox').classList.remove('hidden');
}

// Logout function - used in app.html
function logout() {
    Storage.removeCurrentUser();
    window.location.href = 'index.html';
}

// Expose functions globally
window.showRegister = showRegister;
window.showLogin = showLogin;
window.logout = logout;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;