import React, { useState } from 'react';
import {
  LayoutDashboard, Server, Wallet, LogOut,
  Box, Apple, BookOpen, ChevronRight, Menu, X
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout, walletBalance = "0,00" }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'home', icon: LayoutDashboard, label: 'Home Dashboard' },
    { id: 'app-hosting', icon: Box, label: 'App Hosting' },
    { id: 'vps', icon: Server, label: 'VPS Linux' },
    { id: 'mac', icon: Apple, label: 'Piani Mac', badge: 'In Arrivo' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'wiki', icon: BookOpen, label: 'Documentazione' },
  ];

  const handleTab = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 flex items-center justify-between gap-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 jupiter-gradient rounded-xl flex items-center justify-center jupiter-glow shrink-0">
            <Box className="text-white" size={20} />
          </div>
          <span className="text-lg font-bold tracking-tight">amogaddy's VPS</span>
        </div>
        <button onClick={() => setMobileOpen(false)} className="md:hidden text-gray-500 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-jupiter-500/10 text-jupiter-400 border border-jupiter-500/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
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

      <div className="mx-3 mb-3 p-4 rounded-2xl bg-white/5 border border-white/5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 font-medium">Saldo Wallet</span>
          <Wallet size={14} className="text-jupiter-500" />
        </div>
        <div className="text-xl font-bold mb-3">{walletBalance}€</div>
        <button
          onClick={() => handleTab('wallet')}
          className="w-full py-2 bg-jupiter-500/10 text-jupiter-400 text-sm font-bold rounded-lg border border-jupiter-500/20 hover:bg-jupiter-500/20 transition-all uppercase tracking-wider"
        >
          Ricarica
        </button>
      </div>

      <div className="p-3 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-space-950 border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 jupiter-gradient rounded-lg flex items-center justify-center shrink-0">
            <Box className="text-white" size={14} />
          </div>
          <span className="font-bold text-sm">amogaddy's VPS</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-space-950 border-r border-white/5 flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-60 lg:w-64 h-screen bg-space-950 border-r border-white/5 flex-col sticky top-0 shrink-0">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
