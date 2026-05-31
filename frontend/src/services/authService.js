import api from '../api/axios';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/register', {
      email: userData.email,
      password: userData.password,
      name: userData.name,
    });
    return response.data;
  },
};
