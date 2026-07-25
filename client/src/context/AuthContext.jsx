import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('doubtsnap_token');
    const savedUser = localStorage.getItem('doubtsnap_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('doubtsnap_token');
        localStorage.removeItem('doubtsnap_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser({ _id: data._id, name: data.name, email: data.email });
    setToken(data.token);
    localStorage.setItem('doubtsnap_token', data.token);
    localStorage.setItem('doubtsnap_user', JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
    }));
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setUser({ _id: data._id, name: data.name, email: data.email });
    setToken(data.token);
    localStorage.setItem('doubtsnap_token', data.token);
    localStorage.setItem('doubtsnap_user', JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
    }));
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('doubtsnap_token');
    localStorage.removeItem('doubtsnap_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
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
