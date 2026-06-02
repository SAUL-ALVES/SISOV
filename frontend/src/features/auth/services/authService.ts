import { httpClient, setAccessToken } from '../../../lib/httpClient';
import type { LoginCredentials, AuthResponse, User } from '../../../types/domain';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
    setAccessToken(response.data.accessToken);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout', {});
    } finally {
      setAccessToken(null);
    }
  },

  async refreshToken(): Promise<string> {
    const response = await httpClient.post<{ accessToken: string }>('/auth/refresh', {});
    setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  },

  async getCurrentUser(): Promise<User> {
    const response = await httpClient.get<User>('/auth/me');
    return response.data;
  },
};
