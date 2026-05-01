# VotX: Decentralized Voting System 🗳️

[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)](https://ethereum.org/)
[![Solidity](https://img.shields.io/badge/Solidity-e6e6e6?style=for-the-badge&logo=solidity&logoColor=black)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-FFF831?style=for-the-badge&logo=hardhat&logoColor=black)](https://hardhat.org/)

**VotX** is a next-generation decentralized application (dApp) built on the Ethereum blockchain that ensures secure, transparent, and tamper-proof elections. By leveraging smart contracts and Web3 technologies, VotX eliminates double-voting and provides real-time, immutable election results.

---

## ✨ Key Features

- **Decentralized Identity (DID)**: Authenticate securely using your Ethereum wallet (MetaMask) without centralized databases.
- **Smart Contract Core**: Immutable election logic written in Solidity and deployed to the Ethereum network.
- **Admin Controls**: Secure admin portal to register new proposals/candidates and toggle election states.
- **Real-time Synchronization**: Listen to on-chain events via `ethers.js` to update vote tallies instantly.
- **Fraud Prevention**: Smart contract guarantees one vote per address.

## 🛠️ Technology Stack

- **Smart Contracts**: Solidity ^0.8.24, Hardhat, Ethers.js
- **Frontend**: React.js, Vite, TypeScript, TailwindCSS
- **Blockchain Network**: Sepolia Testnet

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MetaMask](https://metamask.io/) browser extension

### 1. Installation

Clone the repository and install the required dependencies:

```bash
git clone https://github.com/DeekshaG96/Blockchainproj.git
cd Blockchainproj
npm install
```

### 2. Local Blockchain Setup

Spin up a local Hardhat node to test smart contracts:

```bash
npx hardhat node
```

In a new terminal window, deploy the smart contracts to your local network:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Run the Frontend

Start the Vite development server:

```bash
npm run dev
```

The application will be running at `http://localhost:3000`. 
*(Note: To test locally, you will need to add the Localhost 8545 network to MetaMask and import one of the Hardhat test private keys).*

## 🌐 Public Deployment (Sepolia Testnet)

This project is configured for deployment to the **Sepolia** testnet. 

To deploy your own instance:
1. Create a `.env` file from the `.env.example`.
2. Add your `SEPOLIA_RPC_URL` (from Alchemy/Infura) and your MetaMask `PRIVATE_KEY` (must be funded with Sepolia ETH).
3. Run the deployment script:
   ```bash
   node scripts/deploy.js
   ```
4. Update your frontend environment variables with the newly deployed contract address (`VITE_CONTRACT_ADDRESS`).

---
*Built with ❤️ for a decentralized future.*
