const API_URL = 'http://localhost:4000/';

class AuthService {

    getCurrentUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }

    logout() {
        localStorage.removeItem("user");
    }
}

export default new AuthService();