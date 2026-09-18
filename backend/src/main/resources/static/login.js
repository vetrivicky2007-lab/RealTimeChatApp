document.addEventListener("DOMContentLoaded", () => {
    // If already logged in, redirect to index.html
    const existingToken = localStorage.getItem("unihive_token");
    if (existingToken) {
        window.location.href = "index.html";
        return;
    }

    const tabLogin = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const authError = document.getElementById("authError");

    function showError(msg) {
        authError.textContent = msg;
        authError.style.display = "block";
    }

    function clearError() {
        authError.textContent = "";
        authError.style.display = "none";
    }

    // Switch to Login Tab
    tabLogin.addEventListener("click", () => {
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        clearError();
    });

    // Switch to Register Tab
    tabRegister.addEventListener("click", () => {
        tabRegister.classList.add("active");
        tabLogin.classList.remove("active");
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        clearError();
    });

    // Handle Login Submit
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearError();

        const identifier = document.getElementById("loginIdentifier").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!identifier || !password) {
            showError("Please fill in all fields.");
            return;
        }

        const submitBtn = document.getElementById("loginSubmitBtn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Signing In...";

        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password })
            });

            const data = await res.json();

            if (!res.ok) {
                showError(data.error || "Login failed. Please check your credentials.");
                return;
            }

            // Save token and user details
            localStorage.setItem("unihive_token", data.token);
            localStorage.setItem("unihive_user", JSON.stringify(data.user));

            window.location.href = "index.html";

        } catch (err) {
            console.error("Login request failed:", err);
            showError("Unable to connect to server. Ensure the backend is running.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign In";
        }
    });

    // Handle Register Submit
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearError();

        const username = document.getElementById("regUsername").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;

        if (!username || !email || !password) {
            showError("Please fill in all fields.");
            return;
        }

        if (username.length < 3 || username.length > 30) {
            showError("Username must be between 3 and 30 characters.");
            return;
        }

        if (password.length < 6) {
            showError("Password must be at least 6 characters.");
            return;
        }

        const submitBtn = document.getElementById("registerSubmitBtn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Creating Account...";

        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors) {
                    const firstError = Object.values(data.errors)[0];
                    showError(firstError || data.error || "Registration failed.");
                } else {
                    showError(data.error || "Registration failed.");
                }
                return;
            }

            // Save token and user details
            localStorage.setItem("unihive_token", data.token);
            localStorage.setItem("unihive_user", JSON.stringify(data.user));

            window.location.href = "index.html";

        } catch (err) {
            console.error("Registration request failed:", err);
            showError("Unable to connect to server. Ensure the backend is running.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Create Account";
        }
    });
});