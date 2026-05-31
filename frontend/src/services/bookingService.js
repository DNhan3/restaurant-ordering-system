import api from '../api/axios';

export const bookingService = {
  create: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/bookings');
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
};
