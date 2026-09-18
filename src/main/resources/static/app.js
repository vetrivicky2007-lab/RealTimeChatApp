document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // 1. AUTHENTICATION & PROFILE VERIFICATION
    // ============================================================
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

    // Set User Profile in Sidebar
    const currentUsernameEl = document.getElementById("currentUsername");
    const currentUserAvatarEl = document.getElementById("currentUserAvatar");
    const menuUsernameEl = document.getElementById("menuUsername");
    const menuUserEmailEl = document.getElementById("menuUserEmail");

    if (currentUsernameEl) currentUsernameEl.textContent = currentUser.username || "User";
    if (currentUserAvatarEl) currentUserAvatarEl.textContent = (currentUser.username || "U").charAt(0).toUpperCase();
    if (menuUsernameEl) menuUsernameEl.textContent = currentUser.username || "User";
    if (menuUserEmailEl) menuUserEmailEl.textContent = currentUser.email || "";

    // ============================================================
    // 2. DOM ELEMENTS
    // ============================================================
    // Sidebar
    const leftSidebar = document.getElementById("leftSidebar");
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userDropdownMenu = document.getElementById("userDropdownMenu");
    const logoutBtn = document.getElementById("logoutBtn");
    const openCreateModalBtn = document.getElementById("openCreateModalBtn");
    const openJoinPrivateModalBtn = document.getElementById("openJoinPrivateModalBtn");
    const groupSearchInput = document.getElementById("groupSearchInput");
    const clearSearchBtn = document.getElementById("clearSearchBtn");
    const tabMyGroups = document.getElementById("tabMyGroups");
    const tabDiscoverGroups = document.getElementById("tabDiscoverGroups");
    const myGroupsCountBadge = document.getElementById("myGroupsCountBadge");
    const discoverGroupsCountBadge = document.getElementById("discoverGroupsCountBadge");
    const discoverFilterRow = document.getElementById("discoverFilterRow");
    const groupsListContainer = document.getElementById("groupsListContainer");
    const groupsLoading = document.getElementById("groupsLoading");
    const noGroupsMessage = document.getElementById("noGroupsMessage");
    const emptyStateText = document.getElementById("emptyStateText");

    // Main Chat Pane
    const chatMainPane = document.getElementById("chatMainPane");
    const noChatSelectedState = document.getElementById("noChatSelectedState");
    const activeChatView = document.getElementById("activeChatView");
    const mobileBackBtn = document.getElementById("mobileBackBtn");
    const chatHeaderAvatar = document.getElementById("chatHeaderAvatar");
    const chatGroupName = document.getElementById("chatGroupName");
    const chatPrivacyIndicator = document.getElementById("chatPrivacyIndicator");
    const chatPrivacyIcon = document.getElementById("chatPrivacyIcon");
    const chatPrivacyText = document.getElementById("chatPrivacyText");
    const chatGroupMembersCount = document.getElementById("chatGroupMembersCount");
    const onlineCount = document.getElementById("onlineCount");
    const toggleInfoDrawerBtn = document.getElementById("toggleInfoDrawerBtn");
    const groupMenuBtn = document.getElementById("groupMenuBtn");
    const groupDropdownMenu = document.getElementById("groupDropdownMenu");
    const menuPendingBadge = document.getElementById("menuPendingBadge");

    // Group 3-dot Menu Items
    const menuItemOpenInfo = document.getElementById("menuItemOpenInfo");
    const menuItemMembers = document.getElementById("menuItemMembers");
    const menuItemInvite = document.getElementById("menuItemInvite");
    const menuItemRequests = document.getElementById("menuItemRequests");
    const menuRequestsCount = document.getElementById("menuRequestsCount");
    const menuItemLeave = document.getElementById("menuItemLeave");
    const menuItemDelete = document.getElementById("menuItemDelete");

    // Chat Conversation & Composer
    const messagesList = document.getElementById("messagesList");
    const typingIndicator = document.getElementById("typingIndicator");
    const typingText = document.getElementById("typingText");
    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");

    // Right Info Drawer
    const rightInfoDrawer = document.getElementById("rightInfoDrawer");
    const closeInfoDrawerBtn = document.getElementById("closeInfoDrawerBtn");
    const drawerGroupAvatar = document.getElementById("drawerGroupAvatar");
    const drawerGroupName = document.getElementById("drawerGroupName");
    const drawerGroupDesc = document.getElementById("drawerGroupDesc");
    const drawerPrivacyBadge = document.getElementById("drawerPrivacyBadge");
    const drawerMembersCount = document.getElementById("drawerMembersCount");
    const drawerInviteSection = document.getElementById("drawerInviteSection");
    const drawerInviteCode = document.getElementById("drawerInviteCode");
    const drawerCopyCodeBtn = document.getElementById("drawerCopyCodeBtn");
    const drawerRegenCodeBtn = document.getElementById("drawerRegenCodeBtn");
    const drawerRequestsSection = document.getElementById("drawerRequestsSection");
    const drawerRequestsBadge = document.getElementById("drawerRequestsBadge");
    const drawerRequestsList = document.getElementById("drawerRequestsList");
    const drawerMembersTotal = document.getElementById("drawerMembersTotal");
    const drawerMembersList = document.getElementById("drawerMembersList");
    const drawerLeaveBtn = document.getElementById("drawerLeaveBtn");
    const drawerDeleteBtn = document.getElementById("drawerDeleteBtn");

    // Modals
    const createGroupModal = document.getElementById("createGroupModal");
    const closeCreateModalBtn = document.getElementById("closeCreateModalBtn");
    const cancelCreateModalBtn = document.getElementById("cancelCreateModalBtn");
    const createGroupForm = document.getElementById("createGroupForm");
    const createGroupError = document.getElementById("createGroupError");
    const newGroupName = document.getElementById("newGroupName");
    const newGroupDesc = document.getElementById("newGroupDesc");
    const submitCreateGroupBtn = document.getElementById("submitCreateGroupBtn");

    const joinPrivateModal = document.getElementById("joinPrivateModal");
    const closeJoinPrivateModalBtn = document.getElementById("closeJoinPrivateModalBtn");
    const cancelJoinPrivateModalBtn = document.getElementById("cancelJoinPrivateModalBtn");
    const joinPrivateForm = document.getElementById("joinPrivateForm");
    const joinPrivateError = document.getElementById("joinPrivateError");
    const joinPrivateModalTitle = document.getElementById("joinPrivateModalTitle");
    const targetPrivateGroupId = document.getElementById("targetPrivateGroupId");
    const privateInviteCodeInput = document.getElementById("privateInviteCodeInput");
    const submitJoinPrivateBtn = document.getElementById("submitJoinPrivateBtn");

    const confirmActionModal = document.getElementById("confirmActionModal");
    const closeConfirmModalBtn = document.getElementById("closeConfirmModalBtn");
    const cancelConfirmModalBtn = document.getElementById("cancelConfirmModalBtn");
    const proceedConfirmModalBtn = document.getElementById("proceedConfirmModalBtn");
    const confirmModalTitle = document.getElementById("confirmModalTitle");
    const confirmModalMessage = document.getElementById("confirmModalMessage");

    // ============================================================
    // 3. APPLICATION STATE
    // ============================================================
    let allGroups = [];
    let currentTab = "my"; // "my" or "discover"
    let currentDiscoverFilter = "ALL"; // "ALL", "PUBLIC", "PRIVATE"
    let currentGroup = null;
    let currentMembers = [];
    let activeOnlineUsers = new Set();
    let displayedMessageIds = new Set(); // Message deduplication cache
    let activeTypers = new Set();
    let isTyping = false;
    let typingTimeout = null;
    let socket = null;
    let socketReconnectTimer = null;
    let confirmActionCallback = null;

    // Helper: authenticated REST fetch
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
    // 4. WEBSOCKET REAL-TIME MESSAGING ENGINE
    // ============================================================
    function initWebSocket() {
        if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        const wsUrl = `${CONFIG.WS_URL}?token=${encodeURIComponent(token)}`;
        console.log("Establishing WebSocket connection to:", wsUrl);

        try {
            socket = new WebSocket(wsUrl);

            socket.onopen = () => {
                console.log("WebSocket connection established.");
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

            socket.onerror = (err) => {
                console.error("WebSocket transport error:", err);
            };

        } catch (e) {
            console.error("Error creating WebSocket:", e);
        }
    }

    function handleWebSocketMessage(data) {
        // 1. Structured MESSAGE frame (zero-latency broadcast received by all room sessions including sender)
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
                // Deduplicate: ignore if this message ID has already been rendered
                if (id && displayedMessageIds.has(id)) {
                    return;
                }
                if (id) {
                    displayedMessageIds.add(id);
                }
                appendMessage(msg, true);
            }
        }
        // 2. Real-time typing events
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
                if (onlineCount) onlineCount.textContent = data.onlineCount != null ? data.onlineCount : 0;
                activeOnlineUsers = new Set(data.users || []);
                renderDrawerMembers();
            }
        }
        // 4. Server error notification
        else if (data.type === "ERROR") {
            console.warn("WebSocket server error:", data.error);
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

    function sendTypingEvent(state) {
        if (socket && socket.readyState === WebSocket.OPEN && currentGroup) {
            socket.send(JSON.stringify({
                type: state ? "TYPING_START" : "TYPING_STOP",
                groupId: currentGroup.id
            }));
        }
    }

    // ============================================================
    // 5. DASHBOARD, TABS & GROUPS EXPLORATION
    // ============================================================
    async function loadGroups() {
        groupsLoading.style.display = "flex";
        groupsListContainer.style.display = "none";
        noGroupsMessage.style.display = "none";

        try {
            const res = await apiRequest("/api/groups");
            if (!res) return;

            if (res.ok) {
                allGroups = await res.json();
                updateTabCounters();
                renderCurrentGroupList();

                // If currently inside a group chat, refresh its currentGroup reference
                if (currentGroup) {
                    const refreshed = allGroups.find(g => g.id === currentGroup.id);
                    if (refreshed) {
                        currentGroup = refreshed;
                        updateChatHeader(currentGroup);
                    }
                }
            } else {
                console.error("Failed to fetch groups from server:", res.status);
            }
        } catch (err) {
            console.error("Error loading groups:", err);
        } finally {
            groupsLoading.style.display = "none";
        }
    }

    function updateTabCounters() {
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
            discoverFilterRow.style.display = "none";
        } else {
            tabDiscoverGroups.classList.add("active");
            tabMyGroups.classList.remove("active");
            discoverFilterRow.style.display = "flex";
        }
        renderCurrentGroupList();
    }

    tabMyGroups.addEventListener("click", () => switchTab("my"));
    tabDiscoverGroups.addEventListener("click", () => switchTab("discover"));

    // Discover filter pills
    document.querySelectorAll(".filter-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            currentDiscoverFilter = pill.getAttribute("data-filter") || "ALL";
            renderCurrentGroupList();
        });
    });

    // Search input
    groupSearchInput.addEventListener("input", () => {
        const hasText = groupSearchInput.value.trim().length > 0;
        clearSearchBtn.style.display = hasText ? "block" : "none";
        renderCurrentGroupList();
    });

    clearSearchBtn.addEventListener("click", () => {
        groupSearchInput.value = "";
        clearSearchBtn.style.display = "none";
        groupSearchInput.focus();
        renderCurrentGroupList();
    });

    function renderCurrentGroupList() {
        const query = groupSearchInput.value.trim().toLowerCase();

        let filtered = [];
        if (currentTab === "my") {
            filtered = allGroups.filter(g => g.member);
        } else {
            filtered = allGroups.filter(g => !g.member);
            if (currentDiscoverFilter === "PUBLIC") {
                filtered = filtered.filter(g => g.privacy !== "PRIVATE");
            } else if (currentDiscoverFilter === "PRIVATE") {
                filtered = filtered.filter(g => g.privacy === "PRIVATE");
            }
        }

        if (query) {
            filtered = filtered.filter(g =>
                g.name.toLowerCase().includes(query) ||
                (g.description && g.description.toLowerCase().includes(query))
            );
        }

        groupsListContainer.innerHTML = "";

        if (filtered.length === 0) {
            noGroupsMessage.style.display = "flex";
            groupsListContainer.style.display = "none";
            if (currentTab === "my") {
                emptyStateText.textContent = query
                    ? "No matching groups in your chats."
                    : "You haven't joined any groups yet. Switch to Discover or create a group.";
            } else {
                emptyStateText.textContent = query
                    ? "No groups match your search criteria."
                    : "No groups available in this category.";
            }
            return;
        }

        noGroupsMessage.style.display = "none";
        groupsListContainer.style.display = "flex";

        filtered.forEach(group => {
            if (currentTab === "my") {
                renderMyGroupItem(group);
            } else {
                renderDiscoverGroupItem(group);
            }
        });
    }

    // Render item for "My Groups" tab (WhatsApp-style compact list item)
    function renderMyGroupItem(group) {
        const item = document.createElement("div");
        item.className = `group-item ${currentGroup && currentGroup.id === group.id ? 'active' : ''}`;
        item.setAttribute("data-group-id", group.id);

        const initial = (group.name || "G").charAt(0).toUpperCase();
        const isPrivate = group.privacy === "PRIVATE";
        const isAdmin = group.admin;

        item.innerHTML = `
            <div class="group-item-avatar">${initial}</div>
            <div class="group-item-content">
                <div class="group-item-header">
                    <span class="group-item-title">${escapeHtml(group.name)}</span>
                    <span class="group-item-time">${formatTimeShort(group.updatedAt || group.createdAt)}</span>
                </div>
                <p class="group-item-preview">${escapeHtml(group.description || "No recent messages")}</p>
                <div class="group-item-meta">
                    <span class="privacy-pill-micro">${isPrivate ? '🔒 Private' : '🌐 Public'}</span>
                    ${isAdmin ? '<span class="admin-tag-micro">Admin</span>' : ''}
                    <span style="font-size: 11px; color: var(--text-muted); margin-left: auto;">${group.memberCount} members</span>
                </div>
            </div>
        `;

        item.addEventListener("click", () => {
            openGroupChat(group);
        });

        groupsListContainer.appendChild(item);
    }

    // Render item for "Discover Groups" tab (Clean card with Join / Request to Join actions)
    function renderDiscoverGroupItem(group) {
        const item = document.createElement("div");
        item.className = "discover-group-item";

        const initial = (group.name || "G").charAt(0).toUpperCase();
        const isPrivate = group.privacy === "PRIVATE";
        const hasPending = group.hasPendingRequest;

        item.innerHTML = `
            <div class="discover-item-top">
                <div class="group-item-avatar">${initial}</div>
                <div class="discover-item-info">
                    <h4 class="discover-item-name">${escapeHtml(group.name)}</h4>
                    <p class="discover-item-desc">${escapeHtml(group.description || "No description provided.")}</p>
                </div>
            </div>
            <div class="discover-item-footer">
                <div class="discover-item-badges">
                    <span class="privacy-pill-micro">${isPrivate ? '🔒 Private' : '🌐 Public'}</span>
                    <span>${group.memberCount} ${group.memberCount === 1 ? 'member' : 'members'}</span>
                </div>
                <div class="discover-btn-group">
                    ${isPrivate
                        ? (hasPending
                            ? `<button class="join-action-btn pending" disabled>Request Pending</button>`
                            : `
                                <button class="join-action-btn outline btn-enter-code" data-id="${group.id}">Join with Code</button>
                                <button class="join-action-btn primary btn-request-join" data-id="${group.id}">Request to Join</button>
                              `
                          )
                        : `<button class="join-action-btn primary btn-join-public" data-id="${group.id}">Join</button>`
                    }
                </div>
            </div>
        `;

        // Bind button actions
        const joinPublicBtn = item.querySelector(".btn-join-public");
        if (joinPublicBtn) {
            joinPublicBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                joinPublicGroup(group.id);
            });
        }

        const enterCodeBtn = item.querySelector(".btn-enter-code");
        if (enterCodeBtn) {
            enterCodeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                openJoinPrivateModal(group);
            });
        }

        const requestJoinBtn = item.querySelector(".btn-request-join");
        if (requestJoinBtn) {
            requestJoinBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                submitJoinRequest(group.id, requestJoinBtn);
            });
        }

        groupsListContainer.appendChild(item);
    }

    // ============================================================
    // 6. TWO-TIER PRIVATE GROUP JOINING WORKFLOW
    // ============================================================

    // Method 1: Join with Invite Code Modal
    function openJoinPrivateModal(targetGroup = null) {
        joinPrivateError.style.display = "none";
        joinPrivateError.textContent = "";
        privateInviteCodeInput.value = "";
        targetPrivateGroupId.value = targetGroup ? targetGroup.id : "";

        if (targetGroup) {
            joinPrivateModalTitle.textContent = `Join "${targetGroup.name}"`;
        } else {
            joinPrivateModalTitle.textContent = "Join with Code";
        }

        joinPrivateModal.style.display = "flex";
        privateInviteCodeInput.focus();
    }

    function closeJoinPrivateModal() {
        joinPrivateModal.style.display = "none";
    }

    openJoinPrivateModalBtn.addEventListener("click", () => openJoinPrivateModal(null));
    closeJoinPrivateModalBtn.addEventListener("click", closeJoinPrivateModal);
    cancelJoinPrivateModalBtn.addEventListener("click", closeJoinPrivateModal);

    joinPrivateModal.addEventListener("click", (e) => {
        if (e.target === joinPrivateModal) closeJoinPrivateModal();
    });

    joinPrivateForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        joinPrivateError.style.display = "none";

        const inviteCode = privateInviteCodeInput.value.trim().toUpperCase();
        const groupId = targetPrivateGroupId.value;

        if (!inviteCode) {
            joinPrivateError.textContent = "Please enter an invitation code.";
            joinPrivateError.style.display = "block";
            return;
        }

        submitJoinPrivateBtn.disabled = true;
        submitJoinPrivateBtn.textContent = "Verifying...";

        try {
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
                joinPrivateError.textContent = data.error || "Invalid invitation code or unauthorized.";
                joinPrivateError.style.display = "block";
            }
        } catch (err) {
            console.error("Join private error:", err);
            joinPrivateError.textContent = "Failed to communicate with server.";
            joinPrivateError.style.display = "block";
        } finally {
            submitJoinPrivateBtn.disabled = false;
            submitJoinPrivateBtn.textContent = "Join Group";
        }
    });

    // Method 2: Request to Join Workflow
    async function submitJoinRequest(groupId, buttonEl) {
        buttonEl.disabled = true;
        buttonEl.textContent = "Submitting...";

        try {
            const res = await apiRequest(`/api/groups/${groupId}/join-request`, {
                method: "POST"
            });

            if (res.ok) {
                buttonEl.textContent = "Request Pending";
                buttonEl.className = "join-action-btn pending";
                // Update local model
                const group = allGroups.find(g => g.id === groupId);
                if (group) group.hasPendingRequest = true;
            } else {
                const data = await res.json();
                alert(data.error || "Failed to submit join request.");
                buttonEl.disabled = false;
                buttonEl.textContent = "Request to Join";
            }
        } catch (err) {
            console.error("Submit join request error:", err);
            alert("Network error submitting request.");
            buttonEl.disabled = false;
            buttonEl.textContent = "Request to Join";
        }
    }

    // Direct Public Group Join
    async function joinPublicGroup(groupId) {
        try {
            const res = await apiRequest(`/api/groups/${groupId}/join`, {
                method: "POST"
            });

            if (res.ok) {
                const updated = await res.json();
                await loadGroups();
                openGroupChat(updated);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to join group.");
            }
        } catch (err) {
            console.error("Join public group error:", err);
            alert("Network error joining group.");
        }
    }

    // ============================================================
    // 7. CREATE GROUP WORKFLOW
    // ============================================================
    openCreateModalBtn.addEventListener("click", () => {
        createGroupError.style.display = "none";
        newGroupName.value = "";
        newGroupDesc.value = "";
        const defaultRadio = createGroupForm.querySelector('input[name="newGroupPrivacy"][value="PUBLIC"]');
        if (defaultRadio) defaultRadio.checked = true;
        createGroupModal.style.display = "flex";
        newGroupName.focus();
    });

    function closeCreateModal() {
        createGroupModal.style.display = "none";
    }

    closeCreateModalBtn.addEventListener("click", closeCreateModal);
    cancelCreateModalBtn.addEventListener("click", closeCreateModal);

    createGroupModal.addEventListener("click", (e) => {
        if (e.target === createGroupModal) closeCreateModal();
    });

    createGroupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        createGroupError.style.display = "none";

        const name = newGroupName.value.trim();
        const description = newGroupDesc.value.trim();
        const privacy = (createGroupForm.querySelector('input[name="newGroupPrivacy"]:checked') || {}).value || "PUBLIC";

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
                body: JSON.stringify({ name, description, privacy })
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
    // 8. OPEN & CLOSE GROUP CHAT VIEW
    // ============================================================
    async function openGroupChat(group) {
        currentGroup = group;
        displayedMessageIds.clear();
        activeTypers.clear();
        updateTypingUI();

        // Switch main view
        noChatSelectedState.style.display = "none";
        activeChatView.style.display = "flex";

        // Mobile active state
        chatMainPane.classList.add("mobile-active");

        // Highlight active group in sidebar
        document.querySelectorAll(".group-item").forEach(item => {
            if (item.getAttribute("data-group-id") === group.id) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        // Update Navbar Header
        updateChatHeader(group);

        // Update Right Drawer details
        updateDrawerDetails(group);

        // Messages placeholder
        messagesList.innerHTML = `<div class="list-placeholder-state"><div class="loading-spinner"></div><span>Loading messages...</span></div>`;

        // Connect WebSocket and send JOIN_GROUP
        initWebSocket();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "JOIN_GROUP",
                groupId: group.id
            }));
        }

        // Load messages history from MongoDB
        loadMessageHistory(group.id);

        // Load members list
        loadGroupMembers(group.id);

        // If admin, load pending join requests
        if (group.admin) {
            loadPendingJoinRequests(group.id);
        } else {
            drawerRequestsSection.style.display = "none";
            menuItemRequests.style.display = "none";
            menuPendingBadge.style.display = "none";
        }

        messageInput.focus();
    }

    function updateChatHeader(group) {
        const initial = (group.name || "G").charAt(0).toUpperCase();
        if (chatHeaderAvatar) chatHeaderAvatar.textContent = initial;
        if (chatGroupName) chatGroupName.textContent = group.name;
        if (chatGroupMembersCount) chatGroupMembersCount.textContent = `${group.memberCount} ${group.memberCount === 1 ? 'member' : 'members'}`;

        const isPrivate = group.privacy === "PRIVATE";
        if (chatPrivacyText) chatPrivacyText.textContent = isPrivate ? "Private" : "Public";
        if (chatPrivacyIndicator) {
            chatPrivacyIndicator.className = `privacy-tag ${isPrivate ? 'private' : 'public'}`;
        }

        // Menu items visibility
        menuItemInvite.style.display = (isPrivate && (group.admin || group.member)) ? "flex" : "none";
        menuItemDelete.style.display = group.admin ? "flex" : "none";
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

        activeChatView.style.display = "none";
        noChatSelectedState.style.display = "flex";
        chatMainPane.classList.remove("mobile-active");
        closeInfoDrawer();

        document.querySelectorAll(".group-item").forEach(i => i.classList.remove("active"));
    }

    mobileBackBtn.addEventListener("click", closeGroupChat);

    // ============================================================
    // 9. RIGHT GROUP INFO & ADMIN DRAWER
    // ============================================================
    function updateDrawerDetails(group) {
        const initial = (group.name || "G").charAt(0).toUpperCase();
        drawerGroupAvatar.textContent = initial;
        drawerGroupName.textContent = group.name;
        drawerGroupDesc.textContent = group.description || "No description provided.";
        drawerPrivacyBadge.textContent = group.privacy === "PRIVATE" ? "🔒 Private Hive" : "🌐 Public Group";
        drawerMembersCount.textContent = `${group.memberCount} members`;

        // Invite code section
        const isPrivate = group.privacy === "PRIVATE";
        if (isPrivate && (group.member || group.admin) && group.inviteCode) {
            drawerInviteSection.style.display = "block";
            drawerInviteCode.textContent = group.inviteCode;
            drawerRegenCodeBtn.style.display = group.admin ? "inline-flex" : "none";
        } else {
            drawerInviteSection.style.display = "none";
        }

        // Danger zone buttons
        drawerDeleteBtn.style.display = group.admin ? "flex" : "none";
    }

    function toggleInfoDrawer() {
        if (rightInfoDrawer.style.display === "none" || !rightInfoDrawer.style.display) {
            openInfoDrawer();
        } else {
            closeInfoDrawer();
        }
    }

    function openInfoDrawer() {
        rightInfoDrawer.style.display = "flex";
    }

    function closeInfoDrawer() {
        rightInfoDrawer.style.display = "none";
    }

    toggleInfoDrawerBtn.addEventListener("click", toggleInfoDrawer);
    closeInfoDrawerBtn.addEventListener("click", closeInfoDrawer);

    // Copy Invite Code in Drawer
    drawerCopyCodeBtn.addEventListener("click", () => {
        if (currentGroup && currentGroup.inviteCode) {
            navigator.clipboard.writeText(currentGroup.inviteCode).then(() => {
                const label = drawerCopyCodeBtn.querySelector("span");
                const prev = label.textContent;
                label.textContent = "Copied!";
                setTimeout(() => { label.textContent = prev; }, 2000);
            }).catch(() => {
                prompt("Copy invite code:", currentGroup.inviteCode);
            });
        }
    });

    // Regenerate Invite Code (Admin Only)
    drawerRegenCodeBtn.addEventListener("click", async () => {
        if (!currentGroup || !currentGroup.admin) return;

        showConfirmDialog(
            "Regenerate Invite Code",
            "Are you sure? The current invite code will be permanently invalidated and can no longer be used by new members.",
            async () => {
                try {
                    const res = await apiRequest(`/api/groups/${currentGroup.id}/regenerate-code`, {
                        method: "POST"
                    });

                    if (res.ok) {
                        const updated = await res.json();
                        currentGroup = updated;
                        drawerInviteCode.textContent = updated.inviteCode;
                        const label = drawerRegenCodeBtn.querySelector("span");
                        label.textContent = "Done!";
                        setTimeout(() => { label.textContent = "Regenerate"; }, 2000);
                        await loadGroups();
                    } else {
                        const data = await res.json();
                        alert(data.error || "Failed to regenerate code.");
                    }
                } catch (e) {
                    console.error("Regenerate code error:", e);
                    alert("Network error regenerating code.");
                }
            }
        );
    });

    // ============================================================
    // 10. ADMIN PENDING JOIN REQUESTS MANAGEMENT
    // ============================================================
    async function loadPendingJoinRequests(groupId) {
        try {
            const res = await apiRequest(`/api/groups/${groupId}/join-requests`);
            if (res && res.ok) {
                const requests = await res.json();
                renderPendingRequests(requests);
            }
        } catch (e) {
            console.error("Failed to load join requests:", e);
        }
    }

    function renderPendingRequests(requests) {
        if (!requests || requests.length === 0) {
            drawerRequestsSection.style.display = "none";
            menuItemRequests.style.display = "none";
            menuPendingBadge.style.display = "none";
            return;
        }

        drawerRequestsSection.style.display = "block";
        menuItemRequests.style.display = "flex";
        menuRequestsCount.textContent = requests.length;
        drawerRequestsBadge.textContent = requests.length;
        menuPendingBadge.style.display = "block";

        drawerRequestsList.innerHTML = "";
        requests.forEach(req => {
            const card = document.createElement("div");
            card.className = "request-card";
            card.innerHTML = `
                <div class="request-card-header">
                    <span class="request-username">${escapeHtml(req.username)}</span>
                    <span class="request-time">${formatTimeShort(req.requestedAt)}</span>
                </div>
                <div class="request-card-actions">
                    <button class="request-action-btn request-accept-btn" data-req-id="${req.id}">Accept</button>
                    <button class="request-action-btn request-reject-btn" data-req-id="${req.id}">Reject</button>
                </div>
            `;

            const acceptBtn = card.querySelector(".request-accept-btn");
            acceptBtn.addEventListener("click", () => reviewRequest(req.id, true));

            const rejectBtn = card.querySelector(".request-reject-btn");
            rejectBtn.addEventListener("click", () => reviewRequest(req.id, false));

            drawerRequestsList.appendChild(card);
        });
    }

    async function reviewRequest(requestId, approve) {
        if (!currentGroup) return;

        try {
            const res = await apiRequest(`/api/groups/${currentGroup.id}/join-requests/${requestId}/review?approve=${approve}`, {
                method: "POST"
            });

            if (res.ok) {
                const updatedGroup = await res.json();
                currentGroup = updatedGroup;
                updateChatHeader(currentGroup);
                updateDrawerDetails(currentGroup);
                await loadGroupMembers(currentGroup.id);
                await loadPendingJoinRequests(currentGroup.id);
                await loadGroups();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to review join request.");
            }
        } catch (e) {
            console.error("Review request error:", e);
            alert("Network error reviewing join request.");
        }
    }

    // ============================================================
    // 11. MEMBERS LIST IN DRAWER
    // ============================================================
    async function loadGroupMembers(groupId) {
        try {
            const res = await apiRequest(`/api/groups/${groupId}/members`);
            if (res && res.ok) {
                currentMembers = await res.json();
                renderDrawerMembers();
            }
        } catch (e) {
            console.error("Failed to load group members:", e);
        }
    }

    function renderDrawerMembers() {
        if (!drawerMembersList) return;
        drawerMembersList.innerHTML = "";
        drawerMembersTotal.textContent = currentMembers.length;

        currentMembers.forEach(member => {
            const isOnline = activeOnlineUsers.has(member.username);
            const isSelf = member.id === currentUser.id;
            const isAdmin = currentGroup && currentGroup.createdBy === member.id;

            const row = document.createElement("div");
            row.className = "drawer-member-row";
            row.innerHTML = `
                <span class="member-presence-dot ${isOnline ? 'online' : 'offline'}" title="${isOnline ? 'Online' : 'Offline'}"></span>
                <span class="drawer-member-name">${escapeHtml(member.username)} ${isSelf ? '<small style="color:var(--text-muted);">(you)</small>' : ''}</span>
                ${isAdmin ? '<span class="admin-badge-tag">Admin</span>' : ''}
            `;
            drawerMembersList.appendChild(row);
        });
    }

    // ============================================================
    // 12. MESSAGE HISTORY & RENDERING
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
                        <div class="list-placeholder-state" style="margin: auto;">
                            <p style="color: var(--text-muted);">No messages yet. Send a message to start the conversation!</p>
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
                messagesList.innerHTML = `<div class="list-placeholder-state" style="margin: auto;"><p>Failed to load message history.</p></div>`;
            }
        } catch (e) {
            console.error("Load messages error:", e);
            messagesList.innerHTML = `<div class="list-placeholder-state" style="margin: auto;"><p>Network error loading messages.</p></div>`;
        }
    }

    function appendMessage(msg, shouldScroll = true) {
        // Remove empty state placeholder if present
        const placeholder = messagesList.querySelector(".list-placeholder-state");
        if (placeholder) placeholder.remove();

        const mine = msg.senderId === currentUser.id || msg.senderUsername === currentUser.username;
        const timeStr = formatTimestamp(msg.timestamp);

        const row = document.createElement("div");
        row.className = `message-row ${mine ? 'mine' : 'other'}`;

        row.innerHTML = `
            <div class="message-bubble">
                ${!mine ? `<span class="message-sender">${escapeHtml(msg.senderUsername || 'Member')}</span>` : ''}
                <div class="message-text">${escapeHtml(msg.content)}</div>
                <div class="message-meta">
                    <span class="message-time">${timeStr}</span>
                    ${mine ? '<span class="message-check">✓</span>' : ''}
                </div>
            </div>
        `;

        messagesList.appendChild(row);

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

    function formatTimeShort(isoStr) {
        if (!isoStr) return "";
        try {
            const date = new Date(isoStr);
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();
            if (isToday) {
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");
                return `${hours}:${minutes}`;
            }
            return `${date.getMonth() + 1}/${date.getDate()}`;
        } catch (e) {
            return "";
        }
    }

    // ============================================================
    // 13. REAL-TIME MESSAGE COMPOSER
    // ============================================================
    messageInput.addEventListener("input", () => {
        if (!currentGroup) return;

        // Auto-expand height
        messageInput.style.height = "auto";
        messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + "px";

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

    // Support Shift+Enter for newline, Enter to send
    messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            chatForm.requestSubmit();
        }
    });

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
            messageInput.style.height = "auto";
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
                    messageInput.style.height = "auto";
                } else {
                    alert("Reconnecting to chat server... Please try again in a moment.");
                }
            }, 500);
        }
    });

    // ============================================================
    // 14. LEAVE & DELETE GROUP CONFIRMATIONS
    // ============================================================
    function showConfirmDialog(title, message, onProceed) {
        confirmModalTitle.textContent = title;
        confirmModalMessage.textContent = message;
        confirmActionCallback = onProceed;
        confirmActionModal.style.display = "flex";
    }

    function closeConfirmDialog() {
        confirmActionModal.style.display = "none";
        confirmActionCallback = null;
    }

    closeConfirmModalBtn.addEventListener("click", closeConfirmDialog);
    cancelConfirmModalBtn.addEventListener("click", closeConfirmDialog);
    proceedConfirmModalBtn.addEventListener("click", () => {
        if (confirmActionCallback) confirmActionCallback();
        closeConfirmDialog();
    });

    confirmActionModal.addEventListener("click", (e) => {
        if (e.target === confirmActionModal) closeConfirmDialog();
    });

    // Leave Group Handler
    function handleLeaveCurrentGroup() {
        if (!currentGroup) return;

        showConfirmDialog(
            "Leave Group",
            `Are you sure you want to leave "${currentGroup.name}"? You will lose access to its messages.`,
            async () => {
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
                        alert(data.error || "Failed to leave group.");
                    }
                } catch (e) {
                    console.error("Leave group error:", e);
                    alert("Network error leaving group.");
                }
            }
        );
    }

    // Delete Group Handler (Admin Only)
    function handleDeleteCurrentGroup() {
        if (!currentGroup || !currentGroup.admin) return;

        showConfirmDialog(
            "Delete Group",
            `Are you sure you want to permanently delete "${currentGroup.name}" and all of its messages? This action cannot be undone.`,
            async () => {
                try {
                    const res = await apiRequest(`/api/groups/${currentGroup.id}`, {
                        method: "DELETE"
                    });

                    if (res.ok) {
                        closeGroupChat();
                        await loadGroups();
                    } else {
                        const data = await res.json();
                        alert(data.error || "Failed to delete group.");
                    }
                } catch (e) {
                    console.error("Delete group error:", e);
                    alert("Network error deleting group.");
                }
            }
        );
    }

    drawerLeaveBtn.addEventListener("click", handleLeaveCurrentGroup);
    menuItemLeave.addEventListener("click", () => {
        groupDropdownMenu.style.display = "none";
        handleLeaveCurrentGroup();
    });

    drawerDeleteBtn.addEventListener("click", handleDeleteCurrentGroup);
    menuItemDelete.addEventListener("click", () => {
        groupDropdownMenu.style.display = "none";
        handleDeleteCurrentGroup();
    });

    // 3-dot Menu item actions
    menuItemOpenInfo.addEventListener("click", () => {
        groupDropdownMenu.style.display = "none";
        openInfoDrawer();
    });

    menuItemMembers.addEventListener("click", () => {
        groupDropdownMenu.style.display = "none";
        openInfoDrawer();
    });

    menuItemInvite.addEventListener("click", () => {
        groupDropdownMenu.style.display = "none";
        openInfoDrawer();
    });

    menuItemRequests.addEventListener("click", () => {
        groupDropdownMenu.style.display = "none";
        openInfoDrawer();
        if (drawerRequestsSection) {
            drawerRequestsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // ============================================================
    // 15. DROPDOWN MENUS & LOGOUT
    // ============================================================
    userMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdownMenu.style.display = userDropdownMenu.style.display === "none" ? "block" : "none";
    });

    groupMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        groupDropdownMenu.style.display = groupDropdownMenu.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", (e) => {
        if (!userMenuBtn.contains(e.target) && !userDropdownMenu.contains(e.target)) {
            userDropdownMenu.style.display = "none";
        }
        if (!groupMenuBtn.contains(e.target) && !groupDropdownMenu.contains(e.target)) {
            groupDropdownMenu.style.display = "none";
        }
    });

    logoutBtn.addEventListener("click", () => {
        if (socket) socket.close();
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