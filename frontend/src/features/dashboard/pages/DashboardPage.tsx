import { Dashboard } from '../../../components/Dashboard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useAuthStore } from '../../../store/authStore';
import { useAnimals, useDashboardStats } from '../../animals/hooks/useAnimals';
import { useProperties } from '../../properties/hooks/useProperties';
import { formatApiError } from '../../../utils/apiErrors';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useAuthStore((s) => s.user);
  const { data: animals, isLoading: animalsLoading, isError, error } = useAnimals();
  const { data: properties, isLoading: propertiesLoading } = useProperties();
  const dashboardStats = useDashboardStats(animals);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <Dashboard
      onLogout={handleLogout}
      onFlockClick={() => navigate('/app/rebanho')}
      onQRCodeClick={() => navigate('/app/qrcode')}
      isLoading={animalsLoading || propertiesLoading}
      errorMessage={isError ? formatApiError(error) : undefined}
      stats={{
        totalAnimals: dashboardStats.total,
        healthyAnimals: dashboardStats.healthy,
        propertiesCount: properties?.length ?? 0,
        producerName: user?.name,
      }}
    />
  );
}
