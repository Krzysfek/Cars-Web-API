import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        Accept: 'application/json',
    },
});

// Interceptor żądań: automatycznie dodaje token JWT, jeśli go posiadamy
apiClient.interceptors.request.use((config) => {
    const user = useAuthStore.getState().user;
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Interceptor odpowiedzi: automatycznie wylogowuje, gdy token wygaśnie
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);