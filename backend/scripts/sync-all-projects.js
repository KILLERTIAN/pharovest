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
    
    // Get private key from .env file
    const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      console.error("Please set your DEPLOYER_PRIVATE_KEY or PRIVATE_KEY in a .env file");
      process.exit(1);
    }
    
    // Contract address
    const contractAddress = "0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C";
    
    // Connect to Pharos RPC
    const provider = new ethers.JsonRpcProvider("https://devnet.dplabs-internal.com", undefined, {
      staticNetwork: true,
      timeout: 60000,  // 60 seconds timeout
      retryCount: 5,
      retryDelay: 1000,  // 1 second between retries
    });
    
    await provider.ready;
    console.log("Connected to Pharos RPC provider");
    
    // Create wallet with private key
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`Using wallet address: ${wallet.address}`);
    
    // Verify wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);
    
    if (balance < ethers.parseEther("0.1")) {
      console.warn("⚠️ WARNING: Low balance may cause transaction failures");
    }
    
    // ABI with the createProjectWithId function
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
      const projectId = parseInt(dbProject.id, 10);
      
      // Skip if projectId is NaN or invalid
      if (isNaN(projectId)) {
        console.log(`Skipping project with invalid ID: ${dbProject.id}`);
        continue;
      }
      
      console.log(`\nProcessing project ${projectId}: ${dbProject.title}`);
      
      // Check if project already exists on blockchain
      let projectExists = false;
      try {
        const existingProject = await contract.getProject(projectId);
        if (existingProject[0] > 0 || existingProject[1] > 0 || existingProject[2] === true || existingProject[3] > 0) {
          console.log(`Project ${projectId} already exists on the blockchain:`);
          console.log({
            totalAmount: ethers.formatEther(existingProject[0]),
            amountRaised: ethers.formatEther(existingProject[1]),
            isActive: existingProject[2],
            milestonesCount: Number(existingProject[3])
          });
          projectExists = true;
        }
      } catch (error) {
        console.log(`Project ${projectId} doesn't exist yet on blockchain. Creating...`);
      }
      
      if (projectExists) {
        console.log(`Skipping project ${projectId} as it already exists.`);
        continue;
      }
      
      // Convert amountRaised from string "$10,000" to value without $ and commas
      // Default to 1.0 ETH if we can't parse it
      let totalAmountEth = "1.0";
      try {
        // Extract numeric part from format like "$10,000"
        if (dbProject.minimumDonation && typeof dbProject.minimumDonation === 'string') {
          // Clean and convert minimum donation to ETH scale (dividing by 1000)
          const minDonation = parseFloat(dbProject.minimumDonation.replace(/[^0-9.]/g, ''));
          // Set project funding goal to be 100 times minimum donation as a reasonable estimate
          totalAmountEth = (minDonation / 20).toFixed(2);
          
          // Make sure it's at least 0.5 ETH and at most 5 ETH
          totalAmountEth = Math.max(0.5, Math.min(5, parseFloat(totalAmountEth))).toFixed(2);
        }
      } catch (error) {
        console.warn(`Could not parse amount for project ${projectId}, using default of 1.0 ETH`);
      }
      
      console.log(`Setting total amount for project ${projectId} to ${totalAmountEth} ETH`);
      const totalAmount = ethers.parseEther(totalAmountEth);
      
      // Create milestone array from database project
      let formattedMilestones = [];
      if (dbProject.milestones && Array.isArray(dbProject.milestones) && dbProject.milestones.length > 0) {
        // Calculate per-milestone amount (divide total by number of milestones)
        const milestoneCount = dbProject.milestones.length;
        const milestoneAmount = parseFloat(totalAmountEth) / milestoneCount;
        
        formattedMilestones = dbProject.milestones.map((milestone, index) => {
          return {
            title: milestone.title || `Milestone ${index + 1}`,
            amountRequired: ethers.parseEther(milestoneAmount.toFixed(6)),
            recipient: wallet.address, // Using the wallet address for all recipients
            isCompleted: milestone.completed || false
          };
        });
      }
      
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
        console.log(`Creating project ${projectId} with ${formattedMilestones.length} milestones...`);
        
        // Try to use createProjectWithId first
        let tx;
        try {
          // Estimate gas first to ensure it will work
          const gasEstimate = await contract.createProjectWithId.estimateGas(
            projectId, totalAmount, formattedMilestones
          );
          console.log(`Estimated gas: ${gasEstimate.toString()}`);
          
          // Create project with matching ID
          tx = await contract.createProjectWithId(projectId, totalAmount, formattedMilestones, {
            gasLimit: Math.min(3000000, Math.ceil(gasEstimate.toString() * 1.2)) // 20% buffer
          });
        } catch (error) {
          console.log(`createProjectWithId failed: ${error.message}`);
          console.log("Falling back to standard createProject method...");
          
          // Create projects up to the desired ID if needed
          const currentCount = await contract.projectCount();
          if (BigInt(projectId) >= currentCount) {
            console.log(`Need to create ${projectId - Number(currentCount)} projects to reach ID ${projectId}`);
            
            // Create placeholder projects to reach the desired ID
            for (let i = Number(currentCount); i < projectId; i++) {
              console.log(`Creating placeholder project ${i}...`);
              const placeholderTx = await contract.createProject(
                ethers.parseEther("0.01"), 
                [{
                  title: `Placeholder Project ${i}`,
                  amountRequired: ethers.parseEther("0.01"),
                  recipient: wallet.address,
                  isCompleted: false
                }],
                { gasLimit: 3000000 }
              );
              await placeholderTx.wait();
              console.log(`Created placeholder project ${i}`);
              
              // Wait between transactions
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
          }
          
          // Now create the actual project
          tx = await contract.createProject(totalAmount, formattedMilestones, {
            gasLimit: 3000000
          });
        }
        
        console.log(`Transaction hash for project ${projectId}: ${tx.hash}`);
        
        // Wait for transaction to be mined
        console.log("Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log(`Project ${projectId} created successfully!`);
        
        // Verify the project was created
        const createdProject = await contract.getProject(projectId);
        console.log(`Project ${projectId} data:`, {
          totalAmount: ethers.formatEther(createdProject[0]),
          amountRaised: ethers.formatEther(createdProject[1]),
          isActive: createdProject[2],
          milestonesCount: createdProject[3].toString()
        });
        
        // Add a delay between transactions to avoid nonce issues
        console.log("Waiting 5 seconds before next project...");
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error(`Error creating project ${projectId}:`, error.message);
        console.log("Continuing to next project...");
      }
    }
    
    // Get final project count
    const finalProjectCount = await contract.projectCount();
    console.log(`\nFinal blockchain project count: ${finalProjectCount.toString()}`);
    console.log(`Successfully synced database projects to blockchain`);
    
    // Final verification of all projects
    console.log("\n=== Verification of All Projects ===");
    for (const dbProject of dbProjects) {
      const projectId = parseInt(dbProject.id, 10);
      try {
        const project = await contract.getProject(projectId);
        console.log(`Project ${projectId} (${dbProject.title.substring(0, 20)}${dbProject.title.length > 20 ? '...' : ''}): ${ethers.formatEther(project[0])} ETH total, ${ethers.formatEther(project[1])} ETH raised`);
      } catch (error) {
        console.error(`Error verifying project ${projectId}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// Execute the main function
main().catch(error => {
  console.error("Unhandled error:", error);
  process.exit(1);
}); 