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

    // NEW: Chat Enhancement State
    let lastRenderedMessage = null; // { senderId, timestamp } for message grouping
    let lastRenderedDate = null; // For date separator tracking
    let unreadWhileScrolledUp = 0; // Unread count when user scrolled up

    // NEW: Comment Drawer State
    let commentDrawerPostId = null;
    let commentDrawerReplyTo = null; // { commentId, username } for reply-to tracking

    // NEW: Notification State
    let notifications = []; // In-memory notification array

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
    // TOAST NOTIFICATION UTILITY
    // ============================================================
    function showToast(message, type = "info") {
        let container = document.getElementById("toastContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "toastContainer";
            container.className = "toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;

        let iconSvg = "";
        if (type === "success") {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === "error") {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        } else if (type === "warning") {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        } else {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        }

        toast.innerHTML = `
            <div class="toast-icon">${iconSvg}</div>
            <div class="toast-content">${escapeHtml(message)}</div>
            <button class="toast-close" type="button" aria-label="Dismiss">&times;</button>
        `;

        const closeBtn = toast.querySelector(".toast-close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                toast.classList.add("toast-leaving");
                setTimeout(() => toast.remove(), 250);
            });
        }

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.isConnected) {
                toast.classList.add("toast-leaving");
                setTimeout(() => toast.remove(), 250);
            }
        }, 4000);
    }

    // ============================================================
    // SIDEBAR COLLAPSE TOGGLE
    // ============================================================
    const sidebarCollapseBtn = document.getElementById("sidebarCollapseBtn");
    const messengerLayout = document.querySelector(".messenger-layout");
    
    if (sidebarCollapseBtn && messengerLayout) {
        // Restore state from sessionStorage
        if (sessionStorage.getItem("unihive_sidebar_collapsed") === "true") {
            leftSidebar.classList.add("collapsed");
            messengerLayout.classList.add("sidebar-collapsed");
        }
        sidebarCollapseBtn.addEventListener("click", () => {
            leftSidebar.classList.toggle("collapsed");
            messengerLayout.classList.toggle("sidebar-collapsed");
            sessionStorage.setItem("unihive_sidebar_collapsed",
                leftSidebar.classList.contains("collapsed") ? "true" : "false");
        });
    }

    // ============================================================
    // SKELETON LOADING HELPERS
    // ============================================================
    function renderSkeletonPostCards(count = 3) {
        let html = "";
        for (let i = 0; i < count; i++) {
            html += `
                <div class="skeleton-post-card">
                    <div class="skeleton-post-header">
                        <div class="skeleton skeleton-avatar"></div>
                        <div style="flex: 1;">
                            <div class="skeleton skeleton-line w-40 thick"></div>
                            <div class="skeleton skeleton-line w-30"></div>
                        </div>
                    </div>
                    <div class="skeleton skeleton-line w-80 thick"></div>
                    <div class="skeleton skeleton-body-block"></div>
                    <div class="skeleton-action-bar">
                        <div class="skeleton skeleton-action"></div>
                        <div class="skeleton skeleton-action"></div>
                        <div class="skeleton skeleton-action"></div>
                        <div class="skeleton skeleton-action"></div>
                    </div>
                </div>
            `;
        }
        return html;
    }

    function renderSkeletonGroupItems(count = 5) {
        let html = "";
        for (let i = 0; i < count; i++) {
            html += `
                <div class="skeleton-group-item">
                    <div class="skeleton skeleton-group-avatar"></div>
                    <div class="skeleton-group-lines">
                        <div class="skeleton skeleton-line w-60 thick"></div>
                        <div class="skeleton skeleton-line w-40"></div>
                    </div>
                </div>
            `;
        }
        return html;
    }

    function renderSkeletonComments(count = 3) {
        let html = "";
        for (let i = 0; i < count; i++) {
            html += `
                <div class="skeleton-comment">
                    <div class="skeleton skeleton-comment-avatar"></div>
                    <div class="skeleton-comment-body">
                        <div class="skeleton skeleton-line w-30 thick"></div>
                        <div class="skeleton skeleton-line w-80"></div>
                        <div class="skeleton skeleton-line w-60"></div>
                    </div>
                </div>
            `;
        }
        return html;
    }

    function removeSkeletons(container) {
        if (!container) return;
        container.querySelectorAll(".skeleton-post-card, .skeleton-group-item, .skeleton-comment").forEach(el => el.remove());
    }

    // ============================================================
    // SCROLL-TO-BOTTOM BUTTON LOGIC
    // ============================================================
    const scrollToBottomBtn = document.getElementById("scrollToBottomBtn");
    const scrollUnreadBadge = document.getElementById("scrollUnreadBadge");
    const newMessagesIndicator = document.getElementById("newMessagesIndicator");
    const chatStreamWrapper = document.querySelector(".chat-stream-wrapper");

    function isNearBottom() {
        if (!chatStreamWrapper) return true;
        return chatStreamWrapper.scrollTop + chatStreamWrapper.clientHeight >= chatStreamWrapper.scrollHeight - 120;
    }

    function updateScrollButton() {
        if (!scrollToBottomBtn || !chatStreamWrapper) return;
        if (isNearBottom()) {
            scrollToBottomBtn.classList.remove("visible");
            scrollToBottomBtn.style.display = "none";
            if (newMessagesIndicator) {
                newMessagesIndicator.classList.remove("visible");
                newMessagesIndicator.style.display = "none";
            }
            unreadWhileScrolledUp = 0;
        } else {
            scrollToBottomBtn.style.display = "flex";
            scrollToBottomBtn.classList.add("visible");
        }
    }

    if (chatStreamWrapper) {
        chatStreamWrapper.addEventListener("scroll", updateScrollButton);
    }

    if (scrollToBottomBtn) {
        scrollToBottomBtn.addEventListener("click", () => {
            scrollMessagesToBottom();
            unreadWhileScrolledUp = 0;
            scrollToBottomBtn.classList.remove("visible");
            scrollToBottomBtn.style.display = "none";
            if (newMessagesIndicator) {
                newMessagesIndicator.classList.remove("visible");
                newMessagesIndicator.style.display = "none";
            }
            if (scrollUnreadBadge) {
                scrollUnreadBadge.style.display = "none";
            }
        });
    }

    if (newMessagesIndicator) {
        newMessagesIndicator.addEventListener("click", () => {
            scrollMessagesToBottom();
            unreadWhileScrolledUp = 0;
            newMessagesIndicator.classList.remove("visible");
            newMessagesIndicator.style.display = "none";
            if (scrollToBottomBtn) {
                scrollToBottomBtn.classList.remove("visible");
                scrollToBottomBtn.style.display = "none";
            }
        });
    }

    // ============================================================
    // NOTIFICATION BELL SYSTEM
    // ============================================================
    const notificationBellBtn = document.getElementById("notificationBellBtn");
    const notificationBadge = document.getElementById("notificationBadge");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const notificationList = document.getElementById("notificationList");
    const clearNotificationsBtn = document.getElementById("clearNotificationsBtn");

    function addNotification(text, type = "info") {
        const notif = {
            id: Date.now(),
            text,
            type,
            time: new Date().toISOString(),
            read: false
        };
        notifications.unshift(notif);
        if (notifications.length > 50) notifications.pop();
        updateNotificationBadge();
        renderNotifications();
    }

    function updateNotificationBadge() {
        const unread = notifications.filter(n => !n.read).length;
        if (notificationBadge) {
            if (unread > 0) {
                notificationBadge.textContent = unread > 99 ? "99+" : unread;
                notificationBadge.style.display = "flex";
            } else {
                notificationBadge.style.display = "none";
            }
        }
    }

    function renderNotifications() {
        if (!notificationList) return;
        if (notifications.length === 0) {
            notificationList.innerHTML = '<div class="notification-empty">No notifications yet</div>';
            return;
        }
        notificationList.innerHTML = notifications.slice(0, 20).map(notif => {
            const timeAgo = formatRelativeTime(notif.time);
            const iconSvg = notif.type === "post"
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line></svg>'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path></svg>';
            return `
                <div class="notification-item" data-notif-id="${notif.id}">
                    <div class="notification-item-icon">${iconSvg}</div>
                    <div class="notification-item-content">
                        <div class="notification-item-text">${escapeHtml(notif.text)}</div>
                        <div class="notification-item-time">${timeAgo}</div>
                    </div>
                    <button class="notification-item-dismiss icon-btn" aria-label="Dismiss">&times;</button>
                </div>
            `;
        }).join("");

        notificationList.querySelectorAll(".notification-item-dismiss").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const item = btn.closest(".notification-item");
                const id = parseInt(item.getAttribute("data-notif-id"));
                notifications = notifications.filter(n => n.id !== id);
                updateNotificationBadge();
                renderNotifications();
            });
        });
    }

    if (notificationBellBtn) {
        notificationBellBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (notificationDropdown) {
                const isOpen = notificationDropdown.style.display !== "none";
                notificationDropdown.style.display = isOpen ? "none" : "flex";
                if (!isOpen) {
                    notifications.forEach(n => n.read = true);
                    updateNotificationBadge();
                }
            }
        });
    }

    if (clearNotificationsBtn) {
        clearNotificationsBtn.addEventListener("click", () => {
            notifications = [];
            updateNotificationBadge();
            renderNotifications();
        });
    }

    // Close notification dropdown on outside click
    document.addEventListener("click", (e) => {
        if (notificationDropdown && notificationDropdown.style.display !== "none") {
            if (!notificationDropdown.contains(e.target) && e.target !== notificationBellBtn && !notificationBellBtn.contains(e.target)) {
                notificationDropdown.style.display = "none";
            }
        }
    });

    // ============================================================
    // COMMENT DRAWER MANAGEMENT
    // ============================================================
    const commentDrawerPanel = document.getElementById("commentDrawerPanel");
    const commentDrawerBackdrop = document.getElementById("commentDrawerBackdrop");
    const closeCommentDrawerBtn = document.getElementById("closeCommentDrawerBtn");
    const drawerCommentsList = document.getElementById("drawerCommentsList");
    const drawerCommentCount = document.getElementById("drawerCommentCount");
    const drawerPostPreview = document.getElementById("drawerPostPreview");
    const drawerCommentForm = document.getElementById("drawerCommentForm");
    const drawerCommentInput = document.getElementById("drawerCommentInput");
    const drawerCommentSubmitBtn = document.getElementById("drawerCommentSubmitBtn");
    const drawerReplyIndicator = document.getElementById("drawerReplyIndicator");
    const replyToUsername = document.getElementById("replyToUsername");
    const cancelReplyBtn = document.getElementById("cancelReplyBtn");

    function openCommentDrawer(postId, post) {
        commentDrawerPostId = postId;
        commentDrawerReplyTo = null;

        // Set post preview
        if (drawerPostPreview && post) {
            drawerPostPreview.innerHTML = `
                <div class="preview-title">${escapeHtml(post.title || post.content?.substring(0, 80) || "Post")}</div>
                <div class="preview-author">by ${escapeHtml(post.authorUsername || "Unknown")} · ${formatRelativeTime(post.createdAt)}</div>
            `;
        }

        // Show drawer
        if (commentDrawerPanel) commentDrawerPanel.style.display = "flex";
        if (commentDrawerBackdrop) commentDrawerBackdrop.style.display = "block";
        if (drawerReplyIndicator) drawerReplyIndicator.style.display = "none";
        if (drawerCommentInput) drawerCommentInput.focus();

        // Load comments
        loadCommentsInDrawer(postId);
    }

    function closeCommentDrawer() {
        commentDrawerPostId = null;
        commentDrawerReplyTo = null;
        if (commentDrawerPanel) commentDrawerPanel.style.display = "none";
        if (commentDrawerBackdrop) commentDrawerBackdrop.style.display = "none";
        if (drawerReplyIndicator) drawerReplyIndicator.style.display = "none";
        if (drawerCommentInput) drawerCommentInput.value = "";
    }

    if (closeCommentDrawerBtn) {
        closeCommentDrawerBtn.addEventListener("click", closeCommentDrawer);
    }
    if (commentDrawerBackdrop) {
        commentDrawerBackdrop.addEventListener("click", closeCommentDrawer);
    }

    function setReplyTo(commentId, username) {
        commentDrawerReplyTo = { commentId, username };
        if (drawerReplyIndicator) drawerReplyIndicator.style.display = "flex";
        if (replyToUsername) replyToUsername.textContent = "@" + username;
        if (drawerCommentInput) {
            drawerCommentInput.focus();
            drawerCommentInput.placeholder = `Reply to @${username}...`;
        }
    }

    function clearReplyTo() {
        commentDrawerReplyTo = null;
        if (drawerReplyIndicator) drawerReplyIndicator.style.display = "none";
        if (drawerCommentInput) drawerCommentInput.placeholder = "Write a comment...";
    }

    if (cancelReplyBtn) {
        cancelReplyBtn.addEventListener("click", clearReplyTo);
    }

    async function loadCommentsInDrawer(postId) {
        if (!drawerCommentsList) return;
        drawerCommentsList.innerHTML = renderSkeletonComments(3);

        try {
            const res = await apiRequest(`/api/posts/${postId}/comments?page=0&size=100`);
            if (!res || !res.ok) throw new Error("Failed to load comments");
            const data = await res.json();
            const comments = data.content || data || [];

            if (drawerCommentCount) drawerCommentCount.textContent = comments.length;

            if (comments.length === 0) {
                drawerCommentsList.innerHTML = `
                    <div class="empty-comments-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <p>No comments yet. Start the discussion!</p>
                    </div>
                `;
                return;
            }

            // Separate top-level and replies
            const topLevel = comments.filter(c => !c.parentCommentId);
            const replies = comments.filter(c => c.parentCommentId);
            const replyMap = {};
            replies.forEach(r => {
                if (!replyMap[r.parentCommentId]) replyMap[r.parentCommentId] = [];
                replyMap[r.parentCommentId].push(r);
            });

            let html = "";
            topLevel.forEach(comment => {
                html += renderDrawerComment(comment, postId);
                // Render replies underneath
                if (replyMap[comment.id]) {
                    replyMap[comment.id].forEach(reply => {
                        html += renderDrawerComment(reply, postId, true);
                    });
                }
            });

            drawerCommentsList.innerHTML = html;
            attachCommentActions(postId);

        } catch (err) {
            console.error("Load comments error:", err);
            drawerCommentsList.innerHTML = '<p class="error-note">Failed to load comments.</p>';
        }
    }

    function renderDrawerComment(comment, postId, isReply = false) {
        const initial = (comment.authorUsername || "U").charAt(0).toUpperCase();
        const timeAgo = formatRelativeTime(comment.createdAt);
        const isSelf = comment.authorId === currentUser.id;
        const canDelete = comment.canDelete || isSelf;

        return `
            <div class="drawer-comment-row ${isReply ? 'reply-comment' : ''}" data-comment-id="${comment.id}">
                <div class="drawer-comment-avatar">${initial}</div>
                <div class="drawer-comment-body">
                    <div class="drawer-comment-header">
                        <span class="drawer-comment-author">${escapeHtml(comment.authorUsername)}</span>
                        <span class="drawer-comment-time">${timeAgo}</span>
                        ${comment.edited ? '<span class="drawer-comment-edited">(edited)</span>' : ''}
                    </div>
                    <div class="drawer-comment-text">${escapeHtml(comment.content)}</div>
                    <div class="drawer-comment-actions">
                        <button class="comment-action-btn btn-reply-comment" data-comment-id="${comment.id}" data-author="${escapeHtml(comment.authorUsername)}">
                            ↩ Reply
                        </button>
                        ${isSelf ? `<button class="comment-action-btn btn-edit-comment" data-comment-id="${comment.id}">✎ Edit</button>` : ''}
                        ${canDelete ? `<button class="comment-action-btn danger btn-delete-comment" data-comment-id="${comment.id}" data-post-id="${postId}">✕ Delete</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    function attachCommentActions(postId) {
        if (!drawerCommentsList) return;

        // Reply buttons
        drawerCommentsList.querySelectorAll(".btn-reply-comment").forEach(btn => {
            btn.addEventListener("click", () => {
                setReplyTo(btn.getAttribute("data-comment-id"), btn.getAttribute("data-author"));
            });
        });

        // Edit buttons
        drawerCommentsList.querySelectorAll(".btn-edit-comment").forEach(btn => {
            btn.addEventListener("click", async () => {
                const commentId = btn.getAttribute("data-comment-id");
                const row = btn.closest(".drawer-comment-row");
                const textEl = row.querySelector(".drawer-comment-text");
                const oldText = textEl.textContent;

                // Inline edit mode
                textEl.innerHTML = `<input type="text" class="comment-input inline-edit-input" value="${escapeHtml(oldText)}" maxlength="1000" style="width: 100%; font-size: 0.82rem;">`;
                const input = textEl.querySelector("input");
                input.focus();
                input.select();

                const saveEdit = async () => {
                    const newText = input.value.trim();
                    if (!newText || newText === oldText) {
                        textEl.textContent = oldText;
                        return;
                    }
                    try {
                        const res = await apiRequest(`/api/posts/${postId}/comments/${commentId}`, {
                            method: "PUT",
                            body: JSON.stringify({ content: newText })
                        });
                        if (res && res.ok) {
                            showToast("Comment updated.", "success");
                            loadCommentsInDrawer(postId);
                        } else {
                            showToast("Failed to update comment.", "error");
                            textEl.textContent = oldText;
                        }
                    } catch (err) {
                        showToast("Network error.", "error");
                        textEl.textContent = oldText;
                    }
                };

                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") { e.preventDefault(); saveEdit(); }
                    if (e.key === "Escape") { textEl.textContent = oldText; }
                });
                input.addEventListener("blur", saveEdit);
            });
        });

        // Delete buttons
        drawerCommentsList.querySelectorAll(".btn-delete-comment").forEach(btn => {
            btn.addEventListener("click", async () => {
                const commentId = btn.getAttribute("data-comment-id");
                const postId = btn.getAttribute("data-post-id");

                showConfirmDialog("Delete Comment", "Are you sure you want to delete this comment?", async () => {
                    try {
                        const res = await apiRequest(`/api/posts/${postId}/comments/${commentId}`, {
                            method: "DELETE"
                        });
                        if (res && res.ok) {
                            showToast("Comment deleted.", "success");
                            loadCommentsInDrawer(postId);
                            // Update post card comment count
                            const postCard = document.querySelector(`#post-card-${postId}`);
                            if (postCard) {
                                const countEl = postCard.querySelector(".comment-count");
                                if (countEl) {
                                    const c = Math.max(0, parseInt(countEl.textContent || "0") - 1);
                                    countEl.textContent = c;
                                }
                            }
                        } else {
                            showToast("Failed to delete comment.", "error");
                        }
                    } catch (err) {
                        showToast("Network error.", "error");
                    }
                });
            });
        });
    }

    // Comment drawer form submission
    if (drawerCommentForm) {
        drawerCommentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!commentDrawerPostId) return;
            const text = drawerCommentInput.value.trim();
            if (!text) return;
            if (drawerCommentSubmitBtn) drawerCommentSubmitBtn.disabled = true;

            try {
                const body = { content: text };
                if (commentDrawerReplyTo) {
                    body.parentCommentId = commentDrawerReplyTo.commentId;
                }

                const res = await apiRequest(`/api/posts/${commentDrawerPostId}/comments`, {
                    method: "POST",
                    body: JSON.stringify(body)
                });

                if (res && res.ok) {
                    drawerCommentInput.value = "";
                    clearReplyTo();
                    loadCommentsInDrawer(commentDrawerPostId);
                    // Update post card comment count
                    const postCard = document.querySelector(`#post-card-${commentDrawerPostId}`);
                    if (postCard) {
                        const countEl = postCard.querySelector(".comment-count");
                        if (countEl) {
                            countEl.textContent = parseInt(countEl.textContent || "0") + 1;
                        }
                    }
                    showToast("Comment posted!", "success");
                } else {
                    const err = await res.json();
                    showToast(err.error || "Failed to post comment.", "error");
                }
            } catch (err) {
                console.error("Comment submit error:", err);
                showToast("Network error.", "error");
            } finally {
                if (drawerCommentSubmitBtn) drawerCommentSubmitBtn.disabled = false;
            }
        });
    }

    // ============================================================
    // DATE FORMATTING HELPER
    // ============================================================
    function getDateLabel(isoStr) {
        const date = new Date(isoStr);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const diff = today - msgDate;

        if (diff === 0) return "Today";
        if (diff === 86400000) return "Yesterday";

        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
    }

    function createDateSeparator(label) {
        const sep = document.createElement("div");
        sep.className = "chat-date-separator";
        sep.innerHTML = `<span class="chat-date-separator-text">${label}</span>`;
        return sep;
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
                // Add to notification bell
                const author = data.senderUsername || "Someone";
                const title = data.title || "a new post";
                addNotification(`${author} published "${title}" in ${currentGroup.name}`, "post");
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
        groupsLoading.style.display = "none";
        groupsListContainer.innerHTML = renderSkeletonGroupItems(5);
        groupsListContainer.style.display = "block";
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
                showToast("Join request submitted to group admin", "success");
            } else {
                const data = await res.json();
                showToast(data.error || "Failed to submit join request.", "error");
                buttonEl.disabled = false;
                buttonEl.textContent = "Request to Join";
            }
        } catch (err) {
            console.error("Submit join request error:", err);
            showToast("Network error submitting request.", "error");
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
                showToast(`Joined ${updated.name}!`, "success");
            } else {
                const data = await res.json();
                showToast(data.error || "Failed to join group.", "error");
            }
        } catch (err) {
            console.error("Join public group error:", err);
            showToast("Network error joining group.", "error");
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
                        showToast("Invite code regenerated", "success");
                    } else {
                        const data = await res.json();
                        showToast(data.error || "Failed to regenerate code.", "error");
                    }
                } catch (e) {
                    console.error("Regenerate code error:", e);
                    showToast("Network error regenerating code.", "error");
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
                showToast(approve ? "Request approved" : "Request rejected", "info");
            } else {
                const data = await res.json();
                showToast(data.error || "Failed to review join request.", "error");
            }
        } catch (e) {
            console.error("Review request error:", e);
            showToast("Network error reviewing join request.", "error");
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
                lastRenderedMessage = null;
                lastRenderedDate = null;
                unreadWhileScrolledUp = 0;

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

    function appendMessage(msg, isNewMsg = true) {
        const placeholder = messagesList.querySelector(".list-placeholder-state");
        if (placeholder) placeholder.remove();

        const mine = msg.senderId === currentUser.id || msg.senderUsername === currentUser.username;
        const timeStr = formatTimestamp(msg.timestamp);
        
        // 1. Date Separator Logic
        const msgDateIso = parseTimestamp(msg.timestamp || Date.now()).toISOString();
        const dateLabel = getDateLabel(msgDateIso);
        if (dateLabel !== lastRenderedDate) {
            messagesList.appendChild(createDateSeparator(dateLabel));
            lastRenderedDate = dateLabel;
            lastRenderedMessage = null; // Reset grouping after date change
        }

        // 2. Sender Grouping Logic (within 5 minutes)
        let isGrouped = false;
        const msgTimeMs = parseTimestamp(msg.timestamp || Date.now()).getTime();
        
        if (lastRenderedMessage) {
            const timeDiff = msgTimeMs - lastRenderedMessage.timestamp;
            if (lastRenderedMessage.senderId === msg.senderId && timeDiff < 300000) {
                isGrouped = true;
            }
        }

        const row = document.createElement("div");
        row.className = `message-row ${mine ? 'mine' : 'other'} ${isGrouped ? 'grouped' : 'group-first'}`;

        let mediaHtml = "";
        if (msg.mediaUrl) {
            mediaHtml = `
                <div class="message-image-container">
                    <img src="${escapeHtml(msg.mediaUrl)}" alt="Attachment" class="chat-attached-image" loading="lazy">
                </div>
            `;
        }

        row.innerHTML = `
            ${!mine && !isGrouped ? `<div class="msg-avatar-spacer"></div>` : (isGrouped && !mine ? `<div class="msg-avatar-spacer"></div>` : '')}
            <div class="message-bubble">
                ${!mine && !isGrouped ? `<span class="message-sender">${escapeHtml(msg.senderUsername || 'Member')}</span>` : ''}
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
            imgEl.addEventListener("load", () => {
                if (isNewMsg && (mine || isNearBottom())) scrollMessagesToBottom();
            });
        }

        messagesList.appendChild(row);
        
        lastRenderedMessage = {
            senderId: msg.senderId,
            timestamp: msgTimeMs
        };

        // 3. Smart Scrolling Logic
        if (isNewMsg) {
            if (mine || isNearBottom()) {
                scrollMessagesToBottom();
            } else {
                unreadWhileScrolledUp++;
                if (scrollUnreadBadge) {
                    scrollUnreadBadge.textContent = unreadWhileScrolledUp > 99 ? "99+" : unreadWhileScrolledUp;
                    scrollUnreadBadge.style.display = "flex";
                }
                if (newMessagesIndicator) {
                    newMessagesIndicator.classList.add("visible");
                    newMessagesIndicator.style.display = "flex";
                    const newMsgCount = document.getElementById("newMsgCount");
                    if (newMsgCount) {
                        newMsgCount.textContent = unreadWhileScrolledUp === 1 ? "1 new message" : `${unreadWhileScrolledUp} new messages`;
                    }
                }
            }
        }
    }

    function scrollMessagesToBottom() {
        if (chatStreamWrapper) {
            chatStreamWrapper.scrollTop = chatStreamWrapper.scrollHeight;
        } else {
            messagesList.scrollTop = messagesList.scrollHeight;
        }
    }

    function parseTimestamp(val) {
        if (!val) return new Date();
        
        // Handle Spring Boot array serialization [2026, 9, 20, 15, 56, 0]
        if (Array.isArray(val)) {
            if (val.length >= 3) {
                return new Date(Date.UTC(
                    val[0], val[1] - 1, val[2], 
                    val[3] || 0, val[4] || 0, val[5] || 0, 
                    val[6] ? Math.floor(val[6]/1000000) : 0
                ));
            }
        }
        
        // Handle numeric timestamps
        if (typeof val === 'number') {
            if (val < 10000000000) {
                return new Date(val * 1000); // Convert epoch seconds to ms
            }
            return new Date(val);
        }
        
        // Handle purely numeric strings
        if (typeof val === 'string' && /^\d+(\.\d+)?$/.test(val)) {
            let numVal = parseFloat(val);
            if (numVal < 10000000000) {
                return new Date(numVal * 1000);
            }
            return new Date(numVal);
        }
        
        return new Date(val);
    }

    function formatTimestamp(isoStr) {
        if (!isoStr) return "";
        try {
            const date = parseTimestamp(isoStr);
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
            const date = parseTimestamp(isoStr);
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
            const date = parseTimestamp(isoStr);
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
            showToast("Only image files (JPEG, PNG, WebP, GIF) are supported.", "warning");
            chatFileInput.value = "";
            return;
        }

        if (file.size > 15 * 1024 * 1024) {
            showToast("File size exceeds the 15MB limit.", "warning");
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
                    showToast("Failed to upload image. Please try again.", "error");
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
            showToast("Error sending message. Please check connection.", "error");
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

        if (!append) {
            postsFeedContainer.innerHTML = renderSkeletonPostCards(3);
            postsFeedContainer.style.display = "flex";
            postsEmptyState.style.display = "none";
        }

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
                    removeSkeletons(postsFeedContainer);
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
                <div class="post-text-content">${formatPostText(post.content)}</div>
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
        if (commentsToggleBtn) {
            commentsToggleBtn.addEventListener("click", () => {
                openCommentDrawer(post.id, post);
                // Also asynchronously record a view since they're engaging with the post
                apiRequest(`/api/posts/${post.id}/view`, { method: "POST" }).catch(() => {});
            });
        }



        postsFeedContainer.appendChild(card);
    }

    // Helper: auto-link URLs in post content safely
    function formatPostText(text) {
        if (!text) return "";
        const escaped = escapeHtml(text);
        const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
        return escaped.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="post-inline-link">${url}</a>`).replace(/\n/g, '<br>');
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
        const likeBtn = card.querySelector(".btn-post-like");
        const dislikeBtn = card.querySelector(".btn-post-dislike");
        if (likeBtn) likeBtn.disabled = true;
        if (dislikeBtn) dislikeBtn.disabled = true;

        try {
            const res = await apiRequest(`/api/posts/${postId}/react`, {
                method: "POST",
                body: JSON.stringify({ type })
            });

            if (res && res.ok) {
                const result = await res.json();
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
        } finally {
            if (likeBtn) likeBtn.disabled = false;
            if (dislikeBtn) dislikeBtn.disabled = false;
        }
    }

    // ============================================================
    // 17. BOOKMARKING & SAVED POSTS
    // ============================================================
    async function handleBookmarkToggle(postId, bookmarkBtn) {
        bookmarkBtn.disabled = true;

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
                    showToast("Post saved to bookmarks", "success");
                } else {
                    bookmarkBtn.classList.remove("active-bookmark");
                    bookmarkBtn.title = "Save Post";
                    bookmarkBtn.querySelector("svg").setAttribute("fill", "none");
                    showToast("Post removed from bookmarks", "info");
                }
            }
        } catch (e) {
            console.error("Bookmark error:", e);
        } finally {
            bookmarkBtn.disabled = false;
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
                showToast("Post link copied to clipboard!", "success");
            }).catch(() => {
                prompt("Copy post link:", shareUrl);
            });
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
                showToast("Assessment submitted successfully", "success");
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
                showToast("Assessment vote removed", "info");
            } else {
                const err = await res.json();
                showToast(err.error || "Failed to remove verification vote.", "error");
            }
        } catch (e) {
            console.error("Remove verification vote error:", e);
            showToast("Network error removing verification vote.", "error");
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
            showToast("Please select a valid image file (JPEG, PNG, WebP, GIF).", "warning");
            postImageFileInput.value = "";
            return;
        }

        if (file.size > 15 * 1024 * 1024) {
            showToast("Image size exceeds 15MB limit.", "warning");
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
                showToast("Post published successfully", "success");
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
                showToast("Post updated successfully", "success");
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
                        showToast("Post deleted", "info");
                    } else {
                        const data = await res.json();
                        showToast(data.error || "Failed to delete post.", "error");
                    }
                } catch (e) {
                    console.error("Delete post error:", e);
                    showToast("Network error deleting post.", "error");
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
                showToast("Thank you. Your report has been submitted to community moderators.", "success");
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
                        showToast("Left group successfully", "info");
                    } else {
                        const data = await res.json();
                        showToast(data.error || "Failed to leave group.", "error");
                    }
                } catch (e) {
                    console.error("Leave group error:", e);
                    showToast("Network error leaving group.", "error");
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
                        showToast("Group deleted successfully", "info");
                    } else {
                        const data = await res.json();
                        showToast(data.error || "Failed to delete group.", "error");
                    }
                } catch (e) {
                    console.error("Delete group error:", e);
                    showToast("Network error deleting group.", "error");
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
