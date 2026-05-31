import api from '../api/axios';

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/users/admin', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
