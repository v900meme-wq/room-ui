import api from './api';
import type { DashboardStats } from '../types';

export const adminService = {
    getDashboard: async (filters?: {
        startDate?: string;
        endDate?: string;
    }): Promise<DashboardStats> => {
        const params = new URLSearchParams();
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);

        const url = params.toString() ? `/admin/dashboard?${params}` : '/admin/dashboard';
        const response = await api.get<DashboardStats>(url);
        return response.data;
    },

    getUserStats: async (): Promise<any[]> => {
        const response = await api.get('/admin/users/stats');
        return response.data;
    },

    getHouseStats: async (): Promise<any[]> => {
        const response = await api.get('/admin/houses/stats');
        return response.data;
    },

    getRoomStats: async (): Promise<any[]> => {
        const response = await api.get('/admin/rooms/stats');
        return response.data;
    },
};