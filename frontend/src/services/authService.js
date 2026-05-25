import api from '../api/axios';
import { API_URL } from '../config';

export const authService = {
  login: async (email, password) => {
    const response = await api.post(`${API_URL}/login`, { email, password });
    return response.data;
  },

  register: async (userData) => {
    console.log('Registering user with data:', userData);
    const response = await api.post(`${API_URL}/register`, { email: userData.email, password: userData.password, name: userData.name });
    return response.data;
  },
};
