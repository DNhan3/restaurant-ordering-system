import api from '../api/axios';
import { API_URL } from '../config';

export const foodService = {
  getAll: async () => {
    const response = await api.get(`${API_URL}/foods`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${API_URL}/foods/${id}`);
    return response.data;
  },

  getByCategory: async (category) => {
    const response = await api.get(`${API_URL}/foods?category=${category}`);
    return response.data;
  },
};
