import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const session = JSON.parse(localStorage.getItem('qfood_session') || 'null');
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
  } catch {
    // ignore
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
