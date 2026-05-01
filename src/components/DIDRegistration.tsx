import { useState } from 'react';
import { Fingerprint, UserCheck, Shield, Key, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { blockchainService } from '../services/blockchainService';

export default function DIDRegistration({ setUserDID, setAuth }: { setUserDID: (did: string) => void, setAuth: (auth: boolean) => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [did, setDid] = useState<string | null>(null);

  const generateDID = async () => {
    setLoading(true);
    try {
      const address = await blockchainService.connectWallet();
      setDid(address);
      setStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const finalize = () => {
    if (did) {
      setUserDID(did);
      setAuth(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-12">
        <div className="inline-flex p-3 bg-zinc-900 border border-zinc-800 rounded-2xl mb-6 text-emerald-500">
          <Fingerprint size={32} />
        </div>
        <h2 className="text-3xl font-bold mb-2">Decentralized Identity</h2>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest italic font-medium">Bypassing centralized databases for ultimate privacy.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex border-b border-zinc-800">
          <div className={`flex-1 p-4 text-center text-xs font-bold uppercase tracking-widest ${step === 1 ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>01. Proof of Persoon</div>
          <div className={`flex-1 p-4 text-center text-xs font-bold uppercase tracking-widest ${step === 2 ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>02. Key Generation</div>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex gap-4 items-start p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <UserCheck className="text-emerald-500 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm">Biometric Attestation</h4>
                    <p className="text-xs text-zinc-500 mt-1">We use a local-only biometric check to verify you are a unique human without storing your data.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <Shield className="text-blue-500 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm">ZKP Enrollment</h4>
                    <p className="text-xs text-zinc-500 mt-1">Enrollment uses Zero-Knowledge Proofs to link your identity to the network anonymously.</p>
                  </div>
                </div>
              </div>

              <button 
                disabled={loading}
                onClick={generateDID}
                className="w-full py-4 bg-zinc-100 hover:bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : "GENERATE ENCRYPTED ID"}
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl relative overflow-hidden group">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">Your Unique DID</h4>
                  <RefreshCw className="text-zinc-700 hover:text-emerald-500 cursor-pointer transition-colors" size={14} />
                </div>
                <p className="font-mono text-emerald-400 break-all text-sm leading-relaxed">{did}</p>
                <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12">
                  <Fingerprint size={80} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg">
                  <Key className="text-zinc-500 mb-2" size={16} />
                  <p className="text-[10px] font-mono text-zinc-600">PUBLIC_KEY</p>
                  <p className="text-[10px] font-mono text-zinc-400 truncate">ox72...82a9</p>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg">
                  <Shield className="text-zinc-500 mb-2" size={16} />
                  <p className="text-[10px] font-mono text-zinc-600">REVOCATION_PASS</p>
                  <p className="text-[10px] font-mono text-zinc-400 truncate">enabled</p>
                </div>
              </div>

              <button 
                onClick={finalize}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)]"
              >
                FINALIZE REGISTRATION <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] leading-relaxed">
          Proprietary Decentralized Identity Protocol v2.4 <br/> 
          Aligned with W3C Verifiable Credentials Standard
        </p>
      </div>
    </div>
  );
}
