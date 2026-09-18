document.addEventListener("DOMContentLoaded", () => {
    // 1. Auth check
    const token = localStorage.getItem("unihive_token");
    const userJson = localStorage.getItem("unihive_user");

    if (!token || !userJson) {
        window.location.href = "login.html";
        return;
    }

    let currentUser;
    try {
        currentUser = JSON.parse(userJson);
    } catch (e) {
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    // Set header username
    const currentUsernameEl = document.getElementById("currentUsername");
    if (currentUsernameEl) {
        currentUsernameEl.textContent = currentUser.username || "User";
    }

    // UI elements - Dashboard
    const dashboardView = document.getElementById("dashboardView");
    const chatView = document.getElementById("chatView");
    const groupsGrid = document.getElementById("groupsGrid");
    const groupsLoading = document.getElementById("groupsLoading");
    const noGroupsMessage = document.getElementById("noGroupsMessage");
    const emptyStateText = document.getElementById("emptyStateText");
    const groupSearchInput = document.getElementById("groupSearchInput");
    const openCreateModalBtn = document.getElementById("openCreateModalBtn");
    const openJoinPrivateModalBtn = document.getElementById("openJoinPrivateModalBtn");
    const tabMyGroups = document.getElementById("tabMyGroups");
    const tabDiscoverGroups = document.getElementById("tabDiscoverGroups");
    const myGroupsCountBadge = document.getElementById("myGroupsCountBadge");
    const discoverGroupsCountBadge = document.getElementById("discoverGroupsCountBadge");

    // UI elements - Create Group Modal
    const createGroupModal = document.getElementById("createGroupModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    const createGroupForm = document.getElementById("createGroupForm");
    const createGroupError = document.getElementById("createGroupError");
    const newGroupNameInput = document.getElementById("newGroupName");
    const newGroupDescInput = document.getElementById("newGroupDesc");
    const submitCreateGroupBtn = document.getElementById("submitCreateGroupBtn");

    // UI elements - Join Private Group Modal
    const joinPrivateModal = document.getElementById("joinPrivateModal");
    const closeJoinPrivateModalBtn = document.getElementById("closeJoinPrivateModalBtn");
    const cancelJoinPrivateModalBtn = document.getElementById("cancelJoinPrivateModalBtn");
    const joinPrivateForm = document.getElementById("joinPrivateForm");
    const joinPrivateError = document.getElementById("joinPrivateError");
    const targetPrivateGroupId = document.getElementById("targetPrivateGroupId");
    const privateInviteCodeInput = document.getElementById("privateInviteCodeInput");
    const submitJoinPrivateBtn = document.getElementById("submitJoinPrivateBtn");

    // UI elements - Chat
    const backToGroupsBtn = document.getElementById("backToGroupsBtn");
    const chatGroupName = document.getElementById("chatGroupName");
    const chatGroupDesc = document.getElementById("chatGroupDesc");
    const chatGroupMembersCount = document.getElementById("chatGroupMembersCount");
    const chatAdminBadge = document.getElementById("chatAdminBadge");
    const chatPrivacyBadge = document.getElementById("chatPrivacyBadge");
    const chatInviteCodeContainer = document.getElementById("chatInviteCodeContainer");
    const chatInviteCode = document.getElementById("chatInviteCode");
    const copyInviteCodeBtn = document.getElementById("copyInviteCodeBtn");
    const onlineCountEl = document.getElementById("onlineCount");
    const leaveGroupBtn = document.getElementById("leaveGroupBtn");
    const deleteGroupBtn = document.getElementById("deleteGroupBtn");
    const messagesList = document.getElementById("messagesList");
    const typingIndicator = document.getElementById("typingIndicator");
    const typingText = document.getElementById("typingText");
    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");
    const groupMembersList = document.getElementById("groupMembersList");
    const logoutBtn = document.getElementById("logoutBtn");

    // State
    let allGroups = [];
    let currentTab = "my"; // "my" or "discover"
    let currentGroup = null;
    let activeOnlineUsers = new Set();
    let currentMembers = [];
    let displayedMessageIds = new Set(); // Message deduplication cache
    let activeTypers = new Set();
    let isTyping = false;
    let typingTimeout = null;
    let socket = null;
    let socketReconnectTimer = null;

    // Helper: authenticated fetch
    async function apiRequest(endpoint, options = {}) {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(options.headers || {})
        };

        const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (res.status === 401) {
            localStorage.clear();
            window.location.href = "login.html";
            return null;
        }

        return res;
    }

    // ============================================================
    // WEBSOCKET MANAGEMENT
    // ============================================================
    function initWebSocket() {
        if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        const wsUrl = `${CONFIG.WS_URL}?token=${encodeURIComponent(token)}`;
        console.log("Connecting to WebSocket:", wsUrl);

        try {
            socket = new WebSocket(wsUrl);

            socket.onopen = () => {
                console.log("WebSocket connected successfully.");
                if (currentGroup) {
                    socket.send(JSON.stringify({
                        type: "JOIN_GROUP",
                        groupId: currentGroup.id
                    }));
                }
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleWebSocketMessage(data);
                } catch (e) {
                    console.error("Failed to parse WebSocket message:", event.data);
                }
            };

            socket.onclose = (event) => {
                console.warn("WebSocket closed. Code:", event.code);
                if (currentGroup && !socketReconnectTimer) {
                    socketReconnectTimer = setTimeout(() => {
                        socketReconnectTimer = null;
                        initWebSocket();
                    }, 3000);
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

        } catch (e) {
            console.error("Error creating WebSocket:", e);
        }
    }

    function handleWebSocketMessage(data) {
        // 1. Structured MESSAGE frame (zero-latency broadcast from server)
        if (data.type === "MESSAGE" || data.type === "NEW_MESSAGE") {
            const msg = (data.type === "MESSAGE") ? {
                id: data.messageId,
                messageId: data.messageId,
                groupId: data.groupId,
                senderId: data.senderId,
                senderUsername: data.senderUsername,
                content: data.content,
                timestamp: data.timestamp,
                status: data.status
            } : data.message;

            if (currentGroup && msg && msg.groupId === currentGroup.id) {
                const id = msg.id || msg.messageId;
                // Deduplicate: avoid rendering if already rendered
                if (id && displayedMessageIds.has(id)) {
                    return;
                }
                if (id) {
                    displayedMessageIds.add(id);
                }
                appendMessage(msg, true);
            }
        }
        // 2. Real-time typing indicators
        else if (data.type === "TYPING_UPDATE") {
            if (currentGroup && data.groupId === currentGroup.id) {
                const typingUser = data.senderUsername || data.username;
                if (typingUser && typingUser !== currentUser.username) {
                    if (data.isTyping) {
                        activeTypers.add(typingUser);
                    } else {
                        activeTypers.delete(typingUser);
                    }
                    updateTypingUI();
                }
            }
        }
        // 3. Online members count and presence list
        else if (data.type === "ONLINE_USERS") {
            if (currentGroup && data.groupId === currentGroup.id) {
                onlineCountEl.textContent = data.onlineCount != null ? data.onlineCount : 0;
                activeOnlineUsers = new Set(data.users || []);
                renderGroupMembers();
            }
        }
        // 4. Server error notifications
        else if (data.type === "ERROR") {
            console.warn("WebSocket error received from server:", data.error);
        }
    }

    function updateTypingUI() {
        if (!typingIndicator || !typingText) return;

        if (activeTypers.size === 0) {
            typingIndicator.style.display = "none";
        } else if (activeTypers.size === 1) {
            const user = Array.from(activeTypers)[0];
            typingText.textContent = `${escapeHtml(user)} is typing...`;
            typingIndicator.style.display = "flex";
        } else {
            typingText.textContent = "Several people are typing...";
            typingIndicator.style.display = "flex";
        }
    }

    function sendTypingEvent(typingState) {
        if (socket && socket.readyState === WebSocket.OPEN && currentGroup) {
            socket.send(JSON.stringify({
                type: typingState ? "TYPING_START" : "TYPING_STOP",
                groupId: currentGroup.id
            }));
        }
    }

    // ============================================================
    // DASHBOARD, TABS & GROUP EXPLORATION
    // ============================================================
    async function loadGroups() {
        groupsLoading.style.display = "flex";
        groupsGrid.style.display = "none";
        noGroupsMessage.style.display = "none";

        try {
            const res = await apiRequest("/api/groups");
            if (!res) return;

            if (res.ok) {
                allGroups = await res.json();
                updateTabBadges();
                renderFilteredGroups();
            } else {
                console.error("Failed to fetch groups:", res.status);
            }
        } catch (err) {
            console.error("Error fetching groups:", err);
        } finally {
            groupsLoading.style.display = "none";
        }
    }

    function updateTabBadges() {
        const myCount = allGroups.filter(g => g.member).length;
        const discoverCount = allGroups.filter(g => !g.member).length;
        if (myGroupsCountBadge) myGroupsCountBadge.textContent = myCount;
        if (discoverGroupsCountBadge) discoverGroupsCountBadge.textContent = discoverCount;
    }

    function switchTab(tab) {
        currentTab = tab;
        if (tab === "my") {
            tabMyGroups.classList.add("active");
            tabDiscoverGroups.classList.remove("active");
        } else {
            tabDiscoverGroups.classList.add("active");
            tabMyGroups.classList.remove("active");
        }
        renderFilteredGroups();
    }

    if (tabMyGroups) {
        tabMyGroups.addEventListener("click", () => switchTab("my"));
    }
    if (tabDiscoverGroups) {
        tabDiscoverGroups.addEventListener("click", () => switchTab("discover"));
    }

    function renderFilteredGroups() {
        const query = groupSearchInput ? groupSearchInput.value.trim().toLowerCase() : "";

        // Filter by tab
        let filtered = allGroups.filter(g => currentTab === "my" ? g.member : !g.member);

        // Filter by search query
        if (query) {
            filtered = filtered.filter(g =>
                g.name.toLowerCase().includes(query) ||
                (g.description && g.description.toLowerCase().includes(query))
            );
        }

        renderGroups(filtered);
    }

    function renderGroups(groups) {
        groupsGrid.innerHTML = "";

        if (!groups || groups.length === 0) {
            if (emptyStateText) {
                if (currentTab === "my") {
                    emptyStateText.textContent = "You haven't joined any groups yet. Switch to Discover Groups or create your own!";
                } else {
                    emptyStateText.textContent = "No groups available to discover right now. Create a new community!";
                }
            }
            noGroupsMessage.style.display = "block";
            groupsGrid.style.display = "none";
            return;
        }

        noGroupsMessage.style.display = "none";
        groupsGrid.style.display = "grid";

        groups.forEach(group => {
            const card = document.createElement("div");
            card.className = "group-card";

            const isAdmin = group.admin;
            const isMember = group.member;
            const isPrivate = group.privacy === "PRIVATE";

            card.innerHTML = `
                <div class="group-card-header">
                    <h3 class="group-card-title">${escapeHtml(group.name)}</h3>
                    <div style="display: flex; gap: 6px; align-items: center;">
                        ${isAdmin ? '<span class="badge admin-badge">👑 Admin</span>' : ''}
                        ${isPrivate
                            ? '<span class="badge privacy-badge private">🔒 Private</span>'
                            : '<span class="badge privacy-badge">🌐 Public</span>'
                        }
                    </div>
                </div>
                <p class="group-card-desc">${escapeHtml(group.description || "No description provided.")}</p>
                <div class="group-card-footer">
                    <span class="member-count-pill">👥 ${group.memberCount} ${group.memberCount === 1 ? 'member' : 'members'}</span>
                    <button class="card-action-btn ${isMember ? 'open-chat-btn' : (isPrivate ? 'join-group-btn' : 'join-group-btn')}">
                        ${isMember ? 'Open Chat' : (isPrivate ? '🔑 Enter Code' : 'Join Group')}
                    </button>
                </div>
            `;

            const actionBtn = card.querySelector(".card-action-btn");
            actionBtn.addEventListener("click", () => {
                if (isMember) {
                    openGroupChat(group);
                } else if (isPrivate) {
                    openJoinPrivateModal(group);
                } else {
                    joinPublicGroup(group.id);
                }
            });

            groupsGrid.appendChild(card);
        });
    }

    if (groupSearchInput) {
        groupSearchInput.addEventListener("input", renderFilteredGroups);
    }

    // ============================================================
    // CREATE GROUP
    // ============================================================
    openCreateModalBtn.addEventListener("click", () => {
        createGroupError.style.display = "none";
        createGroupError.textContent = "";
        newGroupNameInput.value = "";
        newGroupDescInput.value = "";
        const defaultRadio = createGroupForm.querySelector('input[name="newGroupPrivacy"][value="PUBLIC"]');
        if (defaultRadio) defaultRadio.checked = true;
        createGroupModal.style.display = "flex";
        newGroupNameInput.focus();
    });

    function closeCreateModal() {
        createGroupModal.style.display = "none";
    }

    closeModalBtn.addEventListener("click", closeCreateModal);
    cancelModalBtn.addEventListener("click", closeCreateModal);

    createGroupModal.addEventListener("click", (e) => {
        if (e.target === createGroupModal) {
            closeCreateModal();
        }
    });

    createGroupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        createGroupError.style.display = "none";

        const name = newGroupNameInput.value.trim();
        const description = newGroupDescInput.value.trim();
        const selectedPrivacy = (createGroupForm.querySelector('input[name="newGroupPrivacy"]:checked') || {}).value || "PUBLIC";

        if (!name) {
            createGroupError.textContent = "Group name is required.";
            createGroupError.style.display = "block";
            return;
        }

        submitCreateGroupBtn.disabled = true;
        submitCreateGroupBtn.textContent = "Creating...";

        try {
            const res = await apiRequest("/api/groups", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    description,
                    privacy: selectedPrivacy
                })
            });

            const data = await res.json();

            if (res.ok) {
                closeCreateModal();
                await loadGroups();
                openGroupChat(data);
            } else {
                createGroupError.textContent = data.error || "Failed to create group.";
                createGroupError.style.display = "block";
            }
        } catch (err) {
            console.error("Create group error:", err);
            createGroupError.textContent = "Failed to connect to server.";
            createGroupError.style.display = "block";
        } finally {
            submitCreateGroupBtn.disabled = false;
            submitCreateGroupBtn.textContent = "Create Group";
        }
    });

    // ============================================================
    // JOIN PRIVATE GROUP (INVITE CODE)
    // ============================================================
    function openJoinPrivateModal(targetGroup = null) {
        joinPrivateError.style.display = "none";
        joinPrivateError.textContent = "";
        privateInviteCodeInput.value = "";
        targetPrivateGroupId.value = targetGroup ? targetGroup.id : "";

        if (targetGroup) {
            joinPrivateModal.querySelector("h3").textContent = `Join "${targetGroup.name}"`;
        } else {
            joinPrivateModal.querySelector("h3").textContent = "Join Private Group";
        }

        joinPrivateModal.style.display = "flex";
        privateInviteCodeInput.focus();
    }

    function closeJoinPrivateModal() {
        joinPrivateModal.style.display = "none";
    }

    if (openJoinPrivateModalBtn) {
        openJoinPrivateModalBtn.addEventListener("click", () => openJoinPrivateModal(null));
    }
    if (closeJoinPrivateModalBtn) {
        closeJoinPrivateModalBtn.addEventListener("click", closeJoinPrivateModal);
    }
    if (cancelJoinPrivateModalBtn) {
        cancelJoinPrivateModalBtn.addEventListener("click", closeJoinPrivateModal);
    }

    joinPrivateModal.addEventListener("click", (e) => {
        if (e.target === joinPrivateModal) {
            closeJoinPrivateModal();
        }
    });

    joinPrivateForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        joinPrivateError.style.display = "none";

        const inviteCode = privateInviteCodeInput.value.trim().toUpperCase();
        const groupId = targetPrivateGroupId.value;

        if (!inviteCode) {
            joinPrivateError.textContent = "Invite code is required.";
            joinPrivateError.style.display = "block";
            return;
        }

        submitJoinPrivateBtn.disabled = true;
        submitJoinPrivateBtn.textContent = "Joining...";

        try {
            // If specific group target exists, call /{groupId}/join-private; otherwise call generic /join-private
            const endpoint = groupId ? `/api/groups/${groupId}/join-private` : `/api/groups/join-private`;

            const res = await apiRequest(endpoint, {
                method: "POST",
                body: JSON.stringify({ inviteCode })
            });

            const data = await res.json();

            if (res.ok) {
                closeJoinPrivateModal();
                await loadGroups();
                openGroupChat(data);
            } else {
                joinPrivateError.textContent = data.error || "Invalid invite code or unable to join.";
                joinPrivateError.style.display = "block";
            }
        } catch (err) {
            console.error("Join private group error:", err);
            joinPrivateError.textContent = "Failed to connect to server.";
            joinPrivateError.style.display = "block";
        } finally {
            submitJoinPrivateBtn.disabled = false;
            submitJoinPrivateBtn.textContent = "Join Group";
        }
    });

    // ============================================================
    // JOIN PUBLIC GROUP & LEAVE GROUP
    // ============================================================
    async function joinPublicGroup(groupId) {
        try {
            const res = await apiRequest(`/api/groups/${groupId}/join`, {
                method: "POST"
            });

            if (res.ok) {
                const updatedGroup = await res.json();
                await loadGroups();
                openGroupChat(updatedGroup);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to join group");
            }
        } catch (err) {
            console.error("Join group error:", err);
            alert("Network error joining group.");
        }
    }

    async function leaveCurrentGroup() {
        if (!currentGroup) return;

        if (!confirm(`Are you sure you want to leave "${currentGroup.name}"?`)) {
            return;
        }

        try {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "LEAVE_GROUP",
                    groupId: currentGroup.id
                }));
            }

            const res = await apiRequest(`/api/groups/${currentGroup.id}/leave`, {
                method: "POST"
            });

            if (res.ok) {
                closeGroupChat();
                await loadGroups();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to leave group");
            }
        } catch (err) {
            console.error("Leave group error:", err);
            alert("Network error leaving group.");
        }
    }

    leaveGroupBtn.addEventListener("click", leaveCurrentGroup);

    // ============================================================
    // DELETE GROUP (ADMIN ONLY)
    // ============================================================
    async function deleteCurrentGroup() {
        if (!currentGroup) return;

        if (!confirm(`Are you sure you want to permanently delete "${currentGroup.name}" and all its messages?`)) {
            return;
        }

        try {
            const res = await apiRequest(`/api/groups/${currentGroup.id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                closeGroupChat();
                await loadGroups();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete group");
            }
        } catch (err) {
            console.error("Delete group error:", err);
            alert("Network error deleting group.");
        }
    }

    deleteGroupBtn.addEventListener("click", deleteCurrentGroup);

    // ============================================================
    // OPEN & CLOSE GROUP CHAT
    // ============================================================
    async function openGroupChat(group) {
        currentGroup = group;
        displayedMessageIds.clear();
        activeTypers.clear();
        updateTypingUI();

        dashboardView.style.display = "none";
        chatView.style.display = "flex";

        chatGroupName.textContent = group.name;
        chatGroupDesc.textContent = group.description || "No description";
        chatGroupMembersCount.textContent = `${group.memberCount} ${group.memberCount === 1 ? 'member' : 'members'}`;

        // Admin badge & delete controls
        if (group.admin) {
            chatAdminBadge.style.display = "inline-block";
            deleteGroupBtn.style.display = "inline-block";
        } else {
            chatAdminBadge.style.display = "none";
            deleteGroupBtn.style.display = "none";
        }

        // Privacy badge
        const isPrivate = group.privacy === "PRIVATE";
        if (isPrivate) {
            chatPrivacyBadge.textContent = "🔒 Private";
            chatPrivacyBadge.className = "badge privacy-badge private";
        } else {
            chatPrivacyBadge.textContent = "🌐 Public";
            chatPrivacyBadge.className = "badge privacy-badge";
        }

        // Private group invite code display & copy button
        if (isPrivate && group.inviteCode) {
            chatInviteCodeContainer.style.display = "inline-flex";
            chatInviteCode.textContent = group.inviteCode;
        } else {
            chatInviteCodeContainer.style.display = "none";
        }

        messagesList.innerHTML = `<div class="chat-loading">Loading chat history...</div>`;

        // Connect WebSocket and send JOIN_GROUP
        initWebSocket();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "JOIN_GROUP",
                groupId: group.id
            }));
        }

        // Load message history from MongoDB via REST API
        loadMessageHistory(group.id);

        // Load group members list
        loadGroupMembers(group.id);

        messageInput.focus();
    }

    function closeGroupChat() {
        if (typingTimeout) clearTimeout(typingTimeout);
        if (isTyping) {
            isTyping = false;
            sendTypingEvent(false);
        }

        if (socket && socket.readyState === WebSocket.OPEN && currentGroup) {
            socket.send(JSON.stringify({
                type: "LEAVE_GROUP",
                groupId: currentGroup.id
            }));
        }

        currentGroup = null;
        displayedMessageIds.clear();
        activeTypers.clear();
        activeOnlineUsers.clear();
        currentMembers = [];
        updateTypingUI();

        chatView.style.display = "none";
        dashboardView.style.display = "block";
    }

    backToGroupsBtn.addEventListener("click", () => {
        closeGroupChat();
        loadGroups();
    });

    // Copy Invite Code Button
    if (copyInviteCodeBtn) {
        copyInviteCodeBtn.addEventListener("click", () => {
            if (currentGroup && currentGroup.inviteCode) {
                navigator.clipboard.writeText(currentGroup.inviteCode).then(() => {
                    const originalText = copyInviteCodeBtn.textContent;
                    copyInviteCodeBtn.textContent = "✓ Copied!";
                    setTimeout(() => {
                        copyInviteCodeBtn.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error("Clipboard copy failed:", err);
                    prompt("Copy invite code:", currentGroup.inviteCode);
                });
            }
        });
    }

    // ============================================================
    // MESSAGE HISTORY & RENDERING
    // ============================================================
    async function loadMessageHistory(groupId) {
        try {
            const res = await apiRequest(`/api/groups/${groupId}/messages?limit=50`);
            if (!res) return;

            if (res.ok) {
                const messages = await res.json();
                messagesList.innerHTML = "";
                displayedMessageIds.clear();

                if (messages.length === 0) {
                    messagesList.innerHTML = `
                        <div class="chat-empty">
                            No messages yet. Start the conversation!
                        </div>
                    `;
                } else {
                    messages.forEach(msg => {
                        const id = msg.id || msg.messageId;
                        if (id) displayedMessageIds.add(id);
                        appendMessage(msg, false);
                    });
                    scrollMessagesToBottom();
                }
            } else {
                messagesList.innerHTML = `<div class="chat-error">Failed to load messages.</div>`;
            }
        } catch (err) {
            console.error("Load messages error:", err);
            messagesList.innerHTML = `<div class="chat-error">Network error loading messages.</div>`;
        }
    }

    async function loadGroupMembers(groupId) {
        try {
            const res = await apiRequest(`/api/groups/${groupId}/members`);
            if (res && res.ok) {
                currentMembers = await res.json();
                renderGroupMembers();
            }
        } catch (err) {
            console.error("Load members error:", err);
        }
    }

    function renderGroupMembers() {
        groupMembersList.innerHTML = "";

        currentMembers.forEach(member => {
            const isOnline = activeOnlineUsers.has(member.username);
            const isSelf = member.id === currentUser.id;

            const div = document.createElement("div");
            div.className = `sidebar-member-item ${isOnline ? 'online' : 'offline'}`;
            div.innerHTML = `
                <span class="member-dot ${isOnline ? 'dot-online' : 'dot-offline'}"></span>
                <span class="member-name">${escapeHtml(member.username)} ${isSelf ? '<small>(you)</small>' : ''}</span>
            `;
            groupMembersList.appendChild(div);
        });
    }

    function appendMessage(msg, shouldScroll = true) {
        const emptyMsg = messagesList.querySelector(".chat-empty");
        if (emptyMsg) emptyMsg.remove();

        const mine = msg.senderId === currentUser.id || msg.senderUsername === currentUser.username;
        const timeStr = formatTimestamp(msg.timestamp);

        const msgDiv = document.createElement("div");
        msgDiv.className = mine ? "my-message" : "other-message";

        msgDiv.innerHTML = `
            <div class="message-header">
                <span class="sender-name">${escapeHtml(msg.senderUsername || "User")}</span>
                <span class="message-sep">•</span>
                <span class="message-time">${timeStr}</span>
                ${mine ? '<span class="message-status">✓</span>' : ''}
            </div>
            <div class="${mine ? 'message-bubble' : 'other-bubble'}">
                ${escapeHtml(msg.content)}
            </div>
        `;

        messagesList.appendChild(msgDiv);

        if (shouldScroll) {
            scrollMessagesToBottom();
        }
    }

    function scrollMessagesToBottom() {
        messagesList.scrollTop = messagesList.scrollHeight;
    }

    function formatTimestamp(isoStr) {
        if (!isoStr) return "";
        try {
            const date = new Date(isoStr);
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`;
        } catch (e) {
            return "";
        }
    }

    // ============================================================
    // REAL-TIME TYPING DETECTION & EVENT DISPATCH
    // ============================================================
    messageInput.addEventListener("input", () => {
        if (!currentGroup) return;

        const val = messageInput.value.trim();
        if (val.length > 0) {
            if (!isTyping) {
                isTyping = true;
                sendTypingEvent(true);
            }

            if (typingTimeout) clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                isTyping = false;
                sendTypingEvent(false);
            }, 2000);
        } else {
            if (isTyping) {
                isTyping = false;
                sendTypingEvent(false);
            }
            if (typingTimeout) clearTimeout(typingTimeout);
        }
    });

    // ============================================================
    // SEND MESSAGE (ZERO DELAY IN-MEMORY BROADCAST)
    // ============================================================
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!currentGroup) return;

        const content = messageInput.value.trim();
        if (!content) return;

        // Reset typing indicator immediately on send
        if (typingTimeout) clearTimeout(typingTimeout);
        if (isTyping) {
            isTyping = false;
            sendTypingEvent(false);
        }

        // Send through WebSocket to group room
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "SEND_MESSAGE",
                groupId: currentGroup.id,
                content: content
            }));
            messageInput.value = "";
        } else {
            // Reconnecting fallback
            initWebSocket();
            setTimeout(() => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        type: "SEND_MESSAGE",
                        groupId: currentGroup.id,
                        content: content
                    }));
                    messageInput.value = "";
                } else {
                    alert("Reconnecting to chat server... Please try again in a moment.");
                }
            }, 500);
        }
    });

    // ============================================================
    // LOGOUT
    // ============================================================
    logoutBtn.addEventListener("click", () => {
        if (socket) {
            socket.close();
        }
        localStorage.clear();
        window.location.href = "login.html";
    });

    function escapeHtml(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Initial load
    loadGroups();
});