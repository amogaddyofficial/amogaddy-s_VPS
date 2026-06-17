import React, { useState } from 'react';
import { Box, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '../components/UI';

const AuthPage = ({ onLogin, onBack }) => {
  const [tab, setTab] = useState('login');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <div className="min-h-screen bg-space-950 flex flex-col items-center justify-center p-6">
      <button
        onClick={onBack}
        className="absolute top-8 left-8 text-gray-500 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={20} /> Torna alla Home
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 jupiter-gradient rounded-3xl flex items-center justify-center jupiter-glow mx-auto mb-6 shadow-2xl">
            <Box className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">CloudBox</h1>
          <p className="text-gray-400 mt-2">La tua console Tema Giove ti aspetta.</p>
        </div>

        <div className="glass-card p-2 flex mb-8 bg-white/5">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${tab === 'login' ? 'bg-jupiter-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Accedi
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${tab === 'register' ? 'bg-jupiter-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Registrati
          </button>
        </div>

        <div className="glass-card p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Indirizzo Email</label>
              <input
                type="email"
                placeholder="nome@dominio.it"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-jupiter-500/50 transition-all text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-jupiter-500/50 transition-all text-white"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-jupiter-600 focus:ring-jupiter-500"
              />
              <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
                Accetto i <span className="text-red-400 underline font-medium">Termini di Servizio</span> e la <span className="text-red-400 underline font-medium">Politica No-Refund Rigida</span>.
                L'utente dichiara di aver compreso che il credito non è convertibile in denaro reale.
              </label>
            </div>
          )}

          <Button
            className="w-full py-4 text-lg font-bold"
            disabled={tab === 'register' && !acceptedTerms}
            onClick={onLogin}
          >
            {tab === 'login' ? 'Accedi al Sistema' : 'Crea Account'}
          </Button>

          <div className="text-center">
            <a href="#" className="text-sm text-gray-500 hover:text-jupiter-400 transition-colors">
              Hai dimenticato la password?
            </a>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs uppercase tracking-widest font-bold">
          <ShieldAlert size={14} /> Sistema Criptato 256-bit
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
