const Storage = {
    // Users
    saveUser(user) {
        const users = this.getUsers();
        users[user.email] = user;
        localStorage.setItem('td_users', JSON.stringify(users));
    },
    
    getUsers() {
        return JSON.parse(localStorage.getItem('td_users') || '{}');
    },
    
    getUser(email) {
        return this.getUsers()[email];
    },
    
    // Current User
    setCurrentUser(user) {
        localStorage.setItem('td_current_user', JSON.stringify(user));
    },
    
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('td_current_user') || 'null');
    },
    
    removeCurrentUser() {
        localStorage.removeItem('td_current_user');
    },
    
    // Friends
    getFriends(userId) {
        return JSON.parse(localStorage.getItem(`td_friends_${userId}`) || '[]');
    },
    
    saveFriends(userId, friends) {
        localStorage.setItem(`td_friends_${userId}`, JSON.stringify(friends));
    },
    
    addFriend(userId, friend) {
        const friends = this.getFriends(userId);
        if (!friends.find(f => f.username === friend.username)) {
            friends.push(friend);
            this.saveFriends(userId, friends);
        }
    },
    
    removeFriend(userId, username) {
        let friends = this.getFriends(userId);
        friends = friends.filter(f => f.username !== username);
        this.saveFriends(userId, friends);
    },
    
    // Servers
    getServers(userId) {
        return JSON.parse(localStorage.getItem(`td_servers_${userId}`) || '[]');
    },
    
    saveServers(userId, servers) {
        localStorage.setItem(`td_servers_${userId}`, JSON.stringify(servers));
    },
    
    addServer(userId, server) {
        const servers = this.getServers(userId);
        servers.push(server);
        this.saveServers(userId, servers);
    },
    
    // Messages
    getMessages(serverId, channelId) {
        return JSON.parse(localStorage.getItem(`td_messages_${serverId}_${channelId}`) || '[]');
    },
    
    saveMessages(serverId, channelId, messages) {
        localStorage.setItem(`td_messages_${serverId}_${channelId}`, JSON.stringify(messages));
    },
    
    addMessage(serverId, channelId, message) {
        const messages = this.getMessages(serverId, channelId);
        messages.push(message);
        this.saveMessages(serverId, channelId, messages);
    },
    
    // Settings
    getSettings() {
        return JSON.parse(localStorage.getItem('td_settings') || '{}');
    },
    
    saveSettings(settings) {
        localStorage.setItem('td_settings', JSON.stringify(settings));
    },
    
    // Clear all data (for logout)
    clearAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('td_')) {
                localStorage.removeItem(key);
            }
        });
    }
};