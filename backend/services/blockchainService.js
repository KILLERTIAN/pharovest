import { ethers } from "ethers";
import FinvestABI from "../abis/Finvest.json" assert { type: "json" };

// Initialize the provider and signer
const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

// Initialize the contract
const contractAddress = process.env.FINVEST_CONTRACT_ADDRESS;
const finvestContract = new ethers.Contract(contractAddress, FinvestABI, signer);

// Example function to interact with the contract
export const contributeToProject = async (projectId, amount) => {
  try {
    const tx = await finvestContract.contribute(projectId, { value: ethers.utils.parseEther(amount) });
    await tx.wait();
    console.log(`Contribution made: ${tx.hash}`);
  } catch (error) {
    console.error("Error contributing to project:", error);
  }
};
