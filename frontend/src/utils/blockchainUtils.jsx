import { ethers } from 'ethers';
import { Contract } from 'ethers';
import PharovestABI from './PharovestABI.json'; // Import your contract ABI
import { sepolia } from 'wagmi/chains';

// Contract addresses for different networks
const CONTRACT_ADDRESSES = {
  [sepolia.id]: '0x21B050cA33Fb2c5eDD9Dff59A14f999487b262d4', // Sepolia Testnet - DEPLOYED ✅
  // Additional networks can be added here
};

// Default to Sepolia address
const DEFAULT_CONTRACT_ADDRESS = CONTRACT_ADDRESSES[sepolia.id];

// Function to get the appropriate contract address for the current network
export const getContractAddress = (chainId) => {
  return CONTRACT_ADDRESSES[chainId] || DEFAULT_CONTRACT_ADDRESS;
};

// Function to get the contract instance
export const getContract = async (signer) => {
  if (!signer) {
    throw new Error("Signer is not available. Please connect your wallet first.");
  }

  if (!signer.provider) {
    throw new Error("Provider is not available. Make sure your wallet is properly connected.");
  }

  try {
    const network = await signer.provider.getNetwork();
    const contractAddress = getContractAddress(network.chainId);
    return new Contract(contractAddress, PharovestABI, signer);
  } catch (error) {
    console.error("Error initializing contract:", error);
    throw new Error("Failed to initialize blockchain contract. Please check your wallet connection.");
  }
};

// Function to create a project on blockchain
export const createProjectOnBlockchain = async (signer, totalAmount, milestones, projectId) => {
  try {
    const contract = await getContract(signer);
    console.log("Using contract address:", contract.address);

    // If a project ID is provided, use createProjectWithId
    if (projectId) {
      console.log(`Creating project with specific ID: ${projectId}`);
      const transaction = await contract.createProjectWithId(projectId, totalAmount, milestones);
      const txReceipt = await transaction.wait(); // Wait for transaction confirmation
      return txReceipt.transactionHash; // Return the transaction hash
    } else {
      // Use the regular createProject function (default behavior)
      const transaction = await contract.createProject(totalAmount, milestones);
      const txReceipt = await transaction.wait(); // Wait for transaction confirmation
      return txReceipt.transactionHash; // Return the transaction hash
    }
  } catch (error) {
    console.error("Error creating project on blockchain:", error);
    throw error; // Pass the original error for better error handling
  }
};

// Function to contribute to a project
export const contributeToProject = async (signer, projectId, amount) => {
  try {
    const contract = await getContract(signer);
    console.log("Using contract address for contribution:", contract.address);

    const transaction = await contract.contribute(projectId, { value: ethers.utils.parseEther(amount) });
    const txReceipt = await transaction.wait(); // Wait for transaction confirmation
    return txReceipt.transactionHash; // Return the transaction hash
  } catch (error) {
    console.error("Error contributing to project on blockchain:", error);
    throw error; // Pass the original error for better error handling
  }
};

// Helper function to check if a wallet has contributed to a specific project
export const hasContributedToProject = async (contract, projectId, walletAddress) => {
  try {
    const contribution = await contract.getContribution(projectId, walletAddress);
    return contribution > 0;
  } catch (error) {
    console.error("Error checking contributions:", error);
    return false;
  }
};

// Helper function to get contribution amount for a project
export const getContributionAmount = async (contract, projectId, walletAddress) => {
  try {
    const contribution = await contract.getContribution(projectId, walletAddress);
    return ethers.utils.formatEther(contribution);
  } catch (error) {
    console.error("Error getting contribution amount:", error);
    return "0";
  }
};

// Helper function to get all contributors for a project
export const getAllContributors = async (contract, projectId) => {
  try {
    const contributors = await contract.getContributors(projectId);
    return contributors || [];
  } catch (error) {
    console.error(`Error getting contributors for project ${projectId}:`, error);
    return [];
  }
};

// Helper function to get all contributions for a project
export const getAllContributions = async (contract, projectId) => {
  try {
    // First get project data to check if it exists and has raised funds
    const projectData = await contract.getProject(projectId);

    if (!projectData || projectData[1] <= 0) {
      console.log(`Project ${projectId} has no contributions`);
      return [];
    }

    // Get all contributors
    const contributors = await getAllContributors(contract, projectId);

    if (!contributors || contributors.length === 0) {
      console.log(`Project ${projectId} has no contributors`);
      return [];
    }

    console.log(`Found ${contributors.length} contributors for project ${projectId}`);

    // Get contribution amounts for each contributor
    const contributions = await Promise.all(contributors.map(async (contributor) => {
      try {
        const amount = await getContributionAmount(contract, projectId, contributor);

        // Only include non-zero contributions
        if (parseFloat(amount) > 0) {
          // Create contribution object
          return {
            project: projectId,
            contributor,
            amount,
            usdValue: (parseFloat(amount) * 3000).toFixed(2), // Use standard ETH/USD conversion
            timestamp: new Date().toISOString(), // We don't have timestamp from blockchain
            network: "Sepolia Testnet", // Default to sepolia
            blockchainVerified: true,
            transactionHash: "Verified on blockchain" // We don't have tx hash from getContributors
          };
        }
        return null;
      } catch (error) {
        console.error(`Error getting contribution for ${contributor}:`, error);
        return null;
      }
    }));

    // Filter out null values and return valid contributions
    return contributions.filter(contribution => contribution !== null);
  } catch (error) {
    console.error(`Error getting all contributions for project ${projectId}:`, error);
    return [];
  }
};

// Get project details directly from blockchain
export const getProjectDetailsFromBlockchain = async (contract, projectId) => {
  try {
    const projectData = await contract.getProject(projectId);
    if (!projectData) return null;

    // Convert BigInt values to strings for easier handling
    return {
      totalAmount: ethers.utils.formatEther(projectData[0]),
      amountRaised: ethers.utils.formatEther(projectData[1]),
      isActive: projectData[2],
      milestoneCount: projectData[3].toString()
    };
  } catch (error) {
    console.error(`Error getting project details from blockchain for project ${projectId}:`, error);
    return null;
  }
};

// Helper function to check if network is supported
export const isSupportedNetwork = (chainId) => {
  return !!CONTRACT_ADDRESSES[chainId];
};

// Network Configuration
export const SUPPORTED_NETWORKS = {
  SEPOLIA: {
    id: sepolia.id,
    name: "Sepolia Testnet",
    icon: "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp",
    explorerUrl: "https://sepolia.etherscan.io"
  }
};

// Helper function to identify network from ID or name
export const identifyNetwork = (networkIdOrName) => {
  if (!networkIdOrName) return SUPPORTED_NETWORKS.SEPOLIA;

  // Check if it's a numeric ID
  if (typeof networkIdOrName === 'number' || !isNaN(Number(networkIdOrName))) {
    const networkId = Number(networkIdOrName);
    if (networkId === sepolia.id) return SUPPORTED_NETWORKS.SEPOLIA;
  }

  // Check if it's a string name
  if (typeof networkIdOrName === 'string') {
    const networkName = networkIdOrName.toLowerCase();
    if (networkName.includes('sepolia')) return SUPPORTED_NETWORKS.SEPOLIA;
  }

  // Default to Sepolia if not identified
  return SUPPORTED_NETWORKS.SEPOLIA;
};

// Helper function to get explorer URL for transaction based on network
export const getExplorerUrl = (transactionHash) => {
  if (!transactionHash) return '';

  // If transaction hash is "Verified on blockchain", return a default static message
  if (transactionHash === "Verified on blockchain" || transactionHash === "Not stored in database") {
    return '#'; // Return a fallback hash that won't navigate
  }

  // Use Sepolia Etherscan for all transactions
  return `https://sepolia.etherscan.io/tx/${transactionHash}`;
};

// Add other blockchain interaction functions here if needed
