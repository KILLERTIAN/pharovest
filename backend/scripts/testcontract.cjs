const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const contractAddress = "0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C"; // Updated Pharovest contract address on Pharos testnet

async function main() {
  try {
    // Connect to the Pharos testnet
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-node-tst.pharosnet.xyz");
    
    // Read contract ABI from the artifacts directory
    const abiPath = path.join(__dirname, "../artifacts/contracts/Pharovest.sol/Pharovest.json");
    const contractData = JSON.parse(fs.readFileSync(abiPath, "utf8"));
    const abi = contractData.abi;
    
    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    // Get project count
    const projectCount = await contract.projectCount();
    console.log(`Total projects: ${projectCount.toString()}`);
    
    // More contract interactions can be added here

  } catch (error) {
    console.error("Error testing contract:", error);
  }
}

// Execute the main function
main();
