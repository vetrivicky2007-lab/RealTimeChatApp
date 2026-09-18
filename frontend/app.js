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

    // UI elements
    const dashboardView = document.getElementById("dashboardView");
    const chatView = document.getElementById("chatView");
    const groupsGrid = document.getElementById("groupsGrid");
    const groupsLoading = document.getElementById("groupsLoading");
    const noGroupsMessage = document.getElementById("noGroupsMessage");
    const groupSearchInput = document.getElementById("groupSearchInput");
    const openCreateModalBtn = document.getElementById("openCreateModalBtn");

    // Modal elements
    const createGroupModal = document.getElementById("createGroupModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    const createGroupForm = document.getElementById("createGroupForm");
    const createGroupError = document.getElementById("createGroupError");
    const newGroupNameInput = document.getElementById("newGroupName");
    const newGroupDescInput = document.getElementById("newGroupDesc");

    // Chat elements
    const backToGroupsBtn = document.getElementById("backToGroupsBtn");
    const chatGroupName = document.getElementById("chatGroupName");
    const chatGroupDesc = document.getElementById("chatGroupDesc");
    const chatGroupMembersCount = document.getElementById("chatGroupMembersCount");
    const chatAdminBadge = document.getElementById("chatAdminBadge");
    const onlineCountEl = document.getElementById("onlineCount");
    const leaveGroupBtn = document.getElementById("leaveGroupBtn");
    const deleteGroupBtn = document.getElementById("deleteGroupBtn");
    const messagesList = document.getElementById("messagesList");
    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");
    const groupMembersList = document.getElementById("groupMembersList");
    const logoutBtn = document.getElementById("logoutBtn");

    // State
    let allGroups = [];
    let currentGroup = null;
    let activeOnlineUsers = new Set();
    let currentMembers = [];
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
                // Attempt reconnect if still on chat view
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
        if (data.type === "NEW_MESSAGE") {
            const msg = data.message;
            if (currentGroup && msg.groupId === currentGroup.id) {
                appendMessage(msg);
            }
        } else if (data.type === "ONLINE_USERS") {
            if (currentGroup && data.groupId === currentGroup.id) {
                onlineCountEl.textContent = data.onlineCount != null ? data.onlineCount : 0;
                activeOnlineUsers = new Set(data.users || []);
                renderGroupMembers();
            }
        } else if (data.type === "ERROR") {
            console.warn("WebSocket error received:", data.error);
        }
    }

    // ============================================================
    // DASHBOARD & GROUPS
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
                renderGroups(allGroups);
            } else {
                console.error("Failed to fetch groups:", res.status);
            }
        } catch (err) {
            console.error("Error fetching groups:", err);
        } finally {
            groupsLoading.style.display = "none";
        }
    }

    function renderGroups(groups) {
        groupsGrid.innerHTML = "";

        if (!groups || groups.length === 0) {
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

            card.innerHTML = `
                <div class="group-card-header">
                    <h3 class="group-card-title">${escapeHtml(group.name)}</h3>
                    ${isAdmin ? '<span class="badge admin-badge">👑 Admin</span>' : ''}
                </div>
                <p class="group-card-desc">${escapeHtml(group.description || "No description provided.")}</p>
                <div class="group-card-footer">
                    <span class="member-count-pill">👥 ${group.memberCount} ${group.memberCount === 1 ? 'member' : 'members'}</span>
                    <button class="card-action-btn ${isMember ? 'open-chat-btn' : 'join-group-btn'}">
                        ${isMember ? 'Open Chat' : 'Join Group'}
                    </button>
                </div>
            `;

            const actionBtn = card.querySelector(".card-action-btn");
            actionBtn.addEventListener("click", () => {
                if (isMember) {
                    openGroupChat(group);
                } else {
                    joinGroup(group.id);
                }
            });

            groupsGrid.appendChild(card);
        });
    }

    // Search filter
    groupSearchInput.addEventListener("input", () => {
        const query = groupSearchInput.value.trim().toLowerCase();
        const filtered = allGroups.filter(g =>
            g.name.toLowerCase().includes(query) ||
            (g.description && g.description.toLowerCase().includes(query))
        );
        renderGroups(filtered);
    });

    // ============================================================
    // CREATE GROUP
    // ============================================================
    openCreateModalBtn.addEventListener("click", () => {
        createGroupError.style.display = "none";
        createGroupError.textContent = "";
        newGroupNameInput.value = "";
        newGroupDescInput.value = "";
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

        if (!name) {
            createGroupError.textContent = "Group name is required.";
            createGroupError.style.display = "block";
            return;
        }

        const submitBtn = document.getElementById("submitCreateGroupBtn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Creating...";

        try {
            const res = await apiRequest("/api/groups", {
                method: "POST",
                body: JSON.stringify({ name, description })
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
            submitBtn.disabled = false;
            submitBtn.textContent = "Create Group";
        }
    });

    // ============================================================
    // JOIN & LEAVE GROUP
    // ============================================================
    async function joinGroup(groupId) {
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

        dashboardView.style.display = "none";
        chatView.style.display = "flex";

        chatGroupName.textContent = group.name;
        chatGroupDesc.textContent = group.description || "No description";
        chatGroupMembersCount.textContent = `${group.memberCount} ${group.memberCount === 1 ? 'member' : 'members'}`;

        if (group.admin) {
            chatAdminBadge.style.display = "inline-block";
            deleteGroupBtn.style.display = "inline-block";
        } else {
            chatAdminBadge.style.display = "none";
            deleteGroupBtn.style.display = "none";
        }

        messagesList.innerHTML = `
            <div class="chat-loading">Loading chat history...</div>
        `;

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
    }

    function closeGroupChat() {
        if (socket && socket.readyState === WebSocket.OPEN && currentGroup) {
            socket.send(JSON.stringify({
                type: "LEAVE_GROUP",
                groupId: currentGroup.id
            }));
        }

        currentGroup = null;
        activeOnlineUsers.clear();
        currentMembers = [];

        chatView.style.display = "none";
        dashboardView.style.display = "block";
    }

    backToGroupsBtn.addEventListener("click", () => {
        closeGroupChat();
        loadGroups();
    });

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

                if (messages.length === 0) {
                    messagesList.innerHTML = `
                        <div class="chat-empty">
                            No messages yet. Start the conversation!
                        </div>
                    `;
                } else {
                    messages.forEach(msg => appendMessage(msg, false));
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
    // SEND MESSAGE
    // ============================================================
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!currentGroup) return;

        const content = messageInput.value.trim();
        if (!content) return;

        // Send through WebSocket
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