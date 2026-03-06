let servers = [];

function loadServers() {
    if (!currentUser) return;
    
    servers = Storage.getServers(currentUser.id);
    
    // Add default servers if none exist
    if (servers.length === 0) {
        const defaultServers = [
            { id: 'genel', name: 'Genel', icon: 'G', color: '#5865F2' },
            { id: 'oyun', name: 'Oyun', icon: 'O', color: '#EB459E' },
            { id: 'muzik', name: 'Müzik', icon: 'M', color: '#3BA55D' }
        ];
        
        defaultServers.forEach(server => {
            Storage.addServer(currentUser.id, server);
        });
        
        servers = Storage.getServers(currentUser.id);
    }
    
    renderServerList();
}

function renderServerList() {
    const container = document.getElementById('serverList');
    if (!container) return;
    
    container.innerHTML = servers.map(server => `
        <div class="server-item" 
             style="background: ${server.color};"
             onclick="joinServer('${server.id}')"
             title="${server.name}">
            ${server.icon}
        </div>
    `).join('');
}

function joinServer(serverId) {
    const server = servers.find(s => s.id === serverId);
    if (!server) return;
    
    currentServer = server;
    
    // Update active state
    document.querySelectorAll('.server-item').forEach(el => el.classList.remove('active'));
    event.target.closest('.server-item').classList.add('active');
    
    // Update header
    document.getElementById('currentServerName').textContent = server.name;
    
    // Load channels
    renderChannels(serverId);
    
    // Show welcome or first channel
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'none';
    document.getElementById('membersSidebar').style.display = 'block';
    
    showToast(`${t('joinedServer')} ${server.name}`);
}

function renderChannels(serverId) {
    const channels = [
        { id: 'genel', name: 'genel-sohbet', type: 'text' },
        { id: 'oyun', name: 'oyun', type: 'text' },
        { id: 'muzik', name: 'müzik', type: 'voice' },
        { id: 'yardim', name: 'yardım', type: 'text' }
    ];
    
    const container = document.getElementById('channelContent');
    container.innerHTML = `
        <div class="channel-category">Metin Kanalları</div>
        ${channels.filter(c => c.type === 'text').map(c => `
            <div class="channel-item" onclick="joinChannel('${c.id}', '${c.name}')">
                <span class="channel-name">${c.name}</span>
            </div>
        `).join('')}
        
        <div class="channel-category">Ses Kanalları</div>
        ${channels.filter(c => c.type === 'voice').map(c => `
            <div class="channel-item voice" onclick="joinVoiceChannel('${c.id}', '${c.name}')">
                <span class="channel-name">${c.name}</span>
            </div>
        `).join('')}
    `;
}

function joinChannel(channelId, channelName) {
    currentChannel = { id: channelId, name: channelName };
    
    document.querySelectorAll('.channel-item').forEach(el => el.classList.remove('active'));
    event.target.closest('.channel-item').classList.add('active');
    
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'flex';
    document.getElementById('chatChannelName').textContent = channelName;
    
    loadMessages(channelId);
}

function joinVoiceChannel(channelId, channelName) {
    showToast(`${channelName} ses kanalına katıldınız 🎤`);
}

function createServer() {
    document.getElementById('createServerModal').classList.add('active');
}

function createServerFromTemplate(template) {
    const templates = {
        gaming: { name: 'Oyun Sunucusu', icon: '🎮', color: '#EB459E' },
        school: { name: 'Okul Sunucusu', icon: '🎓', color: '#5865F2' },
        friends: { name: 'Arkadaş Grubu', icon: '👥', color: '#3BA55D' }
    };
    
    const t = templates[template];
    const serverId = 'server_' + Date.now();
    
    const newServer = {
        id: serverId,
        name: t.name,
        icon: t.icon,
        color: t.color,
        createdAt: new Date().toISOString()
    };
    
    Storage.addServer(currentUser.id, newServer);
    servers = Storage.getServers(currentUser.id);
    renderServerList();
    
    closeModal('createServerModal');
    showToast(t('serverCreated'));
}

function createCustomServer() {
    const name = document.getElementById('serverNameInput').value.trim();
    if (!name) {
        showToast(t('fillAllFields'));
        return;
    }
    
    const serverId = 'server_' + Date.now();
    const newServer = {
        id: serverId,
        name: name,
        icon: name[0].toUpperCase(),
        color: getUserColor(name),
        createdAt: new Date().toISOString()
    };
    
    Storage.addServer(currentUser.id, newServer);
    servers = Storage.getServers(currentUser.id);
    renderServerList();
    
    document.getElementById('serverNameInput').value = '';
    closeModal('createServerModal');
    showToast(t('serverCreated'));
}

function exploreServers() {
    showToast('Sunucu keşfi yakında! 🌍');
}

function toggleServerMenu() {
    // Server dropdown menu
    showToast('Sunucu menüsü yakında');
}

// Expose functions
window.joinServer = joinServer;
window.joinChannel = joinChannel;
window.joinVoiceChannel = joinVoiceChannel;
window.createServer = createServer;
window.createServerFromTemplate = createServerFromTemplate;
window.createCustomServer = createCustomServer;
window.exploreServers = exploreServers;
window.toggleServerMenu = toggleServerMenu;