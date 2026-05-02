import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu, AlertCircle, CheckCircle2, Search, BrainCircuit, Terminal, RefreshCw, Hash, Database, Plus, Play, Square, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { blockchainService, Transaction, Candidate } from '../services/blockchainService';

export default function AdminPortal() {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [logs, setLogs] = useState<Transaction[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votingActive, setVotingActive] = useState(true);
  const [activeTab, setActiveTab] = useState<'monitor' | 'manage'>('monitor');

  // Candidate creation state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  const refreshState = async () => {
    await blockchainService.syncState();
    setLogs(blockchainService.getTransactions());
    setCandidates(blockchainService.getCandidates());
    setVotingActive(blockchainService.getVotingStatus());
  };

  useEffect(() => {
    refreshState();
  }, []);

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    if (!newName || !newDesc) return;
    
    try {
      await blockchainService.addCandidate(newName, newDesc);
      setNewName('');
      setNewDesc('');
      refreshState();
    } catch (err: any) {
      if (err.message && err.message.includes("ElectionAlreadyStarted")) {
        setAdminError("Cannot add candidates! The election has already started.");
      } else {
        setAdminError("Transaction failed. Make sure you are the contract admin.");
      }
    }
  };

  const toggleVoting = async () => {
    if (votingActive) return; // Smart contract is immutable, cannot stop election
    setAdminError(null);
    try {
      await blockchainService.setVotingStatus(true);
      refreshState();
    } catch (err: any) {
      setAdminError("Transaction failed. Make sure you are the contract admin.");
    }
  };

  const runAiDetection = async () => {
    setAnalyzing(true);
    setAiInsight(null);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API key missing");
      
      const ai = new GoogleGenAI({ apiKey });
      
      // Use actual logs, or fallback to simulated network activity if ledger is empty (for Vercel demo)
      const analysisData = logs.length > 0 ? logs.slice(0, 10) : [
        { hash: "0x8f2a...", type: "VOTE", from: "0x1A4...", blockNumber: 5231991, timestamp: Date.now() - 5000 },
        { hash: "0x3b1c...", type: "VOTE", from: "0x1A4...", blockNumber: 5231991, timestamp: Date.now() - 4500 },
        { hash: "0x9c4d...", type: "VOTE", from: "0x1A4...", blockNumber: 5231991, timestamp: Date.now() - 4000 } // Simulated Sybil attack
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: "You are a cybersecurity AI monitoring a decentralized voting network. Analyze the given blockchain transaction logs and provide a brief, professional security assessment as a lead architect. Identify if there are clusters of similar transactions or sudden spikes which could indicate botting."
        },
        contents: `Analyze these network transactions: ${JSON.stringify(analysisData)}`
      });
      setAiInsight(response.text || "No anomalies detected.");
    } catch (err: any) {
      setAiInsight("AI analysis failed. Please ensure VITE_GEMINI_API_KEY is set correctly.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Network Control</h2>
          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => setActiveTab('monitor')}
              className={`text-xs font-mono uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'monitor' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-zinc-500'}`}
            >
              System Monitoring
            </button>
            <button 
              onClick={() => setActiveTab('manage')}
              className={`text-xs font-mono uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'manage' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-zinc-500'}`}
            >
              Election Logic
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={refreshState}
            className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {activeTab === 'monitor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Database size={16} className="text-emerald-500" />
                  Immutable Transaction Log
                </h3>
                <div className="flex items-center gap-2 px-2 py-1 bg-black rounded border border-zinc-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-zinc-500">LIVE_CHAIN</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px]">
                  <thead>
                    <tr className="bg-zinc-900 text-zinc-500 border-b border-zinc-800">
                      <th className="p-4 font-medium uppercase tracking-wider">Hash</th>
                      <th className="p-4 font-medium uppercase tracking-wider">Type</th>
                      <th className="p-4 font-medium uppercase tracking-wider">From</th>
                      <th className="p-4 font-medium uppercase tracking-wider">Block</th>
                      <th className="p-4 font-medium uppercase tracking-wider text-right">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length > 0 ? logs.map((tx) => (
                      <tr key={tx.hash} className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                        <td className="p-4 text-emerald-500 font-bold truncate max-w-[100px]">{tx.hash}</td>
                        <td className="p-4">
                          <span className={`px-1.5 py-0.5 rounded ${
                            tx.type === 'VOTE' ? 'bg-blue-500/10 text-blue-500' : 
                            tx.type === 'DID_REG' ? 'bg-purple-500/10 text-purple-500' :
                            'bg-amber-500/10 text-amber-500'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-500 truncate max-w-[120px]">{tx.from}</td>
                        <td className="p-4 text-zinc-400">#{tx.blockNumber}</td>
                        <td className="p-4 text-right text-zinc-600">
                          {Math.floor((Date.now() - tx.timestamp) / 1000)}s ago
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-zinc-600 italic">No transactions found on chain.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <BrainCircuit className="text-emerald-500" size={20} />
                  AI Insights
                </h3>
                <button 
                  onClick={runAiDetection}
                  disabled={analyzing}
                  className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 hover:text-emerald-400 disabled:opacity-50"
                >
                  RUN_SCAN
                </button>
              </div>
              
              {analyzing ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <RefreshCw className="animate-spin text-emerald-500" size={24} />
                  <p className="text-xs font-mono text-zinc-400 uppercase">Detecting Anomalies...</p>
                </div>
              ) : aiInsight ? (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <p className="text-xs text-zinc-300 leading-relaxed italic">"{aiInsight}"</p>
                </div>
              ) : (
                <div className="py-8 text-center text-zinc-600 italic text-xs">Run a scan to analyze recent patterns.</div>
              )}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold flex items-center gap-2 mb-6 text-amber-500">
                <ShieldAlert size={20} />
                Network State
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Voting Active</span>
                  <span className={votingActive ? 'text-emerald-500' : 'text-rose-500'}>{votingActive ? 'YES' : 'NO'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Candidate Count</span>
                  <span className="text-zinc-200">{candidates.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Chain Height</span>
                  <span className="text-zinc-200 font-mono">#{logs[0]?.blockNumber || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {adminError && (
            <div className="col-span-full p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-500">
              <AlertCircle size={20} />
              <p className="font-bold text-sm">{adminError}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                <Plus className="text-emerald-500" size={24} />
                Register New Candidate
              </h3>
              <form onSubmit={handleAddCandidate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Proposal Name</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Universal Basic Income"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Brief Description</label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Details about the proposal implementation..."
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-all h-24"
                  />
                </div>
                <button 
                  disabled={votingActive}
                  className={`w-full py-4 font-extrabold rounded-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] ${
                    votingActive ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none' : 'bg-emerald-600 hover:bg-emerald-500 text-black'
                  }`}
                >
                  {votingActive ? 'ELECTION STARTED (LOCKED)' : 'ADD TO BLOCKCHAIN'}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                 <Cpu className="text-blue-500" size={24} />
                 Election State Toggle
              </h3>
              <div className="p-6 bg-black border border-zinc-800 rounded-xl flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-bold text-sm">Contract Status</h4>
                  <p className="text-xs text-zinc-500 uppercase font-mono">{votingActive ? 'Election Active' : 'Waiting for Admin'}</p>
                </div>
                <button 
                  onClick={toggleVoting}
                  disabled={votingActive}
                  className={`px-6 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                    votingActive 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-not-allowed opacity-50' 
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                  }`}
                >
                  {votingActive ? <CheckCircle2 size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                  {votingActive ? 'ACTIVE (PERMANENT)' : 'START_ELECTION'}
                </button>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Active Candidates</h4>
                {candidates.map(c => (
                  <div key={c.id} className="p-4 border border-zinc-800 rounded-lg flex justify-between items-center bg-zinc-950">
                    <div>
                      <p className="text-sm font-bold">{c.name}</p>
                      <p className="text-[10px] text-zinc-500 italic">#{c.id}</p>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">{c.voteCount} Votes</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
