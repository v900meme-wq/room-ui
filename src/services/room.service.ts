import api from './api';
import type { Room } from '../types';

export const roomService = {
    getAll: async (houseId?: number): Promise<Room[]> => {
        const url = houseId ? `/rooms?houseId=${houseId}` : '/rooms';
        const response = await api.get<Room[]>(url);
        return response.data;
    },

    getOne: async (id: number): Promise<Room> => {
        const response = await api.get<Room>(`/rooms/${id}`);
        return response.data;
    },

    getRoomsByUser: async (): Promise<Room[]> => {
        const response = await api.get<Room[]>(`/rooms/user`);
        return response.data;
    },

    create: async (data: Partial<Room>): Promise<Room> => {
        const response = await api.post<Room>('/rooms', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Room>): Promise<Room> => {
        const response = await api.patch<Room>(`/rooms/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/rooms/${id}`);
    },
};