import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoImage from "../assets/logo-frontend.png";

interface HeaderProps {
  onLoginClick: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerHeight = 64; // altura do header (h-16 = 64px)
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Fechar menu mobile após clicar
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src={logoImage} 
              alt="Sisov Logo" 
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="text-xl font-semibold text-gray-900">SISOV</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#inicio" 
              onClick={(e) => handleSmoothScroll(e, 'inicio')}
              className="text-gray-700 hover:text-teal-600 transition-colors cursor-pointer"
            >
              Início
            </a>
            <a 
              href="#sobre" 
              onClick={(e) => handleSmoothScroll(e, 'sobre')}
              className="text-gray-700 hover:text-teal-600 transition-colors cursor-pointer"
            >
              Sobre
            </a>
            <a 
              href="#como-funciona" 
              onClick={(e) => handleSmoothScroll(e, 'como-funciona')}
              className="text-gray-700 hover:text-teal-600 transition-colors cursor-pointer"
            >
              Como Funciona
            </a>
            <a 
              href="#contato" 
              onClick={(e) => handleSmoothScroll(e, 'contato')}
              className="text-gray-700 hover:text-teal-600 transition-colors cursor-pointer"
            >
              Contato
            </a>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 cursor-pointer" onClick={onLoginClick}>
              Entrar
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">
              Cadastrar
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 cursor-pointer"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 md:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col space-y-4">
                <a 
                  href="#inicio" 
                  onClick={(e) => handleSmoothScroll(e, 'inicio')}
                  className="text-gray-700 hover:text-teal-600 transition-colors cursor-pointer"
                >
                  Início
                </a>
                <a 
                  href="#sobre" 
                  onClick={(e) => handleSmoothScroll(e, 'sobre')}
                  className="text-gray-700 hover:text-teal-600 transition-colors cursor-pointer"
                >
                  Sobre
                </a>
                <a 
                  href="#como-funciona" 
                  onClick={(e) => handleSmoothScroll(e, 'como-funciona')}
                  className="text-gray-700 hover:text-teal-600 transition-colors cursor-pointer"
                >
                  Como Funciona
                </a>
                <a 
                  href="#contato" 
                  onClick={(e) => handleSmoothScroll(e, 'contato')}
                  className="text-gray-700 hover:text-teal-600 transition-colors cursor-pointer"
                >
                  Contato
                </a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Button variant="ghost" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 justify-start cursor-pointer" onClick={onLoginClick}>
                    Entrar
                  </Button>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white justify-start cursor-pointer">
                    Cadastrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}