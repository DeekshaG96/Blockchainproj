import { useState, useEffect } from 'react';
import { Vote as VoteIcon, Lock, ShieldCheck, CheckCircle2, ChevronRight, Hash, EyeOff, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { blockchainService, Candidate } from '../services/blockchainService';

export default function VoterPortal({ userDID }: { userDID: string | null }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  const [isVotingActive, setIsVotingActive] = useState(true);
  const [proof, setProof] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchState = async () => {
      await blockchainService.syncState();
      setCandidates(blockchainService.getCandidates());
      setIsVotingActive(blockchainService.getVotingStatus());
      
      if (userDID) {
        const voted = await blockchainService.hasVoted(userDID);
        setIsVoted(voted);
      }
    };
    fetchState();
  }, [userDID]);

  const handleVote = async () => {
    if (!selected || !userDID) return;
    setIsVoting(true);
    setError(null);
    
    try {
      // Simulate ZK-Proof generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockProof = `zk_snark_proof_${Math.random().toString(36).substring(7)}`;
      setProof(mockProof);

      // Record the transaction on our blockchain ledger
      const tx = await blockchainService.sendTransaction('VOTE', userDID, { 
        candidateId: selected,
        proof: mockProof 
      });
      
      setTxHash(tx.hash);
      setIsVoted(true);
    } catch (err: any) {
      // Check if it's the "AlreadyVoted" custom error or a generic revert
      if (err.message && (err.message.includes("AlreadyVoted") || err.message.includes("execution reverted"))) {
        setError("You have already voted in this election!");
      } else {
        setError(err.message || "Transaction failed");
      }
    } finally {
      setIsVoting(false);
    }
  };

  if (!userDID) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-2xl mb-6">
          <Lock className="text-zinc-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Identity Required</h2>
        <p className="text-zinc-500 max-w-sm mb-8">You must register your Decentralized Identity (DID) before participating in the network.</p>
        <button className="px-6 py-2 bg-zinc-100 text-black font-bold rounded">Go to Registration</button>
      </div>
    );
  }

  if (!isVotingActive && !isVoted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-2xl mb-6">
          <AlertTriangle className="text-amber-500" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Voting Period Closed</h2>
        <p className="text-zinc-500 max-w-sm">The decentralized ledger is currently locked by the administrator. Please check back during the next election cycle.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Cast Your Vote</h2>
          <p className="text-zinc-500 font-mono text-sm italic">Voting privacy managed by Circom zk-SNARK verifiers.</p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
          <ShieldCheck className="text-emerald-500" size={18} />
          <div className="text-[10px] font-mono">
            <p className="text-emerald-500">DID_VERIFIED</p>
            <p className="text-zinc-500 uppercase">ELIGIBLE_TO_VOTE</p>
          </div>
        </div>
      </header>

      {!isVoted ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {candidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => setSelected(candidate.id)}
                className={`w-full text-left p-6 rounded-xl border transition-all flex items-center gap-6 group ${
                  selected === candidate.id 
                    ? 'bg-zinc-900 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                    : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${
                  selected === candidate.id ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'
                }`}>
                  {candidate.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${selected === candidate.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{candidate.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{candidate.description}</p>
                </div>
                {selected === candidate.id && <CheckCircle2 className="text-emerald-500" size={24} />}
              </button>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-fit sticky top-24">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Hash className="text-zinc-500" size={18} />
              Summary
            </h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-500">Voter Eligibility</span>
                <span className="text-emerald-500">PASS</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-500">Selection</span>
                <span className={selected ? 'text-zinc-200' : 'text-zinc-700'}>
                  {selected ? `Proposal ${candidates.find(c => c.id === selected)?.name.split(':')[0]}` : 'None'}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded flex items-center gap-2 text-rose-500 text-[10px] font-mono uppercase">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              disabled={!selected || isVoting}
              onClick={handleVote}
              className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                selected && !isVoting
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              {isVoting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  GEN_PROOF...
                </>
              ) : (
                <>
                  CAST VOTE (ZK)
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            <CheckCircle2 className="text-black" size={40} />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Transaction Confirmed</h3>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Your vote has been cryptographically recorded on the blockchain. 
            The ledger now contains your ZK-Proof.
          </p>
          
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 max-w-xl mx-auto text-left space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2 text-emerald-500">
                <Hash size={18} />
                <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Transaction Hash</span>
              </div>
              <div className="bg-zinc-900 p-3 rounded font-mono text-[10px] text-zinc-400 break-all border border-zinc-800">
                {txHash || 'ALREADY_VOTED_IN_THIS_ELECTION'}
              </div>
            </div>

            {proof && (
              <div>
                <div className="flex items-center gap-3 mb-2 text-blue-500">
                  <EyeOff size={18} />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Privacy Proof (ZK-SNARK)</span>
                </div>
                <div className="bg-zinc-900 p-3 rounded font-mono text-[10px] text-zinc-500 break-all leading-relaxed border border-zinc-800">
                  {proof}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
