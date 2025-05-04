// components/WalletConnectButton.js
import { useContext } from 'react';
import { WalletContext } from '@/context/WalletContext';

const WalletConnectButton = () => {
    const { walletAddress, connectWallet } = useContext(WalletContext);

    return (
        <button
            onClick={connectWallet}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
        </button>
    );
};

export default WalletConnectButton;
