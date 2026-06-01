import api from '../api/axios';

const buildParams = (params = {}) => ({
  params: Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ),
});

export const bookingService = {
  create: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get('/bookings', buildParams(params));
    return response.data;
  },

  getByUser: async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },

  getAvailability: async ({ date, time, excludeId }) => {
    const params = new URLSearchParams({ date, time });
    if (excludeId) {
      params.set('excludeId', excludeId);
    }
    const response = await api.get(`/bookings/availability?${params.toString()}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/bookings/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },
};
