import api from '../api/axios';

export const cartService = {
  getCart: async (userId) => {
    const response = await api.get(`/cart-items/user/${userId}`);
    return response.data;
  },

  addItem: async (data) => {
    const response = await api.post('/cart-items', data);
    return response.data;
  },

  updateItem: async (data) => {
    const response = await api.put('/cart-items', data);
    return response.data;
  },

  removeItem: async (userId, foodId) => {
    const response = await api.delete(`/cart-items/user/${userId}/food/${foodId}`);
    return response.data;
  },

  clearCart: async (userId) => {
    const response = await api.delete(`/cart-items/user/${userId}`);
    return response.data;
  },
};
