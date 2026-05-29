import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'qfood_user';
const ADMIN_STORAGE_KEY = 'qfood_admin';

const normalizeUser = (userData) => {
  if (!userData) return null;

  const id = userData.id ?? userData.user_id;
  const name = userData.name ?? userData.user_name;
  const email = userData.email ?? userData.user_email;
  const phone = userData.phone ?? userData.user_phone ?? '';

  return {
    ...userData,
    id,
    name,
    email,
    phone,
    user_id: id,
    user_name: name,
    user_email: email,
    user_phone: phone,
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return null;

    try {
      return normalizeUser(JSON.parse(saved));
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  });
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!saved) return null;

    try {
      return JSON.parse(saved);
    } catch {
      return { role: saved };
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  }, [admin]);

  const register = async (userData) => {
    const resp = await authService.register(userData);
    const user = resp?.user ?? resp;
    if (!user) {
      throw new Error('Registration failed');
    }
    setUser(normalizeUser(user));
    await login(userData.email, userData.password);
  };

  const login = async (email, password) => {
    setUser(null);
    const resp = await authService.login(email, password);
    const user = resp?.user ?? resp;
    if (!user) {
      throw new Error('Incorrect email or password');
    }
    const normalized = normalizeUser(user);
    setUser(normalized);
    return normalized;
  };

  const logout = () => {
    setUser(null);
  };

  const loginAsAdmin = async (password) => {
    setAdmin(null);
    const resp = await authService.adminLogin(password);
    const admin = resp?.admin;
    if (!admin) {
      throw new Error('Invalid admin credentials');
    }
    setAdmin(admin);
    return true;
  };

  const logoutAdmin = () => {
    setAdmin(null);
  };


  const isAuthenticated = !!user;

  const value = {
    user,
    admin,
    isLoading,
    register,
    login,
    logout,
    loginAsAdmin,
    logoutAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}