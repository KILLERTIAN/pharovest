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

// Target project ID to ensure exists
const TARGET_PROJECT_ID = 4;

// Minimal ABI for the functions we need
const abi = [
  "function createProject(uint256 totalAmount, tuple(string title, uint256 amountRequired, address payable recipient, bool isCompleted)[] memory milestones) external",
  "function projectCount() view returns (uint256)",
  "function getProject(uint256 projectId) view returns (uint256, uint256, bool, uint256)"
];

async function main() {
  // Set up provider with increased timeout and retry
  const provider = new ethers.JsonRpcProvider("https://devnet.dplabs-internal.com", undefined, {
    staticNetwork: true,
    timeout: 60000,  // 60 seconds timeout
    retryCount: 5,
    retryDelay: 1000,  // 1 second between retries
  });

  try {
    // Wait for provider to be ready
    await provider.ready;
    console.log("Connected to RPC provider");
    
    // Create wallet
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`Using wallet address: ${wallet.address}`);

    // Connect to contract
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    // Get network info
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Verify funds
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);
    
    if (balance < ethers.parseEther("0.1")) {
      console.warn("⚠️ WARNING: Low balance may cause transaction failures");
    }

    // Get current project count
    const projectCount = await contract.projectCount();
    console.log(`Current project count: ${projectCount}`);
    
    // Check if target project exists
    try {
      if (Number(projectCount) > TARGET_PROJECT_ID) {
        const project = await contract.getProject(TARGET_PROJECT_ID);
        console.log(`Project ${TARGET_PROJECT_ID} already exists:`);
        console.log({
          totalAmount: ethers.formatEther(project[0]),
          amountRaised: ethers.formatEther(project[1]),
          isActive: project[2],
          milestonesCount: Number(project[3])
        });
        console.log("No action needed.");
        return;
      }
    } catch (error) {
      console.log(`Project ${TARGET_PROJECT_ID} doesn't exist yet. We need to create it.`);
    }
    
    // Calculate how many projects we need to create
    const projectsNeeded = Math.max(0, TARGET_PROJECT_ID - Number(projectCount) + 1);
    console.log(`Need to create ${projectsNeeded} projects to reach ID ${TARGET_PROJECT_ID}`);
    
    // Create projects until we reach the target ID
    for (let i = 0; i < projectsNeeded; i++) {
      const currentId = Number(projectCount) + i;
      
      let projectTitle, projectAmount, milestones;
      
      // Special configuration for project ID 4
      if (currentId === TARGET_PROJECT_ID) {
        projectTitle = "Eco-Friendly Packaging";
        projectAmount = "1.2"; // ETH
        milestones = [
          {
            title: "Research and Material Selection",
            amountRequired: ethers.parseEther("0.3"),
            recipient: wallet.address,
            isCompleted: false
          },
          {
            title: "Design and Prototyping",
            amountRequired: ethers.parseEther("0.3"),
            recipient: wallet.address,
            isCompleted: false
          },
          {
            title: "Testing and Validation",
            amountRequired: ethers.parseEther("0.3"),
            recipient: wallet.address,
            isCompleted: false
          },
          {
            title: "Production and Distribution",
            amountRequired: ethers.parseEther("0.3"),
            recipient: wallet.address,
            isCompleted: false
          }
        ];
      } else {
        // Default configuration for filler projects
        projectTitle = `Filler Project ${currentId}`;
        projectAmount = "0.1"; // Small amount for filler projects
        milestones = [
          {
            title: `Milestone for Project ${currentId}`,
            amountRequired: ethers.parseEther(projectAmount),
            recipient: wallet.address,
            isCompleted: false
          }
        ];
      }
      
      const totalAmount = ethers.parseEther(projectAmount);
      
      console.log(`Creating project ${currentId}: ${projectTitle}...`);
      console.log(`Total amount: ${projectAmount} ETH`);
      
      try {
        // Estimate gas first to check if transaction will succeed
        try {
          const gasEstimate = await contract.createProject.estimateGas(totalAmount, milestones);
          console.log(`Estimated gas: ${gasEstimate.toString()}`);
        } catch (error) {
          console.error(`Gas estimation failed for project ${currentId}:`, error.message);
          throw new Error(`Gas estimation failed: ${error.message}`);
        }
        
        // Send transaction
        const tx = await contract.createProject(totalAmount, milestones, {
          gasLimit: 3000000, // Set explicit gas limit to avoid issues
        });
        console.log(`Transaction sent: ${tx.hash}`);
        
        // Wait for confirmation
        console.log("Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
        
        // Verify new project was created
        const newCount = await contract.projectCount();
        console.log(`New project count: ${newCount}`);
        
        // Pause between transactions to avoid nonce issues
        if (i < projectsNeeded - 1) {
          console.log("Waiting 5 seconds before next transaction...");
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.error(`Error creating project ${currentId}:`, error.message);
        console.log("Continuing to next project...");
      }
    }
    
    // Final verification
    try {
      const finalProjectCount = await contract.projectCount();
      console.log(`Final project count: ${finalProjectCount}`);
      
      if (Number(finalProjectCount) > TARGET_PROJECT_ID) {
        const project = await contract.getProject(TARGET_PROJECT_ID);
        console.log(`Verified project ${TARGET_PROJECT_ID} exists:`);
        console.log({
          totalAmount: ethers.formatEther(project[0]),
          amountRaised: ethers.formatEther(project[1]),
          isActive: project[2],
          milestonesCount: Number(project[3])
        });
      }
    } catch (error) {
      console.error("Error during final verification:", error.message);
    }
  } catch (error) {
    console.error("Error in main function:", error.message);
    
    if (error.message.includes("could not detect network")) {
      console.error("Network connection issue. Please check your RPC endpoint.");
    } else if (error.message.includes("account doesn't exist")) {
      console.error("The wallet address may not be funded on this network.");
    }
  }
}

main().catch(error => {
  console.error("Unhandled error:", error);
  process.exit(1);
}); 