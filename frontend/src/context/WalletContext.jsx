import { createContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { pharosTestnet, pharosMainnet, pharosDevnet } from '../wagmi';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [networkError, setNetworkError] = useState('');
    
    const { address, isConnected, chainId } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain();

    // Check if we're on a supported Pharos network
    const isPharosNetwork = chainId === pharosTestnet.id || 
                          chainId === pharosMainnet.id || 
                          chainId === pharosDevnet.id;
    
    // Check specifically for Devnet
    const isPharosDevnet = chainId === pharosDevnet.id;

    // Initialize provider and signer
    const initializeProviderAndSigner = async () => {
        try {
            if (window.ethereum) {
                const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
                // Force a refresh of network and accounts
                await ethersProvider.send("eth_requestAccounts", []);
                await ethersProvider.send("eth_chainId", []);
                
                setProvider(ethersProvider);
                setSigner(ethersProvider.getSigner());
                setNetworkError('');
            }
        } catch (error) {
            console.error("Error setting up provider:", error);
        }
    };

    // Update state when account changes
    useEffect(() => {
        if (isConnected && address) {
            setWalletAddress(address);
            initializeProviderAndSigner();
        } else {
            setWalletAddress('');
            setProvider(null);
            setSigner(null);
        }
    }, [address, isConnected]);

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
        if (isConnected && !isPharosNetwork) {
            setNetworkError('Please connect to a Pharos network for full functionality');
        } else {
            setNetworkError('');
        }
    }, [isConnected, chainId, isPharosNetwork]);

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

    const switchToPharosDevnet = async () => {
        if (switchChain) {
            try {
                await switchChain({ chainId: pharosDevnet.id });
                // Wait a moment for network to switch
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Refresh provider with new network
                await initializeProviderAndSigner();
                return true;
            } catch (error) {
                console.error("Error switching to Pharos Devnet:", error);
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
                isPharosNetwork,
                isPharosDevnet,
                connectWallet,
                disconnectWallet,
                switchToPharosDevnet,
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
