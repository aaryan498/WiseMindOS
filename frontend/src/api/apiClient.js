import axios from 'axios';
import { getBackendURL } from '../config/env';

const backendURL = getBackendURL();

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
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('wisemind_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
