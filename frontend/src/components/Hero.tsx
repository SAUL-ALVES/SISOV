import { Button } from "./ui/button";
import { QrCode, Shield, Users } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onStartClick: () => void;
}

export function Hero({ onStartClick }: HeroProps) {
  return (
    <section id="inicio" className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white overflow-hidden min-h-[600px] pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 min-h-[calc(600px-4rem)] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center space-x-2 text-teal-200"
              >
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Rastreabilidade Segura para Ovinos e Caprinos</span>
              </motion.div>
              
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
              >
                A força da produção está em <span className="text-teal-200">suas mãos!</span>
              </motion.h1>
              
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl text-teal-100 max-w-xl"
              >
                Rastreando a produção com responsabilidade e informação para todos. 
                Garanta a qualidade e procedência da carne com tecnologia de ponta.
              </motion.p>
            </div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="bg-white text-teal-700 hover:bg-gray-100 font-semibold cursor-pointer" onClick={onStartClick}>
                Começar Agora
              </Button>
              <Button size="lg" variant="outline" className="bg-[rgba(0,150,137,1)] text-white-700 hover:bg-white hover:text-teal-700 cursor-pointer">
                Saiba Mais
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-wrap gap-6 pt-8"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="flex items-center space-x-2"
              >
                <QrCode className="h-6 w-6 text-teal-300" />
                <div>
                  <div className="font-semibold">100%</div>
                  <div className="text-sm text-teal-200">Rastreável</div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="flex items-center space-x-2"
              >
                <Shield className="h-6 w-6 text-teal-300" />
                <div>
                  <div className="font-semibold">Seguro</div>
                  <div className="text-sm text-teal-200">Confiável</div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="flex items-center space-x-2"
              >
                <Users className="h-6 w-6 text-teal-300" />
                <div>
                  <div className="font-semibold">1000+</div>
                  <div className="text-sm text-teal-200">Produtores</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1675715240156-345cb296e42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGVlcCUyMGZhcm1lciUyMHBhc3RvcmFsJTIwZ3JlZW4lMjBmaWVsZHxlbnwxfHx8fDE3NTc2MzI3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Fazendeiro cuidando do rebanho de ovinos"
                className="w-full h-64 lg:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <motion.div 
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 max-w-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">QR Code Gerado</div>
                  <div className="text-sm text-gray-600">Rastreabilidade completa</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}