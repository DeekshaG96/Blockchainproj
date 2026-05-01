import { ethers } from "ethers";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

async function main() {
  if (!SEPOLIA_RPC_URL || !PRIVATE_KEY) {
    throw new Error("Missing SEPOLIA_RPC_URL or PRIVATE_KEY in .env");
  }

  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Get the deployed contract address from the frontend service
  const servicePath = "./src/services/blockchainService.ts";
  const content = fs.readFileSync(servicePath, "utf-8");
  const match = content.match(/private contractAddress = import\.meta\.env\.VITE_CONTRACT_ADDRESS \|\| "(0x[a-fA-F0-9]+)";/);
  
  if (!match) {
    throw new Error("Could not find contract address in blockchainService.ts");
  }
  
  const address = match[1];
  console.log("Found deployed contract at:", address);

  const artifactPath = "./artifacts/contracts/Voting.sol/Voting.json";
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const contract = new ethers.Contract(address, artifact.abi, wallet);

  console.log("\n--- Testing Feature: Add Candidate ---");
  try {
    const tx = await contract.addCandidate("Test Candidate - Automated Verification");
    console.log("Transaction sent! Hash:", tx.hash);
    await tx.wait();
    console.log("Candidate successfully added to Sepolia!");
  } catch (e) {
    console.log("Candidate might already exist or error:", e.message);
  }

  console.log("\n--- Testing Feature: Get Candidates ---");
  const candidates = await contract.getAllCandidates();
  console.log(`Found ${candidates.length} candidates on the blockchain.`);
  
  if (candidates.length > 0) {
    const firstCandidateId = candidates[0].id;
    
    console.log(`\n--- Testing Feature: Starting Election & Casting a Vote for Candidate #${firstCandidateId} ---`);
    try {
      console.log("Starting election...");
      const txStart = await contract.startElection();
      await txStart.wait();
      
      const tx2 = await contract.vote(firstCandidateId);
      console.log("Vote transaction sent! Hash:", tx2.hash);
      await tx2.wait();
      console.log("Vote successfully cast and recorded on Sepolia!");
    } catch (e) {
      console.log("Could not cast vote:", e.message.substring(0, 100));
    }

    const updatedCandidates = await contract.getAllCandidates();
    console.log("\n--- Final Vote Tally ---");
    updatedCandidates.forEach(c => {
      console.log(`- ${c.name}: ${c.voteCount} votes`);
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
