import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowBigUpDash, Share2, ChevronRight, History, Wallet, Clock, DollarSign, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import FadeIn from "./FadeIn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Badge,
} from "@/components/ui/badge";
import UserProfileIcon from "./ui/UserProfileIcon";
import useAuth from "@/utils/auth";
import DonationModal from "./DonationModal";
import { WalletContext } from "@/context/WalletContext";
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import { 
  PHAROS_NETWORKS, 
  identifyNetwork, 
  getContract, 
  hasContributedToProject, 
  getContributionAmount,
  getAllContributors
} from "../utils/blockchainUtils";
import { DataContext } from '../App';

// Network logos with Pharos using consistent icons
const networkLogos = {
  [PHAROS_NETWORKS.MAINNET.name]: "https://docs.pharosnetwork.xyz/~gitbook/image?url=https%3A%2F%2F3467509822-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FKKJs3YcSFbFF0lrqt43f%252Fsites%252Fsite_l4IeK%252Ficon%252FkdvxtoO7c6VTNhdjG8PQ%252Fmark.png%3Falt%3Dmedia%26token%3D5ecfa4fd-78d8-4005-a06c-98df5c01ea50&width=32&dpr=2&quality=100&sign=8eb62a33&sv=2",
  [PHAROS_NETWORKS.TESTNET.name]: "https://docs.pharosnetwork.xyz/~gitbook/image?url=https%3A%2F%2F3467509822-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FKKJs3YcSFbFF0lrqt43f%252Fsites%252Fsite_l4IeK%252Ficon%252FkdvxtoO7c6VTNhdjG8PQ%252Fmark.png%3Falt%3Dmedia%26token%3D5ecfa4fd-78d8-4005-a06c-98df5c01ea50&width=32&dpr=2&quality=100&sign=8eb62a33&sv=2",
  [PHAROS_NETWORKS.DEVNET.name]: "https://docs.pharosnetwork.xyz/~gitbook/image?url=https%3A%2F%2F3467509822-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FKKJs3YcSFbFF0lrqt43f%252Fsites%252Fsite_l4IeK%252Ficon%252FkdvxtoO7c6VTNhdjG8PQ%252Fmark.png%3Falt%3Dmedia%26token%3D5ecfa4fd-78d8-4005-a06c-98df5c01ea50&width=32&dpr=2&quality=100&sign=8eb62a33&sv=2",
  "Pharos": "https://docs.pharosnetwork.xyz/~gitbook/image?url=https%3A%2F%2F3467509822-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FKKJs3YcSFbFF0lrqt43f%252Fsites%252Fsite_l4IeK%252Ficon%252FkdvxtoO7c6VTNhdjG8PQ%252Fmark.png%3Falt%3Dmedia%26token%3D5ecfa4fd-78d8-4005-a06c-98df5c01ea50&width=32&dpr=2&quality=100&sign=8eb62a33&sv=2",
  "Ethereum":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkj3dStbrL3JvOAo7Sn5VEoxIRFsLx-ft4WXZUOpl9d9HmvpTaNxpOXgLe9fECnYLp83Q&usqp=CAU",
  "Bitcoin": "https://bitcoin.org/img/icons/opengraph.png?1646858405",
  "Polygon":
    "https://upload.wikimedia.org/wikipedia/commons/5/53/Polygon_logo.svg",
  "BSC": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Binance_Logo.png",
  "Solana":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2ZBYV7re0bpottvNraonxfjv9qGpMh_23hw&s",
  "Cardano":
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9a411426-3711-47d4-9c1a-dcf72973ddfc/dfiw6f1-d8d49d24-ae93-4a4e-b69b-5d652635faeb.png/v1/fill/w_1280,h_1280/cardano_ada_logo_by_saphyl_dfiw6f1-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzlhNDExNDI2LTM3MTEtNDdkNC05YzFhLWRjZjcyOTczZGRmY1wvZGZpdzZmMS1kOGQ0OWQyNC1hZTkzLTRhNGUtYjY5Yi01ZDY1MjYzNWZhZWIucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.bfvaZGUJUg19yFvUsRQlX_ppldirqvTMA4FPLFXOobU",
  "Avalanche":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3r4bnOojhpFMtgvwU7lbNf_5HovNtHbdCOr7PkC9v9lJYW6uKKvyKcFhRD1C6UUNkqW4&usqp=CAU",
  "Polkadot": "https://polkadot.network/favicon.ico",
  "Tezos": "https://tezostaquito.io/images/tez_logo.png",
  "Chainlink": "https://chainlinklabs.com/images/chainlink_logo.png",
};

const fetchProjectData = async (urls, id) => {
  // Try to get data from the database directly first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(`https://pharovest.onrender.com/project/${id}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return await response.json();
    }
    console.warn(`Failed to fetch from database: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error(`Error fetching from database:`, error);
  }

  // Only use fallbacks as a last resort
  for (const url of urls) {
    if (url.includes('localhost')) continue; // Skip the localhost URL we already tried
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to fetch from ${url}: ${response.status} ${response.statusText}`);
        continue;
      }
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // For array responses (like the local fallback JSON), find the specific project
        const project = data.find(p => p.id && p.id.toString() === id || p._id === id);
        if (project) {
          console.log('Using fallback data from local file');
          return project;
        } else {
          console.warn(`Project with ID ${id} not found in the array response`);
          continue;
        }
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching project data from ${url}:`, error);
    }
  }
  throw new Error('Failed to fetch project data from any source');
};

const fetchContributionsData = async (urls, id) => {
  // Try to get data from the database directly first
  console.log(`Fetching contributions data for project ID: ${id}`);
  try {
    // Add cache-busting parameter to ensure fresh data
    const timestamp = new Date().getTime();
    const apiUrl = `https://pharovest.onrender.com/transactions?project=${id}&_t=${timestamp}`;
    console.log(`Fetching from API: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Successfully fetched ${data.length} contributions from API:`, data);
      return data;
    }
    console.warn(`Failed to fetch contributions from database: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error(`Error fetching contributions from database:`, error);
  }

  // Only use fallbacks as a last resort
  for (const url of urls) {
    if (url.includes('localhost')) continue; // Skip the localhost URL we already tried
    
    try {
      const timestamp = new Date().getTime();
      const fetchUrl = url.includes('?') ? `${url}&_t=${timestamp}` : `${url}?_t=${timestamp}`;
      console.log(`Trying fallback: ${fetchUrl}`);
      
      const response = await fetch(fetchUrl, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.warn(`Failed to fetch from ${url}: ${response.status} ${response.statusText}`);
        continue;
      }
      
      let data = await response.json();
      
      // For array responses from local JSON, filter by project ID
      if (Array.isArray(data) && url.includes('contributions.json')) {
        data = data.filter(contrib => contrib.project === id.toString());
        console.log('Using fallback contributions data from local file, found:', data.length);
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching contributions data from ${url}:`, error);
    }
  }
  console.warn(`No contributions found for project ID: ${id}`);
  return []; // Return empty array if no contributions found
};

const ProjectDetailedView = ({ handleUpvote = () => {}, userUpvotes = {} }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { isLoggedIn } = useAuth();
  const { walletAddress, connectWallet, signer } = useContext(WalletContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userContributions, setUserContributions] = useState([]);
  const [loadingUserContributions, setLoadingUserContributions] = useState(false);
  const [allContributions, setAllContributions] = useState([]);
  const [loadingContributions, setLoadingContributions] = useState(true);
  const [hasBlockchainContribution, setHasBlockchainContribution] = useState(false);
  const [blockchainAmount, setBlockchainAmount] = useState("0");
  const [refreshingData, setRefreshingData] = useState(false);
  const { projectsData } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add socket.io connection for real-time updates
  useEffect(() => {
    // Set up a periodic refresh for contributions, but only if not already refreshing
    // We use a longer interval to avoid excessive API calls
    const refreshInterval = setInterval(() => {
      if (!refreshingData) {
        console.log("Auto-refreshing contributions");
        refreshContributions();
      }
    }, 30000); // Refresh every 30 seconds (increased from 15s)
    
    // Clean up interval on unmount
    return () => clearInterval(refreshInterval);
  }, [projectId]); // Only re-establish on projectId change, not on refreshingData changes

  // Function to update contributions after a successful donation
  const handleSuccessfulDonation = () => {
    console.log("Donation successful, refreshing contributions");
    // Close modal
    setIsModalOpen(false);
    // Wait a moment for blockchain transaction to be processed
    setTimeout(() => {
      refreshContributions();
    }, 2000);
  };

  const handleDonateClick = () => {
    if (!walletAddress) {
      // Connect wallet if not already connected
      connectWallet();
    }
    // Open donation modal
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    // Close the modal when Cancel button is clicked
    setIsModalOpen(false);
  };

  // Function to refresh contribution data
  const refreshContributions = async () => {
    setRefreshingData(true);
    console.log("Refreshing all contributions data for project:", projectId);
    try {
      await fetchAllContributions();
      if (walletAddress) {
        await fetchUserContributions();
        await checkBlockchainContributions();
      }
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshingData(false);
    }
  };

  // Improved function to check blockchain contributions
  const checkBlockchainContributions = async () => {
    if (!signer || !walletAddress || !projectId) return;
    
    try {
      console.log(`Checking blockchain for contributions to project ${projectId} from ${walletAddress}`);
      const contract = await getContract(signer);
      
      // First check if project exists and is valid on the blockchain
      try {
        const projectData = await contract.getProject(projectId);
        console.log(`Project ${projectId} blockchain data:`, projectData);
        
        // Check if this is a valid numeric ID on blockchain
        const numericProjectId = parseInt(projectId, 10);
        if (isNaN(numericProjectId)) {
          console.error(`Invalid project ID for blockchain: ${projectId}`);
          return;
        }
        
        // Check for user contributions on this specific project
        const hasContrib = await hasContributedToProject(contract, numericProjectId, walletAddress);
        console.log(`User has blockchain contribution for project ${numericProjectId}: ${hasContrib}`);
        setHasBlockchainContribution(hasContrib);
        
        if (hasContrib) {
          const amount = await getContributionAmount(contract, numericProjectId, walletAddress);
          console.log(`User has contributed ${amount} ETH to project ${numericProjectId}`);
          setBlockchainAmount(amount);
          
          // Don't call refreshContributions here to avoid infinite loops
          // The parent function will update the UI based on blockchainAmount state
        }
      } catch (error) {
        console.error(`Error checking project ${projectId} on blockchain:`, error);
        
        // Try again with numeric ID conversion in case the string ID is causing issues
        try {
          const numericProjectId = parseInt(projectId, 10);
          if (!isNaN(numericProjectId)) {
            console.log(`Trying again with numeric ID: ${numericProjectId}`);
            const hasContrib = await hasContributedToProject(contract, numericProjectId, walletAddress);
            console.log(`(Retry) User has blockchain contribution for project ${numericProjectId}: ${hasContrib}`);
            setHasBlockchainContribution(hasContrib);
            
            if (hasContrib) {
              const amount = await getContributionAmount(contract, numericProjectId, walletAddress);
              console.log(`(Retry) User has contributed ${amount} ETH to project ${numericProjectId}`);
              setBlockchainAmount(amount);
              
              // Don't call refreshContributions here to avoid infinite loops
            }
          }
        } catch (retryError) {
          console.error("Error during retry with numeric ID:", retryError);
        }
      }
    } catch (error) {
      console.error("Error checking blockchain contributions:", error);
    }
  };

  // Fetch project data and all contributions
  useEffect(() => {
    const getProjectDetails = async () => {
      setIsLoading(true);
      try {
        // First, check if we already have this project in our context data
        const foundProject = projectsData.find(p => 
          (p.id && p.id.toString() === projectId) || p._id === projectId
        );

        if (foundProject) {
          setProject(foundProject);
          setIsLoading(false);
          return;
        }

        // If not found in context, fetch individually
        const urls = [
          `https://pharovest.onrender.com/project/getAllProjects`,
          'https://finvest-backend.onrender.com/projects',
          '/projects.json'
        ];

        const data = await fetchProjectData(urls, projectId);
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    getProjectDetails();
  }, [projectId, projectsData]);

  // Check blockchain contributions when wallet connects
  useEffect(() => {
    if (signer && walletAddress && projectId) {
      checkBlockchainContributions();
    }
  }, [signer, walletAddress, projectId]);

  // Function to fetch all contributions for this project
  const fetchAllContributions = async () => {
    setLoadingContributions(true);
    try {
      const urls = [
        `/contributions.json`  // Only used as fallback
      ];
      
      try {
        const contributionsData = await fetchContributionsData(urls, projectId);
        
        if (!contributionsData || contributionsData.length === 0) {
          console.warn("No contributions data found in database, checking blockchain...");
          
          // Another attempt to check blockchain for this project
          if (signer) {
            try {
              const contract = await getContract(signer);
              // Convert to numeric ID for the blockchain call
              const numericProjectId = parseInt(projectId, 10);
              
              if (isNaN(numericProjectId)) {
                console.error(`Invalid project ID for blockchain: ${projectId}`);
                setAllContributions([]);
                setLoadingContributions(false);
                return;
              }
              
              console.log(`Checking blockchain for contributions to project ID: ${numericProjectId}`);
              
              try {
                const projectData = await contract.getProject(numericProjectId);
                
                if (projectData && projectData[1] > 0) { // If amountRaised > 0
                  console.log("Project has raised funds on blockchain:", ethers.utils.formatEther(projectData[1]), "ETH");
                  
                  // Get all contributors from the blockchain
                  const contributors = await getAllContributors(contract, numericProjectId);
                  console.log(`Found ${contributors.length} contributors for project ${numericProjectId} on blockchain`);
                  
                  if (contributors && contributors.length > 0) {
                    const syntheticContributions = [];
                    
                    for (const contributor of contributors) {
                      try {
                        const amount = await getContributionAmount(contract, numericProjectId, contributor);
                        if (parseFloat(amount) > 0) {
                          syntheticContributions.push({
                            project: projectId,
                            contributor,
                            amount,
                            usdValue: (parseFloat(amount) * 3000).toFixed(2),
                            timestamp: new Date().toISOString(),
                            network: PHAROS_NETWORKS.DEVNET.name, // Use DEVNET name for consistency
                            blockchainVerified: true,
                            transactionHash: null // Use null instead of text string
                          });
                        }
                      } catch (err) {
                        console.error("Error getting contributor data:", err);
                      }
                    }
                    
                    if (syntheticContributions.length > 0) {
                      console.log("Created synthetic contributions from blockchain:", syntheticContributions);
                      setAllContributions(syntheticContributions.map(contrib => {
                        const networkData = identifyNetwork(contrib.network);
                        return {
                          ...contrib,
                          donatedAt: contrib.timestamp,
                          network: networkData.name,
                          formattedDate: new Date(contrib.timestamp).toLocaleDateString(),
                          donor: contrib.contributor,
                          networkIcon: networkLogos[networkData.name] || PHAROS_NETWORKS.DEVNET.icon
                        };
                      }));
                      setLoadingContributions(false);
                      return;
                    }
                  }
                } else {
                  console.log(`Project ${numericProjectId} has no funds raised on blockchain`);
                }
              } catch (projectError) {
                console.error(`Error retrieving project ${numericProjectId} data from blockchain:`, projectError);
              }
            } catch (err) {
              console.error("Error checking blockchain for contributions:", err);
            }
          }
          
          setAllContributions([]);
          setLoadingContributions(false);
          return;
        }
        
        // Process and sort contributions by date (newest first)
        const processedData = contributionsData.map(contrib => {
          // Determine network name consistently
          const networkData = identifyNetwork(contrib.network);
          
          return {
            ...contrib,
            donatedAt: contrib.timestamp || new Date().toISOString(),
            network: networkData.name, // Use consistent network name
            formattedDate: new Date(contrib.timestamp || Date.now()).toLocaleDateString(),
            donor: contrib.contributor || "Anonymous",
            amount: contrib.amount || "0",
            // Calculate USD value using the exchange rate or use provided value
            usdValue: contrib.usdValue || 
              (parseFloat(contrib.amount || 0) * 3000).toFixed(2), // Fallback calculation
            // Add link to the network logo
            networkIcon: networkLogos[networkData.name] || PHAROS_NETWORKS.DEVNET.icon
          };
        }).sort((a, b) => new Date(b.donatedAt) - new Date(a.donatedAt));
        
        console.log(`Processed ${processedData.length} contributions with proper formatting`);
        setAllContributions(processedData);
      } catch (error) {
        console.error(`Error fetching contributions:`, error);
        setAllContributions([]);
      }
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
      setAllContributions([]);
    } finally {
      setLoadingContributions(false);
    }
  };

  // Add function to fetch user's contributions for this project
  const fetchUserContributions = async () => {
    if (!walletAddress || !projectId) return;
    
    setLoadingUserContributions(true);
    try {
      // Add cache-busting parameter and improved logging
      const timestamp = new Date().getTime();
      const apiUrl = `https://pharovest.onrender.com/transactions?project=${projectId}&contributor=${walletAddress}&_t=${timestamp}`;
      console.log(`Fetching user contributions from: ${apiUrl}`);
      
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`Fetched ${data.length} user contributions:`, data);
        
        // If we have blockchain contribution but no data in database
        if (data.length === 0 && hasBlockchainContribution) {
          console.log(`User has blockchain contribution (${blockchainAmount} ETH) but no database records, creating synthetic record`);
          // Create a synthetic record based on blockchain data
          const syntheticContribution = {
            contributor: walletAddress,
            project: projectId,
            timestamp: new Date().toISOString(),
            network: PHAROS_NETWORKS.TESTNET.name,
            amount: blockchainAmount,
            usdValue: (parseFloat(blockchainAmount) * 3000).toFixed(2),
            transactionHash: null,
            blockchainVerified: true
          };
          setUserContributions([syntheticContribution]);
          // No need to continue with empty data
          setLoadingUserContributions(false);
          return;
        }
        
        // Process the data to add formatted date and other fields
        const processedData = data.map(contrib => {
          // Determine network name consistently
          const networkData = identifyNetwork(contrib.network);
          
          return {
            ...contrib,
            donatedAt: contrib.timestamp || new Date().toISOString(),
            network: networkData.name,
            formattedDate: new Date(contrib.timestamp || Date.now()).toLocaleDateString(),
            // Calculate USD value if not provided
            usdValue: contrib.usdValue || (parseFloat(contrib.amount || 0) * 3000).toFixed(2),
            // Add link to the network logo
            networkIcon: networkLogos[networkData.name] || PHAROS_NETWORKS.TESTNET.icon
          };
        });
        
        setUserContributions(processedData);
      } catch (error) {
        console.error(`Error fetching user contributions:`, error);
        
        // If database fetch fails but we have blockchain contribution
        if (hasBlockchainContribution) {
          console.log(`Fallback to blockchain contribution data (${blockchainAmount} ETH)`);
          const syntheticContribution = {
            contributor: walletAddress,
            project: projectId,
            timestamp: new Date().toISOString(),
            network: PHAROS_NETWORKS.TESTNET.name,
            amount: blockchainAmount,
            usdValue: (parseFloat(blockchainAmount) * 3000).toFixed(2),
            transactionHash: null,
            blockchainVerified: true
          };
          setUserContributions([syntheticContribution]);
        } else {
          setUserContributions([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user contributions:", error);
      setUserContributions([]);
    } finally {
      setLoadingUserContributions(false);
    }
  };

  // Add useEffect to fetch user contributions when wallet or project changes
  useEffect(() => {
    if (walletAddress && projectId) {
      fetchUserContributions();
    }
  }, [walletAddress, projectId]);
  
  // Format ETH address for display
  const formatAddress = (address) => {
    if (!address || typeof address !== 'string') return 'Unknown';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format timestamp to relative time (e.g., "2 hours ago")
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    try {
      // First validate the timestamp
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
      } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      } else if (diffInSeconds < 604800) {
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
      } else {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return 'Date error';
    }
  };
  
  // Get appropriate network badge color
  const getNetworkColor = (network) => {
    const networkColors = {
      'Pharos': 'bg-[#2FB574] text-white',
      'Pharos Testnet': 'bg-blue-500 text-white',
      'Pharos Devnet': 'bg-purple-500 text-white',
      'Ethereum': 'bg-blue-700 text-white',
      'Polygon': 'bg-purple-700 text-white'
    };
    
    return networkColors[network] || 'bg-gray-500 text-white';
  };

  if (!project) {
    return (
      <div className="flex min-h-screen w-full bg-[#05140D] text-white">
        <div className="flex-1 sm:py-3 sm:pl-14 bg-[#05140D] overflow-hidden">
          <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-[#05140D] border-b border-gray-800">
            <Sidebar />
            <h1 className="md:text-4xl text-2xl font-semibold text-left text-[#FFFFFF] w-full px-4 md:px-3 z-[5]">
              Project Details
            </h1>
            <Link to="/projects">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-[#2FB574] border-[#2FB574] bg-[#05140D] hover:bg-[#2FB574] hover:text-white hover:border-[#2FB574] mr-4"
              >
                Back to Projects
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </header>
          
          <div className="w-full max-w-4xl mx-auto p-8 mt-8 text-center">
            <div className="bg-[#1A3A2C] p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
              <p className="text-gray-300 mb-6">We cannot find the project you are looking for. It may have been removed or is temporarily unavailable.</p>
              <Link to="/projects">
                <Button className="bg-[#2FB574] hover:bg-[#238A56] text-white">
                  Browse Other Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate pagination for all contributions
  const totalContributions = allContributions.length;
  const totalPages = Math.ceil(totalContributions / itemsPerPage);
  const currentContributions = allContributions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#05140D] text-white p-6">
        <div className="max-w-4xl w-full p-8 bg-[#0A1F15] rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-white">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[#1B7A57] text-white rounded-lg hover:bg-[#145E42] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#05140D]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1B7A57]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#05140D]">
      <div className="flex-1 sm:py-3 sm:pl-14 bg-[#05140D] overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-[#05140D] border-b border-gray-800">
          <Sidebar />
          <FadeIn direction="down" delay={0} fullWidth>
            <h1 className="md:text-4xl text-2xl font-semibold text-left text-[#FFFFFF] w-full px-4 md:px-3 z-[5] line-clamp-1">
              {project?.title}
            </h1>
          </FadeIn>
          <FadeIn direction="down" delay={0}>
            <Link to="/projects">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-[#2FB574] border-[#2FB574] bg-[#05140D] hover:bg-[#2FB574] hover:text-white hover:border-[#2FB574] mr-4"
              >
                View Projects
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </FadeIn>
          {isLoggedIn && (
            <FadeIn direction="left" delay={0.2}>
              <UserProfileIcon />
            </FadeIn>
          )}
        </header>
        <FadeIn direction="up" delay={0} fullWidth>
          <div className="w-full mx-auto p-5 gap-6 flex flex-col md:flex-row">
            {/* Flex-1 Container */}
            <div className="flex-1 bg-[#1A3A2C] rounded-xl shadow-lg p-8">
              <img
                src={project?.image || "default-image-url.jpg"}
                alt={project?.title || "No Title"}
                className="max-h-80 w-full object-cover rounded-lg"
              />
              <h1 className="text-3xl font-bold text-white mt-5">
                {project?.title}
              </h1>
              <div className="flex items-center mt-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={project?.avatar || "default-avatar-url.jpg"}
                    alt={project?.creator}
                  />
                  <AvatarFallback>{project?.creator ? project.creator.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <p className="ml-2 text-sm font-medium text-gray-100">
                  {project?.creator}
                </p>
              </div>
              <p className="mt-4 text-gray-100">{project?.description}</p>
            </div>

            {/* Flex-2 Container */}
            <div className="flex-2 bg-[#1A3A2C] rounded-xl shadow-lg p-8 relative min-w-[30%]">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start">
                  <p className="text-[#2FB574] font-semibold md:text-4xl text-3xl">
                    {project?.amountRaised}
                  </p>
                  <span className="bg-[#2FB574] text-white md:text-xs text-[10px] px-3 py-1 rounded-full mt-2">
                    Total Amount Raised
                  </span>
                </div>
                <p className="text-gray-100 font-medium text-xl">
                  {project?.contributors} contributors
                </p>
                <p className="text-[#2FB574] font-semibold md:text-3xl text-2xl">
                  Milestones
                </p>

                <div
                  className="absolute top-5 right-5 flex items-center justify-center  p-2 pr-3 rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-[#05140D]"
                  onClick={() => handleUpvote(project?.id)}
                >
                  <ArrowBigUpDash
                    className={`h-6 w-6 ${userUpvotes[project.id] ? "text-[#2FB574]" : "text-white"
                      } transition-colors`}
                  />
                  {project.upvotes > 0 && (
                    <span className="ml-1 text-xs font-semibold text-white">
                      {project.upvotes}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative my-4 md:mb-10 py-4">
                {/* Background bar */}
                <div className="absolute left-[8px] top-0 bottom-0 w-2 bg-green-100 rounded-full"></div>

                <Link
                  to={`/projects/${project?.id}/milestones`}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="space-y-4 pl-[2px]">
                    {project?.milestones?.length ? (
                      project.milestones.map((milestone, index) => (
                        <Link
                          key={index}
                          to={`/projects/milestones/${project.id}`}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div
                            className={`h-5 w-5 z-[5] rounded-full ${index < project.milestones.length
                                ? "bg-green-300"
                                : "bg-green-300"
                              }`}
                          />
                          <p className="text-gray-100">{milestone.title}</p>
                        </Link>
                      ))
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-gray-500" />
                        <p className="text-gray-100">No milestones available</p>
                      </div>
                    )}
                  </div>
                </Link>
              </div>

              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Button
                    className="bg-[#2FB574] text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    onClick={handleDonateClick}
                  >
                    Donate / Invest
                  </Button>
                  {isModalOpen && (
                    <DonationModal
                      isOpen={isModalOpen}
                      onClose={handleCancel}
                      projectId={projectId}
                      onSuccess={handleSuccessfulDonation}
                    />
                  )}

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-[#2FB574] border-[#2FB574] border rounded-md py-2 px-4 transition-colors hover:bg-[#F5F5F5]"
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="ml-2">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
        

        {/* All Contributions Section */}
        <div className="flex-1 mt-8 p-5 bg-[#1A3A2C] rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4 justify-between">
            <div className="flex items-center gap-2">
              <History className="h-6 w-6 text-[#2FB574]" />
              <h2 className="text-2xl font-semibold text-white">
                All Project Contributions
              </h2>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 text-[#2FB574] border-[#2FB574] bg-[#05140D] hover:bg-[#2FB574] hover:text-white hover:border-[#2FB574]"
              onClick={refreshContributions}
              disabled={refreshingData}
            >
              <RefreshCw className={`h-4 w-4 ${refreshingData ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
          
          {loadingContributions ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2FB574]"></div>
            </div>
          ) : currentContributions.length === 0 ? (
            <div className="mt-4 p-6 flex flex-col items-center justify-center gap-4 border border-dashed border-[#2C5440] rounded-lg">
              <Wallet className="h-12 w-12 text-gray-500" />
              <p className="text-gray-300 text-center">No contributions have been made to this project yet.</p>
              <Button 
                className="bg-[#2FB574] text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                onClick={handleDonateClick}
              >
                Be the First to Contribute
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="bg-[#143121] border-[#2C5440] shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#2FB574] text-lg">Total Contributors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-white text-3xl font-bold">{allContributions.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-[#143121] border-[#2C5440] shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#2FB574] text-lg">Total Amount Raised</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-white text-3xl font-bold">
                      {allContributions.reduce((total, contrib) => total + parseFloat(contrib.amount || 0), 0).toFixed(4)} ETH
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-[#2C5440] transition-colors">
                      <TableHead className="text-gray-100">Contributor</TableHead>
                      <TableHead className="text-gray-100">Time</TableHead>
                      <TableHead className="text-gray-100">Transaction</TableHead>
                      <TableHead className="text-gray-100">Network</TableHead>
                      <TableHead className="text-gray-100">Amount</TableHead>
                      <TableHead className="text-right text-gray-100">USD Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentContributions.map((contribution, index) => (
                      <TableRow key={index} className={`hover:bg-[#2C5440] transition-colors ${contribution.contributor === walletAddress ? 'bg-[#143121]' : ''}`}>
                        <TableCell className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-[#2FB574] text-white">
                              {contribution.contributor ? contribution.contributor[0].toUpperCase() : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-gray-100">{formatAddress(contribution.contributor)}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">{contribution.contributor}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {contribution.contributor === walletAddress && (
                            <span className="text-xs bg-[#2FB574] text-white px-2 py-0.5 rounded-full">You</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-100">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-300" />
                                <span>{getRelativeTime(contribution.timestamp)}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{new Date(contribution.timestamp).toLocaleString()}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-gray-100">
                          {contribution.transactionHash && contribution.transactionHash !== "Not stored in database" && typeof contribution.transactionHash === 'string' && !contribution.transactionHash.includes("Verified") ? (
                            <a 
                              href={`https://pharosscan.xyz/tx/${contribution.transactionHash}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#2FB574] hover:underline flex items-center gap-1"
                            >
                              <span>{contribution.transactionHash.substring(0, 8)}...{contribution.transactionHash.substring(contribution.transactionHash.length - 6)}</span>
                              <ArrowRight className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-gray-400">
                              {contribution.blockchainVerified ? "Verified on blockchain" : "Unknown"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getNetworkColor(contribution.network)}`}>
                            <div className="flex items-center gap-1">
                              <img 
                                src={PHAROS_NETWORKS.TESTNET.icon} 
                                alt={contribution.network} 
                                className="w-3 h-3 rounded-full"
                              />
                              <span>{contribution.network || "Pharos"}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-100 font-medium">
                          {contribution.amount} ETH
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <DollarSign className="h-3 w-3 text-green-300" />
                            <span className="text-green-300">${contribution.usdValue}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="cursor-pointer"
                      />
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                            className={currentPage === i + 1 ? "bg-[#2FB574]" : ""}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="cursor-pointer"
                      />
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Your contributions section - improved blockchain verification */}
        {walletAddress && (
          <div className="flex-1 mt-8 p-5 bg-[#1A3A2C] rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-6 w-6 text-[#2FB574]" />
                <h2 className="text-2xl font-semibold text-white">
                  Your Contributions
                </h2>
              </div>
              
              {/* Add badge if blockchain contributions detected but not shown in UI */}
              {hasBlockchainContribution && userContributions.length === 0 && (
                <Badge className="bg-yellow-600">Blockchain contribution detected</Badge>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 text-[#2FB574] border-[#2FB574] bg-[#05140D] hover:bg-[#2FB574] hover:text-white hover:border-[#2FB574]"
                onClick={refreshContributions}
                disabled={refreshingData}
              >
                <RefreshCw className={`h-4 w-4 ${refreshingData ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
            
            {loadingUserContributions ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2FB574]"></div>
              </div>
            ) : userContributions.length > 0 || hasBlockchainContribution ? (
              <div className="mt-4 space-y-4">
                {/* Show blockchain-verified contribution if no database records */}
                {userContributions.length === 0 && hasBlockchainContribution && (
                  <Card className="bg-[#143121] border-[#2C5440] overflow-hidden">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">Blockchain-Verified Contribution</CardTitle>
                        <CardDescription className="text-gray-300">
                          Verified on blockchain but not found in database
                        </CardDescription>
                      </div>
                      <Badge className={`${getNetworkColor(PHAROS_NETWORKS.TESTNET.name)}`}>
                        <div className="flex items-center gap-1">
                          <img 
                            src={PHAROS_NETWORKS.TESTNET.icon} 
                            alt={PHAROS_NETWORKS.TESTNET.name} 
                            className="w-3 h-3 rounded-full"
                          />
                          <span>{PHAROS_NETWORKS.TESTNET.name}</span>
                        </div>
                      </Badge>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Amount</p>
                          <p className="text-white text-xl font-semibold">{blockchainAmount} ETH</p>
                          <p className="text-green-300 text-sm">≈ ${(parseFloat(blockchainAmount) * 3000).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Status</p>
                          <Badge className="bg-green-600">Confirmed on Blockchain</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              
                {/* Show database contribution records */}
                {userContributions.map((contribution, index) => (
                  <Card key={index} className="bg-[#143121] border-[#2C5440] overflow-hidden">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">Contribution #{index + 1}</CardTitle>
                        <CardDescription className="text-gray-300">
                          {new Date(contribution.timestamp).toLocaleString()}
                        </CardDescription>
                      </div>
                      <Badge className={`${getNetworkColor(contribution.network)}`}>
                        <div className="flex items-center gap-1">
                          <img 
                            src={contribution.networkIcon || networkLogos[contribution.network] || PHAROS_NETWORKS.MAINNET.icon} 
                            alt={contribution.network} 
                            className="w-3 h-3 rounded-full"
                          />
                          <span>{contribution.network || "Pharos"}</span>
                        </div>
                      </Badge>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Amount</p>
                          <p className="text-white text-xl font-semibold">{contribution.amount} ETH</p>
                          <p className="text-green-300 text-sm">≈ ${contribution.usdValue}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Transaction</p>
                          {contribution.transactionHash && contribution.transactionHash !== "Not stored in database" && typeof contribution.transactionHash === 'string' && !contribution.transactionHash.includes("Verified") ? (
                            <a 
                              href={`https://pharosscan.xyz/tx/${contribution.transactionHash}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#2FB574] hover:underline flex items-center gap-1"
                            >
                              <span>{contribution.transactionHash.substring(0, 8)}...{contribution.transactionHash.substring(contribution.transactionHash.length - 6)}</span>
                              <ArrowRight className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-gray-400">
                              {contribution.blockchainVerified ? "Verified on blockchain" : "Unknown"}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 border-t border-[#2C5440] mt-2">
                      <div className="flex justify-between w-full">
                        <span className="text-gray-400 text-sm">Status</span>
                        <Badge className={contribution.blockchainVerified ? "bg-green-600" : "bg-green-600"}>
                          {contribution.blockchainVerified ? "Blockchain Verified" : "Confirmed"}
                        </Badge>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="mt-4 p-6 flex flex-col items-center justify-center gap-4 border border-dashed border-[#2C5440] rounded-lg">
                <Wallet className="h-12 w-12 text-gray-500" />
                <p className="text-gray-300 text-center">You haven&apos;t contributed to this project yet.</p>
                <Button 
                  className="bg-[#2FB574] text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  onClick={handleDonateClick}
                >
                  Make Your First Contribution
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Donation Modal */}
        {isModalOpen && (
          <DonationModal
            isOpen={isModalOpen}
            onClose={handleCancel}
            projectId={projectId}
            onSuccess={handleSuccessfulDonation}
          />
        )}
      </div>
    </div>
  );
};

ProjectDetailedView.propTypes = {
  handleUpvote: PropTypes.func,
  userUpvotes: PropTypes.object,
};

export default ProjectDetailedView;
