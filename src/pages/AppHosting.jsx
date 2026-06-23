import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Badge } from '../components/UI';
import {
  Box, Terminal, Play, Square, RefreshCw,
  Folder, File, Upload, Plus, Cpu, Database,
  HardDrive, Lock, PlayCircle, Settings, Key,
  FileCode, Activity, Shield, ChevronDown,
  ChevronUp, X, Check, Network, Wifi
} from 'lucide-react';

/* ── Advanced Tab: Web Terminal ── */
const TerminalTab = () => {
  const [lines, setLines] = useState([
    { type: 'out', text: 'amogaddy@vps:~/mio-bot-discord$ ' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const runCommand = (cmd) => {
    const responses = {
      'ls':       ['bot.py', 'config.json', 'requirements.txt', 'commands/'],
      'ls -la':   ['total 24', 'drwxr-xr-x 3 app app 4096 Jun 23 12:00 .', '-rw-r--r-- 1 app app 4209 Jun 23 11:45 bot.py', '-rw-r--r-- 1 app app  512 Jun 23 11:30 requirements.txt'],
      'ps aux':   ['PID   USER  %CPU %MEM  COMMAND', '1     app    0.0  0.1  /bin/sh', '12    app    1.2  3.4  python bot.py'],
      'df -h':    ['Filesystem  Size  Used  Avail  Use%', 'overlay      100M   12M    88M   12%'],
      'whoami':   ['app'],
      'pwd':      ['/home/app/mio-bot-discord'],
      'clear':    null,
    };

    const out = responses[cmd.trim()];
    const newLines = [...lines];
    newLines[newLines.length - 1] = { type: 'cmd', text: `amogaddy@vps:~/mio-bot-discord$ ${cmd}` };

    if (out === null) {
      setLines([{ type: 'out', text: 'amogaddy@vps:~/mio-bot-discord$ ' }]);
      return;
    }

    const nextLines = out
      ? out.map(t => ({ type: 'out', text: t }))
      : [{ type: 'err', text: `bash: ${cmd}: command not found` }];

    setLines([...newLines, ...nextLines, { type: 'out', text: 'amogaddy@vps:~/mio-bot-discord$ ' }]);
  };

  return (
    <div className="bg-black rounded-xl border border-white/10 p-4 font-mono text-sm h-72 flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-0.5 text-green-400">
        {lines.map((l, i) => (
          <div key={i} className={l.type === 'err' ? 'text-red-400' : l.type === 'cmd' ? 'text-white' : 'text-green-400'}>
            {l.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <input
        autoFocus
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && input.trim()) {
            runCommand(input);
            setInput('');
          }
        }}
        className="bg-transparent outline-none text-green-400 caret-green-400 w-full mt-2 border-t border-white/10 pt-2"
        placeholder="digita un comando..."
      />
    </div>
  );
};

/* ── Advanced Tab: File Editor ── */
const FileEditorTab = ({ files }) => {
  const [selected, setSelected] = useState('bot.py');
  const [content, setContent] = useState(
    'import discord\nfrom discord.ext import commands\n\nbot = commands.Bot(command_prefix="!")\n\n@bot.event\nasync def on_ready():\n    print(f"Bot online come {bot.user}")\n\nbot.run("TOKEN")'
  );
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {files.filter(f => f.type === 'file').map(f => (
          <button
            key={f.name}
            onClick={() => setSelected(f.name)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              selected === f.name ? 'bg-jupiter-500/20 text-jupiter-400 border border-jupiter-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full h-56 bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-sm text-green-300 outline-none focus:border-jupiter-500/40 resize-none"
      />
      <div className="flex items-center gap-3">
        <Button onClick={save} className="px-4 py-2 text-xs flex items-center gap-2">
          {saved ? <><Check size={14} /> Salvato!</> : <><FileCode size={14} /> Salva File</>}
        </Button>
        <span className="text-xs text-gray-500 font-mono">chmod 644 {selected}</span>
        <button className="ml-auto text-xs text-gray-500 hover:text-white transition-colors px-3 py-1 border border-white/10 rounded-lg">
          chown app:app {selected}
        </button>
      </div>
    </div>
  );
};

/* ── Advanced Tab: SSH Keys ── */
const SSHKeysTab = () => {
  const [keys, setKeys] = useState([
    { id: 1, name: 'MacBook Pro', key: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAB...', added: '2024-12-10' },
    { id: 2, name: 'VS Code Remote', key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA...', added: '2025-01-15' },
  ]);
  const [name, setName] = useState('');
  const [pub, setPub] = useState('');

  const add = () => {
    if (!name.trim() || !pub.trim()) return;
    setKeys([...keys, { id: Date.now(), name, key: pub, added: new Date().toISOString().slice(0, 10) }]);
    setName('');
    setPub('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {keys.map(k => (
          <div key={k.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group">
            <Key size={16} className="text-jupiter-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{k.name}</div>
              <div className="text-xs text-gray-500 font-mono truncate">{k.key}</div>
            </div>
            <span className="text-[10px] text-gray-600 shrink-0">{k.added}</span>
            <button
              onClick={() => setKeys(keys.filter(x => x.id !== k.id))}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 p-1 shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 pt-4 space-y-3">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Aggiungi Nuova Chiave</p>
        <div className="grid grid-cols-3 gap-3">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nome dispositivo"
            className="col-span-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-jupiter-500/40"
          />
          <input
            value={pub}
            onChange={e => setPub(e.target.value)}
            placeholder="ssh-rsa AAAA... o ssh-ed25519 AAAA..."
            className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-mono outline-none focus:border-jupiter-500/40"
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={add} className="px-4 py-2 text-xs flex items-center gap-2">
            <Plus size={14} /> Aggiungi a authorized_keys
          </Button>
          <button className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1 border border-white/10 rounded-lg flex items-center gap-1">
            <Shield size={12} /> Scarica config VS Code SSH
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Advanced Tab: System Logs ── */
const SystemLogsTab = () => {
  const logs = [
    { ts: '12:00:01', pid: '1234', level: 'INFO',  net: '0B',   msg: 'Container avviato' },
    { ts: '12:00:02', pid: '1234', level: 'INFO',  net: '1.2KB', msg: 'Connessione Discord stabilita' },
    { ts: '12:01:15', pid: '1234', level: 'DEBUG', net: '340B',  msg: 'on_message ricevuto - user#1234' },
    { ts: '12:03:44', pid: '1234', level: 'WARN',  net: '88B',   msg: 'Rate limit hit su !play - retry 2s' },
    { ts: '12:05:00', pid: '1235', level: 'INFO',  net: '0B',   msg: 'Worker health check OK' },
    { ts: '12:07:33', pid: '1234', level: 'DEBUG', net: '512B',  msg: 'on_message ricevuto - admin#0001' },
    { ts: '12:10:01', pid: '1234', level: 'INFO',  net: '2.1KB', msg: 'Comando !play eseguito con successo' },
  ];

  const color = (l) => ({ INFO: 'text-blue-400', DEBUG: 'text-gray-500', WARN: 'text-yellow-400', ERROR: 'text-red-400' })[l] || 'text-gray-400';

  return (
    <div className="bg-black/60 rounded-xl border border-white/10 overflow-hidden">
      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-white/5 text-[9px] font-bold uppercase tracking-widest text-gray-500 border-b border-white/5">
        <div className="col-span-2">Timestamp</div>
        <div className="col-span-1">PID</div>
        <div className="col-span-1">Level</div>
        <div className="col-span-2">Net I/O</div>
        <div className="col-span-6">Messaggio</div>
      </div>
      <div className="divide-y divide-white/5 max-h-52 overflow-y-auto font-mono text-xs">
        {logs.map((l, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 px-4 py-2 hover:bg-white/2">
            <div className="col-span-2 text-gray-600">{l.ts}</div>
            <div className="col-span-1 text-gray-500">{l.pid}</div>
            <div className={`col-span-1 font-bold ${color(l.level)}`}>{l.level}</div>
            <div className="col-span-2 text-purple-400">{l.net}</div>
            <div className="col-span-6 text-gray-300">{l.msg}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Componente principale ── */
const AppHosting = () => {
  const [appState, setAppState] = useState('creation');
  const [selectedRuntime, setSelectedRuntime] = useState('Node.js');
  const [advancedMode, setAdvancedMode] = useState(false);
  const [advancedTab, setAdvancedTab] = useState('terminal');
  const [files, setFiles] = useState([
    { name: 'commands/', type: 'folder', size: '-',     date: '2 min fa' },
    { name: 'bot.py',    type: 'file',   size: '4.2 KB', date: '1 ora fa' },
    { name: 'config.json', type: 'file', size: '128 B',  date: '3 ore fa' },
    { name: 'requirements.txt', type: 'file', size: '512 B', date: '1 giorno fa' },
  ]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles([{ name: file.name, type: 'file', size: `${(file.size / 1024).toFixed(1)} KB`, date: 'Proprio ora' }, ...files]);
    }
  };

  const createFolder = () => {
    const folderName = prompt('Nome della cartella:');
    if (folderName) {
      const n = folderName.endsWith('/') ? folderName : `${folderName}/`;
      setFiles([{ name: n, type: 'folder', size: '-', date: 'Proprio ora' }, ...files]);
    }
  };

  const runtimes = [
    { name: 'Python',       icon: '🐍' },
    { name: 'Node.js',      icon: '🟢' },
    { name: 'Go',           icon: '🔵' },
    { name: 'HTML Statico', icon: '🌐' },
  ];

  const advancedTabs = [
    { id: 'terminal', label: 'Terminal SSH', icon: Terminal },
    { id: 'editor',   label: 'File Editor',  icon: FileCode },
    { id: 'ssh',      label: 'SSH Keys',     icon: Key },
    { id: 'logs',     label: 'System Logs',  icon: Activity },
  ];

  /* ── STATO: creation ── */
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

  /* ── STATO: active ── */
  if (appState === 'active') {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="w-full h-[90px] bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-500 overflow-hidden group">
          <div className="flex flex-col items-center group-hover:scale-105 transition-transform">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Pubblicità Sponsorizzata</span>
            <div className="text-sm font-medium">Spazio Banner 728x90</div>
          </div>
        </div>

        {/* Header app */}
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
          <div className="flex gap-2 flex-wrap">
            {/* Toggle Modalità Avanzata */}
            <button
              onClick={() => setAdvancedMode(!advancedMode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${
                advancedMode
                  ? 'border-jupiter-500/50 bg-jupiter-500/10 text-jupiter-400'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Settings size={16} className={advancedMode ? 'animate-spin-slow' : ''} />
              Modalità Avanzata
              {advancedMode ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <Button variant="secondary" className="px-4 py-2 text-sm border-red-500/20 text-red-400 hover:bg-red-500/10" onClick={() => setAppState('caveau')}>
              <Square size={16} className="mr-2 inline" /> Spegni App
            </Button>
            <Button variant="secondary" className="px-4 py-2 text-sm">
              <RefreshCw size={16} className="mr-2 inline" /> Riavvia
            </Button>
          </div>
        </div>

        {/* Griglia principale (Semplice) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card title="Hardware Status" className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                  <span className="flex items-center gap-1"><Cpu size={12} /> CPU Shared</span>
                  <span>4%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-jupiter-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <div className="text-[10px] text-gray-600 text-right">Max: 10% Shared</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                  <span className="flex items-center gap-1"><Database size={12} /> RAM</span>
                  <span>84MB</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '33%' }}></div>
                </div>
                <div className="text-[10px] text-gray-600 text-right">Max: 256MB</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                  <span className="flex items-center gap-1"><HardDrive size={12} /> Storage</span>
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

          <Card title="File Manager Visivo" className="lg:col-span-9" subtitle="Sincronizzato con l'istanza sandbox">
            <div className="flex items-center justify-between mb-4 bg-white/5 p-3 rounded-xl">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1"><Folder size={16} /> root</span>
                <span>/</span>
                <span className="text-jupiter-400 font-bold">mio-bot-discord</span>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="px-3 py-1.5 text-xs flex items-center gap-2" onClick={createFolder}>
                  <Plus size={14} /> Nuova Cartella
                </Button>
                <div className="relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
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
                      {item.type === 'folder'
                        ? <Folder size={18} className="text-jupiter-500" />
                        : <File size={18} className="text-gray-500" />}
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
              <div className="text-xs text-blue-400 font-medium">
                {advancedMode
                  ? 'Terminal SSH attivo — usa la tab "Terminal SSH" qui sotto.'
                  : 'Abilita Modalità Avanzata per accedere al Terminal SSH Web Console.'}
              </div>
            </div>
          </Card>
        </div>

        {/* Pannello Modalità Avanzata — slide animata */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            advancedMode ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <Card className="border-jupiter-500/20">
            {/* Header panel */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-jupiter-400" />
                <span className="text-sm font-bold text-jupiter-400 uppercase tracking-wider">Modalità Avanzata</span>
                <span className="text-[10px] px-2 py-0.5 bg-jupiter-500/10 text-jupiter-400 rounded-full border border-jupiter-500/20">BETA</span>
              </div>
              <button onClick={() => setAdvancedMode(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 mb-5 bg-white/5 p-1 rounded-xl w-fit">
              {advancedTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAdvancedTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      advancedTab === tab.id
                        ? 'bg-jupiter-500/20 text-jupiter-400 border border-jupiter-500/30'
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            {advancedTab === 'terminal' && <TerminalTab />}
            {advancedTab === 'editor'   && <FileEditorTab files={files} />}
            {advancedTab === 'ssh'      && <SSHKeysTab />}
            {advancedTab === 'logs'     && <SystemLogsTab />}
          </Card>
        </div>
      </div>
    );
  }

  /* ── STATO: caveau ── */
  if (appState === 'caveau') {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
        <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8 animate-pulse">
            <Lock size={48} />
          </div>
          <h2 className="text-4xl font-bold tracking-tight italic">La tua app è al sicuro nel Caveau di Emergenza!</h2>

          <div className="bg-white/5 border border-white/10 p-1 rounded-2xl aspect-video relative overflow-hidden flex items-center justify-center group">
            <div className="text-gray-500 flex flex-col items-center gap-4">
              <PlayCircle size={64} className="opacity-20 group-hover:opacity-40 transition-opacity" />
              <span className="text-sm font-bold uppercase tracking-widest">Video Sponsorizzato (10s)</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-jupiter-500 w-[60%]"></div>
          </div>

          <p className="text-gray-400 text-lg leading-relaxed text-left border-l-4 border-jupiter-500 pl-6 italic">
            "Per rimetterla online sulla nostra VPS dobbiamo riprendere il tuo codice dal nostro archivio di sicurezza Git e reinstallare l'ambiente di esecuzione.
            <span className="text-white font-bold"> Siamo onesti con te</span>: odiamo la pubblicità esattamente quanto la odi tu. È fastidiosa e fa perdere tempo.
            Però mantenere attiva questa infrastruttura e salvare i tuoi file modificabili ha un costo reale in server e manutenzione.
            Non vogliamo chiederti un solo centesimo di tasca tua per questo servizio gratuito, quindi ci servono questi annunci per pagare le bollette delle macchine.
            Guarda questo video sponsorizzato di <span className="text-jupiter-400 font-bold underline">10 secondi</span> per finanziare il ripristino delle tue cartelle. Grazie di cuore per il supporto!"
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
