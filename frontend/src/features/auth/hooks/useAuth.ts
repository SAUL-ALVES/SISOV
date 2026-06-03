import { useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { getAccessToken } from '../../../lib/httpClient';
import { authService } from '../services/authService';
import { formatApiError } from '../../../utils/apiErrors';
import { mapProducerToUser } from '../../../utils/userMappers';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      setAuth(mapProducerToUser(response.producer));
      return response;
    } catch (error) {
      throw new Error(formatApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearAuth();
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      if (isAuthenticated && user) return;
      if (!getAccessToken()) return;

      try {
        setLoading(true);
        const producer = await authService.getCurrentUser();
        setAuth(mapProducerToUser(producer));
      } catch {
        await authService.logout();
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    void restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restaura sessão uma vez na montagem
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
