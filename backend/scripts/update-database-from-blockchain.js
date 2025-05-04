import { ethers } from "ethers";
import Connection from '../database/db.js';
import Project from '../models/Project.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    // Connect to MongoDB
    await Connection();
    console.log("Connected to MongoDB database");
    
    // Get all projects from database
    const dbProjects = await Project.find({}).sort({ id: 1 });
    console.log(`Found ${dbProjects.length} projects in the database`);
    
    // Contract address
    const contractAddress = "0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C";
    
    // Connect to Pharos RPC
    const provider = new ethers.JsonRpcProvider("https://devnet.dplabs-internal.com", undefined, {
      staticNetwork: true,
      timeout: 60000,
      retryCount: 5
    });
    
    await provider.ready;
    console.log("Connected to Pharos RPC provider");
    
    // ABI with just the functions we need
    const abi = [
      "function projectCount() view returns (uint256)",
      "function getProject(uint256 projectId) view returns (uint256, uint256, bool, uint256)",
      "function getMilestone(uint256 projectId, uint256 milestoneIndex) view returns (string memory, uint256, address, bool)"
    ];
    
    // Connect to contract (read-only)
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    // Get project count from blockchain
    const projectCount = await contract.projectCount();
    console.log(`Current blockchain project count: ${projectCount.toString()}`);
    
    // Process each project from the database
    for (const dbProject of dbProjects) {
      const projectId = parseInt(dbProject.id, 10);
      
      // Skip if projectId is NaN or invalid
      if (isNaN(projectId)) {
        console.log(`Skipping project with invalid ID: ${dbProject.id}`);
        continue;
      }
      
      console.log(`\nProcessing project ${projectId}: ${dbProject.title}`);
      
      try {
        // Check if project exists on blockchain
        const blockchainProject = await contract.getProject(projectId);
        const totalAmount = ethers.formatEther(blockchainProject[0]);
        const amountRaised = ethers.formatEther(blockchainProject[1]);
        const isActive = blockchainProject[2];
        const milestonesCount = Number(blockchainProject[3]);
        
        console.log(`Project ${projectId} found on blockchain:`);
        console.log({
          totalAmount: `${totalAmount} ETH`,
          amountRaised: `${amountRaised} ETH`,
          isActive,
          milestonesCount
        });
        
        // Calculate USD equivalent (approximate)
        // Using 2410 USD per ETH as a fixed rate for simplicity
        const ethToUsdRate = 2410;
        const amountRaisedUsd = parseFloat(amountRaised) * ethToUsdRate;
        
        // Update database project with blockchain data
        const updateData = {
          amountRaised: `$${amountRaisedUsd.toFixed(2)}`,
          // If any contributors exist on chain, update that too
          fundingStatus: isActive ? "Active" : "Completed"
        };
        
        // Update milestone completion status if available
        if (milestonesCount > 0 && dbProject.milestones && dbProject.milestones.length > 0) {
          for (let i = 0; i < Math.min(milestonesCount, dbProject.milestones.length); i++) {
            try {
              const milestone = await contract.getMilestone(projectId, i);
              const isCompleted = milestone[3]; // The 4th return value is isCompleted boolean
              
              // Update the milestone in the database
              if (isCompleted) {
                console.log(`Updating milestone ${i+1} (${dbProject.milestones[i].title}) to completed`);
                dbProject.milestones[i].completed = true;
              }
            } catch (error) {
              console.error(`Error fetching milestone ${i} for project ${projectId}:`, error.message);
            }
          }
        }
        
        // Update the database project
        await Project.findOneAndUpdate(
          { id: projectId.toString() }, 
          updateData
        );
        
        console.log(`Updated project ${projectId} in database with blockchain data`);
        
      } catch (error) {
        console.log(`Project ${projectId} not found on blockchain or error: ${error.message}`);
      }
    }
    
    console.log("\nDatabase update completed!");
    
  } catch (error) {
    console.error("Error in main function:", error);
  } finally {
    // Wait a moment before disconnecting to ensure all operations complete
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
}

// Execute the main function
main().catch(error => {
  console.error("Unhandled error:", error);
  process.exit(1);
}); 