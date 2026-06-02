import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header onLoginClick={() => {}} />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
