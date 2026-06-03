import { type ComponentType, type SVGProps } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { MapPin, ShieldCheck, HeartPulse, Leaf, Sparkles, Clock3, Droplet } from "lucide-react";
import type { PublicTraceabilityData } from "../types/api-contract";
import { DEFAULT_IMAGE } from "../utils/animalMappers";

interface TraceEvent {
  title: string;
  date: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

interface AssuranceItem {
  title: string;
  subtitle: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const EVENT_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  VACCINATION: ShieldCheck,
  VET_TREATMENT: HeartPulse,
  WEIGHT_MEASUREMENT: Sparkles,
  NUTRITIONAL_FEEDING: Leaf,
  REPRODUCTION_COVERAGE: Leaf,
  SANITARY_DOCUMENT: ShieldCheck,
  SLAUGHTER_FINALIZATION: HeartPulse,
};

const EVENT_LABELS: Record<string, string> = {
  VACCINATION: "Vacinação",
  VET_TREATMENT: "Tratamento veterinário",
  WEIGHT_MEASUREMENT: "Pesagem",
  NUTRITIONAL_FEEDING: "Alimentação",
  REPRODUCTION_COVERAGE: "Reprodução",
  SANITARY_DOCUMENT: "Documento sanitário",
  SLAUGHTER_FINALIZATION: "Abate",
};

function buildViewModel(data: PublicTraceabilityData) {
  const animal = data.animal;
  const property = data.property ?? animal?.property;
  const producerName =
    (typeof data.producer === "object" && data.producer?.name) ||
    (typeof data.producer === "string" ? data.producer : "Produtor certificado");

  const events: TraceEvent[] = (data.events ?? []).map((event) => ({
    title: EVENT_LABELS[event.eventType ?? ""] ?? event.eventType ?? "Evento",
    date: event.occurredAt
      ? new Date(event.occurredAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "—",
    description: event.description ?? "Registro de manejo no SISOV.",
    icon: EVENT_ICONS[event.eventType ?? ""] ?? MapPin,
  }));

  if (!events.length && animal?.birthDate) {
    events.push({
      title: "Nascimento registrado",
      date: new Date(animal.birthDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      description: `Origem em ${animal.birthCity}. Raça ${animal.breed}.`,
      icon: MapPin,
    });
  }

  const assurances: AssuranceItem[] = [
    {
      title: "Criação regional",
      subtitle: property?.city
        ? `Produção em ${property.city}${property.state ? `, ${property.state}` : ""}.`
        : "Origem certificada na região dos Inhamuns.",
      icon: Leaf,
    },
    {
      title: "Bem-estar animal",
      subtitle: "Histórico sanitário registrado no SISOV.",
      icon: HeartPulse,
    },
    {
      title: "Rastreabilidade",
      subtitle: animal?.tagId
        ? `Identificação ${animal.tagId}`
        : `ID SISOV ${animal?.sisovId?.slice(0, 8) ?? "—"}`,
      icon: ShieldCheck,
    },
  ];

  return {
    heroImage: DEFAULT_IMAGE,
    batchName: animal?.tagId ? `Animal ${animal.tagId}` : "Rastreabilidade SISOV",
    producer: producerName,
    property: property?.farmName
      ? `${property.farmName}${property.city ? `, ${property.city}` : ""}`
      : "Propriedade registrada",
    origin: data.origin ?? animal?.birthCity ?? "Região dos Inhamuns",
    seal:
      data.seal ??
      (data.hasIG
        ? "Indicação Geográfica — Manta de Carneiro de Tauá"
        : "Rastreabilidade SISOV"),
    events,
    assurances,
  };
}

interface PublicTraceabilityProps {
  data: PublicTraceabilityData;
}

export default function PublicTraceability({ data }: PublicTraceabilityProps) {
  const traceabilityData = buildViewModel(data);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden bg-slate-900">
        <img
          src={traceabilityData.heroImage}
          alt="Fazenda nos Inhamuns"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-6">
              <Badge className="bg-amber-400 text-slate-950">Indicação Geográfica</Badge>
              <div className="max-w-2xl space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-100">Rastreabilidade Pública</p>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {traceabilityData.batchName}
                </h1>
                <p className="text-base leading-8 text-slate-200 sm:text-lg">
                  Conheça o caminho completo da Manta de Carneiro de Tauá: origem, cuidado, certificação e sabor
                  autêntico.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm text-slate-300">Produtor</p>
                  <p className="mt-2 text-lg font-semibold text-white">{traceabilityData.producer}</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm text-slate-300">Propriedade</p>
                  <p className="mt-2 text-lg font-semibold text-white">{traceabilityData.property}</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm text-slate-300">Origem</p>
                  <p className="mt-2 text-lg font-semibold text-white">{traceabilityData.origin}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">Selo</p>
                <h2 className="text-2xl font-semibold text-white">{traceabilityData.seal}</h2>
                <p className="text-slate-300">
                  A marca oficial que garante procedência, qualidade e tradição da Manta de Carneiro de Tauá.
                </p>
                <Button className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400">
                  Ver certificação completa
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_0.7fr] lg:items-start">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Linha do tempo</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Rastreabilidade passo a passo</h2>
                </div>
                <Clock3 className="h-10 w-10 text-emerald-400" />
              </div>
              <div className="mt-8 space-y-6">
                {traceabilityData.events.length === 0 ? (
                  <p className="text-slate-400">Nenhum evento registrado ainda para este animal.</p>
                ) : (
                  traceabilityData.events.map((event, index) => {
                    const Icon = event.icon;
                    return (
                      <div key={`${event.title}-${index}`} className="relative pl-14 sm:pl-16">
                        <div className="absolute left-0 top-2 flex h-full w-12 flex-col items-center">
                          <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                          {index < traceabilityData.events.length - 1 && (
                            <span className="mt-2 h-full w-px bg-slate-700" />
                          )}
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-5 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                              <p className="text-sm text-slate-400">{event.date}</p>
                            </div>
                          </div>
                          <p className="mt-4 text-slate-300">{event.description}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/10">
              <CardHeader>
                <CardTitle className="text-xl text-white">Garantia de qualidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {traceabilityData.assurances.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 rounded-3xl border border-white/10 bg-slate-950/90 p-4"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-emerald-300">
                    <Droplet className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Selo de Procedência</p>
                    <h3 className="text-xl font-semibold text-white">Autenticidade garantida</h3>
                  </div>
                </div>
                <p className="text-slate-400">
                  O selo atesta que este alimento foi produzido de acordo com as normas da Indicação Geográfica da Manta
                  de Carneiro de Tauá e combina tradição com alta qualidade.
                </p>
                <Button className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400">
                  Ver detalhes da certificação
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="border-slate-700" />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Conte uma história</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Conte ao consumidor final a jornada completa do seu produto
              </h2>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                A cada scan, o cliente acessa informações reais sobre o produtor, a metodologia, o selo IG e os
                cuidados que tornam a Manta de Carneiro de Tauá única.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-emerald-500/10 p-5">
                <p className="text-sm text-emerald-300">Transparência</p>
                <p className="mt-2 text-white">Origem, criação e certificação em um único QR Code.</p>
              </div>
              <div className="rounded-3xl bg-slate-800/80 p-5">
                <p className="text-sm text-slate-400">Tradição</p>
                <p className="mt-2 text-white">História da região dos Inhamuns contada com respeito ao bioma local.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
