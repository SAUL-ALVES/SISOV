import { useParams } from 'react-router-dom';
import PublicTraceability from '../../../components/PublicTraceability';
import { usePublicTraceability } from '../hooks/usePublicTraceability';
import { formatApiError } from '../../../utils/apiErrors';

export default function PublicTraceabilityPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = usePublicTraceability(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold mb-2">Rastreabilidade indisponível</h1>
          <p className="text-slate-400">{formatApiError(error)}</p>
        </div>
      </div>
    );
  }

  return <PublicTraceability data={data} />;
}
