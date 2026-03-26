import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { authService } from '@/services/auth.api';

export const useAuth = () => {
  const { user, token, isLoading, error, setUser, setToken, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        logout();
      }
    };

    if (!user && !token) {
      initAuth();
    }
  }, [user, token, setUser, setToken, logout]);

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!token && !!user,
    logout,
  };
};
