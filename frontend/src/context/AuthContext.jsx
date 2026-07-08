import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('eventora_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('eventora_token'));
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      const { user: userData, token: authToken } = data.data;
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('eventora_user', JSON.stringify(userData));
      localStorage.setItem('eventora_token', authToken);
      return { success: true, user: userData };
    } catch (error) {
      let message = 'Login failed';
      if (!error.response) {
        message = 'Network error: Cannot reach the server. Please check your connection or CORS settings.';
      } else {
        message = error.response.data?.message || `Login failed with status ${error.response.status}`;
      }
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register({ name, email, password, confirmPassword });
      const { user: userData, token: authToken } = data.data;
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('eventora_user', JSON.stringify(userData));
      localStorage.setItem('eventora_token', authToken);
      return { success: true, user: userData };
    } catch (error) {
      let message = 'Registration failed';
      let errors = null;
      if (!error.response) {
        message = 'Network error: Cannot reach the server. Please check your connection or CORS settings.';
      } else {
        message = error.response.data?.message || `Registration failed with status ${error.response.status}`;
        errors = error.response.data?.errors;
      }
      return { success: false, message, errors };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('eventora_user');
    localStorage.removeItem('eventora_token');
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
