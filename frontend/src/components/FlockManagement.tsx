import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Calendar,
  Bell,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import logoImage from "../assets/logo-frontend.png";
import type { CreateAnimalPayload, Property } from "../types/api-contract";
import type { Animal } from "../types/domain";
import { AnimalStatus } from "../types/domain";

interface FlockManagementProps {
  onBack: () => void;
  onLogout: () => void;
  onAnimalClick: (animal: Animal, viewOnly: boolean) => void;
  animals?: Animal[];
  properties?: Property[];
  producerName?: string;
  isLoading?: boolean;
  errorMessage?: string;
  onRefresh?: () => void;
  onCreateAnimal?: (payload: CreateAnimalPayload) => Promise<void>;
  isSaving?: boolean;
}

export function FlockManagement({
  onBack,
  onLogout,
  onAnimalClick,
  animals: animalsProp = [],
  properties = [],
  producerName = "Produtor",
  isLoading = false,
  errorMessage,
  onRefresh,
  onCreateAnimal,
  isSaving = false,
}: FlockManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [birthDate, setBirthDate] = useState<Date>();
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [locationFilter, setLocationFilter] = useState("Todos");
  const [newAnimal, setNewAnimal] = useState({
    tagId: "",
    propertyId: "",
    sex: "MALE" as "MALE" | "FEMALE",
    race: "",
    birthCity: "",
  });
  const [saveError, setSaveError] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const animals = animalsProp;

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

  const selectedCount = selectedIds.length;
  const isAllSelected = selectedCount > 0 && filteredAnimals.length > 0 && selectedIds.length === filteredAnimals.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(filteredAnimals.map((animal) => animal.id));
  };

  const toggleSelectAnimal = (animalId: string) => {
    setSelectedIds((current) =>
      current.includes(animalId)
        ? current.filter((id) => id !== animalId)
        : [...current, animalId]
    );
  };

  const exportSelectedCSV = () => {
    const selected = animals.filter((animal) => selectedIds.includes(animal.id));
    if (!selected.length) return;

    const header = ["ID","Nome","Raça","Peso","Status","Localização"];
    const rows = selected.map((animal) => [animal.id, animal.name, animal.race, animal.weight, animal.status, animal.location]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ovinos-selecionados-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportSelectedPDF = () => {
    if (!selectedCount) return;
    window.alert(`Exportação em PDF para ${selectedCount} ovinos ainda não disponível no protótipo.`);
  };

  const transferSelectedBatch = () => {
    if (!selectedCount) return;
    window.alert(`${selectedCount} ovinos selecionados para transferência de lote.`);
  };

  const healthyCount = animals.filter(
    (a) => a.apiStatus === "ACTIVE" || a.status === AnimalStatus.HEALTHY,
  ).length;
  const attentionCount = animals.length - healthyCount;
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentCount = animals.filter((a) => new Date(a.createdAt).getTime() >= thirtyDaysAgo).length;

  const stats = [
    { label: "Total", value: String(animals.length), color: "text-teal-600", bgColor: "bg-teal-100" },
    { label: "Saudáveis", value: String(healthyCount), color: "text-green-600", bgColor: "bg-green-100" },
    { label: "Atenção", value: String(attentionCount), color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { label: "Novos (30d)", value: String(recentCount), color: "text-blue-600", bgColor: "bg-blue-100" },
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
                  <div className="text-sm font-semibold text-gray-900">{producerName}</div>
                  <div className="text-xs text-gray-500">Produtor</div>
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
                    <div className="text-sm font-semibold text-gray-900">{producerName}</div>
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
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex justify-between items-center gap-4">
            <span>{errorMessage}</span>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh} className="cursor-pointer shrink-0">
                Tentar novamente
              </Button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="mb-6 flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" />
          </div>
        )}

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
          <div className="space-y-4">
            {selectedCount > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{selectedCount} ovinos selecionados</p>
                    <p className="text-sm text-slate-500">Ações em massa disponíveis para o lote.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={exportSelectedCSV}>
                      Exportar CSV
                    </Button>
                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={exportSelectedPDF}>
                      Exportar PDF
                    </Button>
                    <Button size="sm" className="cursor-pointer bg-teal-600 text-white hover:bg-teal-700" onClick={transferSelectedBatch}>
                      Transferir Lote
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <Card>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[48px] px-4 py-3">
                            <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                          </TableHead>
                          <TableHead className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">ID</TableHead>
                          <TableHead className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Animal</TableHead>
                          <TableHead className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Peso</TableHead>
                          <TableHead className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Localização</TableHead>
                          <TableHead className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</TableHead>
                          <TableHead className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAnimals.map((animal) => (
                          <TableRow key={animal.id}>
                            <TableCell className="px-4 py-3">
                              <Checkbox
                                checked={selectedIds.includes(animal.id)}
                                onCheckedChange={() => toggleSelectAnimal(animal.id)}
                              />
                            </TableCell>
                            <TableCell className="py-3 px-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{animal.id}</TableCell>
                            <TableCell className="py-3 px-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{animal.name}</TableCell>
                            <TableCell className="py-3 px-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{animal.weight}</TableCell>
                            <TableCell className="py-3 px-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{animal.location}</TableCell>
                            <TableCell className="py-3 px-4 whitespace-nowrap">
                              <Badge className={`text-xs ${animal.status === "Saudável" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                {animal.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="cursor-pointer text-xs sm:text-sm"
                                  onClick={() => onAnimalClick(animal, true)}
                                >
                                  Ver
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="cursor-pointer text-xs sm:text-sm"
                                  onClick={() => onAnimalClick(animal, false)}
                                >
                                  Editar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                    <Label htmlFor="modal-property">Propriedade (fazenda)</Label>
                    <select
                      id="modal-property"
                      value={newAnimal.propertyId}
                      onChange={(e) => setNewAnimal({ ...newAnimal, propertyId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <option value="">Selecione a propriedade</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.farmName} — {p.city}/{p.state}
                        </option>
                      ))}
                    </select>
                    {!properties.length && (
                      <p className="text-xs text-amber-600">Cadastre uma propriedade na API antes de registrar animais.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-id">Brinco / tag (opcional)</Label>
                    <Input
                      id="modal-id"
                      placeholder="Ex: TAG-001"
                      value={newAnimal.tagId}
                      onChange={(e) => setNewAnimal({ ...newAnimal, tagId: e.target.value })}
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-sex">Sexo</Label>
                    <select
                      id="modal-sex"
                      value={newAnimal.sex}
                      onChange={(e) =>
                        setNewAnimal({ ...newAnimal, sex: e.target.value as "MALE" | "FEMALE" })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <option value="MALE">Macho</option>
                      <option value="FEMALE">Fêmea</option>
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
                    <Label htmlFor="modal-birthCity">Cidade de nascimento</Label>
                    <Input
                      id="modal-birthCity"
                      placeholder="Ex: Tauá"
                      value={newAnimal.birthCity}
                      onChange={(e) => setNewAnimal({ ...newAnimal, birthCity: e.target.value })}
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
                          }}
                          locale={ptBR}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {saveError && (
                  <p className="mt-4 text-sm text-red-600">{saveError}</p>
                )}

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                  <Button 
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 cursor-pointer"
                    disabled={isSaving}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    disabled={isSaving || !onCreateAnimal}
                    onClick={async () => {
                      setSaveError("");
                      if (!onCreateAnimal) {
                        setSaveError("Cadastro indisponível.");
                        return;
                      }
                      if (!newAnimal.propertyId || !newAnimal.race || !birthDate || !newAnimal.birthCity) {
                        setSaveError("Preencha propriedade, raça, cidade e data de nascimento.");
                        return;
                      }
                      try {
                        await onCreateAnimal({
                          propertyId: newAnimal.propertyId,
                          breed: newAnimal.race,
                          sex: newAnimal.sex,
                          birthDate: birthDate.toISOString(),
                          birthCity: newAnimal.birthCity,
                          ...(newAnimal.tagId ? { tagId: newAnimal.tagId } : {}),
                        });
                        setShowAddModal(false);
                        setBirthDate(undefined);
                        setNewAnimal({
                          tagId: "",
                          propertyId: "",
                          sex: "MALE",
                          race: "",
                          birthCity: "",
                        });
                      } catch (err) {
                        setSaveError(err instanceof Error ? err.message : "Erro ao salvar animal.");
                      }
                    }}
                  >
                    {isSaving ? "Salvando..." : "Salvar"}
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