import api from '../api/axios';

const buildParams = (params = {}) => ({
  params: Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ),
});

export const billingService = {
  checkout: async (data) => {
    const response = await api.post('/checkout', data);
    return response.data?.order ?? response.data;
  },

  getUserInvoices: async (userId) => {
    const response = await api.get(`/billing/user/${userId}`);
    return response.data;
  },

  getUserBills: async (userId) => {
    const response = await api.get(`/bill-status/user/${userId}`);
    return response.data;
  },

  getInvoice: async (billId) => {
    const response = await api.get(`/billing/invoice/${billId}`);
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/billing/summary');
    return response.data;
  },

  getAllBills: async (params) => {
    const response = await api.get('/bill-status', buildParams(params));
    return response.data;
  },

  getBillDetails: async (billId) => {
    const response = await api.get(`/bill-details/bill/${billId}`);
    return response.data;
  },

  updateBill: async (billId, data = {}) => {
    const response = await api.put(`/bill-status/${billId}`, data);
    return response.data;
  },

  cancelBill: async (billId) => {
    const response = await api.put(`/bill-status/cancel/${billId}`);
    return response.data;
  },

  removeBill: async (billId) => {
    const response = await api.delete(`/bill-status/${billId}`);
    return response.data;
  },
};
