import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white text-center py-4 text-sm mt-auto">
        <p>© 2026 MyStore. All rights reserved.</p>
      </footer>
    </div>
  );
}