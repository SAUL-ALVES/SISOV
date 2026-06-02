import type { AxiosError } from 'axios';
import type { ApiError } from './domain';

export type HttpError = AxiosError<ApiError>;
