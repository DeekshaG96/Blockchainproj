import { BookOpen, ShieldCheck, Database, Cpu, Cloud, ListChecks, ArrowRight, Activity } from 'lucide-react';
import { ARCHITECTURE_PLAN } from '../constants';

export default function ArchitectureDocs() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="border-b border-zinc-900 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-emerald-500" size={28} />
          <h2 className="text-4xl font-extrabold tracking-tight text-white">Project Blueprint</h2>
        </div>
        <p className="text-zinc-500 font-mono text-sm leading-relaxed">
          Comprehensive guide for the "Next-Gen Decentralized Voting System" architecture, security protocols, and development roadmap.
        </p>
      </header>

      {/* Tech Stack */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Database className="text-blue-500" size={20} />
          Recommended Tech Stack
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(ARCHITECTURE_PLAN.stack).map(([key, value]) => (
            <div key={key} className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest font-bold mb-1">{key}</p>
              <p className="text-zinc-300 font-medium">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ZKP Deep Dive */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Cpu className="text-emerald-500" size={20} />
          ZKP Integration Strategy (Circom/SnarkJS)
        </h3>
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
          <div className="p-6 space-y-4">
            <div>
              <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2 font-bold">Circuit Logic</h4>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {ARCHITECTURE_PLAN.zkpStrategy.circuitLogic}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2 font-bold">Local Environment Setup</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ARCHITECTURE_PLAN.zkpStrategy.initialSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900 p-2 rounded border border-zinc-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Anomaly Design */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Activity className="text-amber-500" size={20} />
          AI Fraud & Anomaly Detection Design
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-zinc-900/40 border border-zinc-900 rounded-2xl">
            <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4 font-bold">Targeted Models</h4>
            <div className="space-y-3">
              {ARCHITECTURE_PLAN.aiModule.models.map(m => (
                <div key={m} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">{m.split(' (')[0]}</span>
                  <span className="text-[10px] font-mono text-zinc-600 italic">{m.split(' (')[1].replace(')', '')}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-zinc-900/40 border border-zinc-900 rounded-2xl">
            <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4 font-bold">Active Data Streams</h4>
            <div className="space-y-2">
              {ARCHITECTURE_PLAN.aiModule.dataSources.map(d => (
                <div key={d} className="text-xs text-zinc-400 flex gap-2 items-start">
                  <span className="text-amber-500 shrink-0">•</span>
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DID Interaction */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-blue-500" size={20} />
          DID Framework & Voter Registration
        </h3>
        <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-4">
          <p className="text-sm text-zinc-300 leading-relaxed italic">
            Moving away from centralized SQL/NoSQL databases, the system uses a <strong>Voter Registry Merkle Tree</strong> stored on-chain. Verification occurs via W3C Verifiable Credentials issued by trusted attestation nodes.
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-mono rounded">W3C_COMPLIANT</span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-mono rounded">ZERO_PII_STORAGE</span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-mono rounded">EIP-712_SIGNING</span>
          </div>
        </div>
      </section>

      {/* Interaction Blueprints */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-emerald-500" size={20} />
          Interaction Blueprints
        </h3>
        <div className="space-y-4">
          {ARCHITECTURE_PLAN.components.map((comp, idx) => (
            <div key={idx} className="flex gap-6 p-6 bg-zinc-900/40 border border-zinc-900 rounded-2xl group hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 shrink-0 bg-zinc-800 rounded-full flex items-center justify-center font-mono text-xs text-zinc-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                {(idx + 1).toString().padStart(2, '0')}
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">{comp.name}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{comp.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Audit Checklist */}
      <section className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-8 space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-rose-500">
          <ListChecks size={24} />
          Security Audit Checklist (Voting Contracts)
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {ARCHITECTURE_PLAN.securityAudit.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Roadmap */}
      <section className="space-y-8">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Cloud className="text-amber-500" size={20} />
          Phased Phased Roadmap
        </h3>
        <div className="relative pl-8 border-l border-zinc-900 space-y-12">
          {(ARCHITECTURE_PLAN as any).roadmap.map((phase: any, idx: number) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[41px] top-0 w-5 h-5 bg-zinc-950 border-2 border-zinc-900 rounded-full flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-emerald-400 mb-4">{phase.phase}</h4>
                <div className="flex flex-wrap gap-2">
                  {phase.tasks.map((task, tIdx) => (
                    <span key={tIdx} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      {task}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="pt-12 border-t border-zinc-900 text-center">
        <div className="p-8 bg-zinc-900/20 rounded-3xl border border-zinc-900 inline-block">
          <Cpu className="text-zinc-700 mx-auto mb-4" size={32} />
          <h4 className="font-bold mb-2">Ready to initiate Node Sync?</h4>
          <p className="text-xs text-zinc-500 mb-6 max-w-xs mx-auto">All systems are primed for local development and testing environment deployment.</p>
          <button className="px-8 py-3 bg-zinc-100 hover:bg-white text-black font-bold rounded-xl transition-all flex items-center gap-2 mx-auto shadow-2xl">
            CONTINUE TO DEPLOYMENT <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
