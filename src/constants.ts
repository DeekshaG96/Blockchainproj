export const ARCHITECTURE_PLAN = {
  stack: {
    blockchain: "Polygon (Layer 2) - Selected for low gas costs and EVM compatibility.",
    zkp: "Circom & SnarkJS - Industry standard for generating efficient on-chain verifiers.",
    did: "Polygon ID / W3C VCs - Decentralized identity without PII storage.",
    ai: "Python/Scikit-Learn - Isolation Forests for fraud, LSTMs for pattern memory.",
    cloud: "GCP Cloud Run + KMS - Secure key management for relayers.",
  },
  zkpStrategy: {
    library: "Circom / SnarkJS",
    circuitLogic: "A Merkle Tree Proof of Membership. The voter proves they know a leaf in the eligible voter tree without revealing the index. A 'Nullifier' (Hash[Secret + ElectionID]) is revealed to prevent double-voting while keeping the identity secret.",
    initialSteps: [
      "Install circom compiler (Rust)",
      "Define circuit using .circom template",
      "Compile to R1CS and WASM",
      "Perform Trusted Setup (Powers of Tau)",
      "Generate Solidity Verifier contract"
    ]
  },
  aiModule: {
    models: ["Isolation Forest (Anomalies)", "LSTM (Sequential Patterns)", "XGBoost (Relational Fraud)"],
    dataSources: [
      "Transaction Frequency (Detects bots)",
      "Gas Price Spikes (Detects network stress/DoS)",
      "Relay Node Proximity (Detects localized coercion)",
      "Inter-vote Latency (Detects automated script behavior)"
    ],
    operation: "Operates as an off-chain relay listener. Flags are sent to a 'Security Multisig' which can pause contract functionality or trigger manual audit without decrypting individual votes."
  },
  components: [
    {
      name: "Frontend (React/Vite)",
      role: "User interface for DID registration, voting, and real-time result tracking."
    },
    {
      name: "DID Registry",
      role: "W3C compliant decentralized identifier management using Polygon ID SDK."
    },
    {
      name: "Smart Contracts",
      role: "Handles ZKP verification, vote tallying, and election state management (Solidity)."
    },
    {
      name: "ZKP Prover/Verifier",
      role: "SnarkJS client-side proof generation and on-chain verification contracts."
    },
    {
      name: "AI Anomaly Engine",
      role: "Continuous monitoring of transaction sub-graphs for suspicious clusters."
    }
  ],
  securityAudit: [
    "Reentrancy protection on all vote casting functions",
    "Integer overflow/underflow checks (Solidity 0.8+)",
    "ZKP Nullifier verification to prevent double-voting",
    "Access control (Ownable/Roles) for admin functions",
    "Gas limit optimization to prevent DoS attacks"
  ],
  roadmap: [
    { phase: "Phase 1: Genesis", tasks: ["Smart Contract Deployment", "DID Registry Setup", "AI Model Training"] },
    { phase: "Phase 2: Expansion", tasks: ["Multi-District Support", "ZK-Proof Optimization", "Cross-Chain Relayers"] },
    { phase: "Phase 3: Autonomy", tasks: ["DAO Integration", "Decentralized Hosting", "Global Election Support"] }
  ]
};
