import { ethers } from "ethers";
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    try {
        // Get private key from .env file
        const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
        if (!PRIVATE_KEY) {
            console.error("Please set your DEPLOYER_PRIVATE_KEY in a .env file");
            process.exit(1);
        }
        
        // Old contract address
        const oldContractAddress = "0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C";
        
        // Connect to Pharos RPC
        const provider = new ethers.JsonRpcProvider("https://devnet.dplabs-internal.com");
        
        // Create wallet with private key
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        console.log(`Using wallet address: ${wallet.address}`);
        
        // ABI for the old and new contracts
        const oldAbi = [
            "function projectCount() view returns (uint256)",
            "function getProject(uint256 projectId) view returns (uint256, uint256, bool, uint256)",
            "function getMilestone(uint256 projectId, uint256 milestoneIndex) view returns (string memory, uint256, address, bool)"
        ];
        
        // Connect to old contract with signer
        const oldContract = new ethers.Contract(oldContractAddress, oldAbi, wallet);
        
        // Get project count from old contract
        const projectCount = await oldContract.projectCount();
        console.log(`Old contract project count: ${projectCount.toString()}`);
        
        // Load existing projects
        const existingProjects = [];
        for (let i = 0; i < projectCount; i++) {
            try {
                const projectData = await oldContract.getProject(i);
                const totalAmount = projectData[0];
                const amountRaised = projectData[1];
                const isActive = projectData[2];
                const milestonesCount = projectData[3];
                
                const milestones = [];
                for (let j = 0; j < milestonesCount; j++) {
                    const milestoneData = await oldContract.getMilestone(i, j);
                    milestones.push({
                        title: milestoneData[0],
                        amountRequired: milestoneData[1],
                        recipient: milestoneData[2],
                        isCompleted: milestoneData[3]
                    });
                }
                
                existingProjects.push({
                    id: i,
                    totalAmount,
                    amountRaised,
                    isActive,
                    milestones
                });
                
                console.log(`Loaded project ${i} with ${milestonesCount} milestones`);
            } catch (error) {
                console.error(`Error loading project ${i}:`, error.message);
            }
        }
        
        // Now deploy the new contract with createProjectWithId function
        console.log("Deploying new contract...");
        
        // Compile the contract from the file
        const contractFactory = new ethers.ContractFactory(
            // ABI (from the artifacts or manually specified)
            [
                // Construct a minimal ABI for deployment
                "constructor(address initialOwner)",
                "function createProject(uint256 totalAmount, tuple(string title, uint256 amountRequired, address payable recipient, bool isCompleted)[] memory milestones) external",
                "function createProjectWithId(uint256 projectId, uint256 totalAmount, tuple(string title, uint256 amountRequired, address payable recipient, bool isCompleted)[] memory milestones) external",
                "function projectCount() view returns (uint256)",
                "function getProject(uint256 projectId) view returns (uint256, uint256, bool, uint256)"
            ],
            // Bytecode of the contract (you'd need to get this from the compilation)
            "0x608060405260..." // Replace with actual bytecode from compilation
        );
        
        const newContract = await contractFactory.deploy(wallet.address);
        await newContract.waitForDeployment();
        const newContractAddress = await newContract.getAddress();
        
        console.log(`New contract deployed at: ${newContractAddress}`);
        
        // Migrate projects to the new contract
        for (const project of existingProjects) {
            console.log(`Migrating project ${project.id}...`);
            try {
                const tx = await newContract.createProjectWithId(
                    project.id,
                    project.totalAmount,
                    project.milestones
                );
                await tx.wait();
                console.log(`Project ${project.id} migrated successfully!`);
            } catch (error) {
                console.error(`Error migrating project ${project.id}:`, error.message);
            }
        }
        
        // Verify all projects were migrated
        const newProjectCount = await newContract.projectCount();
        console.log(`New contract project count: ${newProjectCount.toString()}`);
        
        console.log("Migration completed!");
        console.log(`Updated contract address: ${newContractAddress}`);
        console.log("Make sure to update your contract address in your application!");
        
    } catch (error) {
        console.error("Error in migration:", error);
    }
}

main(); 