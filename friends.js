let friends = [];
let currentTab = 'all';

function renderFriends() {
    if (!currentUser) return;
    
    friends = Storage.getFriends(currentUser.id);
    const container = document.getElementById('friendsList');
    
    if (!container) return;
    
    if (friends.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">👋</div>
                <h3>${t('noFriends')}</h3>
                <p>${t('addFriendPrompt')}</p>
            </div>
        `;
        return;
    }
    
    let filteredFriends = friends;
    if (currentTab === 'online') {
        filteredFriends = friends.filter(f => f.status === 'online');
    } else if (currentTab === 'pending') {
        filteredFriends = friends.filter(f => f.status === 'pending');
    }
    
    container.innerHTML = filteredFriends.map(friend => `
        <div class="friend-item" onclick="showUserProfile('${friend.username}')">
            <div class="friend-avatar ${friend.status === 'offline' ? 'offline' : ''}" 
                 style="background: ${getUserColor(friend.username)};">
                ${friend.username[0].toUpperCase()}
            </div>
            <div class="friend-info">
                <div class="friend-name">${friend.username}</div>
                <div class="friend-status">
                    ${friend.status === 'online' 
                        ? (friend.activity ? `${t('playing')} ${friend.activity}` : t('online'))
                        : t('offline')}
                </div>
            </div>
            <div class="friend-actions">
                <button class="action-btn" onclick="event.stopPropagation(); sendMessageTo('${friend.username}')" title="${t('sendMessage')}">💬</button>
                <button class="action-btn" onclick="event.stopPropagation(); removeFriend('${friend.username}')" title="${t('remove')}">🗑️</button>
            </div>
        </div>
    `).join('');
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.friends-tabs .tab').forEach(el => {
        el.classList.remove('active');
        if (el.textContent.toLowerCase().includes(tab) || 
            (tab === 'all' && el.textContent === t('all'))) {
            el.classList.add('active');
        }
    });
    renderFriends();
}

function showAddFriend() {
    document.getElementById('addFriendModal').classList.add('active');
    document.getElementById('friendInput').value = '';
    document.getElementById('friendInput').focus();
}

function sendFriendRequest() {
    const input = document.getElementById('friendInput');
    const value = input.value.trim();
    
    if (!value.includes('#')) {
        showToast('Format: username#0000');
        return;
    }
    
    const [username, tag] = value.split('#');
    
    // Check if already friends
    if (friends.find(f => f.username === username)) {
        showToast('Already friends!');
        return;
    }
    
    const newFriend = {
        username: username,
        tag: tag,
        status: 'offline',
        activity: '',
        addedAt: new Date().toISOString()
    };
    
    Storage.addFriend(currentUser.id, newFriend);
    friends = Storage.getFriends(currentUser.id);
    
    renderFriends();
    closeModal('addFriendModal');
    showToast(`${username} ${t('friendAdded')}`);
    
    // Simulate friend coming online after random time
    setTimeout(() => {
        updateFriendStatus(username, 'online', 'LoL');
    }, 5000 + Math.random() * 10000);
}

function removeFriend(username) {
    if (confirm(`Remove ${username} from friends?`)) {
        Storage.removeFriend(currentUser.id, username);
        friends = Storage.getFriends(currentUser.id);
        renderFriends();
        showToast(`${username} removed`);
    }
}

function updateFriendStatus(username, status, activity = '') {
    const friend = friends.find(f => f.username === username);
    if (friend) {
        friend.status = status;
        friend.activity = activity;
        Storage.saveFriends(currentUser.id, friends);
        renderFriends();
    }
}

function searchFriends() {
    const query = document.getElementById('friendSearch').value.toLowerCase();
    const items = document.querySelectorAll('.friend-item');
    
    items.forEach(item => {
        const name = item.querySelector('.friend-name').textContent.toLowerCase();
        item.style.display = name.includes(query) ? 'flex' : 'none';
    });
}

function showUserProfile(username) {
    const friend = friends.find(f => f.username === username);
    if (!friend) return;
    
    document.getElementById('profileName').textContent = friend.username;
    document.getElementById('profileHandle').textContent = `@${friend.username}#${friend.tag}`;
    document.getElementById('profileAvatar').textContent = friend.username[0].toUpperCase();
    document.getElementById('profileAvatar').style.background = getUserColor(friend.username);
    document.getElementById('profileAbout').textContent = friend.about || t('defaultAbout');
    
    document.getElementById('profileModal').classList.add('active');
}

function addFriendFromProfile() {
    closeModal('profileModal');
    showAddFriend();
}

function sendMessageTo(username) {
    showToast(`Opening DM with ${username}...`);
    // In a real app, this would open a DM channel
}

// Expose functions globally
window.switchTab = switchTab;
window.showAddFriend = showAddFriend;
window.sendFriendRequest = sendFriendRequest;
window.removeFriend = removeFriend;
window.searchFriends = searchFriends;
window.showUserProfile = showUserProfile;
window.addFriendFromProfile = addFriendFromProfile;
window.sendMessageTo = sendMessageTo;