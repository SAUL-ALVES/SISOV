import { httpClient } from '../../../lib/httpClient';
import type { PublicTraceabilityData } from '../../../types/api-contract';

export const traceabilityService = {
  async getPublic(id: string): Promise<PublicTraceabilityData> {
    const response = await httpClient.get<PublicTraceabilityData>(
      `/animals/public/traceability/${encodeURIComponent(id)}`,
    );
    return response.data;
  },
};
