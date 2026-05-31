import api from '../api/axios';

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
};