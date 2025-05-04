import { ethers } from "ethers";
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

// Project data with minimal structure needed for contract
const projects = [
  {
    id: 1,
    title: "Innovative Solar Panels",
    totalAmount: "1.5", // in ETH
    milestones: [
      { title: "Initial Research", amountRequired: "0.3", isCompleted: false },
      { title: "Prototype Development", amountRequired: "0.5", isCompleted: false },
      { title: "Testing Phase", amountRequired: "0.4", isCompleted: false },
      { title: "Final Implementation", amountRequired: "0.3", isCompleted: false }
    ]
  },
  {
    id: 2,
    title: "Clean Water Initiative",
    totalAmount: "2.0", // in ETH
    milestones: [
      { title: "Site Selection", amountRequired: "0.4", isCompleted: false },
      { title: "Equipment Purchase", amountRequired: "0.6", isCompleted: false },
      { title: "Installation", amountRequired: "0.6", isCompleted: false },
      { title: "Community Training", amountRequired: "0.4", isCompleted: false }
    ]
  },
  {
    id: 3,
    title: "AI-Powered Healthcare",
    totalAmount: "1.8", // in ETH
    milestones: [
      { title: "Data Collection", amountRequired: "0.4", isCompleted: false },
      { title: "Algorithm Development", amountRequired: "0.5", isCompleted: false },
      { title: "Pilot Testing", amountRequired: "0.5", isCompleted: false },
      { title: "Deployment", amountRequired: "0.4", isCompleted: false }
    ]
  },
  {
    id: 4,
    title: "Eco-Friendly Packaging",
    totalAmount: "1.2", // in ETH
    milestones: [
      { title: "Material Research", amountRequired: "0.3", isCompleted: false },
      { title: "Design Phase", amountRequired: "0.3", isCompleted: false },
      { title: "Prototype Testing", amountRequired: "0.3", isCompleted: false },
      { title: "Production Implementation", amountRequired: "0.3", isCompleted: false }
    ]
  },
  {
    id: 5,
    title: "Renewable Energy Sources",
    totalAmount: "2.2", // in ETH
    milestones: [
      { title: "Resource Assessment", amountRequired: "0.5", isCompleted: false },
      { title: "Technology Selection", amountRequired: "0.5", isCompleted: false },
      { title: "Installation", amountRequired: "0.7", isCompleted: false },
      { title: "Maintenance System", amountRequired: "0.5", isCompleted: false }
    ]
  },
  {
    id: 6,
    title: "Sustainable Agriculture Practices",
    totalAmount: "1.5", // in ETH
    milestones: [
      { title: "Soil Analysis", amountRequired: "0.4", isCompleted: false },
      { title: "Technique Implementation", amountRequired: "0.6", isCompleted: false },
      { title: "Training & Education", amountRequired: "0.5", isCompleted: false }
    ]
  },
  {
    id: 7,
    title: "Community Health Initiatives",
    totalAmount: "1.0", // in ETH
    milestones: [
      { title: "Needs Assessment", amountRequired: "0.3", isCompleted: false },
      { title: "Program Development", amountRequired: "0.4", isCompleted: false },
      { title: "Implementation", amountRequired: "0.3", isCompleted: false }
    ]
  },
  {
    id: 8,
    title: "Educational Technology Solutions",
    totalAmount: "2.0", // in ETH
    milestones: [
      { title: "Research & Analysis", amountRequired: "0.6", isCompleted: false },
      { title: "Development", amountRequired: "0.8", isCompleted: false },
      { title: "Implementation & Training", amountRequired: "0.6", isCompleted: false }
    ]
  },
  {
    id: 9,
    title: "Wildlife Conservation Efforts",
    totalAmount: "1.8", // in ETH
    milestones: [
      { title: "Habitat Study", amountRequired: "0.5", isCompleted: false },
      { title: "Conservation Planning", amountRequired: "0.7", isCompleted: false },
      { title: "Implementation", amountRequired: "0.6", isCompleted: false }
    ]
  },
  {
    id: 10,
    title: "Community Infrastructure Development",
    totalAmount: "1.2", // in ETH
    milestones: [
      { title: "Assessment", amountRequired: "0.3", isCompleted: false },
      { title: "Design", amountRequired: "0.4", isCompleted: false },
      { title: "Construction", amountRequired: "0.5", isCompleted: false }
    ]
  },
  {
    id: 11,
    title: "Technology Innovation Hub",
    totalAmount: "2.2", // in ETH
    milestones: [
      { title: "Location & Setup", amountRequired: "0.6", isCompleted: false },
      { title: "Equipment & Resources", amountRequired: "0.9", isCompleted: false },
      { title: "Program Development", amountRequired: "0.7", isCompleted: false }
    ]
  },
  {
    id: 12,
    title: "Environmental Awareness Campaign",
    totalAmount: "0.8", // in ETH
    milestones: [
      { title: "Content Development", amountRequired: "0.2", isCompleted: false },
      { title: "Campaign Launch", amountRequired: "0.3", isCompleted: false },
      { title: "Community Engagement", amountRequired: "0.3", isCompleted: false }
    ]
  }
];

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
    
    // Get initial project count
    const initialProjectCount = await contract.projectCount();
    console.log(`Initial project count: ${initialProjectCount.toString()}`);
    
    // Create each project
    for (const project of projects) {
      try {
        console.log(`Creating project ${project.id}: ${project.title}...`);
        
        // Format milestones for contract
        const formattedMilestones = project.milestones.map(milestone => ({
          title: milestone.title,
          amountRequired: ethers.parseEther(milestone.amountRequired),
          recipient: wallet.address, // Using the same wallet address for all recipients
          isCompleted: milestone.isCompleted
        }));
        
        // Total amount in ETH
        const totalAmount = ethers.parseEther(project.totalAmount);
        
        // Create project
        const tx = await contract.createProject(totalAmount, formattedMilestones);
        console.log(`Transaction hash for project ${project.id}: ${tx.hash}`);
        
        // Wait for transaction to be mined
        console.log("Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log(`Project ${project.id} created successfully!`);
        
        // Add a small delay between transactions to avoid nonce issues
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`Error creating project ${project.id}:`, error.message);
      }
    }
    
    // Get final project count
    const finalProjectCount = await contract.projectCount();
    console.log(`Final project count: ${finalProjectCount.toString()}`);
    console.log(`Successfully created ${finalProjectCount - initialProjectCount} projects`);
    
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// Execute the main function
main(); 