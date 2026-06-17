import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import VPSManagement from './pages/VPSManagement';
import Pricing from './pages/Pricing';
import { Box } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simuliamo lo stato loggato per ora

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-space-950 flex items-center justify-center p-4">
        <div className="glass-card p-8 w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 jupiter-gradient rounded-2xl flex items-center justify-center jupiter-glow mx-auto mb-4">
              <Box className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold">CloudBox</h1>
            <p className="text-gray-400">Accedi alla dashboard Tema Giove</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-jupiter-500/50 transition-all"
                placeholder="nome@azienda.it"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-jupiter-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsLoggedIn(true)}
              className="w-full jupiter-gradient py-3 rounded-lg font-bold jupiter-glow hover:opacity-90 transition-all mt-4"
            >
              Entra nel Sistema
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Non hai un account? <span className="text-jupiter-400 cursor-pointer hover:underline">Richiedi accesso</span>
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'vps': return <VPSManagement />;
      case 'plans': return <Pricing />;
      default: return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-space-950 text-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => setIsLoggedIn(false)}
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
