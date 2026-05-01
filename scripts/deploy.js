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

  console.log("Connecting to provider...");
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deploying from address:", wallet.address);

  // Read ABI and Bytecode from artifacts
  const artifactPath = "./artifacts/contracts/Voting.sol/Voting.json";
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  
  console.log("Sending deploy transaction...");
  const contract = await factory.deploy();
  
  console.log("Waiting for confirmation...");
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log("Voting contract deployed to:", address);

  // Update frontend service
  const servicePath = "./src/services/blockchainService.ts";
  let content = fs.readFileSync(servicePath, "utf-8");
  content = content.replace(
    /private contractAddress = import\.meta\.env\.VITE_CONTRACT_ADDRESS \|\| "0x[a-fA-F0-9]+";/,
    `private contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "${address}";`
  );
  fs.writeFileSync(servicePath, content);
  console.log("Updated src/services/blockchainService.ts with new address!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
