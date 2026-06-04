import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

const readSession = (storageKey) => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || 'null');
  } catch {
    return null;
  }
};

const clearAuthStorage = () => {
  localStorage.removeItem('qfood_admin');
  localStorage.removeItem('qfood_shipper');
  localStorage.removeItem('qfood_user');
};

api.interceptors.request.use((config) => {
  const url = config.url || '';
  const adminSession = readSession('qfood_admin');
  const userSession = readSession('qfood_user');
  const isShipper = userSession?.role === 'shipper';
  const isAuthEndpoint = ['/login', '/register', '/admin/login'].includes(url);
  let token = null;

  if (!isAuthEndpoint) {
    if (adminSession) {
      token = adminSession.accessToken;
    } else if (isShipper) {
      token = url.startsWith('/shipper') || url.startsWith('/users') ? userSession.accessToken : null;
    } else if (userSession) {
      token = url.startsWith('/admin') || url.startsWith('/shipper') ? null : userSession.accessToken;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthEndpoint = ['/login', '/register', '/admin/login'].includes(url);

    if (!isAuthEndpoint && [401, 403].includes(error.response?.status)) {
      const hadAdminSession = !!readSession('qfood_admin');
      clearAuthStorage();

      if (hadAdminSession || url.startsWith('/admin')) {
        window.location.assign('/admin/login');
      } else {
        window.location.assign('/login');
      }
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
