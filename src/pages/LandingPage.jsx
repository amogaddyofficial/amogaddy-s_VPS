import React from 'react';
import { Button, Card } from '../components/UI';
import { Box, Server, Apple, ArrowRight, Check } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
  const plans = [
    { name: '⏳ FREE', price: '0,00€', features: ['Google Cloud Sandbox', 'XFCE Desktop', 'CPU 30% max', 'Uptime 24/7', 'Web RDP/VNC'], color: 'border-white/10' },
    { name: '🚀 FREE ADVANCED', price: '0,00€', features: ['Google Cloud', 'XFCE Desktop', 'CPU 60% max', 'Max 2 ore/giorno', 'MySQL / MariaDB'], color: 'border-white/10' },
    { name: '👑 HOME', price: '1,50€/mese', features: ['Scaleway', 'XFCE Desktop', 'CPU 100%', 'SSH dedicato', 'Tutte le porte sbloccate', 'MySQL · PostgreSQL · Redis'], color: 'border-jupiter-500/50 jupiter-glow' },
    { name: '📦 PAAS', price: 'Wallet a consumo', features: ['Scaleway', 'Headless (No GUI)', 'CPU 100%', 'Docker · Node · Python · Go', 'Sleep mode automatico'], color: 'border-blue-500/30' },
    { name: '🍏 MAC HOME', price: '2,00€/mese', features: ['Apple Silicon Shared', 'macOS con GUI Browser', 'CPU 30%', 'SSH disattivato', '⚠️ PREVISTO IN ARRIVO'], color: 'border-purple-500/20' },
    { name: '🍏 MAC DEV', price: '3,00€/mese', features: ['Apple Silicon Shared', 'macOS Headless', 'Xcode CLI · Homebrew', 'SSH dedicato', '⚠️ PREVISTO IN ARRIVO'], color: 'border-purple-500/20' },
  ];

  return (
    <div className="min-h-screen bg-space-950 text-white selection:bg-jupiter-500/30">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-space-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="text-jupiter-500" size={32} />
            <span className="text-2xl font-bold tracking-tighter">amogaddy's VPS</span>
          </div>
          <Button onClick={onEnter} className="px-8">Inizia Gratis</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-jupiter-500/10 blur-[120px] rounded-full -z-10"></div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8">
          L'ecosistema Cloud definitivo per <br />
          <span className="text-jupiter-500">Sviluppatori e Principianti</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
          Ospita qualsiasi applicazione gratis o lancia VPS dedicate a consumo senza costi fissi.
          Potenza pura, semplicità assoluta.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Button onClick={onEnter} className="px-10 py-4 text-lg rounded-2xl flex items-center gap-2">
            Inizia Gratis <ArrowRight size={20} />
          </Button>
          <a href="#plans" className="text-gray-400 hover:text-white transition-colors text-lg font-medium">
            Scopri i Piani VPS
          </a>
        </div>
      </header>

      {/* Plans Grid */}
      <section id="plans" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">La Nostra Flotta</h2>
          <p className="text-gray-400">Dai bot gratuiti ai server professionali ad alte prestazioni.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card key={i} className={`p-8 hover:bg-white/[0.05] transition-all border ${plan.color}`}>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-jupiter-400 mb-6">{plan.price}</div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-400 text-sm">
                    <Check size={16} className="text-jupiter-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full py-3" onClick={onEnter}>Configura</Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Box className="text-jupiter-500" size={24} />
              <span className="text-xl font-bold tracking-tighter">amogaddy's VPS</span>
            </div>
            <p className="text-sm text-gray-500">amogaddy's VPS & Tema Giove. © 2024</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-500">Legale</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-jupiter-400 transition-colors">Termini di Servizio</a></li>
              <li><a href="#" className="hover:text-jupiter-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-jupiter-400 transition-colors">Politica No-Refund</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-500">Risorse</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-jupiter-400 transition-colors">Documentazione</a></li>
              <li><a href="#" className="hover:text-jupiter-400 transition-colors">Wiki</a></li>
              <li><a href="#" className="hover:text-jupiter-400 transition-colors">Supporto</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
