import { ethers } from "ethers";
import dotenv from 'dotenv';
dotenv.config();

// Get project ID from command line argument
const projectId = process.argv[2] ? parseInt(process.argv[2], 10) : null;

// Project data
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
    // Validate project ID
    if (projectId === null) {
      console.error("Please provide a project ID as a command line argument");
      console.log("Example: node create-single-project.js 4");
      console.log("Available project IDs:", projects.map(p => p.id).join(", "));
      process.exit(1);
    }
    
    // Find the project with the given ID
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      console.error(`Project with ID ${projectId} not found`);
      console.log("Available project IDs:", projects.map(p => p.id).join(", "));
      process.exit(1);
    }
    
    // Get private key from .env file
    const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
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
    
    // Updated ABI to include the projectId in createProject
    const abi = [
      "function createProjectWithId(uint256 projectId, uint256 totalAmount, tuple(string title, uint256 amountRequired, address payable recipient, bool isCompleted)[] memory milestones) external",
      "function createProject(uint256 totalAmount, tuple(string title, uint256 amountRequired, address payable recipient, bool isCompleted)[] memory milestones) external",
      "function projectCount() view returns (uint256)",
      "function getProject(uint256 projectId) view returns (uint256, uint256, bool, uint256)"
    ];
    
    // Connect to contract with signer
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    // Get initial project count
    const projectCount = await contract.projectCount();
    console.log(`Current project count: ${projectCount.toString()}`);
    
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
    
    // Check if project already exists
    try {
      const existingProject = await contract.getProject(project.id);
      if (existingProject[0] > 0 || existingProject[1] > 0 || existingProject[2] === true || existingProject[3] > 0) {
        console.log(`Project ${project.id} already exists on the blockchain. Skipping creation.`);
        return;
      }
    } catch (error) {
      console.log(`Project ${project.id} doesn't exist yet. Creating...`);
    }
    
    // Create project with explicit ID matching database ID
    let tx;
    try {
      // Try to use createProjectWithId if available
      tx = await contract.createProjectWithId(project.id, totalAmount, formattedMilestones);
    } catch (error) {
      console.log("createProjectWithId not available. Falling back to regular createProject.");
      
      // Create projects up to the desired ID
      const currentCount = await contract.projectCount();
      if (BigInt(project.id) >= currentCount) {
        console.log(`Creating ${project.id - Number(currentCount)} placeholder projects to align IDs...`);
        for (let i = Number(currentCount); i < project.id; i++) {
          const placeholderTx = await contract.createProject(ethers.parseEther("0.01"), [
            {
              title: "Placeholder",
              amountRequired: ethers.parseEther("0.01"),
              recipient: wallet.address,
              isCompleted: false
            }
          ]);
          await placeholderTx.wait();
          console.log(`Created placeholder project ${i}`);
        }
      }
      
      // Now create the actual project
      tx = await contract.createProject(totalAmount, formattedMilestones);
    }
    
    console.log(`Transaction hash: ${tx.hash}`);
    
    // Wait for transaction to be mined
    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();
    
    // Get new project count
    const newProjectCount = await contract.projectCount();
    console.log(`Project ${project.id} created successfully!`);
    console.log(`New project count: ${newProjectCount.toString()}`);
    
    // Verify the project was created with the correct ID
    const createdProject = await contract.getProject(project.id);
    console.log(`Project ${project.id} data:`, {
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