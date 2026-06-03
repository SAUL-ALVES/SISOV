import { useParams, useNavigate } from 'react-router-dom';
import { AnimalPanel } from '../../../components/AnimalPanel';
import { useAuth } from '../../auth/hooks/useAuth';
import { useAuthStore } from '../../../store/authStore';
import { useAnimal, useAnimalHistory, useAddManagementEvent } from '../hooks/useAnimals';
import { formatApiError } from '../../../utils/apiErrors';
import type { CreateManagementEventPayload } from '../../../types/api-contract';

export default function AnimalPanelPage() {
  const { animalId } = useParams<{ animalId: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useAuthStore((s) => s.user);
  const { data: animal, isLoading, isError, error } = useAnimal(animalId);
  const { data: history } = useAnimalHistory(animalId);
  const addManagementEvent = useAddManagementEvent();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleAddEvent = async (payload: CreateManagementEventPayload) => {
    if (!animal?.sisovId) throw new Error('ID do animal não encontrado');
    await addManagementEvent.mutateAsync({ sisovId: animal.sisovId, payload });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (isError || !animal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-600 mb-4">
            {isError ? formatApiError(error) : 'Animal não encontrado'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/app/rebanho')}
            className="text-teal-600 hover:text-teal-700"
          >
            Voltar para rebanho
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimalPanel
      animal={animal}
      historyEvents={history?.events}
      producerName={user?.name}
      onBack={() => navigate('/app/rebanho')}
      onLogout={handleLogout}
      viewOnly={false}
      onAddEvent={handleAddEvent}
    />
  );
}
