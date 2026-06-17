import React from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Wallet, CreditCard, History, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

const WalletPage = () => {
  return (
    <div className="space-y-12 py-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight italic mb-2">Portafoglio & Wallet</h1>
        <p className="text-gray-400">Gestisci i tuoi crediti prepagati per le risorse CloudBox.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Saldo Gigante */}
        <Card className="lg:col-span-1 p-8 flex flex-col items-center justify-center text-center space-y-6 border-jupiter-500/20 bg-jupiter-500/[0.02] relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 opacity-5">
             <Wallet size={200} />
          </div>
          <div className="w-16 h-16 bg-jupiter-500/10 rounded-full flex items-center justify-center text-jupiter-500">
            <Wallet size={32} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-2">Saldo Attuale</div>
            <div className="text-6xl font-black italic tracking-tighter">0,00€</div>
          </div>
          <Badge variant="info">Credito Non Rimborsabile</Badge>
        </Card>

        {/* Modulo Ricarica */}
        <Card className="lg:col-span-2 p-8" title="Ricarica Istantanea" subtitle="Il credito verrà accreditato immediatamente dopo il pagamento.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {['1,50€', '5,00€', '10,00€', '25,00€'].map((taglio) => (
              <button
                key={taglio}
                className="p-4 rounded-xl border border-white/5 bg-white/2 hover:border-jupiter-500/50 hover:bg-jupiter-500/5 transition-all group"
              >
                <div className="text-xl font-bold group-hover:text-jupiter-400 transition-colors">{taglio}</div>
                <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Seleziona</div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
             <Button className="w-full py-4 text-lg font-bold flex items-center justify-center gap-3">
                <CreditCard size={24} /> Paga con PayPal Standard
             </Button>
             <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> Ricarica Minima 1,50€</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> Zero Commissioni</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> Webhook Sicuro</span>
             </div>
          </div>
        </Card>
      </div>

      {/* Storico Transazioni */}
      <Card title="Storico Transazioni" subtitle="Registro delle operazioni finanziarie e dei consumi PaaS.">
        <div className="border border-white/5 rounded-xl overflow-hidden mt-6">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-white/5">
            <div className="col-span-4">Descrizione</div>
            <div className="col-span-3 text-right">Data</div>
            <div className="col-span-3 text-right">Metodo</div>
            <div className="col-span-2 text-right">Importo</div>
          </div>
          <div className="p-12 text-center text-gray-600 italic text-sm">
            Nessuna transazione registrata al momento.
          </div>
        </div>
      </Card>

      {/* Footer Legale Rigido */}
      <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-start">
         <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0">
            <ShieldAlert size={24} />
         </div>
         <div className="space-y-2">
            <h4 className="text-lg font-bold text-red-400 italic">Politica No-Refund Rigida</h4>
            <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
              Il credito inserito nel Wallet non è mai rimborsabile o convertibile in denaro reale, salvo guasti hardware gravi o downtime dell'infrastruttura superiore alle 48 ore consecutive.
              CloudBox PaaS opera come un servizio prepagato; caricando fondi dichiari di accettare espressamente queste condizioni.
            </p>
         </div>
      </div>
    </div>
  );
};

export default WalletPage;
