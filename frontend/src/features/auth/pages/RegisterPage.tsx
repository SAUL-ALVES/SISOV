import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { registerSchema } from '../../../utils/validationSchemas';
import { authService } from '../services/authService';
import { formatApiError } from '../../../utils/apiErrors';
import { Eye, EyeOff, ArrowLeft, ShieldAlert } from 'lucide-react';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 120_000;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    if (isLocked) return;

    const result = registerSchema.safeParse(formData);
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
      setIsLoading(true);
      await authService.register({
        name: formData.name,
        document: formData.document,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(true);
    } catch (error) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_DURATION_MS);
        setLockCountdown(Math.ceil(LOCKOUT_DURATION_MS / 1000));
        setApiError(`Muitas tentativas. Tente novamente em ${Math.ceil(LOCKOUT_DURATION_MS / 1000)}s.`);
      } else {
        setApiError(formatApiError(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-12 px-4 relative"
        style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 40%, #134e4a 100%)' }}
      >
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Cadastro realizado!</h2>
            <p className="text-gray-600 mb-6">
              Sua conta foi criada com sucesso. Agora você pode fazer login.
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2"
            >
              Ir para o Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 relative"
      style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 40%, #134e4a 100%)' }}
    >
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        aria-label="Voltar"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Voltar</span>
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">SISOV</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Criar Conta</h2>

          {isLocked && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-300 rounded flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Cadastro temporariamente bloqueado</p>
                <p>Tente novamente em {lockCountdown}s</p>
              </div>
            </div>
          )}

          {apiError && !isLocked && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                disabled={isLoading}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
                CPF ou CNPJ
              </label>
              <Input
                id="document"
                name="document"
                type="text"
                value={formData.document}
                onChange={handleChange}
                placeholder="000.000.000-00"
                disabled={isLoading}
                className={errors.document ? 'border-red-500' : ''}
              />
              {errors.document && <p className="text-red-600 text-sm mt-1">{errors.document}</p>}
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 disabled:opacity-50"
            >
              {isLocked
                ? `Bloqueado (${lockCountdown}s)`
                : isLoading
                  ? 'Cadastrando...'
                  : 'Cadastrar'}
            </Button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Já tem uma conta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
