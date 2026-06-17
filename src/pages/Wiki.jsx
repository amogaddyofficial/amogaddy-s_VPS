import React from 'react';
import { Card, Button } from '../components/UI';
import { Book, ChevronRight, Search, Zap, Key, FileCode, Wallet } from 'lucide-react';

const Wiki = () => {
  const sections = [
    { title: "Inizio Rapido", items: ["Come trovare il Token del tuo Bot Discord", "Come configurare il Comando di Avvio", "Guida all'uso del File Manager"], icon: Zap },
    { title: "Gestione VPS", items: ["Accedere via SSH", "Installare pacchetti su XFCE", "Gestione Porte e Firewall"], icon: Key },
    { title: "Infrastruttura", items: ["Cos'è Google Cloud Sandbox", "Limiti Hardware Free", "Piani Mac: Roadmap"], icon: FileCode },
    { title: "Fatturazione", items: ["Come funziona il Wallet", "Calcolo della Prorata", "Politiche di Rimborso"], icon: Wallet },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-6 h-full">
      {/* Sidebar Wiki */}
      <aside className="w-full lg:w-64 space-y-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-jupiter-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Cerca guide..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-jupiter-500/50 transition-all text-sm"
          />
        </div>

        <nav className="space-y-6">
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 px-2">{section.title}</h3>
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j}>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all truncate">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Wiki Content */}
      <div className="flex-1 space-y-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tight italic mb-4">Documentazione & Wiki</h1>
          <p className="text-gray-400 text-lg">Tutto quello che devi sapere per dominare la nuvola amogaddy's VPS.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, i) => (
            <Card key={i} className="p-6 hover:border-jupiter-500/20 transition-all cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-jupiter-500/10 flex items-center justify-center text-jupiter-500 group-hover:scale-110 transition-transform">
                  <section.icon size={20} />
                </div>
                <h2 className="text-xl font-bold italic">{section.title}</h2>
              </div>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Esplora le guide dettagliate riguardanti {section.title.toLowerCase()} e scopri come massimizzare le tue risorse.
              </p>
              <div className="flex items-center text-jupiter-400 text-xs font-bold uppercase tracking-widest gap-2">
                Esplora Sezione <ChevronRight size={14} />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 border-blue-500/20 bg-blue-500/[0.02]">
           <div className="flex gap-6 items-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                 <Book size={32} />
              </div>
              <div className="space-y-2">
                 <h3 className="text-xl font-bold italic">Non trovi quello che cerchi?</h3>
                 <p className="text-sm text-gray-400">Il nostro staff è disponibile 24/7 via Ticket per risolvere qualsiasi dubbio tecnico o commerciale.</p>
                 <Button variant="secondary" className="mt-2">Apri un Ticket</Button>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Wiki;
