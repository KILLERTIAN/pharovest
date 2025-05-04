import { http, createConfig } from 'wagmi';
import { sepolia, arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

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
    default: { http: ['http://localhost:8000/api/pharosrpc'] },
    public: { http: ['http://localhost:8000/api/pharosrpc'] },
  },
  blockExplorers: {
    default: { name: 'PharoScan', url: 'https://pharosscan.xyz' },
  },
  testnet: true,
};

// Define Pharos Testnet
export const pharosTestnet = {
  id: 2731,
  name: 'Pharos Testnet',
  network: 'pharos-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Pharos Testnet Token',
    symbol: 'tPHAROS',
  },
  rpcUrls: {
    default: { http: ['https://pharos-testnet.rpc.caldera.xyz/http'] },
    public: { http: ['https://pharos-testnet.rpc.caldera.xyz/http'] },
  },
  blockExplorers: {
    default: { name: 'BlockScout', url: 'https://pharos-explorer.caldera.xyz' },
  },
  testnet: true,
};

// Define Pharos Mainnet
export const pharosMainnet = {
  id: 2730,
  name: 'Pharos',
  network: 'pharos',
  nativeCurrency: {
    decimals: 18,
    name: 'Pharos',
    symbol: 'PHAROS',
  },
  rpcUrls: {
    default: { http: ['https://pharos.rpc.caldera.xyz/http'] },
    public: { http: ['https://pharos.rpc.caldera.xyz/http'] },
  },
  blockExplorers: {
    default: { name: 'BlockScout', url: 'https://pharos-explorer.caldera.xyz' },
  },
};

// Setup chains with their RPC providers
const allChains = [pharosDevnet, pharosTestnet, pharosMainnet, sepolia, mainnet, polygon, optimism, arbitrum, base];

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
  transports: {
    ...Object.fromEntries(
      allChains.filter(chain => chain.id !== pharosDevnet.id).map(chain => [
        chain.id,
        http(chain.rpcUrls.default.http[0])
      ])
    ),
    // Custom transport for Pharos Devnet
    [pharosDevnet.id]: http(pharosDevnet.rpcUrls.default.http[0], {
      fetchOptions: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    }),
  },
  connectors,
});
