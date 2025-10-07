import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Award, Zap } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

export function About() {
  return (
    <section id="sobre" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-100">
            Sobre o SISOV
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Sistema de Rastreabilidade para Ovinos e Caprinos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Uma plataforma dedicada ao rastreamento e à gestão de informações sobre a carne de ovinos e caprinos, 
            garantindo conformidade com as normas de Identidade Geográfica (IG) e proporcionando rastreabilidade completa e confiável.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <AnimatedSection direction="left" delay={0.2}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Por que o SISOV é importante?
              </h3>
              <p className="text-gray-600 text-lg">
                A rastreabilidade da carne de ovinos e caprinos é crucial para assegurar a qualidade e a segurança alimentar. 
                O SISOV permite que produtores e consumidores validem informações sobre a origem da carne, 
                aumentando a transparência e a confiança no produto.
              </p>
              <p className="text-gray-600 text-[18px]">
                Com isso, buscamos promover práticas sustentáveis e responsáveis na produção de carne, 
                fortalecendo a cadeia produtiva e garantindo a procedência dos alimentos.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <AnimatedSection delay={0.6} direction="up">
                  <Card className="text-center p-4">
                    <CardContent className="p-0">
                      <MapPin className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Origem</div>
                      <div className="text-sm text-gray-600">Comprovada</div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
                <AnimatedSection delay={0.8} direction="up">
                  <Card className="text-center p-4">
                    <CardContent className="p-0">
                      <Award className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Qualidade</div>
                      <div className="text-sm text-gray-600">Certificada</div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
                <AnimatedSection delay={1.0} direction="up">
                  <Card className="text-center p-4">
                    <CardContent className="p-0">
                      <Zap className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Processo</div>
                      <div className="text-sm text-gray-600">Transparente</div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.4}>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1751482820011-72231d1c6003?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGVlcCUyMGdyYXppbmclMjBncmVlbiUyMHBhc3R1cmV8ZW58MXx8fHwxNzU3NjMyODAxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Rebanho de ovinos pastando em campo verde"
                className="rounded-xl shadow-lg w-full h-96 object-cover"
              />
              <AnimatedSection delay={0.8} direction="fade" className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3">
                <div className="text-2xl font-bold text-teal-600">100%</div>
                <div className="text-xs text-gray-600">Rastreável</div>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>

        {/* Commitment Section */}
        <AnimatedSection delay={0.2}>
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nossos Compromissos
              </h3>
              <p className="text-gray-600 max-w-4xl mx-auto">
                Estamos comprometidos com a qualidade, a segurança e a responsabilidade na produção de carne de ovinos e caprinos. 
                O SISOV é uma ferramenta que visa não apenas facilitar a gestão dos rebanhos, mas também fomentar uma cultura de 
                transparência e confiança no setor pecuário.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
}