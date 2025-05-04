const { ethers } = require("ethers");
require('dotenv').config();

async function main() {
  try {
    // Contract address
    const contractAddress = "0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C";
    
    // Connect to Pharos RPC
    const provider = new ethers.JsonRpcProvider("https://devnet.dplabs-internal.com");
    
    // Get private key from .env file or set it directly for testing (be careful with hardcoded keys!)
    const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      console.error("Please set your DEPLOYER_PRIVATE_KEY or PRIVATE_KEY in a .env file");
      process.exit(1);
    }
    
    // Create wallet with private key
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`Using wallet address: ${wallet.address}`);
    
    // Minimal ABI for the Pharovest contract
    const abi = [
      "function createProject(uint256 totalAmount, tuple(string title, uint256 amountRequired, address payable recipient, bool isCompleted)[] memory milestones) external",
      "function projectCount() view returns (uint256)",
      "function getProject(uint256 projectId) view returns (uint256, uint256, bool, uint256)"
    ];
    
    // Connect to contract with signer
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    // Get current project count
    const projectCount = await contract.projectCount();
    console.log(`Current project count: ${projectCount.toString()}`);
    
    if (Number(projectCount) > 4) {
      console.log("Project count is already greater than 4. No need to create more projects.");
      
      try {
        // Check if project 4 already exists
        const project = await contract.getProject(4);
        console.log(`Project 4 data:`, {
          totalAmount: ethers.formatEther(project[0]),
          amountRaised: ethers.formatEther(project[1]),
          isActive: project[2],
          milestonesCount: project[3].toString()
        });
      } catch (error) {
        console.error("Error checking project 4:", error.message);
      }
      return;
    }
    
    // Create project data
    const totalAmount = ethers.parseEther("1.2"); // 1.2 ETH funding goal
    
    // Create milestones for the project
    const milestones = [
      {
        title: "Research and Planning",
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
        title: "Implementation",
        amountRequired: ethers.parseEther("0.3"),
        recipient: wallet.address,
        isCompleted: false
      },
      {
        title: "Testing and Launch",
        amountRequired: ethers.parseEther("0.3"),
        recipient: wallet.address,
        isCompleted: false
      }
    ];
    
    console.log("Creating project...");
    console.log("Total amount:", ethers.formatEther(totalAmount), "ETH");
    console.log("Milestones:", milestones.map(m => m.title).join(", "));
    
    // Create the project
    const tx = await contract.createProject(totalAmount, milestones);
    console.log(`Transaction hash: ${tx.hash}`);
    
    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    
    // Verify the project was created
    const newProjectCount = await contract.projectCount();
    console.log(`New project count: ${newProjectCount.toString()}`);
    
    // Check each project ID from current project count to newProjectCount
    for (let i = Number(projectCount); i < Number(newProjectCount); i++) {
      try {
        const project = await contract.getProject(i);
        console.log(`Project ${i} data:`, {
          totalAmount: ethers.formatEther(project[0]),
          amountRaised: ethers.formatEther(project[1]),
          isActive: project[2],
          milestonesCount: project[3].toString()
        });
      } catch (error) {
        console.error(`Error checking project ${i}:`, error.message);
      }
    }
    
    console.log("Project creation completed successfully!");
    
  } catch (error) {
    console.error("Error creating project:", error);
  }
}

// Execute the main function
main(); 