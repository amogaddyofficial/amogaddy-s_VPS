import React from 'react';
import { Button, Card } from '../components/UI';
import { Box, Server, Apple, ArrowRight, Check, Bot, Clock, Archive, Zap } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
  const plans = [
    { name: '🍏 MAC HOME', price: '2,00€/mese', features: ['Apple Silicon Shared', 'macOS con GUI Browser', 'CPU 30%', 'SSH disattivato', '⚠️ PREVISTO IN ARRIVO'], color: 'border-purple-500/50', badge: 'In Arrivo' },
    { name: '🍏 MAC DEV', price: '3,00€/mese', features: ['Apple Silicon Shared', 'macOS Headless', 'Xcode CLI · Homebrew', 'SSH dedicato', '⚠️ PREVISTO IN ARRIVO'], color: 'border-purple-500/50', badge: 'In Arrivo' },
    { name: '👑 HOME', price: '1,50€/mese', features: ['Scaleway', 'XFCE Desktop', 'CPU 100%', 'SSH dedicato', 'Tutte le porte sbloccate', 'MySQL · PostgreSQL · Redis'], color: 'border-jupiter-500/50 jupiter-glow' },
    { name: '📦 PAAS', price: 'Wallet a consumo', features: ['Scaleway', 'Headless (No GUI)', 'CPU 100%', 'Docker · Node · Python · Go', 'Sleep mode automatico'], color: 'border-blue-500/30' },
    { name: '⏳ FREE', price: '0,00€', features: ['Google Cloud Sandbox', 'XFCE Desktop', 'CPU 30% max', 'Uptime 24/7', 'Web RDP/VNC'], color: 'border-white/10' },
    { name: '🚀 FREE ADVANCED', price: '0,00€', features: ['Google Cloud', 'XFCE Desktop', 'CPU 60% max', 'Max 2 ore/giorno', 'MySQL / MariaDB'], color: 'border-white/10' },
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

      {/* App Hosting Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <span className="text-xs font-black text-jupiter-500 uppercase tracking-[0.3em] mb-4 block">Piano Speciale</span>
          <h2 className="text-4xl font-bold mb-4">🤖 App & Bot Hosting Gratuito</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Ospita bot Discord, Telegram o micro-API gratis per sempre. Sostenuto da brevi annunci pubblicitari.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Card features */}
          <Card className="p-8 border-jupiter-500/20 bg-jupiter-500/[0.02]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 jupiter-gradient rounded-xl flex items-center justify-center jupiter-glow shrink-0">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">App Hosting</h3>
                <div className="text-3xl font-black text-jupiter-400">Gratis</div>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {['Python · Node.js · Go · HTML Statico', 'CPU Shared (10% max)', 'RAM 128–256 MB', 'Disco 100 MB', 'File Manager + Git integrato', 'Sostenuto da annunci pubblicitari'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                  <Check size={16} className="text-jupiter-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button className="w-full py-3" onClick={onEnter}>Crea la tua prima App Gratis</Button>
          </Card>

          {/* Lifecycle visual */}
          <div className="space-y-4">
            <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Ciclo di vita dell'app</p>

            {/* Step 1 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-green-500/5 border border-green-500/20">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <div className="font-bold text-green-400 text-sm mb-1">🟢 App Online</div>
                <p className="text-xs text-gray-500 leading-relaxed">La tua app è attiva e raggiungibile. Il File Manager è disponibile per modifiche in tempo reale.</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-3 pl-5">
              <div className="w-px h-6 bg-white/10 ml-4"></div>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Reset automatico ogni 24 ore alle 12:00 ora italiana</span>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400 shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <div className="font-bold text-yellow-400 text-sm mb-1">⏰ Finestra di Rinnovo (12:00 IT)</div>
                <p className="text-xs text-gray-500 leading-relaxed">Ogni giorno a mezzogiorno italiano l'app viene riciclata e rilanciata automaticamente. Nessuna azione richiesta.</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-3 pl-5">
              <div className="w-px h-6 bg-white/10 ml-4"></div>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Se l'app rimane inattiva per 3 giorni consecutivi</span>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-500/5 border border-red-500/20">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 shrink-0">
                <Archive size={20} />
              </div>
              <div>
                <div className="font-bold text-red-400 text-sm mb-1">📦 Caveau di Emergenza</div>
                <p className="text-xs text-gray-500 leading-relaxed">I tuoi file vengono congelati in sicurezza nel Git archive. Per riattivare basta guardare un video sponsorizzato di 10 secondi — zero costi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section id="plans" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">La Nostra Flotta</h2>
          <p className="text-gray-400">Dai bot gratuiti ai server professionali ad alte prestazioni.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card key={i} className={`p-8 hover:bg-white/[0.05] transition-all border relative ${plan.color}`}>
              {plan.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className={`text-3xl font-bold mb-6 ${plan.badge ? 'text-purple-400' : 'text-jupiter-400'}`}>{plan.price}</div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-400 text-sm">
                    <Check size={16} className={`shrink-0 ${plan.badge ? 'text-purple-500' : 'text-jupiter-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full py-3" onClick={onEnter}>{plan.badge ? 'Entra in Lista d\'Attesa' : 'Configura'}</Button>
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
