import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  ArrowLeft,
  Calendar,
  Activity,
  MapPin,
  Weight,
  Bell,
  ChevronDown,
  Menu,
  Heart,
  Syringe,
  FileText,
  AlertCircle,
  Plus,
  Leaf,
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import logoImage from "../assets/logo-frontend.png";
import type { ManagementEvent, ManagementEventType, CreateManagementEventPayload } from "../types/api-contract";
import type { Animal } from "../types/domain";

const EVENT_LABELS: Record<string, string> = {
  VACCINATION: "Vacinação",
  VET_TREATMENT: "Tratamento veterinário",
  WEIGHT_MEASUREMENT: "Pesagem",
  NUTRITIONAL_FEEDING: "Alimentação",
  REPRODUCTION_COVERAGE: "Reprodução",
  SANITARY_DOCUMENT: "Documento sanitário",
  SLAUGHTER_FINALIZATION: "Abate",
};

const EVENT_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  VACCINATION: Syringe,
  VET_TREATMENT: Heart,
  WEIGHT_MEASUREMENT: Weight,
  NUTRITIONAL_FEEDING: Leaf,
  REPRODUCTION_COVERAGE: Activity,
  SANITARY_DOCUMENT: FileText,
  SLAUGHTER_FINALIZATION: AlertCircle,
};

const EVENT_TYPE_OPTIONS: { value: ManagementEventType; label: string }[] = [
  { value: "VACCINATION", label: "Vacinação" },
  { value: "VET_TREATMENT", label: "Tratamento veterinário" },
  { value: "WEIGHT_MEASUREMENT", label: "Pesagem" },
  { value: "NUTRITIONAL_FEEDING", label: "Alimentação" },
  { value: "REPRODUCTION_COVERAGE", label: "Reprodução" },
  { value: "SANITARY_DOCUMENT", label: "Documento sanitário" },
  { value: "SLAUGHTER_FINALIZATION", label: "Abate" },
];

interface AnimalPanelProps {
  animal: Animal;
  historyEvents?: ManagementEvent[];
  producerName?: string;
  onBack: () => void;
  onLogout: () => void;
  viewOnly?: boolean;
  onAddEvent?: (payload: CreateManagementEventPayload) => Promise<void>;
}

export function AnimalPanel({
  animal,
  historyEvents,
  producerName = "—",
  onBack,
  onLogout,
  viewOnly = false,
  onAddEvent,
}: AnimalPanelProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    eventType: "VACCINATION" as ManagementEventType,
    description: "",
    occurredAt: new Date().toISOString().split("T")[0],
    value: "",
  });
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [eventFormError, setEventFormError] = useState("");

  const healthRecords = (historyEvents ?? []).map((event) => ({
    eventType: event.eventType,
    date: new Date(event.occurredAt).toLocaleDateString("pt-BR"),
    type: EVENT_LABELS[event.eventType] ?? event.eventType,
    description: event.description ?? "—",
  }));

  const vaccinationCount = healthRecords.filter((r) => r.eventType === "VACCINATION").length;
  const statusLabel =
    animal.apiStatus === "ACTIVE"
      ? "Saudável"
      : animal.apiStatus === "SOLD"
        ? "Vendido"
        : animal.apiStatus === "SLAUGHTERED"
          ? "Abatido"
          : animal.apiStatus === "DEAD"
            ? "Óbito"
            : animal.status;

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddEvent) return;
    setIsSavingEvent(true);
    setEventFormError("");
    try {
      await onAddEvent({
        eventType: eventForm.eventType,
        description: eventForm.description || undefined,
        occurredAt: new Date(eventForm.occurredAt).toISOString(),
        value: eventForm.value || undefined,
      });
      setShowEventForm(false);
      setEventForm({
        eventType: "VACCINATION",
        description: "",
        occurredAt: new Date().toISOString().split("T")[0],
        value: "",
      });
    } catch (err) {
      setEventFormError(err instanceof Error ? err.message : "Erro ao salvar registro");
    } finally {
      setIsSavingEvent(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="icon" onClick={onBack} className="cursor-pointer">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <img src={logoImage} alt="Sisov Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover" />
              <div className="hidden sm:block">
                <h1 className="font-semibold text-gray-900">{viewOnly ? "Visualização do Animal" : "Painel do Animal"}</h1>
                <p className="text-sm text-gray-500 font-mono">{animal.sisovId?.slice(0, 12) ?? animal.id}</p>
              </div>
              <div className="sm:hidden">
                <h1 className="font-semibold text-gray-900 text-sm font-mono">{animal.tagId ?? animal.sisovId?.slice(0, 8)}</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative cursor-pointer">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{producerName}</div>
                  <div className="text-xs text-gray-500">Produtor</div>
                </div>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout} className="text-gray-600 hover:text-red-600 cursor-pointer">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex md:hidden items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative cursor-pointer">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="cursor-pointer">
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{producerName}</div>
                  <div className="text-xs text-gray-500">Produtor</div>
                </div>
                <Button variant="ghost" size="sm" onClick={onLogout} className="text-gray-600 hover:text-red-600 cursor-pointer">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                    <img src={animal.image} alt={animal.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{animal.name}</h2>
                    <p className="text-sm text-gray-500 font-mono mb-3">{animal.sisovId?.slice(0, 12) ?? animal.id}</p>
                    <Badge className={animal.apiStatus === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                      {statusLabel}
                    </Badge>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-teal-600" />
                        Raça
                      </span>
                      <span className="font-medium text-gray-900">{animal.race}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Weight className="h-4 w-4 mr-2 text-teal-600" />
                        Sexo
                      </span>
                      <span className="font-medium text-gray-900">{animal.sex === "MALE" ? "Macho" : animal.sex === "FEMALE" ? "Fêmea" : "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-teal-600" />
                        Nascimento
                      </span>
                      <span className="font-medium text-gray-900">{animal.birthDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                        Origem
                      </span>
                      <span className="font-medium text-gray-900 text-right">{animal.birthCity ?? animal.location}</span>
                    </div>
                    {animal.tagId && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-teal-600" />
                          Brinco
                        </span>
                        <span className="font-medium text-gray-900 font-mono">{animal.tagId}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Heart className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="font-semibold text-gray-900">{statusLabel}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Syringe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Vacinações</p>
                        <p className="font-semibold text-gray-900">{vaccinationCount} registro(s)</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total de Registros</p>
                        <p className="font-semibold text-gray-900">{healthRecords.length} evento(s)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Animal Info */}
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Informações do Animal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label>Identificação (SISOV)</Label>
                      <Input value={animal.sisovId ?? animal.id} readOnly className="bg-gray-50 font-mono" />
                    </div>
                    <div className="space-y-2">
                      <Label>Brinco (TagId)</Label>
                      <Input value={animal.tagId ?? "—"} readOnly className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Raça</Label>
                      <Input value={animal.race} readOnly className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Sexo</Label>
                      <Input value={animal.sex === "MALE" ? "Macho" : animal.sex === "FEMALE" ? "Fêmea" : "—"} readOnly className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Data de Nascimento</Label>
                      <Input value={animal.birthDate} readOnly className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Cidade de Origem</Label>
                      <Input value={animal.birthCity ?? "—"} readOnly className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Propriedade</Label>
                      <Input value={animal.location} readOnly className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Input value={statusLabel} readOnly className="bg-gray-50" />
                    </div>
                  </div>
                  <div className="flex mt-6 pt-6 border-t border-gray-200">
                    <Button variant="outline" onClick={onBack} className="cursor-pointer">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Health History */}
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Histórico de Saúde e Manejo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthRecords.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">Nenhum evento registrado para este animal.</p>
                    ) : (
                      healthRecords.map((record, index) => {
                        const Icon = EVENT_ICONS[record.eventType] ?? Activity;
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                            className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                <Icon className="h-5 w-5 text-teal-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{record.type}</p>
                                  <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                                  <p className="text-xs text-gray-500 mt-1">{record.date}</p>
                                </div>
                                <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 flex-shrink-0 text-xs">
                                  Registrado
                                </Badge>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>

                  {!viewOnly && onAddEvent && (
                    <div className="mt-6">
                      {!showEventForm ? (
                        <Button variant="outline" className="w-full cursor-pointer" onClick={() => setShowEventForm(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Novo Registro
                        </Button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 text-sm">Novo Registro de Manejo</h4>
                            <Button variant="ghost" size="icon" onClick={() => setShowEventForm(false)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {eventFormError && (
                            <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{eventFormError}</p>
                          )}
                          <form onSubmit={handleAddEvent} className="space-y-3">
                            <div className="space-y-1">
                              <Label htmlFor="eventType">Tipo de Evento</Label>
                              <select
                                id="eventType"
                                value={eventForm.eventType}
                                onChange={(e) => setEventForm((f) => ({ ...f, eventType: e.target.value as ManagementEventType }))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                              >
                                {EVENT_TYPE_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="occurredAt">Data</Label>
                              <Input
                                id="occurredAt"
                                type="date"
                                value={eventForm.occurredAt}
                                onChange={(e) => setEventForm((f) => ({ ...f, occurredAt: e.target.value }))}
                                className="bg-white"
                              />
                            </div>
                            {eventForm.eventType === "WEIGHT_MEASUREMENT" && (
                              <div className="space-y-1">
                                <Label htmlFor="value">Peso (kg)</Label>
                                <Input
                                  id="value"
                                  type="number"
                                  step="0.1"
                                  placeholder="Ex: 42.5"
                                  value={eventForm.value}
                                  onChange={(e) => setEventForm((f) => ({ ...f, value: e.target.value }))}
                                  className="bg-white"
                                />
                              </div>
                            )}
                            <div className="space-y-1">
                              <Label htmlFor="description">Descrição (opcional)</Label>
                              <Textarea
                                id="description"
                                placeholder="Detalhes do evento..."
                                value={eventForm.description}
                                onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))}
                                className="bg-white min-h-[80px]"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button type="submit" disabled={isSavingEvent} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">
                                {isSavingEvent ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                                Salvar
                              </Button>
                              <Button type="button" variant="outline" onClick={() => setShowEventForm(false)} className="cursor-pointer">
                                Cancelar
                              </Button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
