import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { 
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Edit,
  //Trash2,
  Eye,
  Calendar,
  Activity,
  MapPin,
  Weight,
  Bell,
  ChevronDown,
  Menu,
  MoreVertical,
  X
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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

interface FlockManagementProps {
  onBack: () => void;
  onLogout: () => void;
  onAnimalClick: (animal: Animal, viewOnly: boolean) => void;
}

export function FlockManagement({ onBack, onLogout, onAnimalClick }: FlockManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [birthDate, setBirthDate] = useState<Date>();
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [locationFilter, setLocationFilter] = useState("Todos");
  const [newAnimal, setNewAnimal] = useState({
    name: "",
    individualId: "",
    sex: "Macho",
    race: "",
    birthDate: "",
  });

  const animals = [
    {
      id: "OV-1234",
      name: "Ovino #1234",
      type: "Ovino",
      race: "Dorper",
      weight: "45kg",
      birthDate: "15/01/2023",
      status: "Saudável",
      location: "Pasto A",
      lastCheck: "20/03/2024",
      image: "https://images.unsplash.com/photo-1616842609926-533364126cf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGVlcCUyMHBvcnRyYWl0JTIwZmFybXxlbnwxfHx8fDE3NTkyNzI1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "OV-1235",
      name: "Ovino #1235",
      type: "Ovino",
      race: "Santa Inês",
      weight: "42kg",
      birthDate: "22/02/2023",
      status: "Saudável",
      location: "Pasto B",
      lastCheck: "19/03/2024",
      image: "https://images.unsplash.com/photo-1736066349278-897dde1f055d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNoZWVwJTIwbWVhZG93fGVufDF8fHx8MTc1OTI3MjU3NXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "CP-0891",
      name: "Caprino #0891",
      type: "Caprino",
      race: "Anglo-Nubiana",
      weight: "38kg",
      birthDate: "10/03/2023",
      status: "Vacinação Pendente",
      location: "Pasto C",
      lastCheck: "18/03/2024",
      image: "https://images.unsplash.com/photo-1723625449728-40e7a4d968e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2F0JTIwZmFybSUyMGFuaW1hbHxlbnwxfHx8fDE3NTkyNzI1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "OV-1236",
      name: "Ovino #1236",
      type: "Ovino",
      race: "Dorper",
      weight: "48kg",
      birthDate: "05/12/2022",
      status: "Saudável",
      location: "Pasto A",
      lastCheck: "20/03/2024",
      image: "https://images.unsplash.com/photo-1664546474909-89d3390196d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMHNoZWVwJTIwd29vbHxlbnwxfHx8fDE3NTkyNzI1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "OV-1237",
      name: "Ovino #1237",
      type: "Ovino",
      race: "Santa Inês",
      weight: "44kg",
      birthDate: "18/01/2023",
      status: "Saudável",
      location: "Pasto B",
      lastCheck: "17/03/2024",
      image: "https://images.unsplash.com/photo-1616842609926-533364126cf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGVlcCUyMHBvcnRyYWl0JTIwZmFybXxlbnwxfHx8fDE3NTkyNzI1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "CP-0892",
      name: "Caprino #0892",
      type: "Caprino",
      race: "Saanen",
      weight: "40kg",
      birthDate: "25/02/2023",
      status: "Saudável",
      location: "Pasto C",
      lastCheck: "19/03/2024",
      image: "https://images.unsplash.com/photo-1723625449728-40e7a4d968e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2F0JTIwZmFybSUyMGFuaW1hbHxlbnwxfHx8fDE3NTkyNzI1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  // Filtragem combinada
  const filteredAnimals = animals.filter(animal => {
    // Filtro de busca por texto
    const matchesSearch = searchTerm === "" || 
      animal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.type.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por tipo
    const matchesType = typeFilter === "Todos" || animal.type === typeFilter;

    // Filtro por status
    const matchesStatus = statusFilter === "Todos" || animal.status === statusFilter;

    // Filtro por localização
    const matchesLocation = locationFilter === "Todos" || animal.location === locationFilter;

    return matchesSearch && matchesType && matchesStatus && matchesLocation;
  });

  const clearFilters = () => {
    setTypeFilter("Todos");
    setStatusFilter("Todos");
    setLocationFilter("Todos");
  };

  const stats = [
    { label: "Total", value: "243", color: "text-teal-600", bgColor: "bg-teal-100" },
    { label: "Saudáveis", value: "238", color: "text-green-600", bgColor: "bg-green-100" },
    { label: "Atenção", value: "5", color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { label: "Novos (30d)", value: "12", color: "text-blue-600", bgColor: "bg-blue-100" }
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
                <h1 className="font-semibold text-gray-900">Gerenciamento de Rebanho</h1>
                <p className="text-sm text-gray-500">Controle completo dos animais</p>
              </div>
              <div className="sm:hidden">
                <h1 className="font-semibold text-gray-900 text-sm">Rebanho</h1>
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
        {/* Stats */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center">
                    <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between mb-6 sm:mb-8"
        >
          <div className="flex flex-1 gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por ID, raça ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <Button 
              variant="outline"
              size="icon"
              onClick={() => setFilterOpen(!filterOpen)}
              className="cursor-pointer flex-shrink-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 cursor-pointer w-full sm:w-auto"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Animal
          </Button>
        </motion.div>

        {/* Filter Panel */}
        {filterOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-6 sm:mb-8"
          >
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option>Todos</option>
                      <option>Ovino</option>
                      <option>Caprino</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option>Todos</option>
                      <option>Saudável</option>
                      <option>Vacinação Pendente</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Localização</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    >
                      <option>Todos</option>
                      <option>Pasto A</option>
                      <option>Pasto B</option>
                      <option>Pasto C</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      className="w-full cursor-pointer"
                      onClick={clearFilters}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Animals Grid */}
        {filteredAnimals.length === 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum animal encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar os filtros ou a busca</p>
            <Button 
              variant="outline" 
              className="cursor-pointer"
              onClick={() => {
                setSearchTerm("");
                clearFilters();
              }}
            >
              Limpar todos os filtros
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAnimals.map((animal, index) => (
              <motion.div
                key={animal.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                  <img 
                    src={animal.image} 
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{animal.name}</h3>
                      <p className="text-sm text-gray-500">{animal.id}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="cursor-pointer -mr-2">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Activity className="h-4 w-4 mr-2 text-teal-600" />
                      <span className="font-medium mr-2">Raça:</span>
                      <span>{animal.race}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Weight className="h-4 w-4 mr-2 text-teal-600" />
                      <span className="font-medium mr-2">Peso:</span>
                      <span>{animal.weight}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-teal-600" />
                      <span className="font-medium mr-2">Nascimento:</span>
                      <span>{animal.birthDate}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                      <span className="font-medium mr-2">Local:</span>
                      <span>{animal.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant={animal.status === "Saudável" ? "default" : "secondary"}
                      className={animal.status === "Saudável" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"}
                    >
                      {animal.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Checado: {animal.lastCheck}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 cursor-pointer" onClick={() => onAnimalClick(animal, true)}>
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 cursor-pointer" onClick={() => onAnimalClick(animal, false)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          </div>
        )}

        {/* Pagination */}
        {filteredAnimals.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="text-sm text-gray-600">
              Mostrando {filteredAnimals.length} de {animals.length} animais
            </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="cursor-pointer">Anterior</Button>
            <Button variant="outline" size="sm" className="cursor-pointer">1</Button>
            <Button variant="outline" size="sm" className="bg-teal-600 text-white hover:bg-teal-700 cursor-pointer">2</Button>
            <Button variant="outline" size="sm" className="cursor-pointer">3</Button>
            <Button variant="outline" size="sm" className="cursor-pointer">Próximo</Button>
          </div>
          </motion.div>
        )}
      </main>

      {/* Add Animal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Adicionar Novo Animal</h2>
                  <p className="text-sm text-gray-500 mt-1">Preencha as informações do animal</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowAddModal(false)}
                  className="cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="modal-name">Nome do Animal</Label>
                    <Input 
                      id="modal-name"
                      placeholder="Ex: Ovino #1234"
                      value={newAnimal.name}
                      onChange={(e) => setNewAnimal({...newAnimal, name: e.target.value})}
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-id">Identificação Individual</Label>
                    <Input 
                      id="modal-id"
                      placeholder="Ex: OV-1234"
                      value={newAnimal.individualId}
                      onChange={(e) => setNewAnimal({...newAnimal, individualId: e.target.value})}
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-sex">Sexo</Label>
                    <select 
                      id="modal-sex"
                      value={newAnimal.sex}
                      onChange={(e) => setNewAnimal({...newAnimal, sex: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <option>Macho</option>
                      <option>Fêmea</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-race">Raça</Label>
                    <Input 
                      id="modal-race"
                      placeholder="Ex: Dorper, Santa Inês"
                      value={newAnimal.race}
                      onChange={(e) => setNewAnimal({...newAnimal, race: e.target.value})}
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-birthDate">Data de Nascimento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal bg-gray-50 ${!birthDate && "text-muted-foreground"}`}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {birthDate ? format(birthDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={birthDate}
                          onSelect={(date) => {
                            setBirthDate(date);
                            if (date) {
                              setNewAnimal({...newAnimal, birthDate: format(date, "dd/MM/yyyy")});
                            }
                          }}
                          locale={ptBR}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                  <Button 
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    onClick={() => {
                      // Aqui você pode adicionar a lógica para salvar o animal
                      console.log("Novo animal:", newAnimal);
                      setShowAddModal(false);
                      setBirthDate(undefined);
                      setNewAnimal({
                        name: "",
                        individualId: "",
                        sex: "Macho",
                        race: "",
                        birthDate: "",
                      });
                    }}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}