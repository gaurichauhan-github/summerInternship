import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService.js';
import { getStoredUser, removeStoredUser, setStoredUser } from '../utils/storage.js';
import { getStoredToken, removeStoredToken, setStoredToken } from '../utils/tokenStorage.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getStoredToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      if (user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getProfile();
        const profile = response.user;
        setStoredUser(profile);
        setUser(profile);
      } catch {
        removeStoredToken();
        removeStoredUser();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    toast.success(data.message || 'OTP sent to email for verification');
    return data;
  }, []);

  const verifyRegisterOtp = useCallback(async (payload) => {
    const data = await authService.verifyRegisterOtp(payload);

    if (data.token) {
      setStoredToken(data.token);
      setStoredUser(data.user);
      setUser(data.user);
    }

    toast.success(data.message || 'Verification successful');
    return data;
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    toast.success(data.message || 'OTP sent to email for login');
    return data;
  }, []);

  const verifyLoginOtp = useCallback(async (payload) => {
    const data = await authService.verifyLoginOtp(payload);

    if (data.token) {
      setStoredToken(data.token);
      setStoredUser(data.user);
      setUser(data.user);
    }

    toast.success(data.message || 'Login successful');
    return data;
  }, []);

  const logout = useCallback(() => {
    removeStoredToken();
    removeStoredUser();
    setUser(null);
    toast.success('Logged out');
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      register,
      verifyRegisterOtp,
      verifyLoginOtp,
      user,
    }),
    [isLoading, login, logout, register, verifyRegisterOtp, verifyLoginOtp, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
