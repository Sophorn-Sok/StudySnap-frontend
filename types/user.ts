export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export type OtpPurpose = 'register' | 'login';

export interface OtpRequestResponse {
  message: string;
  delivery: 'email';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
