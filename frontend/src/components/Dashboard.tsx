import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Users,
  Heart,
  Calendar,
  FileText,
  LogOut,
  Plus,
  Search,
  BarChart3,
  Download,
  Bell,
  ChevronDown,
  Menu,
  Loader2,
} from "lucide-react";
import { useRef, useState, useMemo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "motion/react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import logoImage from "../assets/logo-frontend.png";
import type { Animal } from "../types/domain";

interface DashboardStats {
  totalAnimals: number;
  healthyAnimals: number;
  propertiesCount: number;
  producerName?: string;
}

interface DashboardProps {
  onLogout: () => void;
  onFlockClick: () => void;
  onQRCodeClick: () => void;
  stats?: DashboardStats;
  animals?: Animal[];
  isLoading?: boolean;
  errorMessage?: string;
  onAddWeightRecord?: (sisovId: string, weight: string, date: string) => Promise<void>;
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Ativo",
  SOLD: "Vendido",
  SLAUGHTERED: "Abatido",
  DEAD: "Morto",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  SOLD: "bg-blue-100 text-blue-700",
  SLAUGHTERED: "bg-gray-100 text-gray-700",
  DEAD: "bg-red-100 text-red-700",
};

export function Dashboard({
  onLogout,
  onFlockClick,
  onQRCodeClick,
  stats,
  animals = [],
  isLoading = false,
  errorMessage,
  onAddWeightRecord,
}: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [weightForm, setWeightForm] = useState({ sisovId: "", weight: "", date: "" });
  const [isSavingWeight, setIsSavingWeight] = useState(false);
  const [weightFormError, setWeightFormError] = useState("");
  const [weightFormSuccess, setWeightFormSuccess] = useState(false);

  const total = stats?.totalAnimals ?? 0;
  const healthy = stats?.healthyAnimals ?? 0;
  const healthPct = total > 0 ? `${Math.round((healthy / total) * 100)}%` : "—";
  const producerName = stats?.producerName ?? "—";
  const producerFirstName = stats?.producerName?.split(" ")[0] ?? "Produtor";

  const statCards = [
    { title: "Total de Ovinos", value: isLoading ? "…" : String(total), icon: Users, color: "text-teal-600", bgColor: "bg-teal-100", tooltip: undefined },
    {
      title: "Saúde Geral",
      value: isLoading ? "…" : healthPct,
      icon: Heart,
      color: "text-green-600",
      bgColor: "bg-green-100",
      tooltip: `Percentual de animais com status Ativo em relação ao total do rebanho. ${healthy} de ${total} animais estão ativos. Quanto mais próximo de 100%, melhor a saúde geral.`,
    },
    { title: "Propriedades", value: isLoading ? "…" : String(stats?.propertiesCount ?? 0), icon: Calendar, color: "text-blue-600", bgColor: "bg-blue-100", tooltip: undefined },
    { title: "Produtor", value: isLoading ? "…" : producerFirstName, icon: FileText, color: "text-purple-600", bgColor: "bg-purple-100", tooltip: undefined },
  ];

  const debouncedSearch = useDebouncedValue(searchTerm, 250);

  const filteredAnimals = useMemo(() => {
    if (!debouncedSearch) return animals;
    const term = debouncedSearch.toLowerCase();
    return animals.filter(
      (a) =>
        a.name?.toLowerCase().includes(term) ||
        a.tagId?.toLowerCase().includes(term) ||
        a.sisovId?.toLowerCase().includes(term),
    );
  }, [animals, debouncedSearch]);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const ROW_HEIGHT = 48;
  const virtualizer = useVirtualizer({
    count: filteredAnimals.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: useCallback(() => ROW_HEIGHT, []),
    overscan: 20,
  });

  const handleAddWeightRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddWeightRecord || !weightForm.sisovId || !weightForm.weight || !weightForm.date) return;
    setIsSavingWeight(true);
    setWeightFormError("");
    setWeightFormSuccess(false);
    try {
      await onAddWeightRecord(weightForm.sisovId, weightForm.weight, weightForm.date);
      setWeightFormSuccess(true);
      setWeightForm({ sisovId: "", weight: "", date: "" });
    } catch (err) {
      setWeightFormError(err instanceof Error ? err.message : "Erro ao registrar pesagem");
    } finally {
      setIsSavingWeight(false);
    }
  };

  const quickActions = [
    { title: "Gerenciamento do Rebanho", icon: Users, color: "bg-blue-600" },
    { title: "Gerar QR Code", icon: FileText, color: "bg-purple-600" },
  ];

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
              <img src={logoImage} alt="Sisov Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover" />
              <div className="hidden sm:block">
                <h1 className="font-semibold text-gray-900">SISOV Dashboard</h1>
                <p className="text-sm text-gray-500">Sistema de Rastreabilidade</p>
              </div>
              <div className="sm:hidden">
                <h1 className="font-semibold text-gray-900 text-sm">SISOV</h1>
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
                <LogOut className="h-5 w-5" />
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
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta, {producerFirstName}!
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">Aqui está um resumo da sua produção e rebanho.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {errorMessage && (
            <div className="col-span-2 lg:col-span-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errorMessage}
            </div>
          )}
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="relative group"
            >
              {stat.tooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-50 w-64 pointer-events-none">
                  <div className="relative bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800 shadow-md leading-relaxed">
                    {stat.tooltip}
                    <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-green-50 border-r border-b border-green-200 rotate-45" />
                  </div>
                </div>
              )}
              <Card className="hover:shadow-lg transition-shadow cursor-default">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3">
                    <div className="w-full">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className={`w-full h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 ${action.color} text-white hover:opacity-90 border-0 cursor-pointer`}
                  onClick={action.title === "Gerenciamento do Rebanho" ? onFlockClick : onQRCodeClick}
                >
                  <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs sm:text-sm text-center leading-tight">{action.title}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weight Record + Reports */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
                  <span>Registrar Pesagem</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddWeightRecord} className="space-y-4">
                  {weightFormError && (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{weightFormError}</p>
                  )}
                  {weightFormSuccess && (
                    <p className="text-sm text-green-700 bg-green-50 p-3 rounded">Pesagem registrada com sucesso!</p>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="sisovId">ID SISOV ou Brinco do Animal</Label>
                    <Input
                      id="sisovId"
                      placeholder="Ex: abc12345 ou TAG-001"
                      value={weightForm.sisovId}
                      onChange={(e) => setWeightForm((f) => ({ ...f, sisovId: e.target.value }))}
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 42.5"
                      value={weightForm.weight}
                      onChange={(e) => setWeightForm((f) => ({ ...f, weight: e.target.value }))}
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Data da Pesagem</Label>
                    <Input
                      id="date"
                      type="date"
                      value={weightForm.date}
                      onChange={(e) => setWeightForm((f) => ({ ...f, date: e.target.value }))}
                      className="bg-gray-50"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSavingWeight || !onAddWeightRecord}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                  >
                    {isSavingWeight ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Registrar Pesagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
                  <span>Relatórios</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between cursor-pointer">
                  <span className="text-sm sm:text-base">Relatório de Rebanho</span>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between cursor-pointer">
                  <span className="text-sm sm:text-base">Histórico de Vacinação</span>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between cursor-pointer">
                  <span className="text-sm sm:text-base">Relatório de Pesagens</span>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between cursor-pointer">
                  <span className="text-sm sm:text-base">QR Codes Gerados</span>
                  <Download className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Animals Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-base sm:text-lg">Rebanho</CardTitle>
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, brinco, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64 bg-gray-50"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="min-w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">ID SISOV</th>
                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">Brinco</th>
                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">Raça</th>
                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">Nascimento</th>
                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                  </table>
                  {filteredAnimals.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-sm">
                      {searchTerm ? "Nenhum animal encontrado." : "Nenhum animal cadastrado ainda."}
                    </div>
                  ) : (
                    <div
                      ref={tableContainerRef}
                      className="max-h-[480px] overflow-auto"
                    >
                      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
                        <table className="min-w-full">
                          <tbody>
                            {virtualizer.getVirtualItems().map((virtualRow) => {
                              const animal = filteredAnimals[virtualRow.index];
                              return (
                                <tr
                                  key={animal.id}
                                  className="border-b border-gray-100 hover:bg-gray-50"
                                  style={{
                                    height: `${ROW_HEIGHT}px`,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualRow.start}px)`,
                                    display: 'table-row',
                                  }}
                                >
                                  <td className="py-3 px-4 text-xs sm:text-sm text-gray-900 font-mono whitespace-nowrap">
                                    {animal.sisovId?.slice(0, 8) ?? "—"}
                                  </td>
                                  <td className="py-3 px-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                                    {animal.tagId ?? "—"}
                                  </td>
                                  <td className="py-3 px-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{animal.race}</td>
                                  <td className="py-3 px-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{animal.birthDate}</td>
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <Badge className={`text-xs ${STATUS_COLORS[animal.apiStatus ?? ""] ?? "bg-gray-100 text-gray-700"}`}>
                                      {STATUS_LABELS[animal.apiStatus ?? ""] ?? animal.status}
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  {isLoading ? "…" : `${filteredAnimals.length} de ${animals.length} animais`}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
