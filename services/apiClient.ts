import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      if (typeof window === 'undefined') {
        return config;
      }

      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const requestUrl = String(error.config?.url ?? '');
        const isAuthEndpoint =
          requestUrl.includes('/auth/login') ||
          requestUrl.includes('/auth/register') ||
          requestUrl.includes('/auth/request-otp') ||
          requestUrl.includes('/auth/verify-otp') ||
          requestUrl.includes('/auth/magic-complete');

        if (status === 401 && typeof window !== 'undefined' && !isAuthEndpoint) {
          // For protected endpoints, clear stale auth and return to login.
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          window.location.href = '/login';
        }

        const backendMessage = error.response?.data?.error;
        if (typeof backendMessage === 'string' && backendMessage.trim().length > 0) {
          return Promise.reject(new Error(backendMessage));
        }

        return Promise.reject(error);
      }
    );
  }

  getInstance() {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export const api = apiClient.getInstance();
