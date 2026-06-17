import React from 'react';
import { LayoutDashboard, Server, CreditCard, Settings, LogOut, Box } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'vps', icon: Server, label: 'Istanze VPS' },
    { id: 'plans', icon: CreditCard, label: 'Piani Cloud' },
    { id: 'settings', icon: Settings, label: 'Impostazioni' },
  ];

  return (
    <div className="w-64 h-screen bg-space-950 border-r border-white/5 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 jupiter-gradient rounded-xl flex items-center justify-center jupiter-glow">
          <Box className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight">CloudBox</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-jupiter-500/10 text-jupiter-400 border border-jupiter-500/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

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
