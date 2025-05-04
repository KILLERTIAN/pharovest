import { ethers } from "ethers";
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    // Project ID to create
    const projectId = 4;
    const projectTitle = "Eco-Friendly Packaging";
    const totalAmountInEth = "1.2";
    
    // Get private key from .env file
    const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      console.error("Please set your DEPLOYER_PRIVATE_KEY or PRIVATE_KEY in a .env file");
      process.exit(1);
    }
    
    // Contract address
    const contractAddress = "0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C";
    
    // Connect to Pharos RPC
    const provider = new ethers.JsonRpcProvider("https://devnet.dplabs-internal.com");
    
    // Create wallet with private key
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`Using wallet address: ${wallet.address}`);
    
    // ABI for contract
    const abi = [
      "function projectCount() view returns (uint256)",
      "function getProject(uint256 projectId) view returns (uint256, uint256, bool, uint256)",
      "function createProject(uint256 totalAmount, tuple(string title, uint256 amountRequired, address payable recipient, bool isCompleted)[] memory milestones) external"
    ];
    
    // Connect to contract with signer
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    // Get current project count
    const projectCount = await contract.projectCount();
    console.log(`Current project count: ${projectCount.toString()}`);
    
    // If Project ID 4 is greater than current count, create filler projects
    if (projectId >= projectCount) {
      console.log(`Need to create ${projectId - Number(projectCount) + 1} projects to reach ID ${projectId}`);
      
      // Create empty projects until we reach the desired ID
      for (let i = Number(projectCount); i <= projectId; i++) {
        console.log(`Creating project ${i}...`);
        
        // For the actual project we want (ID 4), use proper data
        if (i === projectId) {
          // Project data for ID 4
          // Create 4 milestones for our project
          const milestones = [
            {
              title: "Material Research",
              amountRequired: ethers.parseEther("0.3"),
              recipient: wallet.address,
              isCompleted: false
            },
            {
              title: "Design Phase",
              amountRequired: ethers.parseEther("0.3"),
              recipient: wallet.address,
              isCompleted: false
            },
            {
              title: "Prototype Testing",
              amountRequired: ethers.parseEther("0.3"),
              recipient: wallet.address,
              isCompleted: false
            },
            {
              title: "Production Implementation",
              amountRequired: ethers.parseEther("0.3"),
              recipient: wallet.address,
              isCompleted: false
            }
          ];
          
          // Total amount for project 4
          const totalAmount = ethers.parseEther(totalAmountInEth);
          
          // Create the project
          const tx = await contract.createProject(totalAmount, milestones);
          console.log(`Transaction hash for project ${i}: ${tx.hash}`);
          await tx.wait();
        } else {
          // Create minimal placeholder projects for the other IDs
          const placeholder = [
            {
              title: `Placeholder Project ${i}`,
              amountRequired: ethers.parseEther("0.01"),
              recipient: wallet.address,
              isCompleted: false
            }
          ];
          
          const tx = await contract.createProject(ethers.parseEther("0.01"), placeholder);
          console.log(`Transaction hash for placeholder ${i}: ${tx.hash}`);
          await tx.wait();
        }
        
        // Add a delay to avoid nonce issues
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Verify project 4 was created
    try {
      const project = await contract.getProject(projectId);
      console.log(`Project ${projectId} data:`, {
        totalAmount: ethers.formatEther(project[0]),
        amountRaised: ethers.formatEther(project[1]),
        isActive: project[2],
        milestonesCount: Number(project[3])
      });
      console.log("Project 4 is now available on the blockchain!");
    } catch (error) {
      console.error(`Error verifying project ${projectId}:`, error.message);
    }
    
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// Execute the main function
main(); 