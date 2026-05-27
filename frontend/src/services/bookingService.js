import api from '../api/axios';

export const bookingService = {
  create: async (data) => {
    console.log('Creating booking with data:', data);
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
};
