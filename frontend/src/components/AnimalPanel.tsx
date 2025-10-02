import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { 
  ArrowLeft,
  Save,
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
  TrendingUp,
  AlertCircle,
  Plus
} from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import logoImage from "../assets/logo-frontend.png";

interface Animal {
  id: string;
  name: string;
  type: string;
  race: string;
  weight: string;
  birthDate: string;
  status: string;
  location: string;
  lastCheck: string;
  image: string;
}

interface AnimalPanelProps {
  animal: Animal;
  onBack: () => void;
  onLogout: () => void;
  viewOnly?: boolean;
}

export function AnimalPanel({ animal, onBack, onLogout, viewOnly = false }: AnimalPanelProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: animal.name,
    individualId: animal.id,
    sex: "Macho",
    race: animal.race,
    birthDate: animal.birthDate,
    trackingCode: `TRC-${animal.id}`,
    origin: "Fazenda Silva - Ceará, Brasil",
    weight: animal.weight,
    location: animal.location,
    notes: "Animal saudável, vacinação em dia. Última pesagem em 20/03/2024."
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const healthRecords = [
    { date: "20/03/2024", type: "Vacinação", description: "Vacina contra clostridioses", status: "Concluído" },
    { date: "15/03/2024", type: "Exame", description: "Check-up geral", status: "Concluído" },
    { date: "10/03/2024", type: "Pesagem", description: "Peso registrado: 45kg", status: "Concluído" },
    { date: "05/03/2024", type: "Vermifugação", description: "Aplicação de vermífugo", status: "Concluído" }
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
            {/* Logo and Back Button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onBack}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <img 
                src={logoImage} 
                alt="Sisov Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
              />
              <div className="hidden sm:block">
                <h1 className="font-semibold text-gray-900">{viewOnly ? "Visualização do Animal" : "Painel do Animal"}</h1>
                <p className="text-sm text-gray-500">{animal.id}</p>
              </div>
              <div className="sm:hidden">
                <h1 className="font-semibold text-gray-900 text-sm">{animal.id}</h1>
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
                <ArrowLeft className="h-5 w-5" />
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
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Animal Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Animal Photo & Basic Info */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                    <img 
                      src={animal.image} 
                      alt={animal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{animal.name}</h2>
                    <p className="text-sm text-gray-500 mb-3">{animal.id}</p>
                    <Badge 
                      variant={animal.status === "Saudável" ? "default" : "secondary"}
                      className={animal.status === "Saudável" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"}
                    >
                      {animal.status}
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
                        Peso
                      </span>
                      <span className="font-medium text-gray-900">{animal.weight}</span>
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
                        Localização
                      </span>
                      <span className="font-medium text-gray-900">{animal.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Estatísticas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Heart className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Saúde Geral</p>
                        <p className="font-semibold text-gray-900">Excelente</p>
                      </div>
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Syringe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Vacinações</p>
                        <p className="font-semibold text-gray-900">Em dia</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Registros</p>
                        <p className="font-semibold text-gray-900">12 total</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Edit Form & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Form */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Informações do Animal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input 
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-gray-50"
                        disabled={viewOnly}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="individualId">Identificação Individual</Label>
                      <Input 
                        id="individualId"
                        value={formData.individualId}
                        onChange={(e) => handleInputChange('individualId', e.target.value)}
                        className="bg-gray-50"
                        disabled={viewOnly}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sex">Sexo</Label>
                      <select 
                        id="sex"
                        value={formData.sex}
                        onChange={(e) => handleInputChange('sex', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        disabled={viewOnly}
                      >
                        <option>Macho</option>
                        <option>Fêmea</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="race">Raça</Label>
                      <Input 
                        id="race"
                        value={formData.race}
                        onChange={(e) => handleInputChange('race', e.target.value)}
                        className="bg-gray-50"
                        disabled={viewOnly}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Data de Nascimento</Label>
                      <Input 
                        id="birthDate"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        className="bg-gray-50"
                        disabled={viewOnly}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trackingCode">Código de Rastreamento</Label>
                      <Input 
                        id="trackingCode"
                        value={formData.trackingCode}
                        onChange={(e) => handleInputChange('trackingCode', e.target.value)}
                        className="bg-gray-50"
                        disabled={viewOnly}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso Atual</Label>
                      <Input 
                        id="weight"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="bg-gray-50"
                        disabled={viewOnly}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Localização</Label>
                      <select 
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        disabled={viewOnly}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <option>Pasto A</option>
                        <option>Pasto B</option>
                        <option>Pasto C</option>
                      </select>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="origin">Procedência</Label>
                      <Input 
                        id="origin"
                        value={formData.origin}
                        onChange={(e) => handleInputChange('origin', e.target.value)}
                        className="bg-gray-50"
                        disabled={viewOnly}
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="notes">Outras Informações</Label>
                      <Textarea 
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="bg-gray-50 min-h-[100px]"
                        placeholder="Adicione observações ou informações adicionais sobre o animal..."
                        disabled={viewOnly}
                      />
                    </div>
                  </div>

                  {!viewOnly && (
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                      <Button 
                        className="flex-1 bg-teal-600 hover:bg-teal-700 cursor-pointer"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={onBack}
                        className="flex-1 cursor-pointer"
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                  {viewOnly && (
                    <div className="flex mt-6 pt-6 border-t border-gray-200">
                      <Button 
                        variant="outline"
                        onClick={onBack}
                        className="w-full cursor-pointer"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Health History */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Histórico de Saúde e Manejo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthRecords.map((record, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            {record.type === "Vacinação" && <Syringe className="h-5 w-5 text-teal-600" />}
                            {record.type === "Exame" && <Activity className="h-5 w-5 text-teal-600" />}
                            {record.type === "Pesagem" && <Weight className="h-5 w-5 text-teal-600" />}
                            {record.type === "Vermifugação" && <AlertCircle className="h-5 w-5 text-teal-600" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base">{record.type}</p>
                              <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                              <p className="text-xs text-gray-500 mt-1">{record.date}</p>
                            </div>
                            <Badge 
                              variant="default"
                              className="bg-green-100 text-green-700 hover:bg-green-100 flex-shrink-0 text-xs"
                            >
                              {record.status}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {!viewOnly && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-6 cursor-pointer"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Novo Registro
                    </Button>
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