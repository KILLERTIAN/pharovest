import { ethers } from "ethers";

// Contract address
const contractAddress = "0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C";

// Minimal ABI for the functions we need
const abi = [
  "function projectCount() view returns (uint256)",
  "function getProject(uint256 projectId) view returns (uint256, uint256, bool, uint256)",
  "function getMilestone(uint256 projectId, uint256 milestoneIndex) view returns (string memory, uint256, address, bool)"
];

async function main() {
  try {
    // Set up provider
    const provider = new ethers.JsonRpcProvider("https://devnet.dplabs-internal.com");
    console.log("Connected to RPC provider");
    
    // Connect to contract as read-only
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    // Get total project count
    const projectCount = await contract.projectCount();
    console.log(`Total projects on blockchain: ${projectCount}`);
    
    // Check each project
    for (let i = 0; i < Number(projectCount); i++) {
      try {
        const project = await contract.getProject(i);
        
        console.log(`\n=== Project ID ${i} ===`);
        console.log(`Total amount: ${ethers.formatEther(project[0])} ETH`);
        console.log(`Amount raised: ${ethers.formatEther(project[1])} ETH`);
        console.log(`Active: ${project[2]}`);
        
        const milestonesCount = Number(project[3]);
        console.log(`Milestones: ${milestonesCount}`);
        
        // Get milestone details
        if (milestonesCount > 0) {
          console.log("\nMilestone details:");
          for (let j = 0; j < milestonesCount; j++) {
            const milestone = await contract.getMilestone(i, j);
            console.log(`  ${j+1}. ${milestone[0]}`);
            console.log(`     Amount required: ${ethers.formatEther(milestone[1])} ETH`);
            console.log(`     Recipient: ${milestone[2]}`);
            console.log(`     Completed: ${milestone[3]}`);
          }
        }
      } catch (error) {
        console.error(`Error retrieving project ${i}:`, error.message);
      }
    }
    
    // Special focus on Project ID 4
    try {
      console.log("\n=== VERIFICATION: Checking Project ID 4 ===");
      const project4 = await contract.getProject(4);
      
      console.log(`Project ID 4 exists: ${project4[0] > 0 || project4[1] > 0 || project4[2] === true || project4[3] > 0}`);
      console.log(`Total amount: ${ethers.formatEther(project4[0])} ETH`);
      console.log(`Amount raised: ${ethers.formatEther(project4[1])} ETH`);
      console.log(`Active: ${project4[2]}`);
      console.log(`Milestones count: ${project4[3]}`);
      
      if (Number(project4[3]) > 0) {
        console.log("\nProject 4 milestone details:");
        for (let j = 0; j < Number(project4[3]); j++) {
          const milestone = await contract.getMilestone(4, j);
          console.log(`  ${j+1}. ${milestone[0]}`);
          console.log(`     Amount required: ${ethers.formatEther(milestone[1])} ETH`);
          console.log(`     Recipient: ${milestone[2]}`);
          console.log(`     Completed: ${milestone[3]}`);
        }
      }
    } catch (error) {
      console.error("Error checking Project ID 4:", error.message);
    }
    
  } catch (error) {
    console.error("Error in main function:", error.message);
  }
}

main().catch(error => {
  console.error("Unhandled error:", error);
  process.exit(1);
}); 