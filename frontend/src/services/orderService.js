import api from '../api/axios';
import { API_URL } from '../config';

export const orderService = {
  getOrders: async (userId) => {
    const response = await api.get(`${API_URL}/billstatus/user/${userId}`);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get(`${API_URL}/billstatus`);
    return response.data;
  },

  getOrderDetails: async (billId) => {
    const response = await api.get(`${API_URL}/billdetails/${billId}`);
    return response.data;
  },

  getBillStatus: async (billId) => {
    const response = await api.get(`${API_URL}/billstatus/bill/${billId}`);
    return response.data;
  },

  createOrder: async (data) => {
    const response = await api.post(`${API_URL}/billstatus`, data);
    return response.data;
  },

  updateStatus: async (billId) => {
    const response = await api.put(`${API_URL}/billstatus/${billId}`);
    return response.data;
  },

  updatePaid: async (billId) => {
    const response = await api.put(`${API_URL}/billstatus/paid/${billId}`);
    return response.data;
  },

  cancelOrder: async (billId) => {
    const response = await api.put(`${API_URL}/billstatus/cancel/${billId}`);
    return response.data;
  },

  createBillDetail: async (data) => {
    const response = await api.post(`${API_URL}/billdetails`, data);
    return response.data;
  },

  getNewBillId: async () => {
    const response = await api.get(`${API_URL}/billstatus/new`);
    return response.data;
  },
};
