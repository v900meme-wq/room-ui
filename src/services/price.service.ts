import api from './api';

export interface Price {
    id: number;
    priceName: string;
    roomPrice: number;
    electPrice: number;
    waterPrice: number;
    trashFee: number;
    parkingFee: number;  // ← Thêm field này
    washingMachineFee: number;
    elevatorFee: number;
    deposit: number;
}

export const priceService = {
    getAll: async (): Promise<Price[]> => {
        const response = await api.get<Price[]>('/prices');
        return response.data;
    },

    getOne: async (id: number): Promise<Price> => {
        const response = await api.get<Price>(`/prices/${id}`);
        return response.data;
    },

    create: async (data: Partial<Price>): Promise<Price> => {
        const response = await api.post<Price>('/prices', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Price>): Promise<Price> => {
        const response = await api.patch<Price>(`/prices/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/prices/${id}`);
    },
};