function loadMessages(channelId) {
    const container = document.getElementById('messagesList');
    const messages = Storage.getMessages(currentServer?.id || 'default', channelId);
    
    if (messages.length === 0) {
        // Default welcome message
        const welcomeMsg = {
            id: Date.now(),
            author: 'Sistem',
            text: `${currentServer?.name || 'Sunucu'}'ya hoş geldiniz!`,
            time: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}),
            color: '#5865F2',
            system: true
        };
        Storage.addMessage(currentServer?.id || 'default', channelId, welcomeMsg);
        container.innerHTML = createMessageHTML(welcomeMsg);
    } else {
        container.innerHTML = messages.map(m => createMessageHTML(m)).join('');
    }
    
    scrollToBottom();
}

function createMessageHTML(msg) {
    if (msg.system) {
        return `
            <div class="system-message">
                <div class="system-message-content">
                    <span>${msg.text}</span>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="message" data-id="${msg.id}">
            <div class="message-avatar" style="background: ${msg.color};">
                ${msg.author[0].toUpperCase()}
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author" style="color: ${msg.color};">${msg.author}</span>
                    <span class="message-time">${msg.time}</span>
                </div>
                <div class="message-text">${escapeHtml(msg.text)}</div>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text || !currentChannel) return;
    
    const msg = {
        id: Date.now(),
        author: currentUser.username,
        text: text,
        time: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}),
        color: getUserColor(currentUser.username),
        system: false
    };
    
    Storage.addMessage(currentServer?.id || 'default', currentChannel.id, msg);
    
    const container = document.getElementById('messagesList');
    container.innerHTML += createMessageHTML(msg);
    
    input.value = '';
    scrollToBottom();
    showToast(t('messageSent'));
    
    // Simulate reply
    setTimeout(() => {
        simulateReply();
    }, 2000 + Math.random() * 3000);
}

function simulateReply() {
    if (!currentChannel) return;
    
    const replies = [
        'Harika! 🎉',
        'Anladım',
        '😂😂😂',
        'Evet, katılıyorum',
        'Tamamdır',
        'Bilmiyorum ki',
        'Çok iyi!',
        'Teşekkürler 👍'
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    const botNames = ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali'];
    const randomName = botNames[Math.floor(Math.random() * botNames.length)];
    
    const reply = {
        id: Date.now(),
        author: randomName,
        text: randomReply,
        time: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}),
        color: getUserColor(randomName),
        system: false
    };
    
    Storage.addMessage(currentServer?.id || 'default', currentChannel.id, reply);
    
    const container = document.getElementById('messagesList');
    container.innerHTML += createMessageHTML(reply);
    scrollToBottom();
}

function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function scrollToBottom() {
    const container = document.getElementById('messagesArea');
    container.scrollTop = container.scrollHeight;
}

function addAttachment() {
    showToast('Dosya yükleme yakında 📎');
}

function openEmoji() {
    showToast('Emoji seçici yakında 😊');
}

function showSearch() {
    showToast('Arama yakında 🔍');
}

function showMembers() {
    const sidebar = document.getElementById('membersSidebar');
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
}

function toggleMute() {
    showToast('Mikrofon durumu değişti 🎤');
}

function toggleDeaf() {
    showToast('Kulaklık durumu değişti 🎧');
}

function showSettings() {
    document.getElementById('settingsModal').classList.add('active');
    renderSettingsContent('account');
}

function renderSettingsContent(tab) {
    const container = document.getElementById('settingsContent');
    
    const contents = {
        account: `
            <h2>${t('myAccount')}</h2>
            <div class="settings-section">
                <div class="setting-item">
                    <label>Kullanıcı Adı</label>
                    <input type="text" value="${currentUser.username}" readonly>
                </div>
                <div class="setting-item">
                    <label>E-posta</label>
                    <input type="email" value="${currentUser.email}" readonly>
                </div>
                <div class="setting-item">
                    <label>Etiket</label>
                    <input type="text" value="#${currentUser.tag}" readonly>
                </div>
            </div>
        `,
        privacy: `
            <h2>${t('privacy')}</h2>
            <div class="settings-section">
                <div class="setting-item">
                    <label>DM İzinleri</label>
                    <select>
                        <option>Tümü</option>
                        <option>Sadece Arkadaşlar</option>
                        <option>Kapalı</option>
                    </select>
                </div>
            </div>
        `,
        notifications: `
            <h2>${t('notifications')}</h2>
            <div class="settings-section">
                <div class="setting-item">
                    <label>Mesaj Bildirimleri</label>
                    <input type="checkbox" checked>
                </div>
                <div class="setting-item">
                    <label>Ses Bildirimleri</label>
                    <input type="checkbox" checked>
                </div>
            </div>
        `,
        language: `
            <h2>${t('language')}</h2>
            <div class="settings-section">
                <div class="setting-item">
                    <label>Dil Seçimi</label>
                    <select onchange="changeLanguage(this.value)">
                        <option value="tr" ${currentLang === 'tr' ? 'selected' : ''}>🇹🇷 Türkçe</option>
                        <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                        <option value="de" ${currentLang === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
                        <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
                        <option value="es" ${currentLang === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
                        <option value="ru" ${currentLang === 'ru' ? 'selected' : ''}>🇷🇺 Русский</option>
                        <option value="ar" ${currentLang === 'ar' ? 'selected' : ''}>🇸🇦 العربية</option>
                        <option value="ja" ${currentLang === 'ja' ? 'selected' : ''}>🇯🇵 日本語</option>
                        <option value="zh" ${currentLang === 'zh' ? 'selected' : ''}>🇨🇳 中文</option>
                    </select>
                </div>
            </div>
        `,
        appearance: `
            <h2>${t('appearance')}</h2>
            <div class="settings-section">
                <div class="setting-item">
                    <label>Tema</label>
                    <select>
                        <option>Koyu</option>
                        <option>Açık</option>
                    </select>
                </div>
            </div>
        `
    };
    
    container.innerHTML = contents[tab] || contents.account;
}

function showSettingsTab(tab) {
    document.querySelectorAll('.settings-nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('button').classList.add('active');
    renderSettingsContent(tab);
}

function showProfile() {
    document.getElementById('profileName').textContent = currentUser.username;
    document.getElementById('profileHandle').textContent = `@${currentUser.username}#${currentUser.tag}`;
    document.getElementById('profileAvatar').textContent = currentUser.username[0].toUpperCase();
    document.getElementById('profileAvatar').style.background = getUserColor(currentUser.username);
    document.getElementById('profileAbout').textContent = currentUser.about || t('defaultAbout');
    document.getElementById('profileDate').textContent = new Date(currentUser.createdAt).toLocaleDateString();
    
    document.getElementById('profileModal').classList.add('active');
}

function sendMessageToProfile() {
    closeModal('profileModal');
    showToast('DM açılıyor...');
}

// Expose functions
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.addAttachment = addAttachment;
window.openEmoji = openEmoji;
window.showSearch = showSearch;
window.showMembers = showMembers;
window.toggleMute = toggleMute;
window.toggleDeaf = toggleDeaf;
window.showSettings = showSettings;
window.showSettingsTab = showSettingsTab;
window.showProfile = showProfile;
window.sendMessageToProfile = sendMessageToProfile;