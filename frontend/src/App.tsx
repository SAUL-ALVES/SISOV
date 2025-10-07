import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { HowItWorks } from "./components/HowItWorks";
import { Footer } from "./components/Footer";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { FlockManagement } from "./components/FlockManagement";
import { AnimalPanel } from "./components/AnimalPanel";
import { QRCodeGeneration } from "./components/QRCodeGeneration";

type Page = "landing" | "login" | "dashboard" | "flock" | "animal-panel" | "qr-code";

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

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const navigateToLogin = () => setCurrentPage("login");
  const navigateToDashboard = () => setCurrentPage("dashboard");
  const navigateToLanding = () => setCurrentPage("landing");
  const navigateToFlock = () => setCurrentPage("flock");
  const navigateToQRCode = () => setCurrentPage("qr-code");
  const navigateToAnimalPanel = (animal: Animal, viewOnly: boolean = false) => {
    setSelectedAnimal(animal);
    setIsViewMode(viewOnly);
    setCurrentPage("animal-panel");
  };

  if (currentPage === "login") {
    return <Login onLogin={navigateToDashboard} onBack={navigateToLanding} />;
  }

  if (currentPage === "dashboard") {
    return <Dashboard onLogout={navigateToLanding} onFlockClick={navigateToFlock} onQRCodeClick={navigateToQRCode} />;
  }

  if (currentPage === "flock") {
    return <FlockManagement onBack={navigateToDashboard} onLogout={navigateToLanding} onAnimalClick={navigateToAnimalPanel} />;
  }

  if (currentPage === "animal-panel" && selectedAnimal) {
    return <AnimalPanel animal={selectedAnimal} onBack={navigateToFlock} onLogout={navigateToLanding} viewOnly={isViewMode} />;
  }

  if (currentPage === "qr-code") {
    return <QRCodeGeneration onBack={navigateToDashboard} onLogout={navigateToLanding} />;
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header onLoginClick={navigateToLogin} />
      <main>
        <Hero onStartClick={navigateToLogin} />
        <About />
        <HowItWorks onAccessClick={navigateToLogin} />
      </main>
      <Footer onStartClick={navigateToLogin} />
    </div>
  );
}