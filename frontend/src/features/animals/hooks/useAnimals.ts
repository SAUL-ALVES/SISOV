import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { animalService } from '../services/animalService';
import { mapApiAnimalToUi } from '../../../utils/animalMappers';
import type { CreateAnimalPayload, CreateManagementEventPayload } from '../../../types/api-contract';
import type { Animal } from '../../../types/domain';

export const animalsQueryKey = ['animals'] as const;

export function useAnimals() {
  return useQuery({
    queryKey: animalsQueryKey,
    queryFn: async () => {
      const data = await animalService.list();
      return data.map(mapApiAnimalToUi);
    },
  });
}

export function useAnimal(identifier: string | undefined) {
  return useQuery({
    queryKey: ['animals', identifier],
    enabled: Boolean(identifier),
    queryFn: async () => {
      const data = await animalService.getByIdentifier(identifier!);
      return mapApiAnimalToUi(data);
    },
  });
}

export function useAnimalHistory(sisovId: string | undefined) {
  return useQuery({
    queryKey: ['animals', sisovId, 'history'],
    enabled: Boolean(sisovId),
    queryFn: () => animalService.getFullHistory(sisovId!),
  });
}

export function useCreateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAnimalPayload) => animalService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: animalsQueryKey });
    },
  });
}

export function useAddManagementEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sisovId, payload }: { sisovId: string; payload: CreateManagementEventPayload }) =>
      animalService.addManagementEvent(sisovId, payload),
    onSuccess: (_, { sisovId }) => {
      void queryClient.invalidateQueries({ queryKey: ['animals', sisovId, 'history'] });
    },
  });
}

export function useSearchAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (identifier: string) => animalService.getByIdentifier(identifier),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: animalsQueryKey });
    },
  });
}

export function useDashboardStats(animals: Animal[] | undefined) {
  const list = animals ?? [];
  const healthy = list.filter((a) => a.apiStatus === 'ACTIVE' || a.status === 'Saudável').length;
  const attention = list.filter(
    (a) => a.apiStatus === 'SOLD' || a.apiStatus === 'DEAD' || a.status === 'Quarentena',
  ).length;
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = list.filter((a) => new Date(a.createdAt).getTime() >= thirtyDaysAgo).length;

  return {
    total: list.length,
    healthy,
    attention,
    recent,
  };
}
