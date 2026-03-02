import axios from 'axios';
import { message } from 'antd';

// Normalisasi URL: pastikan berakhir dengan /api/ dan tidak ada /projects/ yang dobel
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = rawUrl.replace(/\/projects\/?$/, '').replace(/\/?$/, '/');

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request Interceptor: Logging untuk mempermudah mencari URL dobel di log/console
apiClient.interceptors.request.use(
    (config) => {
        // console.log(`🚀 Calling: ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

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
