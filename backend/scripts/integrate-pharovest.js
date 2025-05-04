/**
 * Pharovest Contract Integration Example
 * ======================================
 * This script demonstrates how to interact with the deployed Pharovest contract
 * on the Pharos Testnet from a Node.js application.
 */

const { ethers } = require('ethers');
require('dotenv').config();

// Get configuration from environment variables or use defaults
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PHAROS_RPC_URL = process.env.PHAROS_RPC_URL || 'https://rpc-node-tst.pharosnet.xyz';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C';

// ABI for the Pharovest contract (simplified for this example)
// For production, import the full ABI from your compiled contract
const ABI = [
  "function projectCount() view returns (uint256)",
  "function createProject(uint256 totalAmount, tuple(string title, uint256 amountRequired, address payable recipient, bool isCompleted)[] memory milestones) external",
  "function contribute(uint256 projectId) external payable",
  "function getProject(uint256 projectId) external view returns (uint256 totalAmount, uint256 amountRaised, bool isActive, uint256 milestoneCount)",
  "function getProjectProgress(uint256 projectId) external view returns (uint256)",
  "function getMilestone(uint256 projectId, uint256 milestoneIndex) external view returns (string memory title, uint256 amountRequired, address recipient, bool isCompleted)",
];

async function connectToProvider() {
  // Connect to Pharos Testnet
  const provider = new ethers.providers.JsonRpcProvider(PHAROS_RPC_URL);
  return provider;
}

async function getContract(providerOrSigner) {
  // Create contract instance
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, providerOrSigner);
}

async function queryProjectCount() {
  try {
    const provider = await connectToProvider();
    const contract = await getContract(provider);
    
    // Get project count
    const count = await contract.projectCount();
    console.log(`Total number of projects: ${count.toString()}`);
    return count;
  } catch (error) {
    console.error('Error querying project count:', error);
  }
}

async function getProjectDetails(projectId) {
  try {
    const provider = await connectToProvider();
    const contract = await getContract(provider);
    
    // Get project details
    const project = await contract.getProject(projectId);
    console.log(`Project ${projectId} details:`);
    console.log(`- Total Amount: ${ethers.utils.formatEther(project.totalAmount)} PHAR`);
    console.log(`- Amount Raised: ${ethers.utils.formatEther(project.amountRaised)} PHAR`);
    console.log(`- Active: ${project.isActive}`);
    console.log(`- Milestone Count: ${project.milestoneCount.toString()}`);
    
    // Get project progress
    const progress = await contract.getProjectProgress(projectId);
    console.log(`- Progress: ${progress}%`);
    
    // Get milestone details
    for (let i = 0; i < project.milestoneCount; i++) {
      const milestone = await contract.getMilestone(projectId, i);
      console.log(`Milestone ${i}:`);
      console.log(`- Title: ${milestone.title}`);
      console.log(`- Amount Required: ${ethers.utils.formatEther(milestone.amountRequired)} PHAR`);
      console.log(`- Recipient: ${milestone.recipient}`);
      console.log(`- Completed: ${milestone.isCompleted}`);
    }
    
    return project;
  } catch (error) {
    console.error(`Error getting details for project ${projectId}:`, error);
  }
}

async function createNewProject() {
  try {
    if (!PRIVATE_KEY) {
      console.error('PRIVATE_KEY is required in .env to create a project');
      return;
    }
    
    const provider = await connectToProvider();
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = await getContract(wallet);
    
    // Example milestone data
    const milestones = [
      {
        title: "Initial Development",
        amountRequired: ethers.utils.parseEther("1.0"),
        recipient: wallet.address,
        isCompleted: false
      },
      {
        title: "Product Launch",
        amountRequired: ethers.utils.parseEther("2.0"),
        recipient: wallet.address,
        isCompleted: false
      }
    ];
    
    const totalAmount = ethers.utils.parseEther("3.0");
    
    console.log('Creating new project...');
    const tx = await contract.createProject(totalAmount, milestones);
    console.log(`Transaction hash: ${tx.hash}`);
    
    console.log('Waiting for transaction confirmation...');
    await tx.wait();
    console.log('Project created successfully!');
    
    // Get the new project ID
    const projectCount = await contract.projectCount();
    console.log(`New project ID: ${projectCount.sub(1).toString()}`);
    
    return projectCount.sub(1);
  } catch (error) {
    console.error('Error creating project:', error);
  }
}

async function contributeToProject(projectId, amount) {
  try {
    if (!PRIVATE_KEY) {
      console.error('PRIVATE_KEY is required in .env to contribute to a project');
      return;
    }
    
    const provider = await connectToProvider();
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = await getContract(wallet);
    
    const amountInWei = ethers.utils.parseEther(amount.toString());
    
    console.log(`Contributing ${amount} PHAR to project ${projectId}...`);
    const tx = await contract.contribute(projectId, { value: amountInWei });
    console.log(`Transaction hash: ${tx.hash}`);
    
    console.log('Waiting for transaction confirmation...');
    await tx.wait();
    console.log('Contribution successful!');
    
    return tx.hash;
  } catch (error) {
    console.error(`Error contributing to project ${projectId}:`, error);
  }
}

// Main function to demonstrate usage
async function main() {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];
  
  switch (command) {
    case 'count':
      await queryProjectCount();
      break;
    case 'details':
      if (!arg1) {
        console.error('Project ID is required');
        break;
      }
      await getProjectDetails(arg1);
      break;
    case 'create':
      await createNewProject();
      break;
    case 'contribute':
      if (!arg1 || !arg2) {
        console.error('Project ID and amount are required');
        break;
      }
      await contributeToProject(arg1, arg2);
      break;
    default:
      console.log('Available commands:');
      console.log('  count - Get total number of projects');
      console.log('  details <projectId> - Get details for a specific project');
      console.log('  create - Create a new project with example milestones');
      console.log('  contribute <projectId> <amount> - Contribute to a project');
  }
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 