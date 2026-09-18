// =============================================================
// UniHive Configuration
// =============================================================
// Configure the backend API and WebSocket endpoints.
// If your backend is hosted on Render, you can set its URL here
// or define window.API_BASE_URL before loading this script.
// =============================================================

const CONFIG = {
    // Backend API URL:
    // When running locally, points to http://localhost:8080.
    // For Render, replace with your Render backend URL, e.g.: "https://unihive-backend.onrender.com"
    API_BASE_URL: window.API_BASE_URL || (
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
            ? "http://localhost:8080"
            : window.location.origin
    ),

    // Dynamically computes the WebSocket URL based on the API URL
    get WS_URL() {
        if (window.WS_URL) return window.WS_URL;
        const base = this.API_BASE_URL;
        if (base.startsWith("https://")) {
            return base.replace(/^https:/, "wss:") + "/ws";
        } else if (base.startsWith("http://")) {
            return base.replace(/^http:/, "ws:") + "/ws";
        }
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        return `${protocol}//${window.location.host}/ws`;
    }
};
