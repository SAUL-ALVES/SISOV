import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { ChartContainer } from "./ui/chart";
import { 
  Users, 
  Heart, 
  Calendar,
  FileText,
  Settings,
  LogOut,
  Plus,
  Search,
  BarChart3,
  Download,
  Bell,
  ChevronDown,
  Menu
} from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import logoImage from "../assets/logo-frontend.png";

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
  isLoading?: boolean;
  errorMessage?: string;
}

export function Dashboard({
  onLogout,
  onFlockClick,
  onQRCodeClick,
  stats,
  isLoading = false,
  errorMessage,
}: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const total = stats?.totalAnimals ?? 0;
  const healthy = stats?.healthyAnimals ?? 0;
  const healthPct = total > 0 ? `${Math.round((healthy / total) * 100)}%` : "—";

  const statCards = [
    {
      title: "Total de Ovinos",
      value: isLoading ? "…" : String(total),
      icon: Users,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
    {
      title: "Saúde Geral",
      value: isLoading ? "…" : healthPct,
      icon: Heart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Propriedades",
      value: isLoading ? "…" : String(stats?.propertiesCount ?? 0),
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Produtor",
      value: stats?.producerName?.split(" ")[0] ?? "—",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  interface WeightCurvePoint {
    month: string;
    weight: number;
  }

  interface SlaughterForecastItem {
    id: string;
    animal: string;
    ageMonths: number;
    currentWeight: number;
    carcassYield: number;
    expectedSlaughter: string;
  }

  const weightCurve: WeightCurvePoint[] = [
    { month: "Mai", weight: 22 },
    { month: "Jun", weight: 28 },
    { month: "Jul", weight: 34 },
    { month: "Ago", weight: 37 },
    { month: "Set", weight: 41 },
    { month: "Out", weight: 44 },
    { month: "Nov", weight: 47 },
    { month: "Dez", weight: 49 }
  ];

  const slaughterForecast: SlaughterForecastItem[] = [
    {
      id: "OV-1234",
      animal: "Ovino #1234",
      ageMonths: 11,
      currentWeight: 45,
      carcassYield: 40,
      expectedSlaughter: "Junho 2024"
    },
    {
      id: "OV-1235",
      animal: "Ovino #1235",
      ageMonths: 10,
      currentWeight: 42,
      carcassYield: 38,
      expectedSlaughter: "Julho 2024"
    },
    {
      id: "OV-1236",
      animal: "Ovino #1236",
      ageMonths: 12,
      currentWeight: 48,
      carcassYield: 42,
      expectedSlaughter: "Maio 2024"
    },
    {
      id: "OV-1237",
      animal: "Ovino #1237",
      ageMonths: 11,
      currentWeight: 44,
      carcassYield: 41,
      expectedSlaughter: "Junho 2024"
    }
  ];

  const recentProductions = [
    { id: "OV-001", animal: "Ovino #1234", peso: "45kg", data: "20/03/2024", status: "Ativo" },
    { id: "OV-002", animal: "Ovino #1235", peso: "42kg", data: "19/03/2024", status: "Ativo" },
    { id: "OV-003", animal: "Ovino #1236", peso: "48kg", data: "18/03/2024", status: "Processado" },
    { id: "OV-004", animal: "Ovino #1237", peso: "44kg", data: "17/03/2024", status: "Processado" },
  ];

  const quickActions = [
    { title: "Gerenciamento do Rebanho", icon: Users, color: "bg-blue-600" },
    { title: "Gerar QR Code", icon: FileText, color: "bg-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img 
                src={logoImage} 
                alt="Sisov Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
              />
              <div className="hidden sm:block">
                <h1 className="font-semibold text-gray-900">SISOV Dashboard</h1>
                <p className="text-sm text-gray-500">Sistema de Rastreabilidade</p>
              </div>
              <div className="sm:hidden">
                <h1 className="font-semibold text-gray-900 text-sm">SISOV</h1>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative cursor-pointer">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">Produtor Silva</div>
                  <div className="text-xs text-gray-500">Administrador</div>
                </div>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </Button>
              </div>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={onLogout}
                className="text-gray-600 hover:text-red-600 cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative cursor-pointer">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="cursor-pointer"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Produtor Silva</div>
                    <div className="text-xs text-gray-500">Administrador</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onLogout}
                    className="text-gray-600 hover:text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta, Produtor Silva! 👋
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Aqui está um resumo da sua produção e rebanho.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {errorMessage && (
            <div className="sm:col-span-2 lg:col-span-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errorMessage}
            </div>
          )}
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
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
                  onClick={
                    action.title === "Gerenciamento do Rebanho" ? onFlockClick :
                    action.title === "Gerar QR Code" ? onQRCodeClick :
                    undefined
                  }
                >
                  <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs sm:text-sm text-center leading-tight">{action.title}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] mb-6 sm:mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Curva de Ganho de Peso do Rebanho</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ChartContainer
                config={{
                  weight: {
                    label: "Peso (kg)",
                    color: "#0d9488"
                  }
                }}
                className="h-full"
              >
                <LineChart data={weightCurve}>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} style={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} style={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip wrapperStyle={{ borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', backgroundColor: '#fff' }} />
                  <Legend verticalAlign="top" align="right" height={36} />
                  <Line type="monotone" dataKey="weight" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Previsão de Abate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Meta de rendimento de carcaça</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-2xl font-semibold text-slate-900">42%</p>
                      <p className="text-xs text-slate-500">Meta ideal para corte de Manta</p>
                    </div>
                    <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-4 rounded-full bg-emerald-500" style={{ width: '42%' }} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {slaughterForecast.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.animal}</p>
                          <p className="text-xs text-slate-500">{item.expectedSlaughter} • {item.ageMonths} meses</p>
                        </div>
                        <Badge className={item.carcassYield >= 42 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                          {item.carcassYield}%
                        </Badge>
                      </div>
                      <div className="mt-3 text-sm text-slate-600">Peso atual: {item.currentWeight}kg</div>
                      <div className="mt-3 h-2 rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(item.carcassYield, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Production Registration */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
                  <span>Registro de Produção</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="animalId">ID do Animal</Label>
                  <Input 
                    id="animalId" 
                    placeholder="Digite o ID do animal" 
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    placeholder="Digite o peso" 
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    className="bg-gray-50"
                  />
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">
                  Registrar Produção
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reports Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
                  <span>Relatórios Rápidos</span>
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
                  <span className="text-sm sm:text-base">Relatório de Produção</span>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between cursor-pointer">
                  <span className="text-sm sm:text-base">QR Codes Gerados</span>
                  <Download className="h-4 w-4" />
                </Button>
                <div className="pt-4 border-t border-gray-200">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer">
                        <BarChart3 className="mr-2 h-4 w-4 text-white" />
                          <span className="text-sm sm:text-base text-white">Ver Todos os Relatórios</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Productions Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-base sm:text-lg">Produções Recentes</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-48 md:w-64 bg-gray-50"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="cursor-pointer flex-shrink-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">ID</th>
                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Animal</th>
                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Peso</th>
                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Data</th>
                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Status</th>
                        <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProductions.map((production, index) => (
                        <motion.tr 
                          key={production.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{production.id}</td>
                          <td className="py-3 px-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{production.animal}</td>
                          <td className="py-3 px-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{production.peso}</td>
                          <td className="py-3 px-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{production.data}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <Badge 
                              variant={production.status === "Ativo" ? "default" : "secondary"}
                              className={`text-xs ${production.status === "Ativo" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}`}
                            >
                              {production.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="cursor-pointer text-xs sm:text-sm">
                                Ver
                              </Button>
                              <Button variant="ghost" size="sm" className="cursor-pointer text-xs sm:text-sm">
                                Editar
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Pagination */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Mostrando 4 de 127 registros
                </p>
                <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="cursor-pointer text-xs sm:text-sm whitespace-nowrap">Anterior</Button>
                  <Button variant="outline" size="sm" className="cursor-pointer text-xs sm:text-sm">1</Button>
                  <Button variant="outline" size="sm" className="bg-teal-600 text-white hover:bg-teal-700 cursor-pointer text-xs sm:text-sm">2</Button>
                  <Button variant="outline" size="sm" className="cursor-pointer text-xs sm:text-sm">3</Button>
                  <Button variant="outline" size="sm" className="cursor-pointer text-xs sm:text-sm whitespace-nowrap">Próximo</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}