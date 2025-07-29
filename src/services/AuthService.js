class AuthService {

    getCurrentUser() {
        const user = localStorage.getItem("user");
        const cacheTime = localStorage.getItem("user_cache_time");
        const now = Date.now();
        const maxAge = 60 * 60 * 1000; // 1 hour

        if (user && cacheTime && now - cacheTime < maxAge) {
            // Refresh cache time on access
            localStorage.setItem("user_cache_time", now);
            return JSON.parse(user);
        } else {
            // Remove expired user
            localStorage.removeItem("user");
            localStorage.removeItem("user_cache_time");
            return null;
        }
    }

    setCurrentUser(user) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user_cache_time", Date.now());
    }

    logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("user_cache_time");
    }
}

export default new AuthService();