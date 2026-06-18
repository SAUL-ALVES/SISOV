import { Header } from '../../../components/Header';
import { Hero } from '../../../components/Hero';
import { About } from '../../../components/About';
import { HowItWorks } from '../../../components/HowItWorks';
import { Footer } from '../../../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/cadastro');
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      <main className="pt-16">
        <Hero onStartClick={handleLoginClick} />
        <About />
        <HowItWorks onAccessClick={handleLoginClick} />
      </main>
      <Footer onStartClick={handleLoginClick} />
    </div>
  );
}
