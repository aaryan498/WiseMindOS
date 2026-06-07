import axios from 'axios';
import { toast } from 'react-toastify';

const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const apiClient = axios.create({
    baseURL: backendURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to attach token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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
        if (error.response) {
            if (error.response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                localStorage.removeItem('wisemind_user');
                window.location.href = '/login';
            } else {
                // Global error toast for structured backend errors
                const errorMessage = error.response.data?.message || 'An unexpected server error occurred.';
                toast.error(errorMessage);
            }
        } else {
            // Network error or other unhandled exception
            toast.error('Network error. Please check your connection.');
        }
        return Promise.reject(error);
    }
);

export default apiClient;