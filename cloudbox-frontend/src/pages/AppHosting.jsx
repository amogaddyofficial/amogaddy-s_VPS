import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import {
  Box,
  Terminal,
  Play,
  Square,
  RefreshCw,
  Folder,
  File,
  Upload,
  Plus,
  Cpu,
  Database,
  HardDrive,
  Lock,
  PlayCircle
} from 'lucide-react';

const AppHosting = () => {
  const [appState, setAppState] = useState('creation'); // 'creation', 'active', 'caveau'
  const [selectedRuntime, setSelectedRuntime] = useState('Node.js');
  const [files, setFiles] = useState([
    { name: 'commands/', type: 'folder', size: '-', date: '2 min fa' },
    { name: 'bot.py', type: 'file', size: '4.2 KB', date: '1 ora fa' },
    { name: 'config.json', type: 'file', size: '128 B', date: '3 ore fa' },
    { name: 'requirements.txt', type: 'file', size: '512 B', date: '1 giorno fa' },
  ]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFile = {
        name: file.name,
        type: 'file',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        date: 'Proprio ora'
      };
      setFiles([newFile, ...files]);
    }
  };

  const createFolder = () => {
    const folderName = prompt('Nome della cartella:');
    if (folderName) {
      const newFolder = {
        name: folderName.endsWith('/') ? folderName : `${folderName}/`,
        type: 'folder',
        size: '-',
        date: 'Proprio ora'
      };
      setFiles([newFolder, ...files]);
    }
  };

  const runtimes = [
    { name: 'Python', icon: '🐍' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'Go', icon: '🔵' },
    { name: 'HTML Statico', icon: '🌐' },
  ];

  if (appState === 'creation') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-6">
        <header>
          <h1 className="text-3xl font-bold mb-2 italic">Configura la tua App Gratuita</h1>
          <p className="text-gray-400">Inserisci i parametri base per lanciare il tuo codice su Google Cloud Sandbox.</p>
        </header>

        <Card className="p-8 space-y-8 border-jupiter-500/20">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-jupiter-500/10 flex items-center justify-center text-jupiter-500">1</span>
              Selezione del Runtime
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {runtimes.map((rt) => (
                <button
                  key={rt.name}
                  onClick={() => setSelectedRuntime(rt.name)}
                  className={`p-6 rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-3 ${
                    selectedRuntime === rt.name
                    ? 'border-jupiter-500 bg-jupiter-500/5'
                    : 'border-white/5 bg-white/2 hover:border-white/20'
                  }`}
                >
                  <span className="text-4xl">{rt.icon}</span>
                  <span className="font-bold">{rt.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Nome Progetto</label>
              <input
                type="text"
                placeholder="es: mio-bot-discord"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-jupiter-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Comando di Avvio</label>
              <input
                type="text"
                placeholder={selectedRuntime === 'Node.js' ? 'node index.js' : 'python main.py'}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-jupiter-500/50 transition-all"
              />
            </div>
          </section>

          <Button
            onClick={() => setAppState('active')}
            className="w-full py-4 text-xl font-bold jupiter-gradient jupiter-glow rounded-2xl flex items-center justify-center gap-3"
          >
            <Play size={24} /> Lancia Applicazione
          </Button>
        </Card>
      </div>
    );
  }

  if (appState === 'active') {
    return (
      <div className="space-y-6">
        {/* Banner Orizzontale */}
        <div className="w-full h-[90px] bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-500 overflow-hidden group">
          <div className="flex flex-col items-center group-hover:scale-105 transition-transform">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Pubblicità Sponsorizzata</span>
            <div className="text-sm font-medium">Spazio Banner 728x90</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
              <Box size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">mio-bot-discord</h1>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Online</span>
              </div>
              <p className="text-xs text-gray-500">Uptime: 14g 3h 22m • ID: cb_9421_bot</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="px-4 py-2 text-sm border-red-500/20 text-red-400 hover:bg-red-500/10" onClick={() => setAppState('caveau')}>
              <Square size={16} className="mr-2 inline" /> Spegni App
            </Button>
            <Button variant="secondary" className="px-4 py-2 text-sm">
              <RefreshCw size={16} className="mr-2 inline" /> Riavvia
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Sinistra Stats & Ads */}
          <div className="lg:col-span-3 space-y-6">
            <Card title="Hardware Status" className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                  <span className="flex items-center gap-1"><Cpu size={12}/> CPU Shared</span>
                  <span>4%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-jupiter-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <div className="text-[10px] text-gray-600 text-right">Max: 10% Shared</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                  <span className="flex items-center gap-1"><Database size={12}/> RAM</span>
                  <span>84MB</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '33%' }}></div>
                </div>
                <div className="text-[10px] text-gray-600 text-right">Max: 256MB</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                  <span className="flex items-center gap-1"><HardDrive size={12}/> Storage</span>
                  <span>12MB</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '12%' }}></div>
                </div>
                <div className="text-[10px] text-gray-600 text-right">Max: 100MB</div>
              </div>
            </Card>

            <div className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-500 group overflow-hidden">
               <div className="flex flex-col items-center group-hover:scale-105 transition-transform p-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Sponsor</span>
                <div className="text-sm font-medium">Banner Quadrato 300x250</div>
              </div>
            </div>
          </div>

          {/* Main Area File Manager */}
          <Card title="File Manager Visivo" className="lg:col-span-9" subtitle="Sincronizzato con l'istanza sandbox">
            <div className="flex items-center justify-between mb-4 bg-white/5 p-3 rounded-xl">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1"><Folder size={16} /> root</span>
                <span>/</span>
                <span className="text-jupiter-400 font-bold">mio-bot-discord</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="px-3 py-1.5 text-xs flex items-center gap-2"
                  onClick={createFolder}
                >
                  <Plus size={14} /> Nuova Cartella
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                  <Button className="px-3 py-1.5 text-xs flex items-center gap-2 pointer-events-none">
                    <Upload size={14} /> Carica File
                  </Button>
                </div>
              </div>
            </div>

            <div className="border border-white/5 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-white/5">
                <div className="col-span-6">Nome</div>
                <div className="col-span-3 text-right">Dimensione</div>
                <div className="col-span-3 text-right">Modificato</div>
              </div>
              <div className="divide-y divide-white/5">
                {files.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-white/2 cursor-pointer transition-colors text-sm items-center">
                    <div className="col-span-6 flex items-center gap-3">
                      {item.type === 'folder' ? <Folder size={18} className="text-jupiter-500" /> : <File size={18} className="text-gray-500" />}
                      <span className={item.type === 'folder' ? 'font-medium' : ''}>{item.name}</span>
                    </div>
                    <div className="col-span-3 text-right text-gray-500">{item.size}</div>
                    <div className="col-span-3 text-right text-gray-500">{item.date}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center gap-3">
              <Terminal size={16} className="text-blue-400" />
              <div className="text-xs text-blue-400 font-medium">Terminal Bash integrato disponibile via SSH Web Console.</div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (appState === 'caveau') {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
        <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8 animate-pulse">
            <Lock size={48} />
          </div>
          <h2 className="text-4xl font-bold tracking-tight italic">📦 La tua app è al sicuro nel Caveau di Emergenza!</h2>

          <div className="bg-white/5 border border-white/10 p-1 rounded-2xl aspect-video relative overflow-hidden flex items-center justify-center group">
             <div className="text-gray-500 flex flex-col items-center gap-4">
                <PlayCircle size={64} className="opacity-20 group-hover:opacity-40 transition-opacity" />
                <span className="text-sm font-bold uppercase tracking-widest">Video Sponsorizzato (10s)</span>
             </div>
             {/* Progress bar simulata */}
             <div className="absolute bottom-0 left-0 h-1 bg-jupiter-500 w-[60%]"></div>
          </div>

          <p className="text-gray-400 text-lg leading-relaxed text-left border-l-4 border-jupiter-500 pl-6 italic">
            "Per rimetterla online sulla nostra VPS dobbiamo riprendere il tuo codice dal nostro archivio di sicurezza Git e reinstallare l'ambiente di esecuzione.
            <span className="text-white font-bold"> Siamo onesti con te</span>: odiamo la pubblicità esattamente quanto la odi tu. È fastidiosa e fa perdere tempo.
            Però mantenere attiva questa infrastruttura e salvare i tuoi file modificabili ha un costo reale in server e manutenzione.
            Non vogliamo chiederti un solo centesimo di tasca tua per questo servizio gratuito, quindi ci servono questi annunci per pagare le bollette delle macchine.
            Guarda questo video sponsorizzato di <span className="text-jupiter-400 font-bold underline">10 secondi</span> per finanziare il ripristino delle tue cartelle. Grazie di cuore per il supporto! ♥️"
          </p>

          <Button
            className="w-full py-5 text-xl font-bold rounded-2xl flex items-center justify-center gap-3"
            onClick={() => setAppState('active')}
          >
            <PlayCircle size={24} /> Guarda il video di 10 secondi e riattiva
          </Button>
        </div>
      </div>
    );
  }
};

export default AppHosting;
