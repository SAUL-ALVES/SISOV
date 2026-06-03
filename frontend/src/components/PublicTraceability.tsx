import type { PublicTraceabilityData, PublicTraceabilityEvent } from "../types/api-contract";

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function DocSection({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <div className="bg-teal-700 px-5 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">
          {number}. {title}
        </h2>
      </div>
      <div className="divide-y divide-gray-100 bg-white">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex text-sm">
      <div className="w-2/5 shrink-0 bg-gray-50 px-4 py-3 font-semibold text-gray-700 border-r border-gray-100">
        {label}
      </div>
      <div className="flex-1 px-4 py-3 text-gray-800 break-all">{value || "—"}</div>
    </div>
  );
}

function SubHeader({ title }: { title: string }) {
  return (
    <div className="bg-teal-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-teal-700 border-b border-teal-100">
      {title}
    </div>
  );
}

function EventRows({ events }: { events: PublicTraceabilityEvent[] }) {
  if (!events.length) {
    return <div className="px-4 py-3 text-sm italic text-gray-400">Nenhum registro.</div>;
  }
  return (
    <>
      {events.map((event, i) => (
        <Row
          key={i}
          label={formatDate(event.occurredAt)}
          value={
            [event.description, event.value ? `Valor: ${event.value}` : null]
              .filter(Boolean)
              .join(" • ") || "Registrado"
          }
        />
      ))}
    </>
  );
}

interface PublicTraceabilityProps {
  data: PublicTraceabilityData;
}

export default function PublicTraceability({ data }: PublicTraceabilityProps) {
  const property = data.property;
  const producerName = property?.producer?.name ?? null;
  const events = data.managementEvents ?? [];

  const vaccinationEvents = events.filter((e) => e.eventType === "VACCINATION");
  const vetEvents = events.filter((e) => e.eventType === "VET_TREATMENT");
  const feedingEvents = events.filter((e) => e.eventType === "NUTRITIONAL_FEEDING");
  const reproductionEvents = events.filter((e) => e.eventType === "REPRODUCTION_COVERAGE");
  const slaughterEvents = events.filter((e) => e.eventType === "SLAUGHTER_FINALIZATION");
  const sanitaryEvents = events.filter((e) => e.eventType === "SANITARY_DOCUMENT");

  const STATUS_LABELS: Record<string, string> = {
    ACTIVE: "Ativo na propriedade",
    SOLD: "Vendido",
    SLAUGHTERED: "Abatido",
    DEAD: "Óbito",
  };

  const animalStatus = data.status ? (STATUS_LABELS[data.status] ?? data.status) : null;
  const locationLine = property?.city
    ? `${property.city}${property.state ? `, ${property.state}` : ""}`
    : null;

  const generatedAt = new Date().toLocaleString("pt-BR");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-teal-700 text-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-teal-200">
            Rastreabilidade Pública — SISOV
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Documento de Rastreamento
          </h1>
          <p className="mt-1 text-sm text-teal-200">
            {data.tagId ? `Animal ${data.tagId}` : `ID ${data.sisovId?.slice(0, 8) ?? "—"}`}
            {locationLine ? ` • ${locationLine}` : ""}
          </p>
          {data.hasIG && (
            <span className="mt-3 inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">
              Indicação Geográfica
            </span>
          )}
        </div>
      </div>

      {/* Document */}
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">

        {/* 1. Informações do Produtor */}
        <DocSection number={1} title="Informações do Produtor">
          <Row label="Nome do Produtor" value={producerName} />
          <Row label="Endereço" value={locationLine} />
          <Row label="Contato" value={null} />
        </DocSection>

        {/* 2. Identificação da Propriedade */}
        <DocSection number={2} title="Identificação da Propriedade">
          <Row label="Nome da Propriedade" value={property?.farmName} />
        </DocSection>

        {/* 3. Dados do Rebanho */}
        <DocSection number={3} title="Dados do Rebanho">
          <Row label="Identificação Individual" value={data.tagId ?? "Sem brinco"} />
          <Row
            label="Sexo"
            value={data.sex === "MALE" ? "Macho" : data.sex === "FEMALE" ? "Fêmea" : null}
          />
          <Row label="Raça" value={data.breed} />
          <Row label="Data de Nascimento" value={formatDate(data.birthDate)} />
          <Row label="Código de Rastreamento SISOV" value={data.sisovId} />
          <Row label="Procedência" value={data.birthCity} />
        </DocSection>

        {/* 4. Histórico de Saúde e Manejo */}
        <DocSection number={4} title="Histórico de Saúde e Manejo">
          <SubHeader title="Vacinações" />
          <EventRows events={vaccinationEvents} />
          <SubHeader title="Tratamentos Veterinários" />
          <EventRows events={vetEvents} />
          <Row label="Histórico de Doenças" value={null} />
          <Row label="Exames Laboratoriais" value={null} />
        </DocSection>

        {/* 5. Alimentação e Suplementação */}
        <DocSection number={5} title="Alimentação e Suplementação">
          {feedingEvents.length > 0 ? (
            <EventRows events={feedingEvents} />
          ) : (
            <>
              <Row label="Tipo de Alimentação" value={null} />
              <Row label="Fornecedor" value={null} />
              <Row label="Registro de Suplementos" value={null} />
            </>
          )}
        </DocSection>

        {/* 6. Movimentação dos Animais */}
        <DocSection number={6} title="Movimentação dos Animais">
          <Row label="Entradas e Saídas" value={animalStatus} />
          <Row
            label="Data de Movimentação"
            value={
              slaughterEvents[0]?.occurredAt
                ? formatDate(slaughterEvents[0].occurredAt)
                : null
            }
          />
          <Row
            label="Origem e Destino"
            value={data.birthCity ? `Origem: ${data.birthCity}` : null}
          />
          <Row
            label="Transporte"
            value={
              Array.isArray(data.movements) && data.movements.length > 0
                ? `${data.movements.length} movimentação(ões) registrada(s)`
                : null
            }
          />
        </DocSection>

        {/* 7. Reprodução */}
        <DocSection number={7} title="Reprodução">
          {reproductionEvents.length > 0 ? (
            <EventRows events={reproductionEvents} />
          ) : (
            <>
              <Row label="Inseminação / Acasalamento" value={null} />
              <Row label="Dados da Gestação" value={null} />
              <Row label="Registro de Partos" value={null} />
            </>
          )}
        </DocSection>

        {/* 8. Rastreamento e Certificação */}
        <DocSection number={8} title="Rastreamento e Certificação">
          <Row label="Código SISOV" value={data.sisovId} />
          <Row
            label="Certificação de IG"
            value={data.hasIG ? "Certificado — Indicação Geográfica" : "Não certificado"}
          />
          <SubHeader title="Auditorias e Inspeções" />
          <EventRows events={sanitaryEvents} />
        </DocSection>

        {/* 9. Produção de Carne */}
        <DocSection number={9} title="Produção de Carne">
          <Row
            label="Registro do Abate"
            value={slaughterEvents[0] ? formatDate(slaughterEvents[0].occurredAt) : null}
          />
          <Row label="Destino da Carne" value={slaughterEvents[0]?.description ?? null} />
          <Row label="Controle de Qualidade" value={slaughterEvents[0]?.value ?? null} />
        </DocSection>

        {/* 10. Documentação Legal e Compliance */}
        <DocSection number={10} title="Documentação Legal e Compliance">
          {sanitaryEvents.length > 0 ? (
            <EventRows events={sanitaryEvents} />
          ) : (
            <>
              <Row label="Certificados de Sanidade" value={null} />
              <Row label="Licenças e Permissões" value={null} />
              <Row label="Relatórios de Conformidade" value={null} />
            </>
          )}
        </DocSection>

        {/* 11. Informações Adicionais */}
        <DocSection number={11} title="Informações Adicionais">
          <Row label="Observações Gerais" value={data.seal ?? null} />
          <Row label="Medidas Preventivas" value={null} />
          <Row
            label="Outras Informações"
            value={data.origin ? `Origem regional: ${data.origin}` : null}
          />
        </DocSection>

        {/* Footer */}
        <div className="pb-8 pt-4 text-center text-xs text-gray-400">
          Este documento foi gerado automaticamente pelo sistema SISOV em {generatedAt}.
        </div>
      </div>
    </div>
  );
}
