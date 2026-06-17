import React from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Play, Square, Terminal, MoreVertical, Search, Plus } from 'lucide-react';

const VPSManagement = () => {
  const instances = [
    { name: 'Jupiter-XFCE-01', status: 'running', ip: '51.15.242.10', plan: 'Pro', region: 'Paris' },
    { name: 'CloudBox-Dev-Node', status: 'stopped', ip: '163.172.15.102', plan: 'Free', region: 'Amsterdam' },
    { name: 'Web-App-Prod', status: 'running', ip: '212.47.233.15', plan: 'Enterprise', region: 'Warsaw' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestione VPS</h1>
          <p className="text-gray-400">Controlla e monitora le tue istanze Scaleway.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={20} /> Nuova Istanza
        </Button>
      </div>

      <div className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/5">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Cerca per nome o IP..."
          className="bg-transparent border-none outline-none text-white w-full"
        />
      </div>

      <div className="grid gap-4">
        {instances.map((vps, i) => (
          <Card key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${vps.status === 'running' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                <Terminal size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{vps.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{vps.ip}</span>
                  <span>•</span>
                  <span>{vps.region}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <Badge variant={vps.status === 'running' ? 'success' : 'danger'}>
                  {vps.status.toUpperCase()}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">Piano: {vps.plan}</p>
              </div>

              <div className="flex items-center gap-2">
                {vps.status === 'running' ? (
                  <Button variant="secondary" className="p-2">
                    <Square size={18} className="text-red-400" />
                  </Button>
                ) : (
                  <Button variant="secondary" className="p-2">
                    <Play size={18} className="text-green-400" />
                  </Button>
                )}
                <Button variant="secondary" className="p-2">
                  <Terminal size={18} />
                </Button>
                <Button variant="secondary" className="p-2">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VPSManagement;
