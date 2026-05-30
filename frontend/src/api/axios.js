import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

const readToken = (storageKey) => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || 'null')?.accessToken;
  } catch {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const token =
    readToken('qfood_admin') ||
    readToken('qfood_shipper') ||
    readToken('qfood_user');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
