import hre from "hardhat";

async function main() {
  const factory = await hre.ethers.getContractFactory("Voting");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  console.log("Voting deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
