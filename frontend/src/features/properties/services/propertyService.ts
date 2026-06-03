import { httpClient } from '../../../lib/httpClient';
import type {
  ApiMessageResponse,
  CreatePropertyPayload,
  Property,
} from '../../../types/api-contract';

export const propertyService = {
  async list(): Promise<Property[]> {
    const response = await httpClient.get<Property[]>('/properties');
    return response.data;
  },

  async create(payload: CreatePropertyPayload): Promise<Property> {
    const response = await httpClient.post<ApiMessageResponse<Property>>('/properties', payload);
    return response.data.data;
  },
};
