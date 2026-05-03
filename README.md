#  <img src="https://res.cloudinary.com/djoebsejh/image/upload/v1746277693/Pharos/b4l4e8yqnyde0p4tbs6r.png" alt="Pharovest Logo" width="30" /> **Pharovest: Blockchain Crowdfunding Platform**  

Pharovest is a state-of-the-art, blockchain-powered platform designed to revolutionize crowdfunding for **startups, NGOs, and charities**. By combining decentralized finance (DeFi) with artificial intelligence, Pharovest ensures absolute transparency, milestone-based accountability, and community-driven support.

## 🚀 Project Vision
Traditional crowdfunding often lacks accountability once funds are raised. Pharovest solves this by using **Smart Contracts** to lock funds and release them only when pre-defined project milestones are achieved and verified.

---

## ✨ Core Features

### 🔐 Blockchain Transparency
- **Milestone-Based Funding**: Funds are locked in the contract and released only upon milestone verification.
- **NFT Proof of Support**: Every contributor receives a unique **Pharovest NFT (PNFT)** as a badge of honor and proof of participation.
- **On-chain Transactions**: Fully verifiable contributions and withdrawals on the Sepolia network.

### 🤖 AI-Powered Intelligence
- **Smart Project Generator**: Powered by **Google Gemini 1.5 Flash**, helping creators draft professional proposals.
- **Automated Milestones**: AI suggests logical project phases and budget allocations based on goals.
- **Project Optimization**: Real-time suggestions for better fundraising outcomes.

### 🎨 Premium User Experience
- **Interactive Dashboard**: Modern, responsive UI with real-time fundraising charts.
- **Seamless Wallet Connection**: Integrated with **RainbowKit** and **Wagmi** for a smooth Web3 experience.
- **Social Interaction**: Integrated community feed for engagement between creators and supporters.

---

## 🏗️ Architecture & Tech Stack

Pharovest is built with a modern full-stack architecture:

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS, Framer Motion, Shadcn UI
- **Web3**: Wagmi, Viem, RainbowKit, Ethers.js v5
- **State Management**: TanStack Query (v5)

### Backend
- **Server**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI**: @google/generative-ai (Gemini API)
- **File Storage**: Cloudinary

### Blockchain (Smart Contracts)
- **Language**: Solidity 0.8.20
- **Environment**: Hardhat
- **Standards**: ERC721 (for Proof-of-Contribution NFTs)

---

## 💻 Smart Contract Details

The Pharovest smart contract handles project creation, fund management, and NFT minting.

- **Contract Name**: `Pharovest`
- **Primary Network**: Sepolia Testnet
- **Sepolia Contract Address**: `0x21B050cA33Fb2c5eDD9Dff59A14f999487b262d4` ✅

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (v18+)
- **MongoDB Atlas** account
- **Web3 Wallet** (e.g., MetaMask)
- API Keys: Alchemy/Infura (Sepolia), Google Gemini, Cloudinary

### 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/pharovest.git
   cd pharovest
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create .env based on .env.example
   npm start
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   # Create .env
   npm run dev
   ```

### 📜 Smart Contract Tasks (Backend)
- **Compile**: `npx hardhat compile`
- **Test**: `npx hardhat test`
- **Deploy**: `npx hardhat run scripts/deploy.js --network sepolia`

---

## 📂 Project Structure

```text
pharovest/
├── backend/            # Express server, AI logic, and Hardhat contracts
│   ├── contracts/      # Solidity smart contracts
│   ├── controllers/    # Business logic (User, Project, AI)
│   ├── models/         # Mongoose schemas
│   └── routes/         # API endpoints
├── frontend/           # React application (Vite)
│   ├── src/
│   │   ├── components/ # UI components (Shadcn)
│   │   ├── context/    # Global state
│   │   ├── pages/      # Route pages
│   │   └── utils/      # Blockchain & Auth utilities
└── README.md           # Unified documentation
```

---

## 🔗 Live Resources

- **Live Application**: [Pharovest Live](https://pharovest.vercel.app)
- **Demo Video**: [Watch Demo](https://youtu.be/UsYzC0wPcRg)

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements
- **Sepolia** for blockchain infrastructure.
- **Google DeepMind** for providing Gemini AI capabilities.
- The open-source community for the incredible tools used in this project.
