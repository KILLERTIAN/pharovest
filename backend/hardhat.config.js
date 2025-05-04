require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
const PHAROS_RPC_URL = process.env.PHAROS_RPC_URL || "https://devnet.dplabs-internal.com";
const PHAROS_API_KEY = process.env.PHAROS_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    pharos: {
      url: PHAROS_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 50002, // Pharos devnet chain ID
      gas: 2100000,
      gasPrice: 8000000000 // 8 Gwei
    }
  },
  etherscan: {
    apiKey: {
      pharos: PHAROS_API_KEY
    },
    customChains: [
      {
        network: "pharos",
        chainId: 50002,
        urls: {
          apiURL: "https://pharosscan.xyz/api",
          browserURL: "https://pharosscan.xyz"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 