#  <img src="https://res.cloudinary.com/djoebsejh/image/upload/v1746277693/Pharos/b4l4e8yqnyde0p4tbs6r.png" alt="Pharovest Logo" width="30" /> **Pharovest: Blockchain Crowdfunding Platform**  

## 🌟 **Overview**
Pharovest is a blockchain-powered platform designed to support **startups, NGOs, charities**, and other initiatives through transparent and decentralized crowdfunding. With **milestone-based fund allocation**, **Pharos blockchain transactions**, and **AI-powered project management**, Pharovest ensures a transparent, secure, and efficient crowdfunding experience. 

## ✨ **Features**
- 🔑 **Milestone-based Funding**: Funds are released only when project milestones are achieved, ensuring accountability
- 🔐 **Blockchain Security**: Built on Pharos Network for decentralized, trustless operations
- 🖼️ **NFT Contributions**: Contributors receive NFTs as proof of participation and project support
- 🤖 **AI Project Management**: Smart project planning and milestone tracking powered by AI
- 💬 **Real-time Social Features**: Community engagement through posts and comments
- 🔗 **Wallet Integration**: Seamless connection with digital wallets via WalletConnect
- 📊 **Project Analytics**: Track fundraising progress, contributions, and milestone achievements

## 💻 **Smart Contract**
**Contract Address**: `0xf94D5Ff360bCD0aEBeF621Ff26bc3BfCc1452b2C`

### ⚙️ **Core Functionalities**
- **Project Creation**: Create new projects with detailed goals and milestones
- **Contribution Handling**: Track contributions in PHAR tokens; all transactions recorded on-chain
- **NFT Minting**: Automatically mint NFTs for contributors as proof of participation
- **Milestone Tracking**: Release funds based on successful milestone completion
- **Withdrawal Capability**: Contributors can withdraw with 90% refund if needed

## 🛠️ **Tech Stack**
- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB
- **Blockchain**: Solidity, Pharos Network
- **AI Integration**: Gemini API for project generation and suggestions
- **Image Storage**: Cloudinary
- **Wallet Connectivity**: WalletConnect
- **Deployment**: Vercel (frontend), Render (backend)

## 🔗 **Connecting to Pharos Networks**

### Adding Pharos Testnet to MetaMask

1. **Open MetaMask** and click on the network dropdown at the top
2. **Select "Add Network"**
3. **Click "Add a network manually"** (at the bottom)
4. **Enter the following details for Pharos Testnet**:
   - **Network Name**: Pharos Testnet
   - **RPC URL**: https://testnet.dplabs-internal.com
   - **Chain ID**: 688688
   - **Currency Symbol**: PHAR
   - **Block Explorer URL**: Leave empty
5. **Click "Save"**

### Adding Pharos Devnet to MetaMask

1. **Open MetaMask** and click on the network dropdown at the top
2. **Select "Add Network"**
3. **Click "Add a network manually"** (at the bottom)
4. **Enter the following details for Pharos Devnet**:
   - **Network Name**: Pharos Devnet
   - **RPC URL**: https://devnet.dplabs-internal.com
   - **Chain ID**: 50002
   - **Currency Symbol**: PHAR
   - **Block Explorer URL**: https://pharosscan.xyz/
5. **Click "Save"**

### Getting Testnet PHAR Tokens

1. **Join the [Pharos Discord](https://discord.gg/pharos)** or relevant community channel
2. **Request testnet tokens** from the faucet channel
3. **Provide your wallet address** in the format specified by the faucet bot
4. **Wait for confirmation** that tokens have been sent to your wallet

### Troubleshooting Connection Issues

- **If the network doesn't appear**: Try restarting your browser or MetaMask extension
- **If transactions fail**: Ensure you have sufficient PHAR for gas fees
- **If RPC errors occur**: Check that your internet connection is stable and you've entered the correct RPC URL

## 🧩 **Adding Pharos Networks to Your Web Application**

### Configuring with Wagmi and RainbowKit

If you're developing a React application that needs to connect to Pharos networks, you can use wagmi and RainbowKit libraries to easily add support:

1. **Install required dependencies**:
   ```bash
   npm install wagmi @rainbow-me/rainbowkit viem
   ```

2. **Define Pharos Networks** in your configuration file:
   ```javascript
   // Define Pharos Testnet
   export const pharosTestnet = {
     id: 688688,
     name: 'Pharos Testnet',
     network: 'pharos-testnet',
     nativeCurrency: {
       decimals: 18,
       name: 'Pharos Testnet Token',
       symbol: 'PHAR',
     },
     rpcUrls: {
       default: { http: ['https://testnet.dplabs-internal.com'] },
       public: { http: ['https://testnet.dplabs-internal.com'] },
     },
     testnet: true,
   };

   // Define Pharos Devnet
   export const pharosDevnet = {
     id: 50002,
     name: 'Pharos Devnet',
     network: 'pharos-devnet',
     nativeCurrency: {
       decimals: 18,
       name: 'Pharos Devnet Token',
       symbol: 'PHAR',
     },
     rpcUrls: {
       default: { http: ['https://devnet.dplabs-internal.com'] },
       public: { http: ['https://devnet.dplabs-internal.com'] },
     },
     blockExplorers: {
       default: { name: 'PharoScan', url: 'https://pharosscan.xyz/' },
     },
     testnet: true,
   };
   ```

3. **Configure Wagmi with the Pharos chains**:
   ```javascript
   import { createConfig } from 'wagmi';
   import { getDefaultWallets } from '@rainbow-me/rainbowkit';
   import { http } from 'viem';

   // Add Pharos chains to your list of supported chains
   const allChains = [pharosDevnet, pharosTestnet, ...otherChains];

   // Set up wallet connectors
   const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';

   const { connectors } = getDefaultWallets({
     appName: 'Your App Name',
     projectId,
     chains: allChains,
   });

   // Create the wagmi config
   export const config = createConfig({
     chains: allChains,
     transports: {
       ...Object.fromEntries(
         allChains.map(chain => [
           chain.id,
           http(chain.rpcUrls.default.http[0])
         ])
       ),
     },
     connectors,
   });
   ```

4. **Implement the RainbowKit provider** in your app:
   ```jsx
   import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
   import { WagmiConfig } from 'wagmi';
   import { config } from './path-to-your-config';

   function App() {
     return (
       <WagmiConfig config={config}>
         <RainbowKitProvider>
           {/* Your app components */}
           <ConnectButton />
         </RainbowKitProvider>
       </WagmiConfig>
     );
   }
   ```

5. **Use the ConnectButton** component to let users connect their wallets:
   ```jsx
   import { ConnectButton } from '@rainbow-me/rainbowkit';

   function Header() {
     return (
       <header>
         <ConnectButton />
       </header>
     );
   }
   ```

### Custom RPC Configuration

For applications that need custom RPC handling (like the Pharos Devnet proxy in this project):

```javascript
// Custom transport for Pharos Devnet (if using a proxy endpoint)
const customTransports = {
  [pharosDevnet.id]: http(pharosDevnet.rpcUrls.default.http[0], {
    fetchOptions: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  }),
};

// Include custom transports in your config
export const config = createConfig({
  chains: allChains,
  transports: {
    ...Object.fromEntries(
      allChains.filter(chain => chain.id !== pharosDevnet.id).map(chain => [
        chain.id,
        http(chain.rpcUrls.default.http[0])
      ])
    ),
    ...customTransports,
  },
  connectors,
});
```

This configuration will add Pharos networks to your wallet connection modal, allowing users to easily connect to the Pharos blockchain.

## 🌍 **Deployment Details**
- **Live Application**: [Pharovest Live](https://pharovest.vercel.app)
- **Demo Video**: [Watch Demo](https://youtu.be/UsYzC0wPcRg)
- **Smart Contract**: Deployed on Pharos Testnet
- **Contract Address**: `0xf94D5Ff360bCD0aEBeF621Ff26bc3BfCc1452b2C`


## 📄 **License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgements**
- [Pharos Network](https://pharosnetwork.xyz) for providing the blockchain infrastructure
- All contributors and supporters of the Pharovest platform
- The open-source community for their invaluable tools and resources
