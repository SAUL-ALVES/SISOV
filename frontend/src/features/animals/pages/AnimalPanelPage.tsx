import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AnimalPanel } from '../../../components/AnimalPanel';
import type { Animal } from '../../../types/domain';
import { useAuth } from '../../auth/hooks/useAuth';

interface LocationState {
  animal?: Animal;
  viewOnly?: boolean;
}

export default function AnimalPanelPage() {
  const { animalId: _ } = useParams<{ animalId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const state = location.state as LocationState | undefined;
  const animal = state?.animal;
  const viewOnly = state?.viewOnly ?? false;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (!animal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Animal não encontrado</p>
          <button
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
      onBack={() => navigate('/app/rebanho')}
      onLogout={handleLogout}
      viewOnly={viewOnly}
    />
  );
}
