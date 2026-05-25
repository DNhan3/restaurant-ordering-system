import api from '../api/axios';
import { API_URL } from '../config';

export const bookingService = {
  create: async (data) => {
    const response = await api.post(`${API_URL}/booking`, data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get(`${API_URL}/booking`);
    return response.data;
  },
};
