import { useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { authService } from '../services/authService';
import { formatApiError } from '../../../utils/apiErrors';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      setAuth(response.user);
      return response;
    } catch (error) {
      const message = formatApiError(error);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      clearAuth();
    } catch (error) {
      console.error('Logout error:', error);
      clearAuth();
    }
  };

  // Verificar autenticação ao montar
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated || !user) return;

      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        setAuth(currentUser);
      } catch (error) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
