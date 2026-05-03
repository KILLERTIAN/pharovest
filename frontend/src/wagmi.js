import { http, createConfig } from 'wagmi';
import { sepolia, arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

// Sepolia is already imported from wagmi/chains at the top
// We'll use it directly instead of defining pharosDevnet

// Setup chains with their RPC providers
const allChains = [sepolia, mainnet, polygon, optimism, arbitrum, base];

// Set up wallet connectors
const projectId = '7a026d961241ea662d0e403720f0552d';

const { connectors } = getDefaultWallets({
  appName: 'Pharovest',
  projectId,
  chains: allChains,
});

// Create the wagmi config
export const config = createConfig({
  chains: allChains,
  transports: Object.fromEntries(
    allChains.map(chain => [
      chain.id,
      http(chain.rpcUrls.default.http[0])
    ])
  ),
  connectors,
});
