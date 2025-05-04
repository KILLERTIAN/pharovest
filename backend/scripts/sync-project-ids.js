import { ethers } from "ethers";
import { connect } from '../database/db.js';
import Project from '../models/project.js';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    // Connect to MongoDB
    await connect();
    
    // Get all projects from database
    const dbProjects = await Project.find({}).sort({ _id: 1 });
    console.log(`Found ${dbProjects.length} projects in the database`);
    
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
    
    // ABI with the new createProjectWithId function
    const abi = [
      "function createProjectWithId(uint256 projectId, uint256 totalAmount, tuple(string title, uint256 amountRequired, address payable recipient, bool isCompleted)[] memory milestones) external",
      "function createProject(uint256 totalAmount, tuple(string title, uint256 amountRequired, address payable recipient, bool isCompleted)[] memory milestones) external",
      "function projectCount() view returns (uint256)",
      "function getProject(uint256 projectId) view returns (uint256, uint256, bool, uint256)"
    ];
    
    // Connect to contract with signer
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    // Get initial project count from blockchain
    const projectCount = await contract.projectCount();
    console.log(`Current blockchain project count: ${projectCount.toString()}`);
    
    // Process each project from the database
    for (const dbProject of dbProjects) {
      const projectId = parseInt(dbProject._id, 10);
      
      // Skip if projectId is NaN or invalid
      if (isNaN(projectId)) {
        console.log(`Skipping project with invalid ID: ${dbProject._id}`);
        continue;
      }
      
      console.log(`Processing project ${projectId}: ${dbProject.title}`);
      
      // Check if project already exists on blockchain
      try {
        const existingProject = await contract.getProject(projectId);
        if (existingProject[0] > 0 || existingProject[1] > 0 || existingProject[2] === true || existingProject[3] > 0) {
          console.log(`Project ${projectId} already exists on the blockchain. Skipping.`);
          continue;
        }
      } catch (error) {
        console.log(`Project ${projectId} doesn't exist yet on blockchain. Creating...`);
      }
      
      // Calculate total amount and format milestones for contract
      const totalAmountEth = dbProject.fundingGoal.toString(); // Assuming fundingGoal is in ETH
      const totalAmount = ethers.parseEther(totalAmountEth);
      
      // Create milestone array
      const formattedMilestones = dbProject.milestones.map(milestone => {
        // Calculate amount required for milestone (assuming evenly distributed if no specific amounts)
        const milestoneAmount = milestone.amount 
          ? milestone.amount.toString() 
          : (parseFloat(totalAmountEth) / dbProject.milestones.length).toFixed(2);
        
        return {
          title: milestone.title,
          amountRequired: ethers.parseEther(milestoneAmount),
          recipient: wallet.address, // Using the wallet address for all recipients
          isCompleted: milestone.completed || false
        };
      });
      
      // Fall back to a simple milestone if none exists
      if (formattedMilestones.length === 0) {
        formattedMilestones.push({
          title: "Project Completion",
          amountRequired: totalAmount,
          recipient: wallet.address,
          isCompleted: false
        });
      }
      
      try {
        // Create project with matching ID
        const tx = await contract.createProjectWithId(projectId, totalAmount, formattedMilestones);
        console.log(`Transaction hash for project ${projectId}: ${tx.hash}`);
        
        // Wait for transaction to be mined
        console.log("Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log(`Project ${projectId} created successfully!`);
        
        // Verify the project was created
        const createdProject = await contract.getProject(projectId);
        console.log(`Project ${projectId} data:`, {
          totalAmount: createdProject[0].toString(),
          amountRaised: createdProject[1].toString(),
          isActive: createdProject[2],
          milestonesCount: createdProject[3].toString()
        });
        
        // Add a small delay between transactions to avoid nonce issues
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error creating project ${projectId}:`, error.message);
      }
    }
    
    // Get final project count
    const finalProjectCount = await contract.projectCount();
    console.log(`Final blockchain project count: ${finalProjectCount.toString()}`);
    console.log(`Successfully synced database projects to blockchain`);
    
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// Execute the main function
main(); 