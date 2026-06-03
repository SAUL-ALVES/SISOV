import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import type { CreatePropertyPayload } from '../../../types/api-contract';

export const propertiesQueryKey = ['properties'] as const;

export function useProperties() {
  return useQuery({
    queryKey: propertiesQueryKey,
    queryFn: () => propertyService.list(),
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropertyPayload) => propertyService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
    },
  });
}
