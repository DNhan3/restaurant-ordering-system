import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import api from '../api/axios';

const AuthContext = createContext();

const SESSION_KEY = 'qfood_session';
const VALID_ROLES = ['customer', 'shipper', 'admin'];

const normalizeUser = (userData) => {
  if (!userData) return null;

  const id = userData.id ?? userData.user_id ?? userData.sub ?? 0;
  const name = userData.name ?? userData.user_name;
  const email = userData.email ?? userData.user_email;
  const phone = userData.phone ?? userData.user_phone ?? '';
  const role = VALID_ROLES.includes(userData.role) ? userData.role : null;

  return {
    ...userData,
    id,
    name,
    email,
    phone,
    role,
    sub: userData.sub ?? id,
    user_id: id,
    user_name: name,
    user_email: email,
    user_phone: phone,
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (!saved) return null;
      return normalizeUser(JSON.parse(saved));
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (!savedSession) {
      setIsLoading(false);
      return;
    }

    try {
      const session = JSON.parse(savedSession);
      if (session?.accessToken) {
        api.get('/me', {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        })
          .then(({ data }) => {
            const normalized = normalizeUser(data?.user);
            if (normalized && normalized.role) {
              const newSession = { ...normalized, accessToken: session.accessToken };
              localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
              setUser(newSession);
            } else {
              localStorage.removeItem(SESSION_KEY);
              setUser(null);
            }
          })
          .catch(() => {
            localStorage.removeItem(SESSION_KEY);
            setUser(null);
          })
          .finally(() => setIsLoading(false));
      } else {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
        setIsLoading(false);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user, isLoading]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    const userData = data?.user;
    if (!userData) throw new Error('Login failed');

    const normalized = normalizeUser(userData);
    if (!normalized.role) throw new Error('Invalid user role');

    const session = { ...normalized, accessToken: data.accessToken };
    setUser(session);
    return session;
  }, []);

  const register = useCallback(async (userData) => {
    const { data } = await api.post('/register', {
      email: userData.email,
      password: userData.password,
      name: userData.name,
    });
    const user = data?.user;
    if (!user) throw new Error('Registration failed');

    const normalized = normalizeUser(user);
    const session = { ...normalized, accessToken: data.accessToken };
    setUser(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
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
