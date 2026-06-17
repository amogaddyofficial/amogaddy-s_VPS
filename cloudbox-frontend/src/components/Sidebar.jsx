import React from 'react';
import {
  LayoutDashboard,
  Server,
  Wallet,
  Settings,
  LogOut,
  Box,
  Apple,
  BookOpen,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout, walletBalance = "0,00" }) => {
  const menuItems = [
    { id: 'home', icon: LayoutDashboard, label: 'Home Dashboard' },
    { id: 'app-hosting', icon: Box, label: 'App Hosting' },
    { id: 'vps', icon: Server, label: 'VPS Linux' },
    { id: 'mac', icon: Apple, label: 'Piani Mac', badge: 'In Arrivo' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'wiki', icon: BookOpen, label: 'Documentazione' },
  ];

  return (
    <div className="w-64 h-screen bg-space-950 border-r border-white/5 flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 jupiter-gradient rounded-xl flex items-center justify-center jupiter-glow shrink-0">
          <Box className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight">CloudBox</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
              activeTab === item.id
                ? 'bg-jupiter-500/10 text-jupiter-400 border border-jupiter-500/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge ? (
              <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full uppercase font-bold">
                {item.badge}
              </span>
            ) : (
              activeTab === item.id && <ChevronRight size={14} />
            )}
          </button>
        ))}
      </nav>

      {/* Wallet Widget */}
      <div className="mx-4 mb-4 p-4 rounded-2xl bg-white/5 border border-white/5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 font-medium">Saldo Wallet</span>
          <Wallet size={14} className="text-jupiter-500" />
        </div>
        <div className="text-xl font-bold mb-3">{walletBalance}€</div>
        <button
          onClick={() => setActiveTab('wallet')}
          className="w-full py-2 bg-jupiter-500/10 text-jupiter-400 text-sm font-bold rounded-lg border border-jupiter-500/20 hover:bg-jupiter-500/20 transition-all uppercase tracking-wider"
        >
          Ricarica
        </button>
      </div>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
