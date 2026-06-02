import { QRCodeGeneration } from '../../../components/QRCodeGeneration';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';

export default function QRCodeGenerationPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <QRCodeGeneration
      onBack={() => navigate('/app/dashboard')}
      onLogout={handleLogout}
    />
  );
}
