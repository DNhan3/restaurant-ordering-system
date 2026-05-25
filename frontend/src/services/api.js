import api from '../api/axios';

export const foodService = {
  getAll: async () => {
    const response = await api.get('/foods');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/foods/${id}`);
    return response.data;
  },

  getByCategory: async (category) => {
    const response = await api.get(`/foods?category=${category}`);
    return response.data;
  },
};

export const cartService = {
  getCart: async (userId) => {
    const response = await api.get(`/cartItem/${userId}`);
    return response.data;
  },

  addItem: async (data) => {
    const response = await api.post('/cartItem/', data);
    return response.data;
  },

  updateItem: async (data) => {
    const response = await api.put('/cartItem/', data);
    return response.data;
  },

  removeItem: async (userId, foodId) => {
    const response = await api.delete(`/cartItem/${userId}/${foodId}`);
    return response.data;
  },

  clearCart: async (userId) => {
    const response = await api.delete(`/cartItem/${userId}`);
    return response.data;
  },
};

export const orderService = {
  getOrders: async (userId) => {
    const response = await api.get(`/billstatus/user/${userId}`);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/billstatus');
    return response.data;
  },

  getOrderDetails: async (billId) => {
    const response = await api.get(`/billdetails/${billId}`);
    return response.data;
  },

  getBillStatus: async (billId) => {
    const response = await api.get(`/billstatus/bill/${billId}`);
    return response.data;
  },

  createOrder: async (data) => {
    const response = await api.post('/billstatus', data);
    return response.data;
  },

  updateStatus: async (billId) => {
    const response = await api.put(`/billstatus/${billId}`);
    return response.data;
  },

  updatePaid: async (billId) => {
    const response = await api.put(`/billstatus/paid/${billId}`);
    return response.data;
  },

  cancelOrder: async (billId) => {
    const response = await api.put(`/billstatus/cancel/${billId}`);
    return response.data;
  },

  createBillDetail: async (data) => {
    const response = await api.post('/billdetails', data);
    return response.data;
  },

  getNewBillId: async () => {
    const response = await api.get('/billstatus/new');
    return response.data;
  },
};

export const authService = {
  getUserByEmail: async (email) => {
    const response = await api.get(`/users/${email}`);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },
};

export const bookingService = {
  create: async (data) => {
    const response = await api.post('/booking', data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/booking');
    return response.data;
  },
};
