import React, { useState } from 'react';
import { Button } from '../components/UI';
import { BookOpen, Server, HelpCircle, ShieldAlert, ChevronDown, ChevronRight, Box, Terminal, Bot, Apple } from 'lucide-react';

const Section = ({ icon: Icon, title, children, accent = 'jupiter' }) => {
  const [open, setOpen] = useState(true);
  const colors = {
    jupiter: 'text-jupiter-500 bg-jupiter-500/10 border-jupiter-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };
  return (
    <div className="border border-white/5 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-6 hover:bg-white/5 transition-colors text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${colors[accent]}`}>
          <Icon size={20} />
        </div>
        <span className="text-xl font-bold flex-1">{title}</span>
        {open ? <ChevronDown size={18} className="text-gray-500" /> : <ChevronRight size={18} className="text-gray-500" />}
      </button>
      {open && <div className="px-6 pb-8 space-y-6 border-t border-white/5 pt-6">{children}</div>}
    </div>
  );
};

const FAQ = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 hover:bg-white/5 transition-colors text-left">
        <span className="font-medium text-sm text-gray-200">{q}</span>
        {open ? <ChevronDown size={16} className="text-gray-500 shrink-0" /> : <ChevronRight size={16} className="text-gray-500 shrink-0" />}
      </button>
      {open && <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">{a}</p>}
    </div>
  );
};

const DocsPage = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-space-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-space-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Box className="text-jupiter-500" size={24} />
            <span className="font-bold tracking-tight">amogaddy's VPS</span>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400 text-sm">Documentazione</span>
          </div>
          <Button onClick={onEnter} className="px-6 py-2 text-sm">Accedi</Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-6">
        <div className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4">Documentazione</h1>
          <p className="text-gray-400 text-lg">Tutto quello che ti serve per iniziare con amogaddy's VPS.</p>
        </div>

        {/* 1. Panoramica Piani */}
        <Section icon={Server} title="Panoramica Piani" accent="jupiter">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: '🍏 MAC HOME', price: '2,00€/mese', desc: 'macOS condiviso con interfaccia grafica via browser. Ideale per test app iOS. ⚠️ Previsto in arrivo.', accent: 'border-purple-500/30' },
              { name: '🍏 MAC DEV', price: '3,00€/mese', desc: 'macOS headless con SSH, Xcode CLI, Homebrew, Flutter e CocoaPods. ⚠️ Previsto in arrivo.', accent: 'border-purple-500/30' },
              { name: '👑 HOME', price: '1,50€/mese', desc: 'VPS Scaleway con XFCE Desktop, CPU 100%, SSH dedicato, tutte le porte sbloccate, MySQL/PostgreSQL/Redis.', accent: 'border-jupiter-500/40' },
              { name: '📦 PAAS', price: 'Wallet a consumo', desc: 'Scaleway headless con Docker, qualsiasi OS/DB, CPU 100%, pay-per-second. Sleep mode automatico a saldo zero.', accent: 'border-blue-500/30' },
              { name: '🚀 FREE ADVANCED', price: '0,00€', desc: 'Google Cloud con XFCE, CPU 60%, max 2 ore al giorno. MySQL/MariaDB incluso.', accent: 'border-white/10' },
              { name: '⏳ FREE', price: '0,00€', desc: 'Google Cloud Sandbox con XFCE, CPU 30%, uptime 24/7. Ideale per i primi passi.', accent: 'border-white/10' },
              { name: '🤖 App Hosting', price: 'Gratis', desc: 'Hosting di bot e micro-app (Python/Node/Go/HTML). Reset automatico ogni 24h alle 12:00 IT. Caveau dopo 3 giorni di inattività.', accent: 'border-green-500/20' },
            ].map((p, i) => (
              <div key={i} className={`p-5 rounded-xl border bg-white/[0.02] ${p.accent}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold">{p.name}</span>
                  <span className="text-jupiter-400 text-sm font-bold">{p.price}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 2. Guide di Setup */}
        <Section icon={Terminal} title="Guide di Setup" accent="blue">
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-jupiter-400 mb-3 flex items-center gap-2"><Bot size={16} /> Bot Discord / Telegram</h3>
              <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside leading-relaxed">
                <li>Vai su <strong className="text-white">Dashboard → App Hosting</strong> e clicca <em>Crea la tua prima App</em>.</li>
                <li>Seleziona il runtime <strong className="text-white">Node.js</strong> o <strong className="text-white">Python</strong>.</li>
                <li>Inserisci il nome del progetto e il comando di avvio (es. <code className="bg-white/10 px-1 rounded text-xs">node index.js</code> o <code className="bg-white/10 px-1 rounded text-xs">python bot.py</code>).</li>
                <li>Clicca <strong className="text-white">Lancia Applicazione</strong>. Il File Manager si apre automaticamente.</li>
                <li>Carica i tuoi file sorgente tramite il pulsante <strong className="text-white">Carica File</strong>.</li>
                <li>Il bot è online. Ricorda: reset automatico ogni giorno alle 12:00 ora italiana.</li>
              </ol>
            </div>

            <div className="h-px bg-white/5"></div>

            <div>
              <h3 className="font-bold text-jupiter-400 mb-3 flex items-center gap-2"><Server size={16} /> Configurare una VPS Linux</h3>
              <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside leading-relaxed">
                <li>Vai su <strong className="text-white">Dashboard → VPS Linux</strong>.</li>
                <li>Scegli il piano desiderato e clicca <strong className="text-white">Seleziona Piano</strong>.</li>
                <li>Nella schermata di creazione scegli il <strong className="text-white">Sistema Operativo</strong> (Ubuntu, Windows, Docker, macOS).</li>
                <li>Imposta le risorse con gli slider di CPU e RAM in base al tuo piano.</li>
                <li>Clicca <strong className="text-white">Crea Istanza</strong>. L'IP e le credenziali SSH appaiono nel pannello in pochi secondi.</li>
                <li>Connettiti via <code className="bg-white/10 px-1 rounded text-xs">ssh utente@IP -p PORTA</code> o usa l'interfaccia web RDP/VNC.</li>
              </ol>
            </div>

            <div className="h-px bg-white/5"></div>

            <div>
              <h3 className="font-bold text-jupiter-400 mb-3 flex items-center gap-2"><Apple size={16} /> Riservare un Piano Mac</h3>
              <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside leading-relaxed">
                <li>Vai su <strong className="text-white">Dashboard → Piani Mac</strong>.</li>
                <li>Inserisci la tua email nel modulo di lista d'attesa.</li>
                <li>Clicca <strong className="text-white">Entra nella Lista d'Attesa (Gratis)</strong>.</li>
                <li>Riceverai una mail non appena i nodi Apple Silicon saranno accesi e il tuo slot sarà disponibile.</li>
              </ol>
            </div>
          </div>
        </Section>

        {/* 3. FAQ */}
        <Section icon={HelpCircle} title="Domande Frequenti (FAQ)" accent="blue">
          <div className="space-y-3">
            {[
              { q: 'Posso usare il servizio gratis per sempre?', a: 'Sì. I piani FREE e FREE ADVANCED sono completamente gratuiti. Il piano App Hosting è anch\'esso gratis e finanziato da brevi annunci pubblicitari. Non è richiesta nessuna carta di credito.' },
              { q: 'Come funziona il reset delle 12:00 per l\'App Hosting?', a: 'Ogni giorno a mezzogiorno (ora italiana) l\'ambiente dell\'app viene riciclato e rilanciato automaticamente. Questo serve a liberare risorse e garantire stabilità. I tuoi file rimangono intatti nel File Manager.' },
              { q: 'Cos\'è il Caveau di Emergenza?', a: 'Se la tua app rimane spenta per 3 giorni consecutivi, i file vengono archiviati nel nostro Git archive (Caveau). Per riattivarla basta guardare un video sponsorizzato di 10 secondi — nessun costo aggiuntivo.' },
              { q: 'Come funziona il Wallet e il piano PAAS?', a: 'Ricarichi il Wallet con PayPal (minimo 1,50€). Il piano PAAS scala i crediti in proporzione esatta all\'uso reale (pay-per-second). Quando il saldo scende a zero, la VPS entra in Sleep Mode automatico e riprende non appena ricarichi.' },
              { q: 'Posso fare downgrade di piano?', a: 'Sì. Il sistema calcola automaticamente il credito residuo per il tempo non utilizzato (Prorata) e lo accredita istantaneamente nel tuo Wallet interno, senza toccare PayPal.' },
              { q: 'C\'è un rimborso se non sono soddisfatto?', a: 'No. Il credito caricato nel Wallet non è mai rimborsabile o convertibile in denaro reale. Fanno eccezione guasti hardware gravi o downtime dell\'infrastruttura superiore alle 48 ore consecutive.' },
              { q: 'Quando arrivano i piani Mac?', a: 'I piani 🍏 Mac Home e Mac Dev sono attualmente in fase di prenotazione. Puoi entrare nella lista d\'attesa gratuitamente dalla dashboard. Ti avviseremo via email non appena i nodi Apple Silicon saranno operativi.' },
              { q: 'Quali sistemi operativi posso installare sulle VPS?', a: 'Dipende dal piano. FREE e FREE ADVANCED supportano solo Ubuntu Linux. Il piano HOME supporta Ubuntu e Windows Desktop. Il piano PAAS supporta Ubuntu Server, Windows Core, Docker Engine e macOS puro (scelta libera).' },
            ].map((f, i) => <FAQ key={i} {...f} />)}
          </div>
        </Section>

        {/* 4. Termini & No-Refund */}
        <Section icon={ShieldAlert} title="Termini di Servizio & Politica No-Refund" accent="red">
          <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
            <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5">
              <h4 className="font-bold text-red-400 mb-2">⚠️ Politica No-Refund Rigida</h4>
              <p>Il credito inserito nel Wallet non è mai rimborsabile o convertibile in denaro reale, salvo guasti hardware gravi o downtime dell'infrastruttura superiore alle 48 ore consecutive. Caricando fondi nel Wallet dichiari di accettare espressamente queste condizioni.</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-2">Uso Accettabile</h4>
              <p>Il servizio è destinato a scopi legittimi di sviluppo, test e hosting. È vietato utilizzare le risorse per attività illegali, spam, mining di criptovalute o qualsiasi attività che violi le leggi vigenti o le policy dei provider (Google Cloud, Scaleway).</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-2">Disponibilità del Servizio</h4>
              <p>amogaddy's VPS non garantisce uptime al 100%. I piani FREE si basano su infrastruttura Google Cloud Sandbox soggetta a limiti di utilizzo. I piani Scaleway sono soggetti alle condizioni di disponibilità del provider. In caso di downtime prolungato oltre le 48 ore consecutive sarà previsto un rimborso proporzionale.</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-2">Dati e Privacy</h4>
              <p>I file caricati tramite File Manager e le credenziali SSH sono di proprietà dell'utente. amogaddy's VPS non accede ai contenuti delle istanze salvo per motivi di manutenzione straordinaria con notifica preventiva. I dati delle istanze FREE vengono eliminati dopo 30 giorni di inattività prolungata.</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-2">Modifiche ai Piani</h4>
              <p>amogaddy's VPS si riserva il diritto di modificare i prezzi e le specifiche dei piani con un preavviso di almeno 14 giorni via email. Gli utenti con abbonamenti attivi manterranno le condizioni correnti fino alla scadenza del ciclo di fatturazione in corso.</p>
            </div>
          </div>
        </Section>
      </div>

      <footer className="border-t border-white/5 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-gray-600">
          <span>amogaddy's VPS & Tema Giove. © 2024</span>
          <Button variant="secondary" onClick={onEnter} className="text-xs px-4 py-2">Accedi alla Dashboard</Button>
        </div>
      </footer>
    </div>
  );
};

export default DocsPage;
