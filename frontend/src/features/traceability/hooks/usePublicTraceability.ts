import { useQuery } from '@tanstack/react-query';
import { traceabilityService } from '../services/traceabilityService';

export function usePublicTraceability(id: string | undefined) {
  return useQuery({
    queryKey: ['traceability', 'public', id],
    enabled: Boolean(id),
    queryFn: () => traceabilityService.getPublic(id!),
    retry: 1,
  });
}
