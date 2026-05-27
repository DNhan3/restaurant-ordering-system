import api from '../api/axios';

export const orderService = {
  checkout: async (data) => {
    const response = await api.post('/checkout', data);
    return response.data?.order ?? response.data;
  },

  getOrders: async (userId) => {
    const response = await api.get(`/bill-status/user/${userId}`);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/bill-status');
    return response.data;
  },

  getOrderDetails: async (billId) => {
    const response = await api.get(`/bill-details/bill/${billId}`);
    return response.data;
  },

  getBillStatus: async (billId) => {
    const response = await api.get(`/bill-status/bill/${billId}`);
    return response.data;
  },

  createOrder: async (data) => {
    const response = await api.post('/bill-status', data);
    return response.data;
  },

  updateStatus: async (billId) => {
    const response = await api.put(`/bill-status/${billId}`, {});
    return response.data;
  },

  updatePaid: async (billId) => {
    const response = await api.put(`/bill-status/paid/${billId}`);
    return response.data;
  },

  cancelOrder: async (billId) => {
    const response = await api.put(`/bill-status/cancel/${billId}`);
    return response.data;
  },

  createBillDetail: async (data) => {
    const response = await api.post('/bill-details', data);
    return response.data;
  },

  getNewBillId: async () => {
    const response = await api.get('/bill-status/new');
    return response.data;
  },
};
