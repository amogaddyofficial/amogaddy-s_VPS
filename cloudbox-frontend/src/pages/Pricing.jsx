import React from 'react';
import { Card, Button } from '../components/UI';
import { Check, Zap, Shield, Globe } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Free (Esploratore)',
      price: '€0',
      description: 'Per testare la potenza di CloudBox.',
      features: ['1 vCPU', '2GB RAM', '20GB NVMe', 'Tempo limitato (Reset giornaliero)', 'XFCE Desktop'],
      color: 'border-gray-500/30',
      button: 'Inizia Gratis'
    },
    {
      name: 'Pro (Pioniere)',
      price: '€15/mese',
      description: 'Il cuore del Tema Giove.',
      features: ['4 vCPU', '8GB RAM', '80GB NVMe', 'Uptime 99.9%', 'Supporto Prioritario', 'Backup Settimanali'],
      color: 'border-jupiter-500/50 ring-2 ring-jupiter-500/20 scale-105',
      button: 'Scegli Pro',
      popular: true
    },
    {
      name: 'Enterprise (Gigante)',
      price: 'Custom',
      description: 'Potenza illimitata per grandi progetti.',
      features: ['Risorse Dedicate', 'RAM fino a 128GB', 'Storage Scalabile', 'Network 10Gbps', 'Manager Dedicato'],
      color: 'border-purple-500/30',
      button: 'Contattaci'
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Piani di Potenza</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Scegli la configurazione perfetta per le tue esigenze su Scaleway.
          Ogni piano include il Tema Giove pre-installato.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
        {plans.map((plan, i) => (
          <Card key={i} className={`relative flex flex-col justify-between ${plan.color}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 jupiter-gradient text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Più Popolare
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-gray-500 text-sm">/mese</span>}
              </div>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-jupiter-400" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <Button variant={plan.popular ? 'primary' : 'secondary'} className="w-full py-3">
              {plan.button}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
