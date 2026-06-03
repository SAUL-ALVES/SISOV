import { FlockManagement } from '../../../components/FlockManagement';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useAuthStore } from '../../../store/authStore';
import { useAnimals, useCreateAnimal } from '../hooks/useAnimals';
import { useProperties } from '../../properties/hooks/useProperties';
import { formatApiError } from '../../../utils/apiErrors';
import type { CreateAnimalPayload } from '../../../types/api-contract';

export default function FlockManagementPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useAuthStore((s) => s.user);
  const { data: animals = [], isLoading, isError, error, refetch } = useAnimals();
  const { data: properties = [] } = useProperties();
  const createAnimal = useCreateAnimal();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleCreateAnimal = async (payload: CreateAnimalPayload) => {
    try {
      await createAnimal.mutateAsync(payload);
    } catch (err) {
      throw new Error(formatApiError(err));
    }
  };

  return (
    <FlockManagement
      onBack={() => navigate('/app/dashboard')}
      onLogout={handleLogout}
      onAnimalClick={(animal, viewOnly) =>
        navigate(`/app/rebanho/${animal.sisovId ?? animal.id}`, { state: { animal, viewOnly } })
      }
      animals={animals}
      properties={properties}
      producerName={user?.name}
      isLoading={isLoading}
      errorMessage={isError ? formatApiError(error) : undefined}
      onRefresh={() => void refetch()}
      onCreateAnimal={handleCreateAnimal}
      isSaving={createAnimal.isPending}
    />
  );
}
