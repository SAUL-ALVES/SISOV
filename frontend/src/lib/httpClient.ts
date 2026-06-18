import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { checkRateLimit } from './rateLimiter';

const TOKEN_STORAGE_KEY = 'sisov_access_token';

let accessToken: string | null =
  typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(TOKEN_STORAGE_KEY) : null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof sessionStorage === 'undefined') return;
  if (token) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getAccessToken() {
  return accessToken;
}

const baseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

export const httpClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Rate limiting interceptor
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const url = config.url ?? '';
  const { allowed, retryAfterMs } = checkRateLimit(url);
  if (!allowed) {
    const seconds = Math.ceil(retryAfterMs / 1000);
    return Promise.reject(
      new axios.AxiosError(
        `Muitas tentativas. Aguarde ${seconds}s antes de tentar novamente.`,
        'ERR_RATE_LIMITED',
        config,
      ),
    );
  }
  return config;
});

// Auth token interceptor
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 1000;
const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

function shouldRetry(error: AxiosError): boolean {
  if (!error.response) return true;
  return RETRYABLE_STATUSES.has(error.response.status);
}

function getRetryDelay(attempt: number, error: AxiosError): number {
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers['retry-after'];
    if (retryAfter) return parseInt(retryAfter, 10) * 1000;
  }
  const jitter = Math.random() * 500;
  return RETRY_BASE_DELAY * Math.pow(2, attempt) + jitter;
}

// Retry with exponential backoff + 401 handler
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };
    if (!config) return Promise.reject(error);

    // 401 — session expired
    if (error.response?.status === 401 && !config.url?.includes('/auth/login')) {
      setAccessToken(null);
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Rate limited locally
    if ((error as AxiosError).code === 'ERR_RATE_LIMITED') {
      return Promise.reject(error);
    }

    // Retry logic
    const retryCount = config._retryCount ?? 0;
    if (retryCount >= MAX_RETRIES || !shouldRetry(error)) {
      return Promise.reject(error);
    }

    config._retryCount = retryCount + 1;
    const delay = getRetryDelay(retryCount, error);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return httpClient(config);
  },
);
