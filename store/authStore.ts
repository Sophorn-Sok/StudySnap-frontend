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
      // Demo mode: Check against locally stored users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find(
        (u: any) => u.email === email && u.password === password
      );
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      const mockToken = 'mock-token-' + Date.now();
      const userData: User = {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt || user.createdAt),
      };
      
      set({ user: userData, token: mockToken, isLoading: false });
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, username: string) => {
    set({ isLoading: true, error: null });
    try {
      // Demo mode: Store user locally instead of calling backend
      const newUser: User = {
        id: Date.now().toString(),
        email,
        username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      // Store user registration data in localStorage for demo
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      registeredUsers.push({ ...newUser, password });
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      set({ user: newUser, token: mockToken, isLoading: false });
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
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
