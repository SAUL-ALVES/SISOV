import { httpClient, setAccessToken } from '../../../lib/httpClient';
import type {
  GoogleLoginResponse,
  LoginResponse,
  Producer,
  RegisterProducerPayload,
} from '../../../types/api-contract';
import type { LoginCredentials } from '../../../types/domain';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>('/auth/login', credentials);
    setAccessToken(response.data.token);
    return response.data;
  },

  async loginWithGoogle(idToken: string): Promise<GoogleLoginResponse> {
    const response = await httpClient.post<GoogleLoginResponse>(
      '/auth/google',
      { idToken },
      {
        validateStatus: (status) => status === 200 || status === 428,
      },
    );

    if ('token' in response.data) {
      setAccessToken(response.data.token);
    }
    return response.data;
  },

  async completeGoogleLogin(
    onboardingToken: string,
    document: string,
  ): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      '/auth/google/complete',
      {
        onboardingToken,
        document: document.replace(/\D/g, ''),
      },
    );
    setAccessToken(response.data.token);
    return response.data;
  },

  async register(payload: RegisterProducerPayload): Promise<Producer> {
    const response = await httpClient.post<{ message: string; data: Producer }>(
      '/auth/register',
      payload,
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    setAccessToken(null);
  },

  async getCurrentUser(): Promise<Producer> {
    const response = await httpClient.get<Producer>('/auth/profile');
    return response.data;
  },
};
