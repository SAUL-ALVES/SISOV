import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { 
  ArrowLeft,
  Search,
  QrCode,
  Award,
  Download,
  X,
  Bell,
  ChevronDown,  
  Menu,
  CheckCircle
} from "lucide-react";
import { useState} from "react";
import { motion, AnimatePresence } from "motion/react";
import logoImage from "../assets/logo-frontend.png";
import QRCodeLib from "qrcode";

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

interface QRCodeGenerationProps {
  onBack: () => void;
  onLogout: () => void;
}

export function QRCodeGeneration({ onBack, onLogout }: QRCodeGenerationProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showSeal, setShowSeal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");


  const animals: Animal[] = [
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
      status: "Saudável",
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

  const filteredAnimals = animals.filter(animal => 
    animal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.race.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateQRCode = async (animal: Animal) => {
    const url = `https://sisov.com.br/rastreamento/${animal.id}`;
    try {
      const qrUrl = await QRCodeLib.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: "#0d9488",
          light: "#ffffff"
        }
      });
      setQrCodeUrl(qrUrl);
      setShowQRCode(true);
      setShowSeal(false);
    } catch (err) {
      console.error("Erro ao gerar QR Code:", err);
    }
  };

  const generateSeal = () => {
    setShowSeal(true);
    setShowQRCode(false);
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qrcode-${selectedAnimal?.id}.png`;
      link.click();
    }
  };

  const closeModal = () => {
    setShowQRCode(false);
    setShowSeal(false);
    setSelectedAnimal(null);
  };

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
                <h1 className="font-semibold text-gray-900">Gerar QR Code</h1>
                <p className="text-sm text-gray-500">Rastreabilidade e Certificação</p>
              </div>
              <div className="sm:hidden">
                <h1 className="font-semibold text-gray-900 text-sm">QR Code</h1>
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
        {/* Info Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-teal-100">QR Code de Rastreabilidade</p>
                  <p className="text-lg font-semibold">Ciclo de Vida Completo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-100">Selo de Certificação</p>
                  <p className="text-lg font-semibold">Produto Final</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por ID, nome ou raça do animal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white h-12"
            />
          </div>
        </motion.div>

        {/* Animals List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Selecione um Animal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAnimals.map((animal, index) => (
                  <motion.div
                    key={animal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                      selectedAnimal?.id === animal.id 
                        ? 'border-teal-600 bg-teal-50' 
                        : 'border-gray-200 hover:border-teal-300 bg-white'
                    }`}
                    onClick={() => setSelectedAnimal(animal)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={animal.image}
                          alt={animal.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{animal.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-xs sm:text-sm text-gray-600">ID: {animal.id}</span>
                            <span className="text-xs sm:text-sm text-gray-600">• {animal.race}</span>
                            <span className="text-xs sm:text-sm text-gray-600">• {animal.weight}</span>
                          </div>
                        </div>
                      </div>
                      {selectedAnimal?.id === animal.id && (
                        <CheckCircle className="h-6 w-6 text-teal-600 flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))}

                {filteredAnimals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhum animal encontrado</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedAnimal && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      className="bg-teal-600 hover:bg-teal-700 cursor-pointer"
                      onClick={() => generateQRCode(selectedAnimal)}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Gerar QR Code
                    </Button>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                      onClick={() => generateSeal()}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Gerar Selo
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && selectedAnimal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">QR Code Gerado</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={closeModal}
                  className="cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-gray-50 p-6 rounded-xl">
                  {qrCodeUrl && (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code"
                      className="mx-auto w-64 h-64"
                    />
                  )}
                </div>

                <div className="text-left bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-teal-900 mb-2">{selectedAnimal.name}</p>
                  <p className="text-xs text-teal-700">ID: {selectedAnimal.id}</p>
                  <p className="text-xs text-teal-700">Raça: {selectedAnimal.race}</p>
                  <p className="text-xs text-teal-700 mt-2">
                    URL: https://sisov.com.br/rastreamento/{selectedAnimal.id}
                  </p>
                </div>

                <Button 
                  className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer"
                  onClick={downloadQRCode}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar QR Code
                </Button>

                <p className="text-xs text-gray-500 mt-4">
                  Este QR Code contém o histórico completo do animal e pode ser impresso na embalagem do produto.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seal Modal */}
      <AnimatePresence>
        {showSeal && selectedAnimal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Selo de Certificação</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={closeModal}
                  className="cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-xl text-white">
                  <Award className="h-24 w-24 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">SISOV</h3>
                  <p className="text-sm text-purple-100">Certificado de Qualidade</p>
                  <div className="mt-6 pt-6 border-t border-purple-400">
                    <p className="font-semibold">{selectedAnimal.name}</p>
                    <p className="text-sm text-purple-100">ID: {selectedAnimal.id}</p>
                    <p className="text-xs text-purple-200 mt-2">Raça: {selectedAnimal.race}</p>
                    <p className="text-xs text-purple-200">Origem: {selectedAnimal.location}</p>
                  </div>
                </div>

                <div className="text-left bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-2">Informações do Selo</p>
                  <p className="text-xs text-purple-700">✓ Rastreabilidade completa</p>
                  <p className="text-xs text-purple-700">✓ Procedência certificada</p>
                  <p className="text-xs text-purple-700">✓ Qualidade garantida</p>
                  <p className="text-xs text-purple-700">✓ Pronto para comercialização</p>
                </div>

                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Selo
                </Button>

                <p className="text-xs text-gray-500 mt-4">
                  Este selo certifica que o produto passou por todas as etapas de controle de qualidade.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}