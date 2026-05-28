import api from '../api/axios';

export const shipperService = {
  login: async (email, password) => {
    const response = await api.post('/shipper/login', { email, password });
    return response.data;
  },

  getAvailableOrders: async () => {
    const response = await api.get('/shipper/available-orders');
    return response.data;
  },

  getMyOrder: async (shipperId) => {
    const response = await api.get(`/shipper/my-order/${shipperId}`);
    return response.data;
  },

  acceptOrder: async (billId, shipperId) => {
    const response = await api.post(`/shipper/accept/${billId}`, { shipperId });
    return response.data;
  },

  denyOrder: async (billId, shipperId) => {
    const response = await api.post(`/shipper/deny/${billId}`, { shipperId });
    return response.data;
  },

  pickupOrder: async (billId, shipperId) => {
    const response = await api.post(`/shipper/pickup/${billId}`, { shipperId });
    return response.data;
  },

  deliveredOrder: async (billId, shipperId) => {
    const response = await api.post(`/shipper/delivered/${billId}`, { shipperId });
    return response.data;
  },
};
