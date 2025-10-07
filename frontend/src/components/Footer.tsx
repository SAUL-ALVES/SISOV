import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import logoImage from "../assets/logo-frontend.png";

interface FooterProps {
  onStartClick: () => void;
}

export function Footer({ onStartClick }: FooterProps) {
  return (
    <footer id="contato" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <AnimatedSection delay={0.2} direction="up" className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src={logoImage} 
                alt="Sisov Logo" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-xl font-semibold">SISOV</span>
            </div>
            <p className="text-gray-300 max-w-md">
              Sistema de Rastreabilidade para Ovinos e Caprinos - Garantindo qualidade, 
              transparência e confiança na cadeia produtiva da carne ovina e caprina.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" className="border-gray-600 text-[rgba(233,233,240,1)] hover:bg-gray-800 bg-[rgba(0,150,137,1)] cursor-pointer" onClick={onStartClick}>
                Começar Agora
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </AnimatedSection>

          {/* Quick Links */}
          <AnimatedSection delay={0.4} direction="up" className="space-y-4">
            <h3 className="font-semibold text-lg">Links Rápidos</h3>
            <div className="space-y-2">
              <a href="#inicio" className="block text-gray-300 hover:text-teal-400 transition-colors">
                Início
              </a>
              <a href="#sobre" className="block text-gray-300 hover:text-teal-400 transition-colors">
                Sobre o SISOV
              </a>
              <a href="#como-funciona" className="block text-gray-300 hover:text-teal-400 transition-colors">
                Como Funciona
              </a>
              <a href="#contato" className="block text-gray-300 hover:text-teal-400 transition-colors">
                Contato
              </a>
            </div>
          </AnimatedSection>

          {/* Contact Info */}
          <AnimatedSection delay={0.6} direction="up" className="space-y-4">
            <h3 className="font-semibold text-lg">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-5 w-5 text-teal-400" />
                <span>sisov.startup@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-5 w-5 text-teal-400" />
                <span>+55 (88) 996012807</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="h-5 w-5 text-teal-400" />
                <span>Ceará, Brasil</span>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <Separator className="bg-gray-700 mb-8" />

        {/* Bottom Section */}
        <AnimatedSection delay={0.8} direction="fade">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 SISOV. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}