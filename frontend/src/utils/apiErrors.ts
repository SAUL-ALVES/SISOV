import axios from 'axios';
import type { ApiError } from '../types/domain';
import type { HttpError } from '../types/api';

export function formatApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = (error as HttpError).response?.data as ApiError | undefined;

    if (apiError?.message) return apiError.message;

    switch (error.response?.status) {
      case 400:
        return 'Dados inválidos. Verifique o formulário.';
      case 401:
        return 'Credenciais inválidas ou sessão expirada.';
      case 403:
        return 'Você não tem permissão para acessar este recurso.';
      case 404:
        return 'Recurso não encontrado.';
      case 409:
        return 'Conflito: este recurso já existe.';
      case 422:
        return formatValidationErrors(apiError?.errors);
      case 500:
      case 502:
      case 503:
        return 'Erro no servidor. Tente novamente mais tarde.';
      default:
        if (!error.response) return 'Sem conexão com o servidor.';
        return error.message || 'Erro desconhecido.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Erro inesperado.';
}

function formatValidationErrors(errors?: Record<string, string[]>): string {
  if (!errors) return 'Erro de validação.';
  const messages = Object.values(errors).flat();
  return messages.join(' ');
}
