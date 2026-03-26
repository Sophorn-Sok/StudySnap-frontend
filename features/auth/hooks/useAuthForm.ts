import { useAuthStore } from '@/store';

export const useAuthForm = () => {
  const { login, register } = useAuthStore();

  return {
    login,
    register,
  };
};
