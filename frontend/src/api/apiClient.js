import axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const apiClient = axios.create({
    baseURL: backendURL,
    // Send the httpOnly auth cookie with every request instead of reading
    // the JWT out of localStorage (which is readable by any injected script).
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor: no longer attaches an Authorization header, the
// browser sends the httpOnly cookie automatically via withCredentials.
apiClient.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Session expired or invalid; the server has already cleared the cookie.
            localStorage.removeItem('wisemind_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;