import { ethers } from "ethers";
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    // Get private key from .env file
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      console.error("Please set your PRIVATE_KEY in a .env file");
      process.exit(1);
    }
    
    // Contract address
    const contractAddress = "0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C";
    
    // Connect to Pharos RPC
    const provider = new ethers.JsonRpcProvider("https://devnet.dplabs-internal.com");
    
    // Create wallet with private key
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`Using wallet address: ${wallet.address}`);
    
    // Sample ABI for the functions we need
    const abi = [
      "function createProject(uint256 totalAmount, tuple(string title, uint256 amountRequired, address payable recipient, bool isCompleted)[] memory milestones) external",
      "function projectCount() view returns (uint256)"
    ];
    
    // Connect to contract with signer
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    // Create milestones
    const milestones = [
      {
        title: "Initial Planning",
        amountRequired: ethers.parseEther("0.5"),
        recipient: wallet.address,
        isCompleted: false
      },
      {
        title: "Development Phase",
        amountRequired: ethers.parseEther("1.0"),
        recipient: wallet.address,
        isCompleted: false
      },
      {
        title: "Final Delivery",
        amountRequired: ethers.parseEther("0.5"),
        recipient: wallet.address,
        isCompleted: false
      }
    ];
    
    // Total amount
    const totalAmount = ethers.parseEther("2.0");
    
    console.log("Creating project...");
    
    // Create project
    const tx = await contract.createProject(totalAmount, milestones);
    console.log(`Transaction hash: ${tx.hash}`);
    
    console.log("Waiting for transaction confirmation...");
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log("Project created successfully!");
    
    // Get updated project count
    const projectCount = await contract.projectCount();
    console.log(`New project count: ${projectCount.toString()}`);
    console.log(`Your project ID is: ${projectCount - 1n}`);
    
  } catch (error) {
    console.error("Error creating project:", error);
  }
}

// Execute the main function
main(); 