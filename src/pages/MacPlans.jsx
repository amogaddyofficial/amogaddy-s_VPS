import React from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Apple, Bell, ArrowRight, Monitor, Cpu, Terminal } from 'lucide-react';

const MacPlans = () => {
  return (
    <div className="space-y-12 py-6">
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="warning">Hardware Apple Silicon</Badge>
        <h1 className="text-5xl font-extrabold tracking-tighter italic">La Macchina dell'Hype</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Stiamo allestendo un cluster di Mac mini M2/M3 per offrirti la potenza di macOS via SSH e Desktop Remoto.
          Validazione di mercato in corso.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[
          {
            name: '🍏 Mac Home',
            price: '2,00€/mese',
            desc: 'Pool condiviso con interfaccia macOS visiva e guidata dal browser.',
            features: ['Apple Silicon Shared', 'macOS con GUI (Browser)', 'CPU 30% max', 'RAM condivisa minima', 'Porte web base sbloccate', 'SSH disattivato', 'Spazio limitato (come Free)', 'Quota fissa attiva solo al lancio']
          },
          {
            name: '🍏 Mac Dev',
            price: '3,00€/mese',
            desc: 'Accesso SSH e grafico per build Xcode e sviluppo nativo Apple.',
            features: ['Apple Silicon Shared', 'macOS Headless (CLI)', 'CPU 30% max', 'RAM condivisa minima', 'SSH IP:Porta dedicato', 'Porte sviluppo iOS sbloccate', 'Xcode CLI · Homebrew · Flutter · CocoaPods', 'Quota fissa attiva solo al lancio hardware']
          }
        ].map((plan, i) => (
          <Card key={i} className="p-8 border border-white/5 opacity-50 relative overflow-hidden group grayscale hover:grayscale-0 transition-all duration-700">
            <div className="absolute top-4 right-4">
              <Badge variant="info">PREVISTO / IN ARRIVO</Badge>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white">
                <Apple size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold italic">{plan.name}</h3>
                <div className="text-sm font-bold text-jupiter-500 uppercase tracking-widest">{plan.price}</div>
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-8 leading-relaxed italic">{plan.desc}</p>

            <ul className="space-y-4 mb-10">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-xs text-gray-600">
                   <div className="w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
                   {f}
                </li>
              ))}
            </ul>

            <div className="h-px bg-white/5 mb-8"></div>
            <div className="text-center text-[10px] font-bold text-gray-700 uppercase tracking-[0.3em]">Hardware in allestimento</div>
          </Card>
        ))}
      </div>

      <Card className="max-w-xl mx-auto p-12 border-jupiter-500/20 bg-jupiter-500/[0.02] shadow-2xl">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-jupiter-500/10 rounded-full flex items-center justify-center text-jupiter-500 mx-auto mb-6">
            <Bell size={32} className="animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold italic">Riserva il tuo posto nel pool condiviso</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            I nodi sono limitati. Entra nella lista d'attesa per essere il primo a ricevere le credenziali SSH non appena le macchine saranno accese.
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Inserisci la tua email migliore..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-jupiter-500/50 transition-all text-center font-medium"
            />
            <Button className="w-full py-4 text-lg font-bold flex items-center justify-center gap-2 group">
              Entra nella Lista d'Attesa (Gratis) <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="pt-4">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              Sei il numero <span className="text-jupiter-500">#142</span> in lista
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto opacity-30">
          {[
            { icon: Monitor, label: "M2 Ultra Cluster" },
            { icon: Cpu, label: "Virtualizzazione Hypervisor" },
            { icon: Terminal, label: "Native Xcode Support" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <item.icon size={24} className="text-gray-500" />
              <span className="text-[10px] uppercase font-black tracking-tighter text-gray-600">{item.label}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MacPlans;
