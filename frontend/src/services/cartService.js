import api from '../api/axios';
import { API_URL } from '../config';

export const cartService = {
  getCart: async (userId) => {
    const response = await api.get(`${API_URL}/cartItem/${userId}`);
    return response.data;
  },

  addItem: async (data) => {
    const response = await api.post(`${API_URL}/cartItem/`, data);
    return response.data;
  },

  updateItem: async (data) => {
    const response = await api.put(`${API_URL}/cartItem/`, data);
    return response.data;
  },

  removeItem: async (userId, foodId) => {
    const response = await api.delete(`${API_URL}/cartItem/${userId}/${foodId}`);
    return response.data;
  },

  clearCart: async (userId) => {
    const response = await api.delete(`${API_URL}/cartItem/${userId}`);
    return response.data;
  },
};
