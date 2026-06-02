import { Dashboard } from '../../../components/Dashboard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <Dashboard
      onLogout={handleLogout}
      onFlockClick={() => navigate('/app/rebanho')}
      onQRCodeClick={() => navigate('/app/qrcode')}
    />
  );
}
