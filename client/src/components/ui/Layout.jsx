import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  useEffect(() => {
    const apply = () => {
      document.documentElement.style.zoom = String(window.innerWidth / 1440);
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />

      <main className="w-full flex-1 pt-navbar">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}