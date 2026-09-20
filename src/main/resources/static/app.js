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
    const menuItemSavedPosts = document.getElementById("menuItemSavedPosts");
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

    // Main Chat Pane & Header
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

    // Community Spaces Navigation Tabs
    const tabGeneralChat = document.getElementById("tabGeneralChat");
    const tabCommunityPosts = document.getElementById("tabCommunityPosts");
    const newPostsDot = document.getElementById("newPostsDot");
    const chatViewContainer = document.getElementById("chatViewContainer");
    const postsViewContainer = document.getElementById("postsViewContainer");

    // Chat Conversation & Composer
    const messagesList = document.getElementById("messagesList");
    const typingIndicator = document.getElementById("typingIndicator");
    const typingText = document.getElementById("typingText");
    const chatImagePreviewBar = document.getElementById("chatImagePreviewBar");
    const chatPreviewThumb = document.getElementById("chatPreviewThumb");
    const chatImageName = document.getElementById("chatImageName");
    const removeChatImageBtn = document.getElementById("removeChatImageBtn");
    const chatForm = document.getElementById("chatForm");
    const chatFileInput = document.getElementById("chatFileInput");
    const chatAttachBtn = document.getElementById("chatAttachBtn");
    const messageInput = document.getElementById("messageInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");

    // Community Posts Feed Controls
    const openCreatePostModalBtn = document.getElementById("openCreatePostModalBtn");
    const emptyStateCreatePostBtn = document.getElementById("emptyStateCreatePostBtn");
    const postCategoryFilter = document.getElementById("postCategoryFilter");
    const activeTagFilterPill = document.getElementById("activeTagFilterPill");
    const activeTagName = document.getElementById("activeTagName");
    const clearTagFilterBtn = document.getElementById("clearTagFilterBtn");
    const refreshPostsBtn = document.getElementById("refreshPostsBtn");
    const newPostsBanner = document.getElementById("newPostsBanner");
    const postsScrollStream = document.getElementById("postsScrollStream");
    const postsEmptyState = document.getElementById("postsEmptyState");
    const postsFeedContainer = document.getElementById("postsFeedContainer");
    const postsLoadingIndicator = document.getElementById("postsLoadingIndicator");

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

    // Modals: Create Group
    const createGroupModal = document.getElementById("createGroupModal");
    const closeCreateModalBtn = document.getElementById("closeCreateModalBtn");
    const cancelCreateModalBtn = document.getElementById("cancelCreateModalBtn");
    const createGroupForm = document.getElementById("createGroupForm");
    const createGroupError = document.getElementById("createGroupError");
    const newGroupName = document.getElementById("newGroupName");
    const newGroupDesc = document.getElementById("newGroupDesc");
    const submitCreateGroupBtn = document.getElementById("submitCreateGroupBtn");

    // Modals: Join Private
    const joinPrivateModal = document.getElementById("joinPrivateModal");
    const closeJoinPrivateModalBtn = document.getElementById("closeJoinPrivateModalBtn");
    const cancelJoinPrivateModalBtn = document.getElementById("cancelJoinPrivateModalBtn");
    const joinPrivateForm = document.getElementById("joinPrivateForm");
    const joinPrivateError = document.getElementById("joinPrivateError");
    const joinPrivateModalTitle = document.getElementById("joinPrivateModalTitle");
    const targetPrivateGroupId = document.getElementById("targetPrivateGroupId");
    const privateInviteCodeInput = document.getElementById("privateInviteCodeInput");
    const submitJoinPrivateBtn = document.getElementById("submitJoinPrivateBtn");

    // Modals: Confirm Action
    const confirmActionModal = document.getElementById("confirmActionModal");
    const closeConfirmModalBtn = document.getElementById("closeConfirmModalBtn");
    const cancelConfirmModalBtn = document.getElementById("cancelConfirmModalBtn");
    const proceedConfirmModalBtn = document.getElementById("proceedConfirmModalBtn");
    const confirmModalTitle = document.getElementById("confirmModalTitle");
    const confirmModalMessage = document.getElementById("confirmModalMessage");

    // Modals: Create Post
    const createPostModal = document.getElementById("createPostModal");
    const closeCreatePostModalBtn = document.getElementById("closeCreatePostModalBtn");
    const cancelCreatePostBtn = document.getElementById("cancelCreatePostBtn");
    const createPostForm = document.getElementById("createPostForm");
    const createPostError = document.getElementById("createPostError");
    const postTitleInput = document.getElementById("postTitleInput");
    const postContentInput = document.getElementById("postContentInput");
    const postImageUploadZone = document.getElementById("postImageUploadZone");
    const postImageFileInput = document.getElementById("postImageFileInput");
    const postImagePlaceholder = document.getElementById("postImagePlaceholder");
    const postImagePreviewContainer = document.getElementById("postImagePreviewContainer");
    const postImagePreviewImg = document.getElementById("postImagePreviewImg");
    const removePostImageBtn = document.getElementById("removePostImageBtn");
    const postLinkInput = document.getElementById("postLinkInput");
    const postCategoryInput = document.getElementById("postCategoryInput");
    const postTagsInput = document.getElementById("postTagsInput");
    const submitCreatePostBtn = document.getElementById("submitCreatePostBtn");

    // Modals: Edit Post
    const editPostModal = document.getElementById("editPostModal");
    const closeEditPostModalBtn = document.getElementById("closeEditPostModalBtn");
    const cancelEditPostBtn = document.getElementById("cancelEditPostBtn");
    const editPostForm = document.getElementById("editPostForm");
    const editPostError = document.getElementById("editPostError");
    const editPostId = document.getElementById("editPostId");
    const editPostTitleInput = document.getElementById("editPostTitleInput");
    const editPostContentInput = document.getElementById("editPostContentInput");
    const editPostLinkInput = document.getElementById("editPostLinkInput");
    const editPostCategoryInput = document.getElementById("editPostCategoryInput");
    const editPostTagsInput = document.getElementById("editPostTagsInput");
    const submitEditPostBtn = document.getElementById("submitEditPostBtn");

    // Modals: Verification Assessment
    const verificationModal = document.getElementById("verificationModal");
    const closeVerificationModalBtn = document.getElementById("closeVerificationModalBtn");
    const cancelVerificationModalBtn = document.getElementById("cancelVerificationModalBtn");
    const verificationForm = document.getElementById("verificationForm");
    const verificationModalError = document.getElementById("verificationModalError");
    const verifyPostId = document.getElementById("verifyPostId");
    const verifyReasonInput = document.getElementById("verifyReasonInput");
    const verifyEvidenceLinkInput = document.getElementById("verifyEvidenceLinkInput");
    const removeVerificationVoteBtn = document.getElementById("removeVerificationVoteBtn");
    const submitVerificationBtn = document.getElementById("submitVerificationBtn");

    // Modals: Verification Details
    const verificationDetailsModal = document.getElementById("verificationDetailsModal");
    const closeVerificationDetailsBtn = document.getElementById("closeVerificationDetailsBtn");
    const closeVerificationDetailsFooterBtn = document.getElementById("closeVerificationDetailsFooterBtn");
    const detailVerifiedCount = document.getElementById("detailVerifiedCount");
    const detailVerifiedPct = document.getElementById("detailVerifiedPct");
    const detailNotVerifiedCount = document.getElementById("detailNotVerifiedCount");
    const detailNotVerifiedPct = document.getElementById("detailNotVerifiedPct");
    const detailProgressBar = document.getElementById("detailProgressBar");
    const detailTotalVotesNote = document.getElementById("detailTotalVotesNote");
    const verificationEvidenceList = document.getElementById("verificationEvidenceList");

    // Modals: Report Post
    const reportPostModal = document.getElementById("reportPostModal");
    const closeReportPostModalBtn = document.getElementById("closeReportPostModalBtn");
    const cancelReportPostBtn = document.getElementById("cancelReportPostBtn");
    const reportPostForm = document.getElementById("reportPostForm");
    const reportPostError = document.getElementById("reportPostError");
    const reportPostId = document.getElementById("reportPostId");
    const reportReasonSelect = document.getElementById("reportReasonSelect");
    const reportDetailsInput = document.getElementById("reportDetailsInput");
    const submitReportPostBtn = document.getElementById("submitReportPostBtn");

    // Modals: Saved Posts
    const savedPostsModal = document.getElementById("savedPostsModal");
    const closeSavedPostsModalBtn = document.getElementById("closeSavedPostsModalBtn");
    const savedPostsLoading = document.getElementById("savedPostsLoading");
    const savedPostsEmpty = document.getElementById("savedPostsEmpty");
    const savedPostsList = document.getElementById("savedPostsList");

    // Modals: Image Lightbox
    const imageLightboxModal = document.getElementById("imageLightboxModal");
    const downloadLightboxBtn = document.getElementById("downloadLightboxBtn");
    const closeLightboxBtn = document.getElementById("closeLightboxBtn");
    const lightboxImage = document.getElementById("lightboxImage");

    // ============================================================
    // 3. APPLICATION STATE
    // ============================================================
    let allGroups = [];
    let currentTab = "my"; // "my" or "discover"
    let currentDiscoverFilter = "ALL"; // "ALL", "PUBLIC", "PRIVATE"
    let currentGroup = null;
    let currentCommunitySpace = "chat"; // "chat" or "posts"
    let currentMembers = [];
    let activeOnlineUsers = new Set();
    let displayedMessageIds = new Set(); // Message deduplication cache
    let activeTypers = new Set();
    let isTyping = false;
    let typingTimeout = null;
    let socket = null;
    let socketReconnectTimer = null;
    let confirmActionCallback = null;

    // Chat Image Attachment State
    let pendingChatFile = null;

    // Community Posts Feed State
    let postsList = [];
    let postsPage = 0;
    let postsTotalPages = 1;
    let isPostsLoading = false;
    let currentCategoryFilter = "ALL";
    let currentTagFilter = "";
    let pendingPostFile = null;

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
                status: data.status,
                mediaUrl: data.mediaUrl,
                messageType: data.messageType
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
        // 4. Real-time Community Post notification
        else if (data.type === "POST_CREATED") {
            if (currentGroup && data.groupId === currentGroup.id) {
                if (currentCommunitySpace === "posts") {
                    if (newPostsBanner) newPostsBanner.style.display = "flex";
                } else {
                    if (newPostsDot) newPostsDot.style.display = "block";
                }
            }
        }
        // 5. Server error notification
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

    function switchSidebarTab(tab) {
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

    tabMyGroups.addEventListener("click", () => switchSidebarTab("my"));
    tabDiscoverGroups.addEventListener("click", () => switchSidebarTab("discover"));

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
                <p class="group-item-preview">${escapeHtml(group.description || "No recent activity")}</p>
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
    // 8. OPEN & CLOSE GROUP CHAT VIEW & COMMUNITY SPACES
    // ============================================================
    async function openGroupChat(group) {
        currentGroup = group;
        displayedMessageIds.clear();
        activeTypers.clear();
        updateTypingUI();

        // Switch main view
        noChatSelectedState.style.display = "none";
        activeChatView.style.display = "flex";

        // Reset to General Chat Space
        switchCommunitySpace("chat");

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

        // Reset Community Posts feed state for this group
        postsList = [];
        postsPage = 0;
        currentCategoryFilter = "ALL";
        currentTagFilter = "";
        if (postCategoryFilter) postCategoryFilter.value = "ALL";
        if (activeTagFilterPill) activeTagFilterPill.style.display = "none";
        if (newPostsBanner) newPostsBanner.style.display = "none";
        if (newPostsDot) newPostsDot.style.display = "none";

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

    function switchCommunitySpace(space) {
        currentCommunitySpace = space;
        if (space === "chat") {
            tabGeneralChat.classList.add("active");
            tabCommunityPosts.classList.remove("active");
            chatViewContainer.style.display = "flex";
            postsViewContainer.style.display = "none";
            scrollMessagesToBottom();
        } else {
            tabCommunityPosts.classList.add("active");
            tabGeneralChat.classList.remove("active");
            chatViewContainer.style.display = "none";
            postsViewContainer.style.display = "flex";
            if (newPostsDot) newPostsDot.style.display = "none";

            // Load community posts if not loaded
            if (postsList.length === 0 && currentGroup) {
                loadCommunityPosts(0, false);
            }
        }
    }

    tabGeneralChat.addEventListener("click", () => switchCommunitySpace("chat"));
    tabCommunityPosts.addEventListener("click", () => switchCommunitySpace("posts"));

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
        postsList = [];
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

        const isPrivate = group.privacy === "PRIVATE";
        if (isPrivate && (group.member || group.admin) && group.inviteCode) {
            drawerInviteSection.style.display = "block";
            drawerInviteCode.textContent = group.inviteCode;
            drawerRegenCodeBtn.style.display = group.admin ? "inline-flex" : "none";
        } else {
            drawerInviteSection.style.display = "none";
        }

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
    // 12. GENERAL CHAT MESSAGE HISTORY & SENDER INSTANT DELIVERY
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
                            <p style="color: var(--text-muted);">No messages yet. Send a message or share an image!</p>
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
        const placeholder = messagesList.querySelector(".list-placeholder-state");
        if (placeholder) placeholder.remove();

        const mine = msg.senderId === currentUser.id || msg.senderUsername === currentUser.username;
        const timeStr = formatTimestamp(msg.timestamp);

        const row = document.createElement("div");
        row.className = `message-row ${mine ? 'mine' : 'other'}`;

        let mediaHtml = "";
        if (msg.mediaUrl) {
            mediaHtml = `
                <div class="message-image-container">
                    <img src="${escapeHtml(msg.mediaUrl)}" alt="Attachment" class="chat-attached-image" loading="lazy">
                </div>
            `;
        }

        row.innerHTML = `
            <div class="message-bubble">
                ${!mine ? `<span class="message-sender">${escapeHtml(msg.senderUsername || 'Member')}</span>` : ''}
                ${mediaHtml}
                ${msg.content ? `<div class="message-text">${escapeHtml(msg.content)}</div>` : ''}
                <div class="message-meta">
                    <span class="message-time">${timeStr}</span>
                    ${mine ? '<span class="message-check">✓</span>' : ''}
                </div>
            </div>
        `;

        const imgEl = row.querySelector(".chat-attached-image");
        if (imgEl) {
            imgEl.addEventListener("click", () => {
                openLightbox(msg.mediaUrl);
            });
        }

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

    function formatRelativeTime(isoStr) {
        if (!isoStr) return "";
        try {
            const date = new Date(isoStr);
            const now = new Date();
            const diffSeconds = Math.floor((now - date) / 1000);

            if (diffSeconds < 60) return "just now";
            const diffMinutes = Math.floor(diffSeconds / 60);
            if (diffMinutes < 60) return `${diffMinutes}m ago`;
            const diffHours = Math.floor(diffMinutes / 60);
            if (diffHours < 24) return `${diffHours}h ago`;
            const diffDays = Math.floor(diffHours / 24);
            if (diffDays < 7) return `${diffDays}d ago`;
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return "";
        }
    }

    // ============================================================
    // 13. CHAT COMPOSER WITH IMAGE ATTACHMENTS & OPTIMISTIC RENDERING
    // ============================================================
    chatAttachBtn.addEventListener("click", () => {
        chatFileInput.click();
    });

    chatFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Only image files (JPEG, PNG, WebP, GIF) are supported.");
            chatFileInput.value = "";
            return;
        }

        if (file.size > 15 * 1024 * 1024) {
            alert("File size exceeds the 15MB limit.");
            chatFileInput.value = "";
            return;
        }

        pendingChatFile = file;
        chatImageName.textContent = file.name;
        chatPreviewThumb.src = URL.createObjectURL(file);
        chatImagePreviewBar.style.display = "flex";
    });

    removeChatImageBtn.addEventListener("click", () => {
        pendingChatFile = null;
        chatFileInput.value = "";
        chatImagePreviewBar.style.display = "none";
        chatPreviewThumb.src = "";
    });

    messageInput.addEventListener("input", () => {
        if (!currentGroup) return;

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

    messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            chatForm.requestSubmit();
        }
    });

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!currentGroup) return;

        const content = messageInput.value.trim();
        const fileToUpload = pendingChatFile;

        if (!content && !fileToUpload) return;

        if (typingTimeout) clearTimeout(typingTimeout);
        if (isTyping) {
            isTyping = false;
            sendTypingEvent(false);
        }

        sendMessageBtn.disabled = true;

        try {
            let uploadedMediaUrl = null;

            if (fileToUpload) {
                const formData = new FormData();
                formData.append("file", fileToUpload);
                formData.append("folder", `unihive/chat/${currentGroup.id}`);

                const uploadRes = await fetch(`${CONFIG.API_BASE_URL}/api/upload/image`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    uploadedMediaUrl = uploadData.url;
                } else {
                    alert("Failed to upload image. Please try again.");
                    sendMessageBtn.disabled = false;
                    return;
                }
            }

            // Zero-latency optimistic append in sender's UI
            const tempId = "client-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6);
            displayedMessageIds.add(tempId);

            const optimisticMsg = {
                id: tempId,
                messageId: tempId,
                groupId: currentGroup.id,
                senderId: currentUser.id,
                senderUsername: currentUser.username,
                content: content,
                timestamp: new Date().toISOString(),
                status: "SENT",
                mediaUrl: uploadedMediaUrl,
                messageType: uploadedMediaUrl ? "IMAGE" : "TEXT"
            };
            appendMessage(optimisticMsg, true);

            // Send structured frame over WebSocket
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "SEND_MESSAGE",
                    groupId: currentGroup.id,
                    content: content,
                    mediaUrl: uploadedMediaUrl,
                    messageType: uploadedMediaUrl ? "IMAGE" : "TEXT"
                }));
            } else {
                initWebSocket();
                setTimeout(() => {
                    if (socket && socket.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({
                            type: "SEND_MESSAGE",
                            groupId: currentGroup.id,
                            content: content,
                            mediaUrl: uploadedMediaUrl,
                            messageType: uploadedMediaUrl ? "IMAGE" : "TEXT"
                        }));
                    }
                }, 500);
            }

            // Reset inputs & preview
            messageInput.value = "";
            messageInput.style.height = "auto";
            pendingChatFile = null;
            chatFileInput.value = "";
            chatImagePreviewBar.style.display = "none";
            chatPreviewThumb.src = "";

        } catch (err) {
            console.error("Error sending message:", err);
            alert("Error sending message. Please check connection.");
        } finally {
            sendMessageBtn.disabled = false;
        }
    });

    // ============================================================
    // 14. COMMUNITY POSTS FEED, INFINITE SCROLL & FILTERS
    // ============================================================
    async function loadCommunityPosts(page = 0, append = false) {
        if (!currentGroup || isPostsLoading) return;
        isPostsLoading = true;

        if (postsLoadingIndicator) postsLoadingIndicator.style.display = "flex";

        try {
            let url = `/api/communities/${currentGroup.id}/posts?page=${page}&size=20`;
            if (currentCategoryFilter && currentCategoryFilter !== "ALL") {
                url += `&category=${encodeURIComponent(currentCategoryFilter)}`;
            }
            if (currentTagFilter) {
                url += `&tag=${encodeURIComponent(currentTagFilter)}`;
            }

            const res = await apiRequest(url);
            if (!res) return;

            if (res.ok) {
                const data = await res.json();
                const fetchedPosts = data.content || [];

                postsPage = data.number != null ? data.number : page;
                postsTotalPages = data.totalPages != null ? data.totalPages : 1;

                if (!append) {
                    postsList = fetchedPosts;
                    postsFeedContainer.innerHTML = "";
                } else {
                    postsList = postsList.concat(fetchedPosts);
                }

                if (postsList.length === 0) {
                    postsEmptyState.style.display = "flex";
                    postsFeedContainer.style.display = "none";
                } else {
                    postsEmptyState.style.display = "none";
                    postsFeedContainer.style.display = "flex";

                    fetchedPosts.forEach(post => {
                        renderPostCard(post);
                    });
                }
            } else {
                console.error("Failed to load community posts:", res.status);
            }
        } catch (err) {
            console.error("Error fetching community posts:", err);
        } finally {
            isPostsLoading = false;
            if (postsLoadingIndicator) postsLoadingIndicator.style.display = "none";
        }
    }

    postCategoryFilter.addEventListener("change", () => {
        currentCategoryFilter = postCategoryFilter.value;
        loadCommunityPosts(0, false);
    });

    clearTagFilterBtn.addEventListener("click", () => {
        currentTagFilter = "";
        activeTagFilterPill.style.display = "none";
        loadCommunityPosts(0, false);
    });

    refreshPostsBtn.addEventListener("click", () => {
        if (newPostsBanner) newPostsBanner.style.display = "none";
        if (newPostsDot) newPostsDot.style.display = "none";
        loadCommunityPosts(0, false);
    });

    newPostsBanner.addEventListener("click", () => {
        newPostsBanner.style.display = "none";
        if (newPostsDot) newPostsDot.style.display = "none";
        postsScrollStream.scrollTo({ top: 0, behavior: 'smooth' });
        loadCommunityPosts(0, false);
    });

    postsScrollStream.addEventListener("scroll", () => {
        const threshold = 200;
        const reachedBottom = (postsScrollStream.scrollHeight - postsScrollStream.scrollTop - postsScrollStream.clientHeight) < threshold;
        if (reachedBottom && !isPostsLoading && postsPage + 1 < postsTotalPages) {
            loadCommunityPosts(postsPage + 1, true);
        }
    });

    // ============================================================
    // 15. POST CARD RENDERING, REACTIONS & VERIFICATION GAUGE
    // ============================================================
    function renderPostCard(post) {
        const card = document.createElement("article");
        card.className = "post-card";
        card.id = `post-card-${post.id}`;
        card.setAttribute("data-post-id", post.id);

        const initial = (post.authorUsername || "U").charAt(0).toUpperCase();
        const timeAgo = formatRelativeTime(post.createdAt);
        const isAuthor = currentUser.id === post.authorId;
        const isAdmin = currentGroup && currentGroup.admin;
        const canEdit = post.canEdit || isAuthor;
        const canDelete = post.canDelete || isAuthor || isAdmin;

        // Tag Pills HTML
        let tagsHtml = "";
        if (post.tags && post.tags.length > 0) {
            tagsHtml = `
                <div class="post-tags-row">
                    ${post.tags.map(tag => `<span class="post-tag-chip" data-tag="${escapeHtml(tag)}">#${escapeHtml(tag)}</span>`).join("")}
                </div>
            `;
        }

        // Image Attachment HTML
        let mediaHtml = "";
        if (post.mediaUrl) {
            mediaHtml = `
                <div class="post-media-container">
                    <img src="${escapeHtml(post.mediaUrl)}" alt="Post image" class="post-media-img" loading="lazy">
                </div>
            `;
        }

        // External Link Preview HTML
        let linkHtml = "";
        if (post.externalUrl) {
            linkHtml = `
                <a href="${escapeHtml(post.externalUrl)}" target="_blank" rel="noopener noreferrer" class="post-external-link-card">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    <span class="external-url-text">${escapeHtml(post.externalUrl)}</span>
                </a>
            `;
        }

        // Community Verification Gauge HTML
        const totalVerifications = post.totalVerifications || 0;
        const verifiedPercent = post.verifiedPercent || 0;
        const notVerifiedPercent = post.notVerifiedPercent || 0;
        const userVerdict = post.userVerification;

        const verificationGaugeHtml = `
            <div class="community-verification-block" id="verification-gauge-${post.id}">
                <div class="verification-gauge-header">
                    <div class="gauge-title-row">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        <strong>Community Verification</strong>
                    </div>
                    <button type="button" class="btn-view-verifications" data-post-id="${post.id}">
                        ${totalVerifications} ${totalVerifications === 1 ? 'assessment' : 'assessments'} · Details
                    </button>
                </div>

                <div class="verification-track" title="Verified: ${verifiedPercent}%, Not Verified: ${notVerifiedPercent}%">
                    <div class="verification-bar-true" style="width: ${verifiedPercent}%;"></div>
                    <div class="verification-bar-false" style="width: ${notVerifiedPercent}%;"></div>
                </div>

                <div class="verification-labels-row">
                    <span class="label-verified">✓ ${verifiedPercent}% Verified (${post.verifiedCount || 0})</span>
                    <span class="label-not-verified">✕ ${notVerifiedPercent}% Not Verified (${post.notVerifiedCount || 0})</span>
                </div>

                <div class="verification-action-buttons">
                    <button type="button" class="verify-btn btn-vote-true ${userVerdict === 'VERIFIED' ? 'active-true' : ''}" data-post-id="${post.id}">
                        <span class="vote-icon">✓</span> Verify / True
                    </button>
                    <button type="button" class="verify-btn btn-vote-false ${userVerdict === 'NOT_VERIFIED' ? 'active-false' : ''}" data-post-id="${post.id}">
                        <span class="vote-icon">✕</span> Not Verified / False
                    </button>
                </div>
            </div>
        `;

        const userReaction = post.userReaction;
        const isBookmarked = post.isBookmarked || post.bookmarked;

        card.innerHTML = `
            <div class="post-header">
                <div class="post-author-meta">
                    <div class="post-author-avatar">${initial}</div>
                    <div class="post-author-info">
                        <span class="post-author-name">${escapeHtml(post.authorUsername)}</span>
                        <div class="post-meta-sub">
                            <span class="post-timestamp" title="${new Date(post.createdAt).toLocaleString()}">${timeAgo}</span>
                            ${post.edited ? '<span class="post-edited-tag">• edited</span>' : ''}
                            <span class="post-category-badge">${escapeHtml(post.category || 'General')}</span>
                        </div>
                    </div>
                </div>

                <div class="post-menu-wrapper">
                    <button type="button" class="icon-btn post-menu-btn" title="Post options">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                    </button>
                    <div class="dropdown-menu post-dropdown-menu" style="display: none;">
                        ${canEdit ? `
                            <button type="button" class="dropdown-item btn-menu-edit-post" data-post-id="${post.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                Edit Post
                            </button>
                        ` : ''}
                        ${canDelete ? `
                            <button type="button" class="dropdown-item danger-item btn-menu-delete-post" data-post-id="${post.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                Delete Post
                            </button>
                        ` : ''}
                        <button type="button" class="dropdown-item btn-menu-report-post" data-post-id="${post.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                            Report Post
                        </button>
                    </div>
                </div>
            </div>

            <div class="post-body">
                ${post.title ? `<h3 class="post-title">${escapeHtml(post.title)}</h3>` : ''}
                <div class="post-text-content">${escapeHtml(post.content).replace(/\n/g, '<br>')}</div>
                ${linkHtml}
                ${mediaHtml}
                ${tagsHtml}
            </div>

            ${verificationGaugeHtml}

            <div class="post-social-bar">
                <div class="social-actions-left">
                    <button type="button" class="social-action-btn btn-post-like ${userReaction === 'LIKE' ? 'active-like' : ''}" data-post-id="${post.id}" title="Like">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        <span class="like-count">${post.likeCount || 0}</span>
                    </button>

                    <button type="button" class="social-action-btn btn-post-dislike ${userReaction === 'DISLIKE' ? 'active-dislike' : ''}" data-post-id="${post.id}" title="Dislike">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
                        </svg>
                        <span class="dislike-count">${post.dislikeCount || 0}</span>
                    </button>

                    <button type="button" class="social-action-btn btn-post-comments" data-post-id="${post.id}" title="Comments">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span class="comment-count">${post.commentCount || 0}</span>
                    </button>
                </div>

                <div class="social-actions-right">
                    <button type="button" class="social-action-btn btn-post-bookmark ${isBookmarked ? 'active-bookmark' : ''}" data-post-id="${post.id}" title="${isBookmarked ? 'Remove Bookmark' : 'Save Post'}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </button>

                    <button type="button" class="social-action-btn btn-post-share" data-post-id="${post.id}" title="Share Link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="post-comments-section" id="comments-section-${post.id}" style="display: none;">
                <div class="comments-list-container" id="comments-list-${post.id}">
                    <div class="loading-spinner small-spinner"></div>
                </div>

                <form class="comment-composer-form" data-post-id="${post.id}">
                    <input type="text" class="comment-input" placeholder="Write a comment..." maxlength="1000" autocomplete="off" required>
                    <button type="submit" class="comment-submit-btn">Comment</button>
                </form>
            </div>
        `;

        // Tag Clicks
        card.querySelectorAll(".post-tag-chip").forEach(chip => {
            chip.addEventListener("click", () => {
                const tag = chip.getAttribute("data-tag");
                currentTagFilter = tag;
                if (activeTagName) activeTagName.textContent = "#" + tag;
                if (activeTagFilterPill) activeTagFilterPill.style.display = "inline-flex";
                loadCommunityPosts(0, false);
            });
        });

        // Media Click -> Lightbox
        const mediaImg = card.querySelector(".post-media-img");
        if (mediaImg) {
            mediaImg.addEventListener("click", () => {
                openLightbox(post.mediaUrl);
            });
        }

        // Post Menu Dropdown
        const menuBtn = card.querySelector(".post-menu-btn");
        const menuDropdown = card.querySelector(".post-dropdown-menu");
        if (menuBtn && menuDropdown) {
            menuBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                document.querySelectorAll(".post-dropdown-menu").forEach(m => {
                    if (m !== menuDropdown) m.style.display = "none";
                });
                menuDropdown.style.display = menuDropdown.style.display === "none" ? "block" : "none";
            });
        }

        const editOption = card.querySelector(".btn-menu-edit-post");
        if (editOption) {
            editOption.addEventListener("click", () => {
                menuDropdown.style.display = "none";
                openEditPostModal(post);
            });
        }

        const deleteOption = card.querySelector(".btn-menu-delete-post");
        if (deleteOption) {
            deleteOption.addEventListener("click", () => {
                menuDropdown.style.display = "none";
                handleDeletePost(post.id);
            });
        }

        const reportOption = card.querySelector(".btn-menu-report-post");
        if (reportOption) {
            reportOption.addEventListener("click", () => {
                menuDropdown.style.display = "none";
                openReportPostModal(post.id);
            });
        }

        const voteTrueBtn = card.querySelector(".btn-vote-true");
        if (voteTrueBtn) {
            voteTrueBtn.addEventListener("click", () => {
                openVerificationModal(post.id, "VERIFIED");
            });
        }

        const voteFalseBtn = card.querySelector(".btn-vote-false");
        if (voteFalseBtn) {
            voteFalseBtn.addEventListener("click", () => {
                openVerificationModal(post.id, "NOT_VERIFIED");
            });
        }

        const viewVerificationsBtn = card.querySelector(".btn-view-verifications");
        if (viewVerificationsBtn) {
            viewVerificationsBtn.addEventListener("click", () => {
                openVerificationDetailsModal(post.id);
            });
        }

        const likeBtn = card.querySelector(".btn-post-like");
        if (likeBtn) {
            likeBtn.addEventListener("click", () => {
                handleReaction(post.id, "LIKE", card);
            });
        }

        const dislikeBtn = card.querySelector(".btn-post-dislike");
        if (dislikeBtn) {
            dislikeBtn.addEventListener("click", () => {
                handleReaction(post.id, "DISLIKE", card);
            });
        }

        const bookmarkBtn = card.querySelector(".btn-post-bookmark");
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener("click", () => {
                handleBookmarkToggle(post.id, bookmarkBtn);
            });
        }

        const shareBtn = card.querySelector(".btn-post-share");
        if (shareBtn) {
            shareBtn.addEventListener("click", () => {
                handleSharePost(post);
            });
        }

        const commentsToggleBtn = card.querySelector(".btn-post-comments");
        const commentsSection = card.querySelector(`#comments-section-${post.id}`);
        if (commentsToggleBtn && commentsSection) {
            commentsToggleBtn.addEventListener("click", () => {
                const isHidden = commentsSection.style.display === "none";
                commentsSection.style.display = isHidden ? "block" : "none";
                if (isHidden) {
                    loadPostComments(post.id);
                }
            });
        }

        const commentForm = card.querySelector(`.comment-composer-form[data-post-id="${post.id}"]`);
        if (commentForm) {
            commentForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const input = commentForm.querySelector(".comment-input");
                const text = input.value.trim();
                if (!text) return;

                const submitBtn = commentForm.querySelector(".comment-submit-btn");
                submitBtn.disabled = true;

                try {
                    const res = await apiRequest(`/api/posts/${post.id}/comments`, {
                        method: "POST",
                        body: JSON.stringify({ content: text })
                    });

                    if (res && res.ok) {
                        input.value = "";
                        await loadPostComments(post.id);
                        post.commentCount = (post.commentCount || 0) + 1;
                        const countEl = card.querySelector(".comment-count");
                        if (countEl) countEl.textContent = post.commentCount;
                    } else {
                        const err = await res.json();
                        alert(err.error || "Failed to post comment.");
                    }
                } catch (err) {
                    console.error("Comment submit error:", err);
                } finally {
                    submitBtn.disabled = false;
                }
            });
        }

        postsFeedContainer.appendChild(card);
    }

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".post-menu-wrapper")) {
            document.querySelectorAll(".post-dropdown-menu").forEach(m => m.style.display = "none");
        }
    });

    // ============================================================
    // 16. SOCIAL ACTIONS: LIKE & DISLIKE TOGGLE
    // ============================================================
    async function handleReaction(postId, type, card) {
        try {
            const res = await apiRequest(`/api/posts/${postId}/react`, {
                method: "POST",
                body: JSON.stringify({ type })
            });

            if (res && res.ok) {
                const result = await res.json();
                const likeBtn = card.querySelector(".btn-post-like");
                const dislikeBtn = card.querySelector(".btn-post-dislike");
                const likeCountEl = card.querySelector(".like-count");
                const dislikeCountEl = card.querySelector(".dislike-count");

                if (likeCountEl) likeCountEl.textContent = result.likeCount != null ? result.likeCount : 0;
                if (dislikeCountEl) dislikeCountEl.textContent = result.dislikeCount != null ? result.dislikeCount : 0;

                if (result.userReaction === "LIKE") {
                    likeBtn.classList.add("active-like");
                    dislikeBtn.classList.remove("active-dislike");
                } else if (result.userReaction === "DISLIKE") {
                    dislikeBtn.classList.add("active-dislike");
                    likeBtn.classList.remove("active-like");
                } else {
                    likeBtn.classList.remove("active-like");
                    dislikeBtn.classList.remove("active-dislike");
                }
            }
        } catch (e) {
            console.error("Reaction error:", e);
        }
    }

    // ============================================================
    // 17. BOOKMARKING & SAVED POSTS
    // ============================================================
    async function handleBookmarkToggle(postId, bookmarkBtn) {
        try {
            const res = await apiRequest(`/api/posts/${postId}/bookmark`, {
                method: "POST"
            });

            if (res && res.ok) {
                const result = await res.json();
                const isBookmarked = result.bookmarked;

                if (isBookmarked) {
                    bookmarkBtn.classList.add("active-bookmark");
                    bookmarkBtn.title = "Remove Bookmark";
                    bookmarkBtn.querySelector("svg").setAttribute("fill", "currentColor");
                } else {
                    bookmarkBtn.classList.remove("active-bookmark");
                    bookmarkBtn.title = "Save Post";
                    bookmarkBtn.querySelector("svg").setAttribute("fill", "none");
                }
            }
        } catch (e) {
            console.error("Bookmark error:", e);
        }
    }

    menuItemSavedPosts.addEventListener("click", () => {
        userDropdownMenu.style.display = "none";
        openSavedPostsModal();
    });

    closeSavedPostsModalBtn.addEventListener("click", () => {
        savedPostsModal.style.display = "none";
    });

    savedPostsModal.addEventListener("click", (e) => {
        if (e.target === savedPostsModal) savedPostsModal.style.display = "none";
    });

    async function openSavedPostsModal() {
        savedPostsModal.style.display = "flex";
        savedPostsLoading.style.display = "flex";
        savedPostsEmpty.style.display = "none";
        savedPostsList.innerHTML = "";

        try {
            const res = await apiRequest("/api/users/me/bookmarks?page=0&size=50");
            if (res && res.ok) {
                const data = await res.json();
                const bookmarkedPosts = data.content || [];

                if (bookmarkedPosts.length === 0) {
                    savedPostsEmpty.style.display = "flex";
                } else {
                    bookmarkedPosts.forEach(post => {
                        const item = document.createElement("div");
                        item.className = "saved-post-item";
                        item.innerHTML = `
                            <div class="saved-post-header">
                                <strong>${escapeHtml(post.title || "Community Post")}</strong>
                                <span class="post-category-badge">${escapeHtml(post.category || "General")}</span>
                            </div>
                            <p class="saved-post-preview">${escapeHtml(post.content || "")}</p>
                            <div class="saved-post-footer">
                                <span class="metadata-text">Posted by ${escapeHtml(post.authorUsername)} · ${formatRelativeTime(post.createdAt)}</span>
                                <button type="button" class="small-btn primary-btn btn-view-saved-post" data-community-id="${post.communityId}">
                                    Go to Community
                                </button>
                            </div>
                        `;

                        const viewBtn = item.querySelector(".btn-view-saved-post");
                        viewBtn.addEventListener("click", async () => {
                            savedPostsModal.style.display = "none";
                            const target = allGroups.find(g => g.id === post.communityId);
                            if (target) {
                                openGroupChat(target);
                                switchCommunitySpace("posts");
                            }
                        });

                        savedPostsList.appendChild(item);
                    });
                }
            }
        } catch (e) {
            console.error("Saved posts fetch error:", e);
        } finally {
            savedPostsLoading.style.display = "none";
        }
    }

    // ============================================================
    // 18. SHARE POST LINK
    // ============================================================
    function handleSharePost(post) {
        const shareUrl = `${window.location.origin}${window.location.pathname}#post-${post.id}`;
        if (navigator.share) {
            navigator.share({
                title: post.title || "UniHive Community Post",
                text: post.content ? post.content.substring(0, 100) + "..." : "Check out this community post on UniHive",
                url: shareUrl
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert("Post link copied to clipboard!");
            }).catch(() => {
                prompt("Copy post link:", shareUrl);
            });
        }
    }

    // ============================================================
    // 19. POST COMMENTS WORKFLOW
    // ============================================================
    async function loadPostComments(postId) {
        const listContainer = document.getElementById(`comments-list-${postId}`);
        if (!listContainer) return;

        try {
            const res = await apiRequest(`/api/posts/${postId}/comments?page=0&size=50`);
            if (res && res.ok) {
                const data = await res.json();
                const comments = data.content || [];
                listContainer.innerHTML = "";

                if (comments.length === 0) {
                    listContainer.innerHTML = `<p class="empty-comments-note">No comments yet. Start the discussion!</p>`;
                    return;
                }

                comments.forEach(comment => {
                    const row = document.createElement("div");
                    row.className = "comment-row";
                    const initial = (comment.authorUsername || "U").charAt(0).toUpperCase();
                    const isSelf = comment.authorId === currentUser.id;
                    const canDelete = comment.canDelete || isSelf;

                    row.innerHTML = `
                        <div class="comment-avatar">${initial}</div>
                        <div class="comment-content-box">
                            <div class="comment-header-line">
                                <strong class="comment-author">${escapeHtml(comment.authorUsername)}</strong>
                                <span class="comment-time">${formatRelativeTime(comment.createdAt)}</span>
                                ${canDelete ? `
                                    <button type="button" class="btn-delete-comment" title="Delete comment" data-comment-id="${comment.id}">&times;</button>
                                ` : ''}
                            </div>
                            <div class="comment-text">${escapeHtml(comment.content)}</div>
                        </div>
                    `;

                    const delBtn = row.querySelector(".btn-delete-comment");
                    if (delBtn) {
                        delBtn.addEventListener("click", async () => {
                            if (confirm("Delete this comment?")) {
                                const delRes = await apiRequest(`/api/posts/${postId}/comments/${comment.id}`, {
                                    method: "DELETE"
                                });
                                if (delRes && delRes.ok) {
                                    await loadPostComments(postId);
                                    const card = document.getElementById(`post-card-${postId}`);
                                    if (card) {
                                        const countEl = card.querySelector(".comment-count");
                                        const currentVal = parseInt(countEl.textContent, 10) || 1;
                                        countEl.textContent = Math.max(0, currentVal - 1);
                                    }
                                }
                            }
                        });
                    }

                    listContainer.appendChild(row);
                });
            }
        } catch (e) {
            console.error("Load comments error:", e);
            listContainer.innerHTML = `<p class="error-note">Failed to load comments.</p>`;
        }
    }

    // ============================================================
    // 20. COMMUNITY VERIFICATION ASSESSMENT WORKFLOW
    // ============================================================
    function openVerificationModal(postId, defaultVerdict = "VERIFIED") {
        verificationModalError.style.display = "none";
        verifyPostId.value = postId;
        verifyReasonInput.value = "";
        verifyEvidenceLinkInput.value = "";

        const radio = verificationForm.querySelector(`input[name="verificationVerdict"][value="${defaultVerdict}"]`);
        if (radio) radio.checked = true;

        const post = postsList.find(p => p.id === postId);
        if (post && post.userVerification) {
            removeVerificationVoteBtn.style.display = "inline-block";
        } else {
            removeVerificationVoteBtn.style.display = "none";
        }

        verificationModal.style.display = "flex";
    }

    function closeVerificationModal() {
        verificationModal.style.display = "none";
    }

    closeVerificationModalBtn.addEventListener("click", closeVerificationModal);
    cancelVerificationModalBtn.addEventListener("click", closeVerificationModal);
    verificationModal.addEventListener("click", (e) => {
        if (e.target === verificationModal) closeVerificationModal();
    });

    verificationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        verificationModalError.style.display = "none";

        const postId = verifyPostId.value;
        const verdictRadio = verificationForm.querySelector('input[name="verificationVerdict"]:checked');
        const verdict = verdictRadio ? verdictRadio.value : "VERIFIED";
        const reason = verifyReasonInput.value.trim();
        const evidenceUrl = verifyEvidenceLinkInput.value.trim();

        submitVerificationBtn.disabled = true;
        submitVerificationBtn.textContent = "Submitting...";

        try {
            const res = await apiRequest(`/api/posts/${postId}/verify`, {
                method: "POST",
                body: JSON.stringify({
                    verdict,
                    reason,
                    evidenceUrl
                })
            });

            if (res && res.ok) {
                const result = await res.json();
                updatePostVerificationInDOM(postId, result);
                closeVerificationModal();
            } else {
                const err = await res.json();
                verificationModalError.textContent = err.error || "Failed to submit verification.";
                verificationModalError.style.display = "block";
            }
        } catch (err) {
            console.error("Verification submit error:", err);
            verificationModalError.textContent = "Network error submitting verification.";
            verificationModalError.style.display = "block";
        } finally {
            submitVerificationBtn.disabled = false;
            submitVerificationBtn.textContent = "Submit Assessment";
        }
    });

    removeVerificationVoteBtn.addEventListener("click", async () => {
        const postId = verifyPostId.value;
        if (!postId) return;

        removeVerificationVoteBtn.disabled = true;

        try {
            const res = await apiRequest(`/api/posts/${postId}/verify`, {
                method: "DELETE"
            });

            if (res && res.ok) {
                const result = await res.json();
                updatePostVerificationInDOM(postId, result);
                closeVerificationModal();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to remove verification vote.");
            }
        } catch (e) {
            console.error("Remove verification vote error:", e);
        } finally {
            removeVerificationVoteBtn.disabled = false;
        }
    });

    function updatePostVerificationInDOM(postId, result) {
        const post = postsList.find(p => p.id === postId);
        if (post) {
            post.verifiedCount = result.verifiedCount;
            post.notVerifiedCount = result.notVerifiedCount;
            post.totalVerifications = result.totalVerifications;
            post.verifiedPercent = result.verifiedPercent;
            post.notVerifiedPercent = result.notVerifiedPercent;
            post.userVerification = result.userVerification;
        }

        const gaugeEl = document.getElementById(`verification-gauge-${postId}`);
        if (!gaugeEl) return;

        const totalVerifications = result.totalVerifications || 0;
        const verifiedPercent = result.verifiedPercent || 0;
        const notVerifiedPercent = result.notVerifiedPercent || 0;
        const userVerdict = result.userVerification;

        const detailsBtn = gaugeEl.querySelector(".btn-view-verifications");
        if (detailsBtn) {
            detailsBtn.textContent = `${totalVerifications} ${totalVerifications === 1 ? 'assessment' : 'assessments'} · Details`;
        }

        const barTrue = gaugeEl.querySelector(".verification-bar-true");
        const barFalse = gaugeEl.querySelector(".verification-bar-false");
        if (barTrue) barTrue.style.width = `${verifiedPercent}%`;
        if (barFalse) barFalse.style.width = `${notVerifiedPercent}%`;

        const lblVerified = gaugeEl.querySelector(".label-verified");
        const lblNotVerified = gaugeEl.querySelector(".label-not-verified");
        if (lblVerified) lblVerified.textContent = `✓ ${verifiedPercent}% Verified (${result.verifiedCount || 0})`;
        if (lblNotVerified) lblNotVerified.textContent = `✕ ${notVerifiedPercent}% Not Verified (${result.notVerifiedCount || 0})`;

        const btnTrue = gaugeEl.querySelector(".btn-vote-true");
        const btnFalse = gaugeEl.querySelector(".btn-vote-false");
        if (btnTrue) {
            if (userVerdict === "VERIFIED") btnTrue.classList.add("active-true");
            else btnTrue.classList.remove("active-true");
        }
        if (btnFalse) {
            if (userVerdict === "NOT_VERIFIED") btnFalse.classList.add("active-false");
            else btnFalse.classList.remove("active-false");
        }
    }

    // ============================================================
    // 21. VERIFICATION BREAKDOWN DETAILS MODAL
    // ============================================================
    async function openVerificationDetailsModal(postId) {
        verificationDetailsModal.style.display = "flex";
        detailVerifiedCount.textContent = "0";
        detailVerifiedPct.textContent = "0%";
        detailNotVerifiedCount.textContent = "0";
        detailNotVerifiedPct.textContent = "0%";
        detailProgressBar.style.width = "0%";
        detailTotalVotesNote.textContent = "Loading assessments...";
        verificationEvidenceList.innerHTML = `<div class="loading-spinner small-spinner"></div>`;

        try {
            const res = await apiRequest(`/api/posts/${postId}/verifications`);
            if (res && res.ok) {
                const data = await res.json();
                detailVerifiedCount.textContent = data.verifiedCount || 0;
                detailVerifiedPct.textContent = `${data.verifiedPercent || 0}%`;
                detailNotVerifiedCount.textContent = data.notVerifiedCount || 0;
                detailNotVerifiedPct.textContent = `${data.notVerifiedPercent || 0}%`;
                detailProgressBar.style.width = `${data.verifiedPercent || 0}%`;
                detailTotalVotesNote.textContent = `${data.totalAssessments || 0} members reviewed this post.`;

                verificationEvidenceList.innerHTML = "";
                const items = data.assessments || [];

                if (items.length === 0) {
                    verificationEvidenceList.innerHTML = `<p class="empty-state-text" style="padding: 16px 0;">No reviews with explanations provided yet.</p>`;
                } else {
                    items.forEach(item => {
                        const isTrue = item.verdict === "VERIFIED";
                        const row = document.createElement("div");
                        row.className = "evidence-item-card";
                        row.innerHTML = `
                            <div class="evidence-item-header">
                                <strong class="evidence-reviewer">${escapeHtml(item.username)}</strong>
                                <span class="evidence-verdict-pill ${isTrue ? 'verified' : 'unverified'}">
                                    ${isTrue ? '✓ Verified / True' : '✕ Not Verified / False'}
                                </span>
                                <span class="evidence-time">${formatRelativeTime(item.createdAt)}</span>
                            </div>
                            ${item.reason ? `<p class="evidence-reason-text">${escapeHtml(item.reason)}</p>` : ''}
                            ${item.evidenceUrl ? `
                                <a href="${escapeHtml(item.evidenceUrl)}" target="_blank" rel="noopener noreferrer" class="evidence-source-link">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                    </svg>
                                    <span>${escapeHtml(item.evidenceUrl)}</span>
                                </a>
                            ` : ''}
                        `;
                        verificationEvidenceList.appendChild(row);
                    });
                }
            } else {
                detailTotalVotesNote.textContent = "Failed to load verification breakdown.";
                verificationEvidenceList.innerHTML = "";
            }
        } catch (e) {
            console.error("Verification details error:", e);
        }
    }

    closeVerificationDetailsBtn.addEventListener("click", () => verificationDetailsModal.style.display = "none");
    closeVerificationDetailsFooterBtn.addEventListener("click", () => verificationDetailsModal.style.display = "none");
    verificationDetailsModal.addEventListener("click", (e) => {
        if (e.target === verificationDetailsModal) verificationDetailsModal.style.display = "none";
    });

    // ============================================================
    // 22. CREATE POST WORKFLOW
    // ============================================================
    function openCreatePostModal() {
        createPostError.style.display = "none";
        createPostError.textContent = "";
        postTitleInput.value = "";
        postContentInput.value = "";
        postLinkInput.value = "";
        postTagsInput.value = "";
        postCategoryInput.value = "General";

        pendingPostFile = null;
        postImageFileInput.value = "";
        postImagePlaceholder.style.display = "flex";
        postImagePreviewContainer.style.display = "none";
        postImagePreviewImg.src = "";

        createPostModal.style.display = "flex";
        postTitleInput.focus();
    }

    function closeCreatePostModal() {
        createPostModal.style.display = "none";
    }

    openCreatePostModalBtn.addEventListener("click", openCreatePostModal);
    if (emptyStateCreatePostBtn) emptyStateCreatePostBtn.addEventListener("click", openCreatePostModal);
    closeCreatePostModalBtn.addEventListener("click", closeCreatePostModal);
    cancelCreatePostBtn.addEventListener("click", closeCreatePostModal);

    createPostModal.addEventListener("click", (e) => {
        if (e.target === createPostModal) closeCreatePostModal();
    });

    postImageUploadZone.addEventListener("click", () => {
        postImageFileInput.click();
    });

    postImageFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file (JPEG, PNG, WebP, GIF).");
            postImageFileInput.value = "";
            return;
        }

        if (file.size > 15 * 1024 * 1024) {
            alert("Image size exceeds 15MB limit.");
            postImageFileInput.value = "";
            return;
        }

        pendingPostFile = file;
        postImagePreviewImg.src = URL.createObjectURL(file);
        postImagePlaceholder.style.display = "none";
        postImagePreviewContainer.style.display = "block";
    });

    removePostImageBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        pendingPostFile = null;
        postImageFileInput.value = "";
        postImagePreviewImg.src = "";
        postImagePreviewContainer.style.display = "none";
        postImagePlaceholder.style.display = "flex";
    });

    createPostForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        createPostError.style.display = "none";

        if (!currentGroup) return;

        const title = postTitleInput.value.trim();
        const content = postContentInput.value.trim();
        const externalUrl = postLinkInput.value.trim();
        const category = postCategoryInput.value;
        const rawTags = postTagsInput.value.trim();

        if (!content && !title) {
            createPostError.textContent = "Please provide post content or a title.";
            createPostError.style.display = "block";
            return;
        }

        submitCreatePostBtn.disabled = true;
        submitCreatePostBtn.textContent = "Publishing...";

        try {
            const formData = new FormData();
            if (title) formData.append("title", title);
            formData.append("content", content);
            if (externalUrl) formData.append("externalUrl", externalUrl);
            formData.append("category", category);

            if (rawTags) {
                const tags = rawTags.split(/[\s,]+/).map(t => t.replace(/^#/, "").trim()).filter(Boolean);
                tags.forEach(t => formData.append("tags", t));
            }

            if (pendingPostFile) {
                formData.append("image", pendingPostFile);
            }

            const res = await fetch(`${CONFIG.API_BASE_URL}/api/communities/${currentGroup.id}/posts`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                closeCreatePostModal();
                loadCommunityPosts(0, false);
            } else {
                const data = await res.json();
                createPostError.textContent = data.error || "Failed to publish post.";
                createPostError.style.display = "block";
            }
        } catch (err) {
            console.error("Create post error:", err);
            createPostError.textContent = "Network error publishing post.";
            createPostError.style.display = "block";
        } finally {
            submitCreatePostBtn.disabled = false;
            submitCreatePostBtn.textContent = "Publish Post";
        }
    });

    // ============================================================
    // 23. EDIT & DELETE POST WORKFLOW
    // ============================================================
    function openEditPostModal(post) {
        editPostError.style.display = "none";
        editPostId.value = post.id;
        editPostTitleInput.value = post.title || "";
        editPostContentInput.value = post.content || "";
        editPostLinkInput.value = post.externalUrl || "";
        editPostCategoryInput.value = post.category || "General";
        editPostTagsInput.value = (post.tags || []).map(t => "#" + t).join(" ");

        editPostModal.style.display = "flex";
        editPostTitleInput.focus();
    }

    function closeEditPostModal() {
        editPostModal.style.display = "none";
    }

    closeEditPostModalBtn.addEventListener("click", closeEditPostModal);
    cancelEditPostBtn.addEventListener("click", closeEditPostModal);
    editPostModal.addEventListener("click", (e) => {
        if (e.target === editPostModal) closeEditPostModal();
    });

    editPostForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        editPostError.style.display = "none";

        const postId = editPostId.value;
        const title = editPostTitleInput.value.trim();
        const content = editPostContentInput.value.trim();
        const externalUrl = editPostLinkInput.value.trim();
        const category = editPostCategoryInput.value;
        const rawTags = editPostTagsInput.value.trim();

        if (!content) {
            editPostError.textContent = "Content cannot be empty.";
            editPostError.style.display = "block";
            return;
        }

        submitEditPostBtn.disabled = true;
        submitEditPostBtn.textContent = "Saving...";

        try {
            const tags = rawTags ? rawTags.split(/[\s,]+/).map(t => t.replace(/^#/, "").trim()).filter(Boolean) : [];

            const res = await apiRequest(`/api/posts/${postId}`, {
                method: "PUT",
                body: JSON.stringify({
                    title,
                    content,
                    externalUrl,
                    category,
                    tags
                })
            });

            if (res && res.ok) {
                closeEditPostModal();
                loadCommunityPosts(postsPage, false);
            } else {
                const data = await res.json();
                editPostError.textContent = data.error || "Failed to update post.";
                editPostError.style.display = "block";
            }
        } catch (err) {
            console.error("Edit post error:", err);
            editPostError.textContent = "Network error updating post.";
            editPostError.style.display = "block";
        } finally {
            submitEditPostBtn.disabled = false;
            submitEditPostBtn.textContent = "Save Changes";
        }
    });

    function handleDeletePost(postId) {
        showConfirmDialog(
            "Delete Post",
            "Are you sure you want to delete this post? All reactions, comments, and verifications will be permanently removed.",
            async () => {
                try {
                    const res = await apiRequest(`/api/posts/${postId}`, {
                        method: "DELETE"
                    });

                    if (res && (res.ok || res.status === 204)) {
                        const card = document.getElementById(`post-card-${postId}`);
                        if (card) card.remove();
                        postsList = postsList.filter(p => p.id !== postId);
                        if (postsList.length === 0) {
                            postsEmptyState.style.display = "flex";
                            postsFeedContainer.style.display = "none";
                        }
                    } else {
                        const data = await res.json();
                        alert(data.error || "Failed to delete post.");
                    }
                } catch (e) {
                    console.error("Delete post error:", e);
                    alert("Network error deleting post.");
                }
            }
        );
    }

    // ============================================================
    // 24. REPORT POST WORKFLOW
    // ============================================================
    function openReportPostModal(postId) {
        reportPostError.style.display = "none";
        reportPostId.value = postId;
        reportReasonSelect.value = "False/misleading information";
        reportDetailsInput.value = "";
        reportPostModal.style.display = "flex";
    }

    function closeReportPostModal() {
        reportPostModal.style.display = "none";
    }

    closeReportPostModalBtn.addEventListener("click", closeReportPostModal);
    cancelReportPostBtn.addEventListener("click", closeReportPostModal);
    reportPostModal.addEventListener("click", (e) => {
        if (e.target === reportPostModal) closeReportPostModal();
    });

    reportPostForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        reportPostError.style.display = "none";

        const postId = reportPostId.value;
        const reason = reportReasonSelect.value;
        const details = reportDetailsInput.value.trim();

        submitReportPostBtn.disabled = true;
        submitReportPostBtn.textContent = "Submitting...";

        try {
            const res = await apiRequest(`/api/posts/${postId}/report`, {
                method: "POST",
                body: JSON.stringify({ reason, details })
            });

            if (res && res.ok) {
                closeReportPostModal();
                alert("Thank you. Your report has been submitted to community moderators.");
            } else {
                const data = await res.json();
                reportPostError.textContent = data.error || "Failed to submit report.";
                reportPostError.style.display = "block";
            }
        } catch (e) {
            console.error("Report post error:", e);
            reportPostError.textContent = "Network error submitting report.";
            reportPostError.style.display = "block";
        } finally {
            submitReportPostBtn.disabled = false;
            submitReportPostBtn.textContent = "Submit Report";
        }
    });

    // ============================================================
    // 25. FULLSCREEN IMAGE LIGHTBOX
    // ============================================================
    function openLightbox(imageUrl) {
        if (!imageUrl) return;
        lightboxImage.src = imageUrl;
        downloadLightboxBtn.href = imageUrl;
        imageLightboxModal.style.display = "flex";
    }

    function closeLightbox() {
        imageLightboxModal.style.display = "none";
        lightboxImage.src = "";
    }

    closeLightboxBtn.addEventListener("click", closeLightbox);
    imageLightboxModal.addEventListener("click", (e) => {
        if (e.target === imageLightboxModal) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && imageLightboxModal.style.display === "flex") {
            closeLightbox();
        }
    });

    // ============================================================
    // 26. LEAVE & DELETE GROUP CONFIRMATIONS
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

    function handleDeleteCurrentGroup() {
        if (!currentGroup || !currentGroup.admin) return;

        showConfirmDialog(
            "Delete Group",
            `Are you sure you want to permanently delete "${currentGroup.name}" and all of its messages and posts? This action cannot be undone.`,
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
    // 27. USER MENU & LOGOUT
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
