const hre = require("hardhat");

async function main() {
  console.log("Deploying DiploChain contracts...");

  // Deploy DiplomaIssuer
  const DiplomaIssuer = await hre.ethers.getContractFactory("DiplomaIssuer");
  const issuer = await DiplomaIssuer.deploy();
  await issuer.waitForDeployment();
  const issuerAddress = await issuer.getAddress();
  console.log(`DiplomaIssuer deployed to: ${issuerAddress}`);

  // Deploy DiplomaVerifier
  const DiplomaVerifier = await hre.ethers.getContractFactory("DiplomaVerifier");
  const verifier = await DiplomaVerifier.deploy(issuerAddress);
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log(`DiplomaVerifier deployed to: ${verifierAddress}`);

  console.log("Deployment completed successfully!");
  
  // Log the addresses for backend configuration
  console.log("-----------------------------------------");
  console.log("BACKEND CONFIGURATION:");
  console.log(`BLOCKCHAIN_CONTRACT_ISSUER_ADDRESS=${issuerAddress}`);
  console.log(`BLOCKCHAIN_CONTRACT_VERIFIER_ADDRESS=${verifierAddress}`);
  console.log("-----------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
