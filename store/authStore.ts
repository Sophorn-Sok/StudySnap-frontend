import { create } from 'zustand';
import { User, AuthResponse, OtpPurpose, OtpRequestResponse } from '@/types';
import { authService } from '@/services/auth.api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithOtp: (email: string, otp: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  registerWithOtp: (email: string, password: string, username: string, otp: string) => Promise<void>;
  requestOtp: (email: string, purpose: OtpPurpose) => Promise<OtpRequestResponse>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response: AuthResponse = await authService.login({ email, password });
      set({ user: response.user, token: response.token, isLoading: false });

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  loginWithOtp: async (email: string, otp: string) => {
    set({ isLoading: true, error: null });
    try {
      const response: AuthResponse = await authService.loginWithOtp({ email, otp });
      set({ user: response.user, token: response.token, isLoading: false });

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, username: string) => {
    set({ isLoading: true, error: null });
    try {
      const response: AuthResponse = await authService.register({ email, password, username });
      set({ user: response.user, token: response.token, isLoading: false });

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  registerWithOtp: async (email: string, password: string, username: string, otp: string) => {
    set({ isLoading: true, error: null });
    try {
      const response: AuthResponse = await authService.verifyRegisterOtp({
        email,
        password,
        username,
        otp,
      });

      set({ user: response.user, token: response.token, isLoading: false });
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  requestOtp: async (email: string, purpose: OtpPurpose) => {
    set({ error: null });
    try {
      return await authService.requestOtp(email, purpose);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    set({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
  },

  setUser: (user: User | null) => set({ user }),
  setToken: (token: string | null) => set({ token }),
}));
