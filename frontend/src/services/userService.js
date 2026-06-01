import api from '../api/axios';

const buildParams = (params = {}) => ({
  params: Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ),
});

export const userService = {
    getUserByEmail: async (email) => {
        const response = await api.post(`/users/find`, { email });
        return response.data;
    },

    updateProfile: async (id, data) => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    changePassword: async (id, currentPassword, newPassword) => {
        const response = await api.put(`/users/${id}/password`, { currentPassword, newPassword });
        return response.data;
    },
    getAll: async (params) => {
      const response = await api.get('/users', buildParams(params));
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
