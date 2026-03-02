import axios from 'axios';
import { message } from 'antd';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/?$/, '/');

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Response Interceptor for Global Error Handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMsg = error.response?.data?.message || error.message || 'Terjadi kesalahan pada server';

        // Ant Design global message
        message.error(errorMsg);

        return Promise.reject(error);
    }
);

export default apiClient;
