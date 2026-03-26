import { create } from 'zustand';
import { User, AuthResponse } from '@/types';
import { authService } from '@/services/auth.api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
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
      const response = await authService.login({ email, password });
      set({ user: response.user, token: response.token, isLoading: false });
      localStorage.setItem('authToken', response.token);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, username: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register({ email, password, username });
      set({ user: response.user, token: response.token, isLoading: false });
      localStorage.setItem('authToken', response.token);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
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
    localStorage.removeItem('authToken');
  },

  setUser: (user: User | null) => set({ user }),
  setToken: (token: string | null) => set({ token }),
}));
