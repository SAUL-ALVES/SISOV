import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { loginSchema } from '../../../utils/validationSchemas';
import { useAuth } from '../hooks/useAuth';
import { formatApiError } from '../../../utils/apiErrors';
import { Eye, EyeOff, ArrowLeft, ShieldAlert } from 'lucide-react';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60_000;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [lockCountdown, setLockCountdown] = useState(0);

  const isLocked = lockedUntil > Date.now();

  useEffect(() => {
    if (!isLocked) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setLockCountdown(remaining);
      if (remaining <= 0) {
        setLockedUntil(0);
        setFailedAttempts(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, lockedUntil]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    if (isLocked) return;

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) fieldErrors[path as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      setFailedAttempts(0);
      navigate('/app/dashboard', { replace: true });
    } catch (error) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_DURATION_MS);
        setLockCountdown(Math.ceil(LOCKOUT_DURATION_MS / 1000));
        setApiError(`Muitas tentativas falhas. Conta bloqueada por ${Math.ceil(LOCKOUT_DURATION_MS / 1000)}s.`);
      } else {
        setApiError(formatApiError(error));
      }
    }
  }, [formData, isLocked, failedAttempts, login, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 40%, #134e4a 100%)' }}>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        aria-label="Voltar"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Voltar</span>
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">SISOV</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Entrar na Plataforma</h2>

            {isLocked && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-300 rounded flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">Acesso temporariamente bloqueado</p>
                  <p>Tente novamente em {lockCountdown}s</p>
                </div>
              </div>
            )}

            {apiError && !isLocked && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {apiError}
                {failedAttempts > 0 && failedAttempts < MAX_ATTEMPTS && (
                  <p className="mt-1 text-xs text-red-400">
                    Tentativa {failedAttempts}/{MAX_ATTEMPTS} — bloqueio após {MAX_ATTEMPTS} falhas
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading || isLocked}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 disabled:opacity-50"
              >
                {isLocked
                  ? `Bloqueado (${lockCountdown}s)`
                  : isLoading
                    ? 'Entrando...'
                    : 'Entrar'}
              </Button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              Não tem uma conta?{' '}
              <button
                onClick={() => navigate('/cadastro')}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Faça seu cadastro
              </button>
            </p>
          </div>
        </div>
      </div>
  );
}
