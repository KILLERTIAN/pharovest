import { ethers } from "ethers";
import dotenv from 'dotenv';
dotenv.config();

// Get project ID and other arguments from command line arguments
const projectId = process.argv[2] ? parseInt(process.argv[2], 10) : null;
const title = process.argv[3] || "Sample Project";
const totalAmountInEth = process.argv[4] || "1.0";

async function main() {
  try {
    // Validate project ID
    if (projectId === null) {
      console.error("Please provide a project ID as the first command line argument");
      console.log("Example: node create-project-with-id.js 4 'My Project' 1.5");
      process.exit(1);
    }
    
    // Get private key from .env file
    const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      console.error("Please set your DEPLOYER_PRIVATE_KEY in a .env file");
      process.exit(1);
    }
    
    // Contract address
    const contractAddress = "0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C";
    
    // Connect to Pharos RPC
    const provider = new ethers.JsonRpcProvider("https://devnet.dplabs-internal.com");
    
    // Create wallet with private key
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`Using wallet address: ${wallet.address}`);
    
    // ABI with the createProjectWithId function
    const abi = [
      "function createProjectWithId(uint256 projectId, uint256 totalAmount, tuple(string title, uint256 amountRequired, address payable recipient, bool isCompleted)[] memory milestones) external",
      "function projectCount() view returns (uint256)",
      "function getProject(uint256 projectId) view returns (uint256, uint256, bool, uint256)"
    ];
    
    // Connect to contract with signer
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    // Get initial project count
    const projectCount = await contract.projectCount();
    console.log(`Current project count: ${projectCount.toString()}`);
    
    // Check if project already exists
    try {
      const existingProject = await contract.getProject(projectId);
      if (existingProject[0] > 0 || existingProject[1] > 0 || existingProject[2] === true || existingProject[3] > 0) {
        console.log(`Project ${projectId} already exists on the blockchain. Skipping creation.`);
        return;
      }
    } catch (error) {
      console.log(`Project ${projectId} doesn't exist yet. Creating...`);
    }
    
    console.log(`Creating project ${projectId}: ${title}...`);
    
    // Create simple milestones
    const milestoneCount = 3;
    const milestoneAmount = parseFloat(totalAmountInEth) / milestoneCount;
    
    const formattedMilestones = [];
    for (let i = 0; i < milestoneCount; i++) {
      formattedMilestones.push({
        title: `Milestone ${i + 1}`,
        amountRequired: ethers.parseEther(milestoneAmount.toFixed(6)),
        recipient: wallet.address, // Using the wallet address as recipient
        isCompleted: false
      });
    }
    
    // Total amount in ETH
    const totalAmount = ethers.parseEther(totalAmountInEth);
    
    // Create project with specific ID
    const tx = await contract.createProjectWithId(projectId, totalAmount, formattedMilestones);
    console.log(`Transaction hash: ${tx.hash}`);
    
    // Wait for transaction to be mined
    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();
    
    // Get updated project count
    const newProjectCount = await contract.projectCount();
    console.log(`Project ${projectId} created successfully!`);
    console.log(`New project count: ${newProjectCount.toString()}`);
    
    // Verify the project was created with the correct ID
    const createdProject = await contract.getProject(projectId);
    console.log(`Project ${projectId} data:`, {
      totalAmount: createdProject[0].toString(),
      amountRaised: createdProject[1].toString(),
      isActive: createdProject[2],
      milestonesCount: createdProject[3].toString()
    });
    
  } catch (error) {
    console.error("Error creating project:", error.message);
  }
}

// Execute the main function
main(); 