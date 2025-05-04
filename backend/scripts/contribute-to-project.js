import { ethers } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config();

// Get private key from env or args
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error("Please set DEPLOYER_PRIVATE_KEY or PRIVATE_KEY in .env file");
  process.exit(1);
}

// Contract address
const contractAddress = "0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C";

// Target project ID to contribute to
const PROJECT_ID = 4;
const DONATION_AMOUNT = "0.05"; // ETH

// Minimal ABI for the functions we need
const abi = [
  "function contribute(uint256 projectId) external payable",
  "function getProject(uint256 projectId) view returns (uint256, uint256, bool, uint256)"
];

async function main() {
  try {
    // Set up provider
    const provider = new ethers.JsonRpcProvider("https://devnet.dplabs-internal.com");
    await provider.ready;
    console.log("Connected to RPC provider");
    
    // Create wallet
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`Using wallet address: ${wallet.address}`);
    
    // Get wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);
    
    // Connect to contract
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    // Check if project exists and is active
    try {
      const project = await contract.getProject(PROJECT_ID);
      console.log(`Project ${PROJECT_ID} details:`);
      console.log(`Total amount: ${ethers.formatEther(project[0])} ETH`);
      console.log(`Amount raised: ${ethers.formatEther(project[1])} ETH`);
      console.log(`Is active: ${project[2]}`);
      console.log(`Milestones count: ${project[3]}`);
      
      if (!project[2]) {
        console.error(`Project ${PROJECT_ID} is not active!`);
        return;
      }
    } catch (error) {
      console.error(`Error checking project ${PROJECT_ID}:`, error.message);
      return;
    }
    
    console.log(`\nContributing ${DONATION_AMOUNT} ETH to project ${PROJECT_ID}...`);
    
    // Estimate gas
    try {
      const gasEstimate = await contract.contribute.estimateGas(PROJECT_ID, {
        value: ethers.parseEther(DONATION_AMOUNT)
      });
      console.log(`Estimated gas: ${gasEstimate.toString()}`);
    } catch (error) {
      console.error("Gas estimation failed:", error.message);
      return;
    }
    
    // Contribute to project
    const tx = await contract.contribute(PROJECT_ID, {
      value: ethers.parseEther(DONATION_AMOUNT),
      gasLimit: 300000 // Set explicit gas limit to avoid issues
    });
    
    console.log(`Transaction sent: ${tx.hash}`);
    console.log("Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    // Verify contribution was successful
    try {
      const updatedProject = await contract.getProject(PROJECT_ID);
      console.log(`\nUpdated project ${PROJECT_ID} details:`);
      console.log(`Total amount: ${ethers.formatEther(updatedProject[0])} ETH`);
      console.log(`Amount raised: ${ethers.formatEther(updatedProject[1])} ETH`);
      console.log(`Is active: ${updatedProject[2]}`);
      console.log(`Milestones count: ${updatedProject[3]}`);
      
      // Check if our contribution is reflected
      if (updatedProject[1] > ethers.parseEther("0")) {
        console.log(`\n✅ Success! Project now has ${ethers.formatEther(updatedProject[1])} ETH in contributions.`);
      } else {
        console.log(`\n⚠️ Warning: Contribution may not have been properly recorded. Please check the transaction.`);
      }
    } catch (error) {
      console.error("Error verifying contribution:", error.message);
    }
    
  } catch (error) {
    console.error("Error in main function:", error.message);
  }
}

main().catch(error => {
  console.error("Unhandled error:", error);
  process.exit(1);
}); 