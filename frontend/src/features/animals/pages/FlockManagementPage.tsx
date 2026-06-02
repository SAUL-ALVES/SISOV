import { FlockManagement } from '../../../components/FlockManagement';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';

export default function FlockManagementPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <FlockManagement
      onBack={() => navigate('/app/dashboard')}
      onLogout={handleLogout}
      onAnimalClick={(animal, viewOnly) => navigate(`/app/rebanho/${animal.id}`, { state: { animal, viewOnly } })}
    />
  );
}
