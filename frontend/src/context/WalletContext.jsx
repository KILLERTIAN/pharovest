import { createContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { pharosTestnet, pharosMainnet } from '../wagmi';
import { sepolia } from 'wagmi/chains';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [networkError, setNetworkError] = useState('');

    const { address, isConnected, chainId, connector } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain();

    // Check if we're on a supported network
    const isSupportedNetwork = chainId === pharosTestnet.id ||
        chainId === pharosMainnet.id ||
        chainId === sepolia.id;

    // Check specifically for Sepolia
    const isSepolia = chainId === sepolia.id;

    // Initialize provider and signer using the current connector
    const initializeProviderAndSigner = async () => {
        try {
            if (isConnected && connector) {
                const provider = await connector.getProvider();
                const ethersProvider = new ethers.providers.Web3Provider(provider, "any");

                setProvider(ethersProvider);
                setSigner(ethersProvider.getSigner());
                setNetworkError('');
                console.log("Ethers provider and signer initialized successfully");
            } else if (window.ethereum) {
                const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
                setProvider(ethersProvider);
                setSigner(ethersProvider.getSigner());
            }
        } catch (error) {
            console.error("Error setting up provider:", error);
        }
    };

    // Update state when account or connector changes
    useEffect(() => {
        if (isConnected && address && connector) {
            setWalletAddress(address);
            initializeProviderAndSigner();
        } else {
            setWalletAddress('');
            setProvider(null);
            setSigner(null);
        }
    }, [address, isConnected, connector]);

    // Listen for chain changes
    useEffect(() => {
        if (window.ethereum) {
            const handleChainChanged = () => {
                // Refresh provider on chain change
                initializeProviderAndSigner();
                window.location.reload();
            };

            window.ethereum.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, []);

    // Monitor network changes
    useEffect(() => {
        if (isConnected && !isSupportedNetwork) {
            setNetworkError('Please connect to a supported network (Sepolia)');
        } else {
            setNetworkError('');
        }
    }, [isConnected, chainId, isSupportedNetwork]);

    const connectWallet = async () => {
        if (!isConnected) {
            openConnectModal();

            // Wait for connection to be established
            const maxRetries = 10;
            let retries = 0;

            return new Promise((resolve, reject) => {
                const checkConnection = async () => {
                    if (isConnected && address) {
                        try {
                            await initializeProviderAndSigner();
                            resolve(true);
                        } catch (error) {
                            console.error("Failed to initialize provider after connection:", error);
                            reject(error);
                        }
                        return;
                    }

                    retries++;
                    if (retries >= maxRetries) {
                        reject(new Error("Connection timeout. Please try again."));
                        return;
                    }

                    // Check again after a short delay
                    setTimeout(checkConnection, 1000);
                };

                // Start checking after initial modal is shown
                setTimeout(checkConnection, 1000);
            });
        } else {
            // Already connected, just ensure provider and signer are initialized
            await initializeProviderAndSigner();
            return true;
        }
    };

    const disconnectWallet = () => {
        disconnect();
    };

    const switchToSepolia = async () => {
        if (switchChain) {
            try {
                await switchChain({ chainId: sepolia.id });
                // Wait a moment for network to switch
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Refresh provider with new network
                await initializeProviderAndSigner();
                return true;
            } catch (error) {
                console.error("Error switching to Sepolia:", error);
                throw error;
            }
        }
    };

    const switchToPharosTestnet = async () => {
        if (switchChain) {
            try {
                await switchChain({ chainId: pharosTestnet.id });
                // Wait a moment for network to switch
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Refresh provider with new network
                await initializeProviderAndSigner();
                return true;
            } catch (error) {
                console.error("Error switching to Pharos Testnet:", error);
                throw error;
            }
        }
    };

    return (
        <WalletContext.Provider
            value={{
                walletAddress,
                provider,
                signer,
                setSigner,
                networkError,
                isSupportedNetwork,
                isSepolia,
                connectWallet,
                disconnectWallet,
                switchToSepolia,
                switchToPharosTestnet,
                currentChainId: chainId,
                initializeProviderAndSigner
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

WalletProvider.propTypes = {
    children: PropTypes.node.isRequired
};
