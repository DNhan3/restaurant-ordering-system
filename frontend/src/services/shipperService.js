import api from '../api/axios';

export const shipperService = {
  getAvailableOrders: async () => {
    const response = await api.get('/shipper/available-orders');
    return response.data;
  },

  getMyOrder: async () => {
    const response = await api.get('/shipper/my-order');
    return response.data;
  },

  acceptOrder: async (billId) => {
    const response = await api.post(`/shipper/accept/${billId}`);
    return response.data;
  },

  denyOrder: async (billId) => {
    const response = await api.post(`/shipper/deny/${billId}`);
    return response.data;
  },

  pickupOrder: async (billId) => {
    const response = await api.post(`/shipper/pickup/${billId}`);
    return response.data;
  },

  deliveredOrder: async (billId) => {
    const response = await api.post(`/shipper/delivered/${billId}`);
    return response.data;
  },
};
