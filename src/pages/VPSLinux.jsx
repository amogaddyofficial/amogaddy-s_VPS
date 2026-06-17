import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Server, Zap, Globe, Cpu, HardDrive, Terminal, Shield, RefreshCw, X } from 'lucide-react';

const VPSLinux = () => {
  const [showProrata, setShowProrata] = useState(false);

  const plans = [
    {
      id: 'free',
      name: '⏳ FREE',
      price: '0,00€',
      subtitle: 'Sempre Gratis',
      provider: 'Google Cloud Sandbox',
      features: ['XFCE Desktop leggero', 'CPU 30% max', 'RAM condivisa minima', 'Uptime 24/7', 'Web RDP/VNC', 'Porte base sbloccate', 'DuckDNS Wildcard', 'Linux Ubuntu'],
      color: 'border-white/10'
    },
    {
      id: 'free-adv',
      name: '🚀 FREE ADVANCED',
      price: '0,00€',
      subtitle: 'Sbloccabile',
      provider: 'Google Cloud',
      features: ['XFCE Desktop leggero', 'CPU 60% max', 'RAM condivisa ottimizzata', 'Max 2 ore al giorno', 'Web RDP/VNC', 'Porte sviluppo sbloccate', 'MySQL / MariaDB', 'Linux Ubuntu'],
      color: 'border-jupiter-500/30'
    },
    {
      id: 'home',
      name: '👑 HOME',
      price: '1,50€/mese',
      subtitle: 'Quota fissa mensile',
      provider: 'Scaleway',
      features: ['XFCE Desktop', 'CPU 100% dedicata', 'RAM dedicata e garantita', 'Uptime 24/7', 'SSH IP:Porta dedicato', 'Tutte le porte sbloccate', 'MySQL · MariaDB · PostgreSQL · Redis', 'Ubuntu / Windows Desktop', 'DuckDNS + Domini propri'],
      color: 'border-jupiter-500 jupiter-glow'
    },
    {
      id: 'paas',
      name: '📦 PAAS',
      price: 'Wallet a consumo',
      subtitle: 'Ricarica minima PayPal 1€',
      provider: 'Scaleway',
      features: ['Headless (No GUI)', '⚡ CPU 100% dedicata', 'RAM dedicata e garantita', 'Attivo finché wallet positivo', 'SSH IP:Porta dedicato', '100% porte sbloccate', 'Qualsiasi SQL/NoSQL', 'Docker · Ubuntu · Windows · macOS', 'DuckDNS + Domini propri', 'Sleep Mode automatico a saldo zero'],
      color: 'border-blue-500/30'
    }
  ];

  return (
    <div className="space-y-12 py-6 relative">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight italic mb-2">La Matrice dei Piani - Tema Giove</h1>
          <p className="text-gray-400">Configura il tuo server Linux ideale su infrastruttura Tier 3.</p>
        </div>
        <Badge variant="warning">Pay-per-use attivo</Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`p-6 flex flex-col justify-between transition-all hover:scale-[1.02] border-2 ${plan.color}`}>
            <div>
              <div className="text-xs font-bold text-jupiter-500 mb-2 uppercase tracking-[0.2em]">{plan.provider}</div>
              <h2 className="text-xl font-bold mb-1 italic">{plan.name}</h2>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">{plan.subtitle}</div>
              <div className="text-2xl font-black mb-6">{plan.price}</div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-1 h-1 bg-jupiter-500 rounded-full"></div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className="w-full py-3 font-bold uppercase tracking-wider text-xs"
              variant={plan.id === 'home' ? 'primary' : 'secondary'}
              onClick={() => plan.id === 'free' ? setShowProrata(true) : null}
            >
              Seleziona Piano
            </Button>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <Card title="Perché scegliere amogaddy's VPS?" className="bg-white/2">
           <div className="space-y-6">
              {[
                { icon: Shield, title: "Isolamento Totale", desc: "Ogni VPS gira in una sandbox hardware isolata (KVM/Docker)." },
                { icon: Globe, title: "IP Pubblico", desc: "Disponibile su piani commerciali per hosting professionale." },
                { icon: Terminal, title: "Accesso SSH", desc: "Gestisci tutto via riga di comando o desktop remoto XFCE." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-jupiter-500">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
           </div>
        </Card>

        <div className="flex flex-col justify-center p-8 bg-jupiter-500/5 rounded-2xl border border-jupiter-500/10">
          <h3 className="text-2xl font-bold italic mb-4">Hai bisogno di più potenza?</h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            I nostri nodi Scaleway sono scalabili istantaneamente. Se il tuo progetto cresce, puoi passare al piano superiore senza perdere i dati.
          </p>
          <Button variant="secondary" className="w-fit px-8 py-3 flex items-center gap-2 group">
            Contatta il Reparto Ops <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          </Button>
        </div>
      </div>

      {/* Popup Prorata */}
      {showProrata && (
        <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
          <Card className="max-w-md w-full p-8 border-jupiter-500/50 shadow-2xl relative">
            <button onClick={() => setShowProrata(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X size={20} />
            </button>
            <div className="w-16 h-16 bg-jupiter-500/10 rounded-full flex items-center justify-center text-jupiter-500 mx-auto mb-6">
              <RefreshCw size={32} />
            </div>
            <h3 className="text-2xl font-bold text-center mb-2 italic">Calcolo Prorata</h3>
            <p className="text-gray-400 text-center text-sm mb-8 leading-relaxed">
              Stai effettuando un downgrade. Il sistema ha calcolato il rimborso per il tempo non utilizzato.
            </p>

            <div className="bg-white/5 rounded-xl p-4 space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Credito Residuo:</span>
                <span className="text-white font-mono">1.12€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Costo Nuovo Piano:</span>
                <span className="text-green-400 font-mono">0.00€</span>
              </div>
              <div className="h-px bg-white/5"></div>
              <div className="flex justify-between font-bold text-lg italic">
                <span className="text-jupiter-400">Accredito Wallet:</span>
                <span className="text-jupiter-400">+1.12€</span>
              </div>
            </div>

            <Button className="w-full py-4 font-bold" onClick={() => setShowProrata(false)}>
              Conferma e Ricevi Credito
            </Button>
            <p className="text-[10px] text-gray-600 text-center mt-4 uppercase tracking-widest font-bold">
              Transazione istantanea nel wallet interno
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VPSLinux;
