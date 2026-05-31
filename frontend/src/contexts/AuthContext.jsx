import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'qfood_user';
const ADMIN_STORAGE_KEY = 'qfood_admin';
const SHIPPER_STORAGE_KEY = 'qfood_shipper';

const clearUserStorage = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(SHIPPER_STORAGE_KEY);
};

const clearAdminStorage = () => {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
};

  const normalizeUser = (userData) => {
    if (!userData) return null;

    const id = userData.id ?? userData.user_id ?? userData.sub;
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
    const saved = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(SHIPPER_STORAGE_KEY);
    if (!saved) return null;

    try {
      return normalizeUser(JSON.parse(saved));
    } catch {
      clearUserStorage();
      return null;
    }
  });
  const [admin, setAdmin] = useState(() => {
    if (localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(SHIPPER_STORAGE_KEY)) {
      clearAdminStorage();
      return null;
    }

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
      clearAdminStorage();
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      if (user.role === 'shipper') {
        localStorage.setItem(SHIPPER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SHIPPER_STORAGE_KEY);
      }
    } else {
      clearUserStorage();
    }
  }, [user]);

  useEffect(() => {
    if (admin) {
      clearUserStorage();
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
    } else {
      clearAdminStorage();
    }
  }, [admin]);

  const register = async (userData) => {
    setAdmin(null);
    const resp = await authService.register(userData);
    const user = resp?.user ?? resp;
    if (!user) {
      throw new Error('Registration failed');
    }
    setUser({ ...normalizeUser(user), accessToken: resp?.accessToken });
  };

  const login = async (email, password) => {
    setUser(null);
    setAdmin(null);
    clearAdminStorage();
    const resp = await authService.login(email, password);
    const user = resp?.user ?? resp;
    if (!user) {
      throw new Error('Incorrect email or password');
    }
    const session = { ...normalizeUser(user), accessToken: resp?.accessToken };
    setUser(session);
    return session;
  };

  const logout = () => {
    setUser(null);
    clearUserStorage();
  };

  const loginAsAdmin = async (password) => {
    setAdmin(null);
    setUser(null);
    clearUserStorage();
    const resp = await authService.adminLogin(password);
    const admin = resp?.admin;
    if (!admin) {
      throw new Error('Invalid admin credentials');
    }
    setAdmin({ ...admin, accessToken: resp?.accessToken });
    return true;
  };

  const logoutAdmin = () => {
    setAdmin(null);
    clearAdminStorage();
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      return normalizeUser({ ...prev, ...updates });
    });
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
    updateUser,
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
