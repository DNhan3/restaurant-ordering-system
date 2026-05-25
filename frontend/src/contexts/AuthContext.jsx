import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'qfood_user';
const ADMIN_STORAGE_KEY = 'qfood_admin';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    return saved || null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem(ADMIN_STORAGE_KEY, admin);
    } else {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  }, [admin]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const loginAsAdmin = (password) => {
    const adminKey = '25082002';
    if (password === adminKey) {
      setAdmin('admin');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdmin(null);
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    admin,
    isLoading,
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
