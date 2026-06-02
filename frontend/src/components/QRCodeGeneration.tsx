import { useMemo, useState } from "react";
import { motion } from "motion/react";
import QRCodeLib from "qrcode";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  QrCode,
  Award,
  Printer,
  Plus,
  Loader2,
  ChevronDown
} from "lucide-react";
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
  hasEartag: boolean;
}

interface BulkLabel {
  id: string;
  qrCodeUrl: string;
}

interface QRCodeGenerationProps {
  onBack: () => void;
  onLogout: () => void;
}

export function QRCodeGeneration({ onBack, onLogout }: QRCodeGenerationProps) {
  const [bulkQuantity, setBulkQuantity] = useState(12);
  const [bulkLabels, setBulkLabels] = useState<BulkLabel[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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
      image: "https://images.unsplash.com/photo-1616842609926-533364126cf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGVlcCUyMHBvcnRyYWl0JTIwZmFybXxlbnwxfHx8fDE3NTkyNzI1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      hasEartag: false
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
      image: "https://images.unsplash.com/photo-1736066349278-897dde1f055d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNoZWVwJTIwbWVhZG93fGVufDF8fHx8MTc1OTI3MjU3NXww&ixlib=rb-4.1.0&q=80&w=1080",
      hasEartag: false
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
      image: "https://images.unsplash.com/photo-1723625449728-40e7a4d968e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2F0JTIwZmFybSUyMGFuaW1hbHxlbnwxfHx8fDE3NTkyNzI1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      hasEartag: true
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
      image: "https://images.unsplash.com/photo-1664546474909-89d3390196d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMHNoZWVwJTIwd29vbHxlbnwxfHx8fDE3NTkyNzI1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      hasEartag: false
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
      image: "https://images.unsplash.com/photo-1616842609926-533364126cf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGVlcCUyMHBvcnRyYWl0JTIwZmFybXxlbnwxfHx8fDE3NTkyNzI1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      hasEartag: true
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
      image: "https://images.unsplash.com/photo-1723625449728-40e7a4d968e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2F0JTIwZmFybSUyMGFuaW1hbHxlbnwxfHx8fDE3NTkyNzI1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      hasEartag: false
    }
  ];

  const availableAnimals = useMemo(() => animals.filter((animal) => !animal.hasEartag), [animals]);

  const buildLabelId = (index: number) => `SEM-BRINCO-${String(index + 1).padStart(3, "0")}`;

  const generateBulkQRCodes = async () => {
    if (bulkQuantity < 1) return;
    setIsGenerating(true);
    try {
      const labels = await Promise.all(
        Array.from({ length: bulkQuantity }, (_, index) => {
          const id = buildLabelId(index);
          const url = `https://sisov.com.br/rastreamento/${id}`;
          return QRCodeLib.toDataURL(url, {
            width: 360,
            margin: 2,
            color: {
              dark: "#0f766e",
              light: "#ffffff"
            }
          }).then((qrCodeUrl) => ({ id, qrCodeUrl }));
        })
      );
      setBulkLabels(labels);
    } catch (error) {
      console.error("Falha ao gerar QR Codes em lote:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (!bulkLabels.length) return;
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack} className="cursor-pointer">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
              <img src={logoImage} alt="Sisov Logo" className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="text-sm font-medium text-slate-500">Escritório do Produtor</p>
                <h1 className="text-lg font-semibold text-slate-900">QR Code em Lote</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">Produtor Silva</div>
                  <div className="text-xs text-slate-500">Administrador</div>
                </div>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <ChevronDown className="h-4 w-4 text-slate-600" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout} className="text-slate-600 hover:text-rose-600">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 print:hidden"
        >
          <Card className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-100">Impressão otimizada</p>
                  <p className="text-lg font-semibold">Grade de etiquetas padrão Pimaco</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-100">Rastreabilidade em massa</p>
                  <p className="text-lg font-semibold">Sem brinco & geração rápida</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-6 xl:grid-cols-[1.6fr_1fr]"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Configuração em Lote</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Animais sem brinco</p>
                    <p className="text-sm text-slate-500">Use este painel para gerar imediatamente etiquetas para o rebanho sem brinco.</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <Input
                      type="number"
                      min={1}
                      max={24}
                      value={bulkQuantity}
                      onChange={(event) => setBulkQuantity(Number(event.target.value))}
                      className="w-28"
                    />
                    <Badge className="bg-slate-100 text-slate-900">Máx 24</Badge>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white hover:bg-teal-700"
                    onClick={generateBulkQRCodes}
                    disabled={isGenerating || bulkQuantity < 1}
                  >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Gerar QR Codes
                  </Button>
                  <Button
                    variant="outline"
                    className="inline-flex items-center justify-center gap-2 border-slate-300 text-slate-900 hover:bg-slate-100"
                    onClick={handlePrint}
                    disabled={bulkLabels.length === 0}
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir etiquetas
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">Visão geral</h3>
                    <p className="mt-2 text-sm text-slate-600">Cores e dimensões foram ajustadas para impressão com qualidade em folhas de etiquetas e selos.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">Rastreamento ativo</h3>
                    <p className="mt-2 text-sm text-slate-600">Cada QR Code conecta ao painel público de rastreabilidade do SISOV.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hidden xl:block">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Animais sugeridos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Sem brinco</p>
                <p className="mt-2 text-sm text-slate-600">Você tem {availableAnimals.length} animais cadastrados sem brinco no sistema.</p>
              </div>
              {availableAnimals.slice(0, 3).map((animal) => (
                <div key={animal.id} className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">{animal.name}</p>
                  <p className="text-xs text-slate-500">{animal.race} • {animal.weight}</p>
                  <p className="mt-2 text-xs text-slate-500">Origem: {animal.location}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {bulkLabels.length > 0 && (
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <div className="flex flex-col gap-3 justify-between md:flex-row md:items-center print:hidden">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Visualização de impressão</h2>
                <p className="mt-1 text-sm text-slate-500">{bulkLabels.length} etiquetas prontas para exportação ou impressão.</p>
              </div>
              <Button
                className="inline-flex items-center gap-2 bg-teal-600 text-white hover:bg-teal-700"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Abrir impressão
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-2 print:p-0">
              {bulkLabels.map((label) => (
                <div
                  key={label.id}
                  className="print-label rounded-[18px] border border-slate-200 bg-white p-5 text-slate-950 shadow-sm print:border-slate-300 print:shadow-none"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Etiqueta</p>
                      <p className="text-sm font-semibold text-slate-900">{label.id}</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-900">IG Tauá</Badge>
                  </div>
                  <div className="flex justify-center rounded-3xl bg-slate-100 p-5 mb-4">
                    <img src={label.qrCodeUrl} alt={`QR ${label.id}`} className="h-40 w-40 object-contain" />
                  </div>
                  <div className="space-y-2 text-[11px] leading-5 text-slate-600">
                    <p><span className="font-semibold text-slate-900">Origem:</span> Fazenda Inhamuns</p>
                    <p><span className="font-semibold text-slate-900">Produto:</span> Manta de Carneiro</p>
                    <p><span className="font-semibold text-slate-900">Rastreamento:</span> sisov.com.br/rastreamento/{label.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            print-color-adjust: exact;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print-label {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .print\\:grid {
            display: grid !important;
          }

          .print\\:p-0 {
            padding: 0 !important;
          }

          @page {
            size: A4 portrait;
            margin: 12mm;
          }
        }
      `}</style>
    </div>
  );
}
