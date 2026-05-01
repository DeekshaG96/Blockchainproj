/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout, Vote, ShieldCheck, Activity, UserCircle2, BookOpen, Lock, AlertTriangle, Cpu, Wallet, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import VoterPortal from './components/VoterPortal';
import AdminPortal from './components/AdminPortal';
import DIDRegistration from './components/DIDRegistration';
import ArchitectureDocs from './components/ArchitectureDocs';

type View = 'dashboard' | 'vote' | 'admin' | 'did' | 'docs';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDID, setUserDID] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      const { blockchainService } = await import('./services/blockchainService');
      const address = await blockchainService.connectWallet();
      setWalletAddress(address);
      
      // Auto-register DID as wallet address for simplicity
      setUserDID(address);
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Failed to connect wallet", e);
    } finally {
      setConnecting(false);
    }
  };

  const NavItem = ({ icon: Icon, label, view, active }: { icon: any, label: string, view: View, active: boolean }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 border-l-2 ${
        active 
          ? 'bg-zinc-900 border-emerald-500 text-emerald-400' 
          : 'border-transparent text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
      {active && (
        <motion.div
          layoutId="active-indicator"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
        />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Top Bar */}
      <header className="h-16 border-b border-zinc-900 flex items-center px-6 justify-between bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <Lock className="text-black" size={18} />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg leading-none">VotX</h1>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-widest italic font-medium">Secured by ZK-SNARKs</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {walletAddress ? (
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500">
                {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
              </span>
              <button 
                onClick={() => setWalletAddress(null)}
                className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400"
              >
                [X]
              </button>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              disabled={connecting}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-emerald-500/50 transition-all group"
            >
              <Wallet size={14} className="text-zinc-500 group-hover:text-emerald-500" />
              <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200">
                {connecting ? 'CONNECTING...' : 'CONNECT_WALLET'}
              </span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Mainnet Nodes: Active</span>
          </div>
          {userDID ? (
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="text-right">
                <p className="text-[10px] font-mono text-zinc-500 leading-none">VOTER_DID</p>
                <p className="text-xs font-medium text-emerald-400 truncate max-w-[100px]">{userDID}</p>
              </div>
              <UserCircle2 className="text-zinc-400 group-hover:text-emerald-400 transition-colors" size={24} />
            </div>
          ) : (
            <button 
              onClick={() => setCurrentView('did')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              REGISTER DID
            </button>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 h-[calc(100vh-64px)] border-r border-zinc-900 sticky top-16 hidden lg:block bg-[#0A0A0A]">
          <div className="py-6 flex flex-col gap-1">
            <p className="px-6 mb-2 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] italic font-semibold">Security Core</p>
            <NavItem icon={Layout} label="Global Stats" view="dashboard" active={currentView === 'dashboard'} />
            <NavItem icon={Vote} label="Voter Portal" view="vote" active={currentView === 'vote'} />
            <NavItem icon={ShieldCheck} label="DID Identity" view="did" active={currentView === 'did'} />
            
            <div className="mt-8">
              <p className="px-6 mb-2 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] italic font-semibold">Network Insights</p>
              <NavItem icon={Activity} label="Fraud Monitoring" view="admin" active={currentView === 'admin'} />
              <NavItem icon={BookOpen} label="Architecture Docs" view="docs" active={currentView === 'docs'} />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-zinc-900 bg-zinc-900/10">
            <div className="flex items-center gap-3 text-zinc-500">
              <Cpu size={16} />
              <div className="text-[10px] font-mono leading-tight">
                <p>PATTERN_DETECTION</p>
                <p className="text-emerald-500">STATUS_OPTIMAL</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 overflow-x-hidden min-h-[calc(100vh-64px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="max-w-6xl mx-auto"
            >
              {currentView === 'dashboard' && <Dashboard />}
              {currentView === 'vote' && <VoterPortal userDID={userDID} />}
              {currentView === 'did' && <DIDRegistration setUserDID={setUserDID} setAuth={setIsAuthenticated} />}
              {currentView === 'admin' && <AdminPortal />}
              {currentView === 'docs' && <ArchitectureDocs />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile nav indicator */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-full">
        <button onClick={() => setCurrentView('dashboard')} className={`p-3 rounded-full ${currentView === 'dashboard' ? 'bg-emerald-500 text-black' : 'text-zinc-400'}`}><Layout size={20} /></button>
        <button onClick={() => setCurrentView('vote')} className={`p-3 rounded-full ${currentView === 'vote' ? 'bg-emerald-500 text-black' : 'text-zinc-400'}`}><Vote size={20} /></button>
        <button onClick={() => setCurrentView('did')} className={`p-3 rounded-full ${currentView === 'did' ? 'bg-emerald-500 text-black' : 'text-zinc-400'}`}><ShieldCheck size={20} /></button>
        <button onClick={() => setCurrentView('admin')} className={`p-3 rounded-full ${currentView === 'admin' ? 'bg-emerald-500 text-black' : 'text-zinc-400'}`}><Activity size={20} /></button>
      </div>
    </div>
  );
}

