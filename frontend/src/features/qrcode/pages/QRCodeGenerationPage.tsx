import { QRCodeGeneration } from '../../../components/QRCodeGeneration';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useAuthStore } from '../../../store/authStore';
import { useAnimals } from '../../animals/hooks/useAnimals';

export default function QRCodeGenerationPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useAuthStore((s) => s.user);
  const { data: animals = [], isLoading } = useAnimals();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <QRCodeGeneration
      onBack={() => navigate('/app/dashboard')}
      onLogout={handleLogout}
      animals={animals}
      producerName={user?.name}
      isLoading={isLoading}
    />
  );
}
