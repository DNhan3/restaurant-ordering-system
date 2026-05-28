import api from '../api/axios';

export const adminService = {
  getShippers: async () => {
    const response = await api.get('/admin/shippers');
    return response.data;
  },

  createShipper: async (shipper) => {
    const response = await api.post('/admin/shippers', shipper);
    return response.data;
  },
};
