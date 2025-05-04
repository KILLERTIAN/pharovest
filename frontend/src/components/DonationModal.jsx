import { useState, useContext, useEffect } from "react";
import { usdToEth, ethToUsd } from "../utils/conversion";
import { WalletContext } from "@/context/WalletContext";
import { ethers } from "ethers";
import PharovestABI from '../utils/PharovestABI.json';
import { toast } from 'react-hot-toast';
import { X, CreditCard, AlertCircle, CheckCircle2, ArrowRight, Wallet, Loader2 } from "lucide-react";
import PropTypes from 'prop-types';
import React from 'react';
import { getContractAddress, getExplorerUrl } from "../utils/blockchainUtils";

// Function to convert technical error messages to user-friendly messages
const getUserFriendlyErrorMessage = (error) => {
    const errorMessage = error.message || "Unknown error occurred";
    const errorData = error.data ? error.data.message || "" : "";
    
    // Check for specific error: Project is not active
    if (errorMessage.includes("Project is not active") || errorData.includes("Project is not active")) {
        return "This project is not active on the blockchain. The project may have been created in the database but not properly registered on the blockchain. Please contact the project creator or refresh the page and try again.";
    }
    
    // Parse the hex error message for better error handling
    if (errorMessage.includes("execution reverted") && errorMessage.includes("08c379a0")) {
        // This is a standard Solidity error format
        try {
            // Extract the error message from the hex data
            const hexData = errorMessage.match(/08c379a0([0-9a-fA-F]+)/);
            if (hexData && hexData[1]) {
                // Use TextEncoder/TextDecoder instead of Buffer which isn't available in browser
                const hexString = hexData[1];
                // Convert hex to bytes
                const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                
                // Skip the first 32 bytes (offset) and the next 32 bytes (length)
                // In a typical Solidity error, the layout is:
                // 32 bytes: offset to string data
                // 32 bytes: string length
                // N bytes: string data
                
                // Extract the length (at position 32-64)
                const dataView = new DataView(bytes.buffer);
                const stringLength = dataView.getUint32(60); // Get last 4 bytes of the 32-64 range
                
                // Get the string data
                const stringBytes = bytes.slice(64, 64 + stringLength);
                const decodedMsg = new TextDecoder().decode(stringBytes);
                
                if (decodedMsg.includes("Project is not active")) {
                    return "This project is not active on the blockchain. The project may have been created in the database but not properly registered on the blockchain. Please contact the project creator or refresh the page and try again.";
                }
                
                return `Contract error: ${decodedMsg}`;
            }
        } catch (parseError) {
            console.error("Error parsing contract error message:", parseError);
        }
    }
    
    // Check for the specific JSON-RPC errors with nested data
    if (error.code === -32603 && errorData.includes("insufficient funds")) {
        return "Your wallet doesn't have enough funds on the Pharos network. You can get free test tokens from the Pharos faucet.";
    }
    
    // Handle common MetaMask/wallet errors
    if (errorMessage.includes("user rejected") || errorMessage.includes("User denied")) {
        return "You declined the transaction in your wallet. You can try again when you're ready.";
    }
    
    if (errorMessage.includes("insufficient funds") || errorData.includes("insufficient funds")) {
        return "Your wallet doesn't have enough funds on the Pharos network. Visit the Pharos faucet to get free test tokens.";
    }
    
    if (errorMessage.includes("execution reverted")) {
        return "The transaction was rejected by the blockchain. This might be due to contract restrictions or network issues.";
    }
    
    if (errorMessage.includes("nonce")) {
        return "There was a transaction sequence issue. Please refresh the page and try again.";
    }
    
    if (errorMessage.includes("gas")) {
        return "The transaction couldn't be completed due to gas fee issues. You may need to adjust gas settings in your wallet.";
    }
    
    if (errorMessage.includes("network") || errorMessage.includes("connection")) {
        return "Network connection issue detected. Please check your internet connection and wallet network settings.";
    }
    
    if (errorMessage.includes("network") || errorMessage.includes("chain")) {
        return "Please switch to the Pharos network in your wallet to complete this transaction.";
    }
    
    // Fallback for other errors
    return "There was an issue with your transaction. Please try again or contact support.";
};

// Separate standalone component for error toast
class ErrorToastContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false
        };
    }
    
    toggleExpand = () => {
        this.setState(prevState => ({
            isExpanded: !prevState.isExpanded
        }));
    }
    
    render() {
        const { t, errorMessage, technicalDetails } = this.props;
        const { isExpanded } = this.state;
        
        const shortTechnicalDetails = technicalDetails.length > 50 
            ? `${technicalDetails.substring(0, 50)}...` 
            : technicalDetails;
            
        return (
            <div 
                className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-[#1A3A2C] border-l-4 border-red-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-white">
                                Transaction Failed
                            </p>
                            <p className="mt-1 text-sm text-gray-300">
                                {errorMessage}
                            </p>
                            
                            {technicalDetails && technicalDetails !== errorMessage && (
                                <div className="mt-1">
                                    <p className="text-xs text-gray-400 mb-1">Technical details:</p>
                                    <p className="text-xs text-gray-400 bg-[#05140D] p-2 rounded">
                                        {isExpanded ? technicalDetails : shortTechnicalDetails}
                                    </p>
                                    
                                    {technicalDetails.length > 50 && (
                                        <button
                                            onClick={this.toggleExpand}
                                            className="mt-1 text-xs text-[#2FB574] hover:underline flex items-center"
                                        >
                                            {isExpanded ? 'Show less' : 'Show more'}
                                            <ArrowRight className="h-3 w-3 ml-1" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-700">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-white focus:outline-none"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        );
    }
}

ErrorToastContent.propTypes = {
    t: PropTypes.object.isRequired,
    errorMessage: PropTypes.string.isRequired,
    technicalDetails: PropTypes.string.isRequired
};

// Function to show the custom error toast
const showErrorToast = (error) => {
    const technicalDetails = error.message || "Unknown error";
    const userFriendlyMessage = getUserFriendlyErrorMessage(error);
    
    toast.custom((t) => (
        <ErrorToastContent 
            t={t} 
            errorMessage={userFriendlyMessage} 
            technicalDetails={technicalDetails} 
        />
    ), {
        duration: 8000, // Longer duration for error messages
    });
};

const DonationModal = ({ isOpen, onClose, projectId, onSuccess }) => {
    const [amountUSD, setAmountUSD] = useState("");
    const [amountETH, setAmountETH] = useState("");
    const [loading, setLoading] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState("idle"); // idle, processing, confirming, success, error
    const [transactionHash, setTransactionHash] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [userFriendlyError, setUserFriendlyError] = useState("");
    const { 
        walletAddress, 
        // eslint-disable-next-line no-unused-vars
        connectWallet, 
        signer, 
        isPharosNetwork,
        isPharosDevnet,
        switchToPharosDevnet,
        currentChainId,
        // eslint-disable-next-line no-unused-vars
        setSigner
    } = useContext(WalletContext);

    // Reset state when modal is opened
    useEffect(() => {
        if (isOpen) {
            setTransactionStatus("idle");
            setLoading(false);
            setTransactionHash("");
            setErrorMessage("");
            setUserFriendlyError("");
        }
    }, [isOpen]);

    // Handle successful transaction with callback
    useEffect(() => {
        if (transactionStatus === "success" && onSuccess && typeof onSuccess === 'function') {
            // Call the onSuccess callback after a short delay to allow UI to update
            const timer = setTimeout(() => {
                onSuccess();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [transactionStatus, onSuccess]);

    // Check network when modal is opened
    useEffect(() => {
        if (isOpen && walletAddress && !isPharosNetwork) {
            toast.error("Please switch to a Pharos network to make a donation", {
                icon: <AlertCircle className="h-5 w-5 text-red-500" />,
                duration: 5000,
                action: {
                    label: 'Switch to Devnet',
                    onClick: () => switchToPharosDevnet()
                }
            });
        }
    }, [isOpen, walletAddress, isPharosNetwork, switchToPharosDevnet]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.className && event.target.className.includes && event.target.className.includes('modal-overlay')) {
                if (transactionStatus !== "processing" && transactionStatus !== "confirming") {
                    onClose();
                }
            }
        };

        const handleEscKey = (event) => {
            if (event.key === 'Escape' && transactionStatus !== "processing" && transactionStatus !== "confirming") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, onClose, transactionStatus]);

    const handleUSDChange = (e) => {
        const usd = e.target.value;
        setAmountUSD(usd);
        setAmountETH(usdToEth(usd));
    };

    const handleETHChange = (e) => {
        const eth = e.target.value;
        setAmountETH(eth);
        setAmountUSD(ethToUsd(eth));
    };

    const handleSubmit = () => {
        if (amountUSD > 0) {
            handleDonate(amountETH, amountUSD);
        } else {
            toast.error("Please enter a valid amount");
        }
    };

    const resetForm = () => {
        setTransactionStatus("idle");
        setLoading(false);
        setAmountUSD("");
        setAmountETH("");
        setTransactionHash("");
        setErrorMessage("");
        setUserFriendlyError("");
    };

    const handleDonate = async (amountETH, amountUSD) => {
        if (!signer) {
            toast.error("Please connect your wallet first");
            return;
        }

        if (!isPharosNetwork) {
            toast.error("Please switch to a Pharos network");
            return;
        }

        setLoading(true);
        setTransactionStatus("processing");

        try {
            // Create contract instance
            const contractAddress = getContractAddress(currentChainId);
            console.log(`Using contract at address: ${contractAddress} for chain ID: ${currentChainId}`);
            
            const contract = new ethers.Contract(contractAddress, PharovestABI, signer);
            
            // Convert project ID to number if it's a string
            const projectIdNumber = typeof projectId === 'string' ? parseInt(projectId, 10) : projectId;
            
            // Validate project ID
            if (isNaN(projectIdNumber)) {
                throw new Error(`Invalid project ID: ${projectId}. Must be a number.`);
            }
            
            console.log(`Donating ${amountETH} ETH to project with ID: ${projectIdNumber} (numeric)`);
            
            // Convert ETH amount to wei
            const amountInWei = ethers.utils.parseEther(amountETH.toString());
            
            // Call the contribute function
            const transaction = await contract.contribute(projectIdNumber, {
                value: amountInWei
            });
            
            setTransactionHash(transaction.hash);
            setTransactionStatus("confirming");
            
            // Wait for transaction confirmation
            const receipt = await transaction.wait();
            
            if (receipt.status === 1) {
                console.log("Transaction successful:", receipt);
                setTransactionStatus("success");
                
                // Record transaction in database
                await saveTransactionToBackend(transaction.hash, amountETH, amountUSD);
                
                // Show success toast
                toast.custom((t) => (
                    <div className={`${
                        t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-[#1A3A2C] border-l-4 border-green-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-white">
                                        Contribution Successful!
                                    </p>
                                    <p className="mt-1 text-sm text-gray-300">
                                        You&apos;ve successfully contributed {amountETH} ETH to this project.
                                    </p>
                                    <p className="text-sm text-blue-500">
                                        <a 
                                            href={getExplorerUrl(transaction.hash)} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1"
                                        >
                                            <span>{transaction.hash.substring(0, 8)}...{transaction.hash.substring(transaction.hash.length - 6)}</span>
                                            <ArrowRight className="h-3 w-3" />
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-gray-700">
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-white focus:outline-none"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ), {
                    duration: 5000,
                });
            } else {
                console.error("Transaction failed:", receipt);
                setTransactionStatus("error");
                setErrorMessage("Transaction failed to confirm. Please check the explorer for details.");
                setUserFriendlyError("Your contribution couldn't be processed. This might be due to network issues or contract restrictions.");
                showErrorToast(new Error("Transaction failed to confirm"));
            }
        } catch (error) {
            console.error("Error making donation:", error);
            setTransactionStatus("error");
            setErrorMessage(error.message || "Unknown error occurred");
            setUserFriendlyError(getUserFriendlyErrorMessage(error));
            showErrorToast(error);
        } finally {
            setLoading(false);
        }
    };

    // Save transaction to backend - enhanced with retry logic
    const saveTransactionToBackend = async (transactionHash, amountETH, amountUSD) => {
        const maxRetries = 3;
        let retryCount = 0;
        
        const attemptSave = async () => {
            try {
                const response = await fetch('http://localhost:8000/transactions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        project: projectId,
                        contributor: walletAddress,
                        amount: amountETH,
                        usdValue: amountUSD,
                        transactionHash: transactionHash,
                        network: isPharosDevnet ? "Pharos Devnet" : "Pharos Testnet",
                        timestamp: new Date().toISOString()
                    }),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Transaction saved to backend:", data);
                return data;
            } catch (error) {
                console.error("Error saving transaction to backend:", error);
                
                if (retryCount < maxRetries) {
                    retryCount++;
                    console.log(`Retrying (${retryCount}/${maxRetries})...`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                    return attemptSave();
                }
                
                // If we've exhausted retries, just log the error
                console.error(`Failed to save transaction after ${maxRetries} attempts`);
            }
        };
        
        return attemptSave();
    };

    const getStatusMessage = () => {
        switch(transactionStatus) {
            case "processing":
                return "Preparing transaction...";
            case "confirming":
                return "Waiting for blockchain confirmation...";
            case "success":
                return "Transaction successful!";
            case "error":
                return "Transaction failed. Please try again.";
            default:
                return "";
        }
    };

    const getExplorerLink = () => {
        if (!transactionHash) return "#";
        return getExplorerUrl(transactionHash);
    };

    const renderTransactionStatusContent = () => {
        switch(transactionStatus) {
            case "processing":
                return (
                    <div className="flex flex-col items-center justify-center py-10 space-y-6">
                        <div className="relative h-24 w-24">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-ping"></div>
                            <div className="absolute inset-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-40 animate-pulse"></div>
                            <Wallet className="absolute inset-0 h-full w-full text-white m-6" />
                        </div>
                        <p className="text-center text-white text-lg">{getStatusMessage()}</p>
                        <p className="text-center text-gray-400 text-sm">Please confirm the transaction in your wallet</p>
                    </div>
                );
            case "confirming":
                return (
                    <div className="flex flex-col items-center justify-center py-10 space-y-6">
                        <div className="relative h-24 w-24">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-500 border-opacity-20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2FB574] animate-spin"></div>
                            <Loader2 className="absolute inset-0 h-full w-full text-[#2FB574] m-6 animate-pulse" />
                        </div>
                        <p className="text-center text-white text-lg">{getStatusMessage()}</p>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                            <span>Transaction Hash:</span>
                            <a 
                                href={getExplorerLink()} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#2FB574] hover:underline truncate max-w-[150px]"
                            >
                                {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
                            </a>
                        </div>
                    </div>
                );
            case "success":
                return (
                    <div className="flex flex-col items-center justify-center py-10 space-y-6">
                        <div className="relative h-24 w-24">
                            <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-full animate-pulse"></div>
                            <CheckCircle2 className="absolute inset-0 h-full w-full text-green-500 m-4" />
                        </div>
                        <p className="text-center text-white text-xl font-semibold">{getStatusMessage()}</p>
                        <div className="space-y-3">
                            <p className="text-center text-gray-300">Thank you for supporting this project!</p>
                            <div className="flex items-center justify-center space-x-2">
                                <a 
                                    href={getExplorerLink()}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[#2FB574] hover:underline flex items-center"
                                >
                                    View on Pharos Explorer
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </a>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full">
                            <button 
                                onClick={resetForm}
                                className="flex-1 bg-transparent border border-[#2C5440] text-white hover:bg-[#142A20] font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                                Make another donation
                            </button>
                            <button 
                                onClick={onClose}
                                className="flex-1 bg-[#2FB574] hover:bg-[#26925e] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                );
            case "error":
                return (
                    <div className="flex flex-col items-center justify-center py-10 space-y-6">
                        <div className="relative h-24 w-24">
                            <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-full animate-pulse"></div>
                            <AlertCircle className="absolute inset-0 h-full w-full text-red-500 m-4" />
                        </div>
                        <p className="text-center text-white text-xl font-semibold">{getStatusMessage()}</p>
                        <div className="max-w-full px-4">
                            <p className="text-center text-gray-300 text-sm mb-2">There was an issue with your transaction:</p>
                            <div className="bg-[#05140D] p-3 rounded-lg border border-red-600 text-red-300 text-sm mb-3">
                                {userFriendlyError || "An unexpected error occurred during the transaction."}
                            </div>
                            
                            {errorMessage && errorMessage !== userFriendlyError && (
                                <div className="mt-2">
                                    <details className="text-xs text-gray-400">
                                        <summary className="cursor-pointer hover:text-gray-300 mb-1">Technical details</summary>
                                        <div className="bg-[#05140D] p-2 rounded text-gray-400 overflow-auto max-h-[60px]">
                                            {errorMessage}
                                        </div>
                                    </details>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 w-full">
                            <button 
                                onClick={resetForm}
                                className="flex-1 bg-transparent border border-[#2C5440] text-white hover:bg-[#142A20] font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                                Try again
                            </button>
                            <button 
                                onClick={onClose}
                                className="flex-1 bg-[#2FB574] hover:bg-[#26925e] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`modal-overlay fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="modal-content bg-[#1A3A2C] rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-[#2C5440] overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-[#2C5440] flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#2FB574] flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Donate to Project
                    </h2>
                    {transactionStatus !== "processing" && transactionStatus !== "confirming" && (
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-6">
                    {loading || transactionStatus === "success" || transactionStatus === "error" ? (
                        renderTransactionStatusContent()
                    ) : (
                        <>
                            <div className="space-y-6">
                                {/* Pharos Devnet Notice */}
                                <div className="bg-[#05140D] p-3 rounded-lg border border-blue-600 text-blue-300 text-sm">
                                    <p className="font-medium mb-1">⚠️ Pharos Devnet Mode</p>
                                    <p>This app uses the Pharos Devnet for demonstrations. You&apos;ll need Pharos Devnet tokens to make donations.</p>
                                    <a 
                                        href="https://pharosscan.xyz/faucet" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[#2FB574] hover:underline flex items-center mt-1 text-xs"
                                    >
                                        Get free Pharos tokens from faucet
                                        <ArrowRight className="h-3 w-3 ml-1" />
                                    </a>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-200">
                                        Amount in USD:
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={amountUSD}
                                            onChange={handleUSDChange}
                                            className="w-full pl-8 pr-3 py-3 bg-[#05140D] border border-[#2C5440] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2FB574] transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-200">
                                        Amount in PHAR:
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">Ꭾ</span>
                                        <input
                                            type="number"
                                            value={amountETH}
                                            onChange={handleETHChange}
                                            className="w-full pl-8 pr-3 py-3 bg-[#05140D] border border-[#2C5440] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2FB574] transition-all"
                                            placeholder="0.000000"
                                        />
                                    </div>
                                </div>

                                {!walletAddress && (
                                    <div className="bg-[#05140D] p-3 rounded-lg border border-yellow-600 text-yellow-500 text-sm">
                                        You&apos;ll need to connect your wallet to make a donation.
                                    </div>
                                )}
                                
                                {walletAddress && !isPharosDevnet && (
                                    <div className="bg-[#05140D] p-3 rounded-lg border border-yellow-600 text-yellow-500 text-sm">
                                        For best results, please switch to the Pharos Devnet.
                                        <button 
                                            onClick={switchToPharosDevnet}
                                            className="block mt-1 text-[#2FB574] hover:underline text-xs"
                                        >
                                            Switch to Pharos Devnet
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button 
                                    onClick={handleSubmit}
                                    className="flex-1 bg-[#2FB574] hover:bg-[#26925e] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                                >
                                    Donate Now
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="flex-1 bg-transparent border border-[#2C5440] text-white hover:bg-[#142A20] font-semibold py-3 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Optional footer with wallet info */}
                {walletAddress && !loading && transactionStatus === "idle" && (
                    <div className="px-6 py-3 bg-[#142A20] text-xs text-gray-400">
                        Connected wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </div>
                )}
            </div>
        </div>
    );
};

DonationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onSuccess: PropTypes.func // Optional callback for successful donations
};

export default DonationModal;
