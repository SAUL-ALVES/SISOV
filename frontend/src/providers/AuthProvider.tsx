import type { ReactNode } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';

interface AuthProviderProps {
  children: ReactNode;
}

/** Restaura sessão JWT ao carregar a aplicação */
export function AuthProvider({ children }: AuthProviderProps) {
  useAuth();
  return <>{children}</>;
}
