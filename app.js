let currentUser = null;
let currentServer = null;
let currentChannel = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check auth
    currentUser = Storage.getCurrentUser();
    if (!currentUser && window.location.pathname.includes('app.html')) {
        window.location.href = 'index.html';
        return;
    }
    
    // Init UI
    initUserInterface();
    loadServers();
    renderFriends();
    
    // Event listeners
    document.getElementById('friendSearch')?.addEventListener('input', searchFriends);
});

function initUserInterface() {
    if (!currentUser) return;
    
    // Update user info
    document.getElementById('userName').textContent = currentUser.username;
    document.getElementById('userStatus').textContent = `#${currentUser.tag}`;
    document.getElementById('userAvatarText').textContent = currentUser.username[0].toUpperCase();
    document.getElementById('userAvatar').style.background = getUserColor(currentUser.username);
}

function getUserColor(username) {
    const colors = ['#5865F2', '#EB459E', '#3BA55D', '#FAA61A', '#ED4245', '#9B59B6', '#1ABC9C'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function goHome() {
    currentServer = null;
    currentChannel = null;
    
    // Update UI
    document.querySelectorAll('.server-item').forEach(el => el.classList.remove('active'));
    document.querySelector('.server-item.home').classList.add('active');
    
    document.getElementById('currentServerName').textContent = t('appName');
    document.getElementById('channelContent').innerHTML = `
        <div class="friends-nav">
            <div class="search-bar">
                <input type="text" placeholder="${t('search')}" id="friendSearch" oninput="searchFriends()">
            </div>
            <div class="friends-tabs">
                <button class="tab active" onclick="switchTab('all')">${t('all')}</button>
                <button class="tab" onclick="switchTab('online')">${t('online')}</button>
                <button class="tab" onclick="switchTab('pending')">${t('pending')}</button>
                <button class="tab" onclick="switchTab('blocked')">${t('blocked')}</button>
                <button class="tab add-friend-tab" onclick="showAddFriend()">+ ${t('addFriend')}</button>
            </div>
            <div class="friends-list" id="friendsList"></div>
        </div>
    `;
    
    document.getElementById('chatContainer').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'flex';
    document.getElementById('membersSidebar').style.display = 'none';
    
    renderFriends();
}

function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Global functions for onclick handlers
window.goHome = goHome;
window.showToast = showToast;
window.closeModal = closeModal;
window.getUserColor = getUserColor;