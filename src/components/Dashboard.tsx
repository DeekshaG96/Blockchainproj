import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Vote as VoteIcon, ShieldAlert, Cpu, Globe, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { blockchainService } from '../services/blockchainService';
import { useEffect, useState } from 'react';

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-emerald-500/50 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-zinc-800 group-hover:bg-${color}-500/10 text-${color}-500 transition-colors`}>
        <Icon size={24} />
      </div>
      <span className={`text-xs font-mono ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend}
      </span>
    </div>
    <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-1">{label}</h3>
    <p className="text-2xl font-bold tracking-tight text-zinc-100">{value}</p>
  </div>
);

export default function Dashboard() {
  const [candidates, setCandidates] = useState(blockchainService.getCandidates());
  const [txs, setTxs] = useState(blockchainService.getTransactions());

  useEffect(() => {
    // Poll for updates (simplified)
    const interval = setInterval(() => {
      setCandidates(blockchainService.getCandidates());
      setTxs(blockchainService.getTransactions());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const chartData = candidates.map(c => ({
    name: c.name.split(':')[0],
    votes: c.voteCount,
    color: '#10b981'
  }));

  const totalRegistered = txs.filter(t => t.type === 'DID_REG').length + 124500; // Base + actual

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Network Overview</h2>
        <p className="text-zinc-500 font-mono text-sm italic">Monitoring real-time cryptographic integrity across 12 nodes.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total DID Registered" value={totalRegistered.toLocaleString()} trend="+0.2%" color="emerald" />
        <StatCard icon={VoteIcon} label="Votes Cast" value={txs.filter(t => t.type === 'VOTE').length.toString()} trend="+100%" color="blue" />
        <StatCard icon={ShieldAlert} label="Fraud Attempts Blocked" value="1,204" trend="-4.1%" color="rose" />
        <StatCard icon={Cpu} label="Avg Proof Verification Time" value="42ms" trend="-2.4%" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={20} />
              Participation by Candidate
            </h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-zinc-800 text-[10px] rounded font-mono text-zinc-400">LIVE_DATA</span>
              <span className="px-2 py-1 bg-emerald-500/10 text-[10px] rounded font-mono text-emerald-400">ENCRYPTED</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'monospace' }} 
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: '#18181b' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Globe className="text-blue-500" size={20} />
            Node Health
          </h3>
          <div className="space-y-4 flex-1">
            {[
              { id: 'NY-SEC-01', status: 'Online', latency: '12ms' },
              { id: 'SG-SEC-04', status: 'Online', latency: '45ms' },
              { id: 'EU-SEC-12', status: 'Online', latency: '28ms' },
              { id: 'JP-SEC-09', status: 'Syncing', latency: '112ms' },
              { id: 'AU-SEC-05', status: 'Online', latency: '82ms' },
            ].map(node => (
              <div key={node.id} className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${node.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                  <div>
                    <p className="text-xs font-bold font-mono">{node.id}</p>
                    <p className="text-[10px] text-zinc-500 uppercase">{node.status}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">{node.latency}</span>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-2 border border-zinc-800 hover:bg-zinc-800 rounded transition-colors text-xs font-mono uppercase tracking-widest text-zinc-400">
            Node Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
