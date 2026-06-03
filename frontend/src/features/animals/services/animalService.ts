import { httpClient } from '../../../lib/httpClient';
import type {
  ApiAnimalWithProperty,
  ApiMessageResponse,
  AnimalFullHistory,
  CreateAnimalPayload,
  CreateManagementEventPayload,
} from '../../../types/api-contract';

export const animalService = {
  async list(): Promise<ApiAnimalWithProperty[]> {
    const response = await httpClient.get<ApiAnimalWithProperty[]>('/animals');
    return response.data;
  },

  async getByIdentifier(identifier: string): Promise<ApiAnimalWithProperty> {
    const response = await httpClient.get<ApiAnimalWithProperty>(
      `/animals/${encodeURIComponent(identifier)}`,
    );
    return response.data;
  },

  async create(payload: CreateAnimalPayload): Promise<ApiAnimalWithProperty> {
    const response = await httpClient.post<ApiMessageResponse<ApiAnimalWithProperty>>(
      '/animals',
      payload,
    );
    return response.data.data;
  },

  async getFullHistory(sisovId: string): Promise<AnimalFullHistory> {
    const response = await httpClient.get<AnimalFullHistory>(
      `/animals/${encodeURIComponent(sisovId)}/full-history`,
    );
    return response.data;
  },

  async addManagementEvent(
    sisovId: string,
    payload: CreateManagementEventPayload,
  ): Promise<void> {
    await httpClient.post(`/animals/${encodeURIComponent(sisovId)}/management-events`, payload);
  },

  async registerSlaughter(sisovId: string): Promise<void> {
    await httpClient.post(`/animals/${encodeURIComponent(sisovId)}/slaughter`);
  },
};
