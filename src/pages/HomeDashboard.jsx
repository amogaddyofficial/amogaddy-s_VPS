import React from 'react';
import { Card, Button } from '../components/UI';
import { Box, Server, Sparkles, ArrowRight, Zap } from 'lucide-react';

const HomeDashboard = ({ onNavigate }) => {
  return (
    <div className="space-y-12 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Benvenuto su amogaddy's VPS</h1>
          <p className="text-gray-400 text-lg">Da dove vogliamo iniziare oggi?</p>
        </div>
        <div className="bg-jupiter-500/10 border border-jupiter-500/20 px-4 py-2 rounded-full flex items-center gap-2">
          <Sparkles className="text-jupiter-500" size={18} />
          <span className="text-sm font-bold text-jupiter-400 uppercase tracking-wider">Dashboard Giorno Zero</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card Sinistra - App Hosting */}
        <Card className="p-8 border border-white/5 hover:border-jupiter-500/30 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Box size={160} />
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-jupiter-500/10 rounded-2xl flex items-center justify-center text-jupiter-500 mb-6">
              <Box size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-3 italic">🤖 App & Bot Hosting Gratuito</h2>
            <h3 className="text-lg text-jupiter-400 font-medium mb-4">Ospita un bot Discord, Telegram o una micro-API in un clic.</h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              Sostenuto da brevi annunci pubblicitari, 100% gratis per sempre, gestione file inclusa.
              Perfetto per testare le tue idee senza costi.
            </p>
            <Button
              onClick={() => onNavigate('app-hosting')}
              className="w-full py-4 text-lg font-bold flex items-center justify-center gap-2"
            >
              Crea la tua prima App Gratis <ArrowRight size={20} />
            </Button>
          </div>
        </Card>

        {/* Card Destra - VPS Linux */}
        <Card className="p-8 border border-white/5 hover:border-jupiter-500/30 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-purple-500">
            <Server size={160} />
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
              <Server size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-3 italic">🛰️ Configura Istanza VPS Dedicata</h2>
            <h3 className="text-lg text-purple-400 font-medium mb-4">Server Linux ad alte prestazioni con grafica XFCE o Headless.</h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              Piani a partire da 1,50€/mese o 100% a consumo (PaaS al secondo) tramite Wallet.
              Massima libertà e risorse dedicate.
            </p>
            <Button
              onClick={() => onNavigate('vps')}
              className="w-full py-4 text-lg font-bold flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 jupiter-glow shadow-purple-500/20"
            >
              Configura una VPS <Zap size={20} />
            </Button>
          </div>
        </Card>
      </div>

      {/* Sezione Quick Stats / Wiki Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-4 bg-white/2">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
            <Zap size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nodi Attivi</div>
            <div className="text-xl font-bold">124 Scaleway</div>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 bg-white/2">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
            <Box size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Apps Online</div>
            <div className="text-xl font-bold">8.421 Free</div>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 bg-white/2">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 text-green-400">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Uptime Rete</div>
            <div className="text-xl font-bold">99.98%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
