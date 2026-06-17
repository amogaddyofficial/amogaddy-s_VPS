import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import HomeDashboard from './pages/HomeDashboard';
import AppHosting from './pages/AppHosting';
import VPSLinux from './pages/VPSLinux';
import MacPlans from './pages/MacPlans';
import WalletPage from './pages/WalletPage';
import Wiki from './pages/Wiki';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding && !isLoggedIn) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  if (!isLoggedIn) {
    return <AuthPage onLogin={() => setIsLoggedIn(true)} onBack={() => setShowLanding(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeDashboard onNavigate={setActiveTab} />;
      case 'app-hosting': return <AppHosting />;
      case 'vps': return <VPSLinux />;
      case 'mac': return <MacPlans />;
      case 'wallet': return <WalletPage />;
      case 'wiki': return <Wiki />;
      default: return <HomeDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-space-950 text-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => {
          setIsLoggedIn(false);
          setShowLanding(true);
        }}
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
