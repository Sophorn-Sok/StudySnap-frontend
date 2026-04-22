import { api } from './apiClient';
import { AuthCredentials, AuthResponse, OtpPurpose, OtpRequestResponse, User } from '@/types';

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: AuthCredentials & { username: string }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  async requestOtp(
    email: string,
    purpose: OtpPurpose,
    payload?: { username?: string; password?: string }
  ): Promise<OtpRequestResponse> {
    const response = await api.post<OtpRequestResponse>('/auth/request-otp', {
      email,
      purpose,
      ...payload,
    });
    return response.data;
  },

  async completeMagicLink(payload: {
    accessToken: string;
    purpose: OtpPurpose;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/magic-complete', payload);
    return response.data;
  },

  async verifyRegisterOtp(payload: {
    email: string;
    username: string;
    password: string;
    otp: string;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/verify-otp', {
      ...payload,
      purpose: 'register',
    });

    return response.data;
  },

  async loginWithOtp(payload: { email: string; otp: string }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/verify-otp', {
      ...payload,
      purpose: 'login',
    });

    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post<{ token: string }>('/auth/refresh');
    return response.data;
  },
};
