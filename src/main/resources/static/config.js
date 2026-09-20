// =============================================================
// UniHive Configuration (Single-Domain & Multi-Domain Ready)
// =============================================================

const CONFIG = {
    // When served by Spring Boot on the same domain and port, API_BASE_URL is "" (relative).
    // If run on a different local dev port (e.g. Live Server on 3000/5500), it targets http://localhost:8080.
    API_BASE_URL: localStorage.getItem("unihive_api_url") || window.API_BASE_URL || (
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && window.location.port !== "8080" && window.location.port !== ""
            ? "http://localhost:8080"
            : ""
    ),

    // Dynamically computes WebSocket URL based on current host
    get WS_URL() {
        if (window.WS_URL) return window.WS_URL;
        if (localStorage.getItem("unihive_ws_url")) return localStorage.getItem("unihive_ws_url");

        // Render / HTTPS production deployment (never append :8887 on Render)
        if (window.location.hostname.includes("onrender.com") || window.location.protocol === "https:") {
            return `wss://${window.location.host}`;
        }

        // Local development environment: connects to ChatWebSocketServer on port 8887
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || !window.location.hostname) {
            return "ws://localhost:8887";
        }

        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = window.location.host || "localhost:8887";
        return `${protocol}//${host}`;
    }
};
