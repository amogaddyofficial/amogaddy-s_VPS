import React, { useState } from 'react';
import { Button, Badge } from './UI';
import { X, Server, Monitor, Terminal, Container, Apple, ChevronRight, Cpu, MemoryStick, HardDrive, Check } from 'lucide-react';

const OS_OPTIONS = {
  free: [
    { id: 'ubuntu', label: 'Ubuntu 22.04 LTS', icon: Terminal, desc: 'Linux stabile, consigliato per principianti', tag: null },
  ],
  'free-adv': [
    { id: 'ubuntu', label: 'Ubuntu 22.04 LTS', icon: Terminal, desc: 'Linux stabile, consigliato per principianti', tag: null },
  ],
  home: [
    { id: 'ubuntu', label: 'Ubuntu 22.04 LTS', icon: Terminal, desc: 'Linux stabile, consigliato per principianti', tag: null },
    { id: 'windows', label: 'Windows Desktop', icon: Monitor, desc: 'Interfaccia grafica Windows completa via RDP', tag: null },
  ],
  paas: [
    { id: 'ubuntu', label: 'Ubuntu Server', icon: Terminal, desc: 'Linux headless, massima performance', tag: null },
    { id: 'windows', label: 'Windows Core', icon: Monitor, desc: 'Windows senza GUI, ottimizzato per servizi', tag: null },
    { id: 'docker', label: 'Docker Engine', icon: Container, desc: 'Container runtime puro, zero overhead', tag: 'Consigliato' },
    { id: 'macos', label: 'macOS Puro', icon: Apple, desc: 'macOS nativo su hardware Apple emulato', tag: 'Raro' },
  ],
};

const PLAN_LIMITS = {
  free:     { cpu: 30,  ram: 512,   disk: 5   },
  'free-adv': { cpu: 60, ram: 1024,  disk: 10  },
  home:     { cpu: 100, ram: 4096,  disk: 25  },
  paas:     { cpu: 100, ram: 8192,  disk: 50  },
};

const Slider = ({ label, icon: Icon, value, min, max, step, unit, onChange }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-bold">
        <Icon size={16} className="text-jupiter-500" />
        {label}
      </div>
      <span className="text-jupiter-400 font-black text-lg">{value}{unit}</span>
    </div>
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #f0a04b ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%)`
        }}
      />
    </div>
    <div className="flex justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest">
      <span>{min}{unit}</span>
      <span>{max}{unit}</span>
    </div>
  </div>
);

const VPSWizard = ({ plan, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [selectedOS, setSelectedOS] = useState(null);
  const limits = PLAN_LIMITS[plan.id];
  const [cpu, setCpu] = useState(Math.round(limits.cpu * 0.5));
  const [ram, setRam] = useState(Math.round(limits.ram * 0.5));
  const [disk, setDisk] = useState(Math.round(limits.disk * 0.5));
  const [name, setName] = useState('');

  const osList = OS_OPTIONS[plan.id] || OS_OPTIONS['free'];

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-space-950 border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <div>
            <div className="text-xs font-black text-jupiter-500 uppercase tracking-[0.3em] mb-1">
              Crea Istanza — {plan.name}
            </div>
            <div className="flex items-center gap-3">
              {['Sistema Operativo', 'Risorse', 'Riepilogo'].map((s, i) => (
                <React.Fragment key={i}>
                  <span className={`text-sm font-bold ${step === i + 1 ? 'text-white' : 'text-gray-600'}`}>
                    {i + 1}. {s}
                  </span>
                  {i < 2 && <ChevronRight size={14} className="text-gray-700" />}
                </React.Fragment>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="px-8 py-8">
          {/* STEP 1 — OS */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-6">Scegli il Sistema Operativo</h2>
              {osList.map(os => (
                <button
                  key={os.id}
                  onClick={() => setSelectedOS(os.id)}
                  className={`w-full flex items-center gap-5 p-5 rounded-2xl border transition-all text-left ${
                    selectedOS === os.id
                      ? 'border-jupiter-500 bg-jupiter-500/10'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedOS === os.id ? 'bg-jupiter-500/20 text-jupiter-400' : 'bg-white/5 text-gray-400'
                  }`}>
                    <os.icon size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold">{os.label}</span>
                      {os.tag && (
                        <span className="text-[10px] font-black bg-jupiter-500/20 text-jupiter-400 border border-jupiter-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest">
                          {os.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{os.desc}</p>
                  </div>
                  {selectedOS === os.id && <Check size={20} className="text-jupiter-500 shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {/* STEP 2 — Risorse */}
          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-2">Configura le Risorse</h2>
              <p className="text-xs text-gray-500 -mt-4 mb-6">
                Il piano <strong className="text-white">{plan.name}</strong> consente fino a{' '}
                <strong className="text-jupiter-400">CPU {limits.cpu}%</strong>,{' '}
                <strong className="text-jupiter-400">RAM {limits.ram >= 1024 ? limits.ram / 1024 + 'GB' : limits.ram + 'MB'}</strong>,{' '}
                <strong className="text-jupiter-400">Disco {limits.disk}GB</strong>.
              </p>

              <div className="space-y-3 mb-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Nome Istanza</label>
                <input
                  type="text"
                  placeholder="es. mio-server-01"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-jupiter-500/50 transition-all text-sm font-medium"
                />
              </div>

              <Slider label="CPU" icon={Cpu} value={cpu} min={10} max={limits.cpu} step={5} unit="%" onChange={setCpu} />
              <Slider
                label="RAM"
                icon={MemoryStick}
                value={ram}
                min={128}
                max={limits.ram}
                step={128}
                unit="MB"
                onChange={setRam}
              />
              <Slider label="Disco" icon={HardDrive} value={disk} min={1} max={limits.disk} step={1} unit="GB" onChange={setDisk} />
            </div>
          )}

          {/* STEP 3 — Riepilogo */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-6">Riepilogo Istanza</h2>
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl divide-y divide-white/5">
                {[
                  { label: 'Piano', value: plan.name },
                  { label: 'Provider', value: plan.provider },
                  { label: 'Sistema Operativo', value: osList.find(o => o.id === selectedOS)?.label },
                  { label: 'Nome Istanza', value: name || '(non specificato)' },
                  { label: 'CPU', value: `${cpu}%` },
                  { label: 'RAM', value: `${ram >= 1024 ? (ram / 1024).toFixed(1) + ' GB' : ram + ' MB'}` },
                  { label: 'Disco', value: `${disk} GB` },
                  { label: 'Prezzo', value: plan.price },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center px-6 py-4 text-sm">
                    <span className="text-gray-500 font-medium">{row.label}</span>
                    <span className="font-bold text-white">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-jupiter-500/5 border border-jupiter-500/20 rounded-xl p-4 text-xs text-gray-400 leading-relaxed">
                Cliccando <strong className="text-white">Crea Istanza</strong> confermi di aver letto e accettato i Termini di Servizio e la Politica No-Refund di amogaddy's VPS.
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-8 py-6 border-t border-white/5 flex justify-between gap-4">
          {step > 1 ? (
            <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="px-6">← Indietro</Button>
          ) : (
            <Button variant="secondary" onClick={onClose} className="px-6">Annulla</Button>
          )}

          {step < 3 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !selectedOS}
              className="px-8 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Avanti <ChevronRight size={18} />
            </Button>
          ) : (
            <Button onClick={() => { onConfirm({ os: selectedOS, cpu, ram, disk, name }); onClose(); }} className="px-8">
              🚀 Crea Istanza
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VPSWizard;
