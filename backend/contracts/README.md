# Pharovest Smart Contract for Pharos Hackathon

This smart contract is designed for the Pharovest blockchain crowdfunding platform, specifically for the Pharos blockchain hackathon.

## Contract Overview

- **Name**: Pharovest
- **Token Standard**: ERC721 (NFT)
- **Network**: Pharos Testnet
- **Features**:
  - Project creation with milestone-based funding
  - Contribution tracking with NFT rewards
  - Milestone-based fund release
  - Withdrawal capability (90% refund)

## Testing on Remix

### Setup

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file called `Pharovest.sol`
3. Copy and paste the entire contract code from the `Pharovest.sol` file
4. Install required dependencies:
   - Click on "File Explorer"
   - Under "File" menu, select "Open in GitHub, Gist..."
   - Enter `OpenZeppelin/openzeppelin-contracts`
   - Select the `ERC721.sol` and `Ownable.sol` files
5. Compile the contract:
   - Go to the "Solidity Compiler" tab
   - Select compiler version 0.8.20
   - Click "Compile Pharovest.sol"

### Deploying on Remix with Pharos Testnet

1. Go to the "Deploy & Run Transactions" tab
2. Change the environment to "Injected Provider - MetaMask"
3. Configure MetaMask to connect to Pharos Testnet:
   - Network Name: Pharos Testnet
   - RPC URL: https://rpc-node-tst.pharosnet.xyz
   - Chain ID: 18538
   - Currency Symbol: PHAR
4. In the Deploy section, enter your address as the `initialOwner` parameter
5. Click "Deploy" and confirm the transaction in MetaMask

### Testing Contract Functions

After deployment, you can interact with the contract through the Remix interface:

#### Creating a Project

1. Use the `createProject` function with:
   - `totalAmount`: Total funding goal (in wei)
   - `milestones`: Array of milestone structs, each containing:
     - `title`: Milestone description
     - `amountRequired`: Amount needed for this milestone (in wei)
     - `recipient`: Address to receive funds for this milestone
     - `isCompleted`: Initially false

Example: Create a project with two milestones:
```
[
  ["First milestone", 500000000000000000, "0xYourAddress", false],
  ["Second milestone", 500000000000000000, "0xYourAddress", false]
]
```
Total amount: 1000000000000000000 (1 PHAR)

#### Contributing to a Project

1. Use the `contribute` function with:
   - `projectId`: ID of the project to contribute to (starting from 0)
   - Set the "Value" field to the amount of PHAR you want to contribute

#### Testing Withdrawals

1. Use the `withdraw` function with:
   - `projectId`: ID of the project to withdraw from

#### Transferring Funds to Milestone Recipients

1. Use the `transferFunds` function with:
   - `projectId`: ID of the project
   - `milestoneIndex`: Index of the milestone to fund (starting from 0)

## Important Notes

- The contract uses the native coin (PHAR) for transactions
- NFTs are automatically minted for contributors
- Only the contract owner can transfer funds to milestone recipients
- Contributors can withdraw and receive 90% of their contribution back

## Troubleshooting

- Ensure you have enough PHAR in your wallet for testing
- If transactions fail, check the error message in Remix's console
- Verify that all the required imports are correctly loaded
- Remember that milestone amounts must add up to the total project amount 