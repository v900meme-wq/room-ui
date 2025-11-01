import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message: string; statusCode: number }>) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'Có lỗi xảy ra';

        switch (status) {
            case 401:
                toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                break;
            case 403:
                toast.error('Bạn không có quyền thực hiện thao tác này.');
                break;
            case 404:
                toast.error('Không tìm thấy dữ liệu.');
                break;
            case 429:
                toast.error('Bạn đang thao tác quá nhanh. Vui lòng đợi chút.');
                break;
            case 500:
                toast.error('Lỗi server. Vui lòng thử lại sau.');
                break;
            default:
                if (Array.isArray(message)) {
                    toast.error(message[0]);
                } else {
                    toast.error(message);
                }
        }

        return Promise.reject(error);
    }
);

export default api;
