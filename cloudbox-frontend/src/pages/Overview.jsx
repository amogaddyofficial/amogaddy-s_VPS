import React from 'react';
import { Card } from '../components/UI';
import { Activity, Server, Cpu, HardDrive } from 'lucide-react';

const Overview = () => {
  const stats = [
    { label: 'VPS Attive', value: '3', icon: Server, color: 'text-jupiter-400' },
    { label: 'Utilizzo CPU', value: '42%', icon: Cpu, color: 'text-blue-400' },
    { label: 'Storage Usato', value: '128GB', icon: HardDrive, color: 'text-purple-400' },
    { label: 'Uptime Globale', value: '99.9%', icon: Activity, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Benvenuto, Comandante</h1>
        <p className="text-gray-400">Ecco lo stato attuale della tua flotta CloudBox.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Utilizzo Risorse" subtitle="Andamento nelle ultime 24 ore">
          <div className="h-64 flex items-end justify-between gap-2 pt-4">
            {[40, 25, 45, 30, 55, 70, 45, 60, 35, 50, 40, 60].map((h, i) => (
              <div
                key={i}
                className="w-full bg-jupiter-500/20 rounded-t-sm transition-all hover:bg-jupiter-500/40"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
        </Card>

        <Card title="Attività Recenti" subtitle="Ultime operazioni sui nodi Scaleway">
          <div className="space-y-4 mt-4">
            {[
              { msg: 'VPS "Web-Server-01" riavviata con successo', time: '2 min fa' },
              { msg: 'Nuovo backup creato per "DB-Master"', time: '1 ora fa' },
              { msg: 'Raggiunto 80% quota traffico su "Storage-Node"', time: '3 ore fa' },
            ].map((act, i) => (
              <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-gray-300">{act.msg}</span>
                <span className="text-gray-500">{act.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
