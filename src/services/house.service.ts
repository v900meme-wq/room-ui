import api from './api';
import type { House } from '../types';

export const houseService = {
    getAll: async (): Promise<House[]> => {
        const response = await api.get<House[]>('/houses');
        return response.data;
    },

    getOne: async (id: number): Promise<House> => {
        const response = await api.get<House>(`/houses/${id}`);
        return response.data;
    },

    create: async (data: Partial<House>): Promise<House> => {
        const response = await api.post<House>('/houses', data);
        return response.data;
    },

    update: async (id: number, data: Partial<House>): Promise<House> => {
        const response = await api.patch<House>(`/houses/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/houses/${id}`);
    },
};
