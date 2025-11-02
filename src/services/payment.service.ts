import api from './api';
import type { MonthlyPayment } from '../types';

export const paymentService = {
    getAll: async (filters?: {
        roomId?: number;
        month?: number;
        year?: number;
        status?: string;
    }): Promise<MonthlyPayment[]> => {
        const params = new URLSearchParams();

        // Chỉ append khi có giá trị
        if (filters?.roomId !== undefined && filters.roomId > 0) {
            params.append('roomId', filters.roomId.toString());
        }
        if (filters?.month !== undefined && filters.month > 0) {
            params.append('month', filters.month.toString());
        }
        if (filters?.year !== undefined && filters.year > 0) {
            params.append('year', filters.year.toString());
        }
        if (filters?.status) {
            params.append('status', filters.status);
        }

        const url = params.toString() ? `/payments?${params}` : '/payments';
        const response = await api.get<MonthlyPayment[]>(url);
        return response.data;
    },

    getOne: async (id: number): Promise<MonthlyPayment> => {
        const response = await api.get<MonthlyPayment>(`/payments/${id}`);
        return response.data;
    },

    getRecentByRoom: async (roomId: number): Promise<{
        recentPayments: MonthlyPayment[];
        suggestion: {
            suggestedElectStart: number;
            suggestedWaterStart: number;
            lastPaymentMonth: number;
            lastPaymentYear: number;
        } | null;
    }> => {
        const response = await api.get(`/payments/room/${roomId}/recent`);
        return response.data;
    },

    create: async (data: Partial<MonthlyPayment>): Promise<MonthlyPayment> => {
        const response = await api.post<MonthlyPayment>('/payments', data);
        return response.data;
    },

    update: async (id: number, data: Partial<MonthlyPayment>): Promise<MonthlyPayment> => {
        const response = await api.patch<MonthlyPayment>(`/payments/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/payments/${id}`);
    },
};