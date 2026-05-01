import { ethers } from 'ethers';
import VotingArtifact from '../../artifacts/contracts/Voting.sol/Voting.json';

export interface Candidate {
  id: number;
  name: string;
  voteCount: number;
  description: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  type: 'VOTE' | 'DID_REG' | 'ADMIN_ACTION' | 'ADD_CANDIDATE';
  payload: any;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  blockNumber: number;
}

class BlockchainService {
  private contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "0x298a182F3A1811EBe17B968EB5D70093B8bc4303";
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;

  private isVotingActive: boolean = false;
  private candidates: Candidate[] = [];
  private ledger: Transaction[] = []; // Local cache of transactions for UI purposes

  constructor() {
    this.initProvider();
  }

  async initProvider() {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    } else {
      console.warn("MetaMask not detected, using fallback read-only provider");
      this.provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/demo") as any;
    }
    
    if (this.provider) {
      this.contract = new ethers.Contract(this.contractAddress, VotingArtifact.abi, this.provider);
      
      // Listen to events
      this.contract.on("VoteCasted", (voter, candidateId, newVoteCount, event) => {
        this.addTransaction({
          hash: event.log.transactionHash,
          from: voter,
          to: this.contractAddress,
          value: '0',
          timestamp: Date.now(),
          type: 'VOTE',
          payload: { candidateId: Number(candidateId) },
          status: 'CONFIRMED',
          blockNumber: event.log.blockNumber
        });
        this.syncState();
      });

      this.contract.on("CandidateAdded", () => this.syncState());
      this.contract.on("ElectionStarted", () => {
        this.isVotingActive = true;
      });

      await this.syncState();
    }
  }

  async connectWallet(): Promise<string> {
    if (!this.provider) throw new Error("No web3 provider found");
    
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia Test Network",
                  nativeCurrency: { name: "SepoliaETH", symbol: "SEP", decimals: 18 },
                  rpcUrls: ["https://sepolia.infura.io/v3/"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          } catch (addError) {
            throw new Error("Failed to add Sepolia network to MetaMask");
          }
        } else {
          throw new Error("Failed to switch to Sepolia network");
        }
      }
      
      // CRITICAL: Re-instantiate provider after network switch to avoid "underlying network changed" error
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    }

    if (!this.provider) throw new Error("No web3 provider found");

    const accounts = await this.provider.send("eth_requestAccounts", []);
    this.signer = await this.provider.getSigner();
    
    // Reinitialize contract with signer context
    this.contract = new ethers.Contract(this.contractAddress, VotingArtifact.abi, this.signer);
    
    return accounts[0];
  }

  async syncState() {
    if (!this.contract) return;
    try {
      this.isVotingActive = await this.contract.electionStarted();
      const rawCandidates = await this.contract.getAllCandidates();
      
      this.candidates = rawCandidates.map((c: any) => ({
        id: Number(c.id),
        name: c.name,
        voteCount: Number(c.voteCount),
        description: "On-chain candidate"
      }));
    } catch (e) {
      console.error("Failed to sync state from contract", e);
    }
  }

  private addTransaction(tx: Transaction) {
    // Avoid duplicates
    if (!this.ledger.find(t => t.hash === tx.hash)) {
      this.ledger.unshift(tx);
    }
  }

  getTransactions() {
    return [...this.ledger].sort((a, b) => b.timestamp - a.timestamp);
  }

  getCandidates() {
    return this.candidates;
  }

  getVotingStatus() {
    return this.isVotingActive;
  }

  async setVotingStatus(active: boolean) {
    if (!this.signer || !this.contract) throw new Error("Wallet not connected");
    if (active) {
      const tx = await this.contract.startElection();
      await tx.wait();
      this.isVotingActive = true;
    }
  }

  async addCandidate(name: string, description: string) {
    if (!this.signer || !this.contract) throw new Error("Wallet not connected");
    const tx = await this.contract.addCandidate(name + " - " + description);
    await tx.wait();
    await this.syncState();
  }

  async hasVoted(address: string): Promise<boolean> {
    if (!this.contract) return false;
    return await this.contract.hasVoted(address);
  }

  async sendTransaction(type: Transaction['type'], from: string, payload: any): Promise<Transaction> {
    if (!this.signer || !this.contract) throw new Error("Wallet not connected");

    if (type === 'VOTE') {
      const tx = await this.contract.vote(payload.candidateId);
      const receipt = await tx.wait();
      
      const newTx: Transaction = {
        hash: receipt.hash,
        from,
        to: this.contractAddress,
        value: '0',
        timestamp: Date.now(),
        type: 'VOTE',
        payload,
        status: 'CONFIRMED',
        blockNumber: receipt.blockNumber
      };
      this.addTransaction(newTx);
      await this.syncState();
      return newTx;
    }
    
    throw new Error("Unsupported transaction type");
  }
}

export const blockchainService = new BlockchainService();
