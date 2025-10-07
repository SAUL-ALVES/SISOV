import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Users, 
  Heart, 
  FileText, 
  Utensils, 
  MapPin, 
  QrCode,
  Smartphone,
  CheckCircle
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

interface HowItWorksProps {
  onAccessClick: () => void;
}

export function HowItWorks({ onAccessClick }: HowItWorksProps) {
  const features = [
    {
      icon: Users,
      title: "Identificação dos animais",
      description: "Registro completo e identificação única de cada animal do rebanho"
    },
    {
      icon: Heart,
      title: "Histórico de saúde e manejo",
      description: "Acompanhamento detalhado da saúde, vacinação e cuidados veterinários"
    },
    {
      icon: FileText,
      title: "Documentação legal e compliance",
      description: "Conformidade com regulamentações e documentação necessária"
    },
    {
      icon: Utensils,
      title: "Informações de alimentação e suplementação",
      description: "Controle da dieta, ração e suplementos fornecidos aos animais"
    },
    {
      icon: MapPin,
      title: "Movimentação dos animais",
      description: "Rastreamento de localização e transporte do rebanho"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Registro do Animal",
      description: "Cada animal é registrado no sistema com informações completas"
    },
    {
      step: "2",
      title: "Acompanhamento",
      description: "Todo o ciclo de vida é monitorado e documentado"
    },
    {
      step: "3",
      title: "Geração do QR Code",
      description: "Ao abater, é gerado um QR Code único para o produto"
    },
    {
      step: "4",
      title: "Rastreabilidade",
      description: "O consumidor acessa todo o histórico via QR Code"
    }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* How it works intro */}
        <AnimatedSection className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-100">
            Como Funciona
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Sistema Intuitivo de Rastreabilidade
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Através de um sistema intuitivo, o SISOV coleta e organiza dados essenciais relacionados aos rebanhos
          </p>
        </AnimatedSection>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <AnimatedSection 
              key={index} 
              delay={index * 0.1}
              direction="up"
            >
              <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-teal-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        {/* Process Section */}
        <AnimatedSection delay={0.2}>
          <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Do Rebanho ao Consumidor
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Acompanhe o processo completo de rastreabilidade, desde o nascimento do animal até o produto final
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {process.map((item, index) => (
                <AnimatedSection 
                  key={index} 
                  delay={0.4 + (index * 0.2)}
                  direction="up"
                  className="text-center"
                >
                  <div className="relative mb-4">
                    <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-xl">
                      {item.step}
                    </div>
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-teal-200 -translate-y-0.5"></div>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </AnimatedSection>
              ))}
            </div>

            {/* QR Code Demo */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <AnimatedSection delay={1.4} direction="left">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <QrCode className="h-6 w-6 text-teal-600" />
                    <h4 className="text-xl font-semibold text-gray-900">
                      Experiência do Consumidor
                    </h4>
                  </div>
                  <p className="text-gray-600">
                    Ao escanear o QR Code na embalagem, o consumidor tem acesso instantâneo a um relatório 
                    completo do ciclo de vida do animal, incluindo origem, alimentação, cuidados veterinários 
                    e certificações de qualidade.
                  </p>
                  <div className="space-y-3">
                    <AnimatedSection delay={1.8} direction="left">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-teal-600" />
                        <span className="text-gray-700">Histórico completo do animal</span>
                      </div>
                    </AnimatedSection>
                    <AnimatedSection delay={2.0} direction="left">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-teal-600" />
                        <span className="text-gray-700">Certificações de qualidade</span>
                      </div>
                    </AnimatedSection>
                    <AnimatedSection delay={2.2} direction="left">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-teal-600" />
                        <span className="text-gray-700">Informações sobre origem e manejo</span>
                      </div>
                    </AnimatedSection>
                    <AnimatedSection delay={2.4} direction="left">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-teal-600" />
                        <span className="text-gray-700">Transparência total na produção</span>
                      </div>
                    </AnimatedSection>
                  </div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={1.6} direction="right">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1706759755767-526cdaa02109?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxRUiUyMGNvZGUlMjBwaG9uZSUyMHNjcmVlbnxlbnwxfHx8fDE3NTc2MzM0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="QR Code na tela do smartphone"
                    className="rounded-xl shadow-lg w-full h-80 object-cover"
                  />
                  <AnimatedSection delay={2.0} direction="fade" className="absolute top-4 right-4">
                    <div className="bg-white rounded-lg shadow-lg p-3">
                      <Smartphone className="h-6 w-6 text-teal-600" />
                    </div>
                  </AnimatedSection>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="text-center mt-16" delay={0.4}>
          <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer" onClick={onAccessClick}>
            Acessar o Sistema
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}