// Script to deploy the Pharovest contract to Pharos testnet
const hre = require('hardhat');
const { ethers } = require('hardhat');

async function main() {
  console.log('Deploying Pharovest contract to Pharos testnet...');

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);

  // Display account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} PHAR`);

  // Deploy the contract
  const pharovestFactory = await ethers.getContractFactory('Pharovest');
  const pharovest = await pharovestFactory.deploy(deployer.address);
  await pharovest.waitForDeployment();
  
  const pharovestAddress = await pharovest.getAddress();
  console.log(`Pharovest contract deployed to: ${pharovestAddress}`);
  
  // Get the transaction that deployed the contract
  const tx = pharovest.deploymentTransaction();
  console.log('Transaction hash:', tx?.hash);
  
  console.log('----------------------------------------------------');
  console.log('Contract deployment completed successfully!');
  console.log(`To verify the contract on Pharos Explorer, run:`);
  console.log(`npx hardhat verify --network pharos ${pharovestAddress} ${deployer.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Deployment failed with error:');
    console.error(error);
    process.exit(1);
  }); 