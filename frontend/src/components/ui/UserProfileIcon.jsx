import { useContext } from "react";
import { User, Settings, LifeBuoy, LogOut, Wallet, Check, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { WalletContext } from "@/context/WalletContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getExplorerUrl } from "@/utils/blockchainUtils";

const UserProfileIcon = () => {
  const navigate = useNavigate();
  
  // Get wallet context
  const { 
    walletAddress, 
    connectWallet, 
    disconnectWallet, 
    isPharosNetwork,
    currentChainId,
    switchToPharosDevnet 
  } = useContext(WalletContext);

  // Generate Jazzicon or avatar URL from wallet address
  const getWalletAvatar = (address) => {
    if (!address) return null;
    // Use ENS avatar service for wallet identicon
    return `https://effigy.im/a/${address}.svg`;
  };

  // Fetch user data from localStorage
  const data = JSON.parse(localStorage.getItem('user')) || {};
  
  // Ensure data.user exists before accessing name
  const username = data?.user?.name || "Guest";
  const baseURL = `${window.location.protocol}//${window.location.host}`;

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken'); // Or wherever you store the refresh token

      // eslint-disable-next-line no-unused-vars
      const response = await fetch(`${baseURL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }), // Send refresh token in request body
      });

      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      
      // Also disconnect wallet if connected
      if (walletAddress) {
        disconnectWallet();
      }

      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
   
  const handleSupportClick = () => {
    navigate("/settings", { state: { scrollTo: "support" } });
  };

  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get wallet explorer link
  const getWalletExplorerLink = () => {
    if (!walletAddress || !currentChainId) return '#';
    
    // Use the address explorer based on network 
    // We just replace 'tx' with 'address' in our existing explorer URL function
    const txUrl = getExplorerUrl('placeholder');
    return txUrl.replace('/tx/placeholder', `/address/${walletAddress}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full h-10 w-10 bg-[#10251C] text-white hover:bg-[#2FB574] transition-colors"
        >
          {walletAddress ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={getWalletAvatar(walletAddress)} alt="Wallet" className="bg-[#10251C]" />
              <AvatarFallback className="bg-[#10251C] text-[#2FB574]">
                {walletAddress.substring(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-7 w-7" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#10251C] border border-gray-700 text-white rounded-md shadow-lg w-64"
      >
        <DropdownMenuLabel className="text-gray-400 flex flex-col gap-1">
          <span>{username}</span>
          {walletAddress && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs flex items-center gap-1 text-[#2FB574]">
                <Wallet className="h-3 w-3" />
                {formatWalletAddress(walletAddress)}
              </span>
              {isPharosNetwork && <Check className="h-3 w-3 text-[#2FB574]" />}
              <a 
                href={getWalletExplorerLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs text-gray-400 hover:text-[#2FB574]"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="border-gray-600" />
        
        {!walletAddress && (
          <DropdownMenuItem
            onClick={connectWallet}
            className="cursor-pointer flex items-center gap-2 text-white hover:text-[#2FB574] hover:bg-[#0A1F15]"
          >
            <div className="flex items-center gap-2">
              <img 
                src="https://res.cloudinary.com/djoebsejh/image/upload/v1746277693/Pharos/b4l4e8yqnyde0p4tbs6r.png" 
                alt="Pharos" 
                className="h-4 w-4"
              />
              <span>Connect Wallet</span>
            </div>
          </DropdownMenuItem>
        )}
        
        {walletAddress && !isPharosNetwork && (
          <DropdownMenuItem
            onClick={switchToPharosDevnet}
            className="cursor-pointer flex items-center gap-2 text-white hover:text-[#2FB574] hover:bg-[#0A1F15]"
          >
            <div className="flex items-center gap-2">
              <img 
                src="https://res.cloudinary.com/djoebsejh/image/upload/v1746277693/Pharos/b4l4e8yqnyde0p4tbs6r.png" 
                alt="Pharos" 
                className="h-4 w-4"
              />
              <span>Switch to Pharos Network</span>
            </div>
          </DropdownMenuItem>
        )}
        
        {walletAddress && (
          <DropdownMenuItem
            onClick={disconnectWallet}
            className="cursor-pointer flex items-center gap-2 text-white hover:text-[#2FB574] hover:bg-[#0A1F15]"
          >
            <LogOut className="h-4 w-4" />
            Disconnect Wallet
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="border-gray-600" />
        
        <DropdownMenuItem>
          <Link
            to="/settings"
            className="flex items-center gap-2 text-white hover:text-[#2FB574]"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            href="#support-section"
            className="relative flex w-full gap-2 text-white hover:text-[#2FB574]"
            onClick={handleSupportClick}
          >
            <LifeBuoy className="h-4 w-4" />
            Support
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-gray-600" />
        <DropdownMenuItem
          className="flex items-center gap-2 text-white hover:text-red-500 cursor-pointer hover:bg-[#0A1F15]"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileIcon;
