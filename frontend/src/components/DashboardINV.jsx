import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import {
  Activity,
  Bell,
  CreditCard,
  Gift,
  Layers,
  ArrowUpRight,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FadeIn from "@/components/FadeIn";
import { WalletContext } from "@/context/WalletContext";
import { getAllContributions, getContract } from "@/utils/blockchainUtils";

// Collection of NFT images to use throughout the application
const NFT_IMAGE_COLLECTION = [
  "https://res.cloudinary.com/djoebsejh/image/upload/v1746338564/Pharos/uexmgkvgtlb5wgj5aypt.avif",
  "https://res.cloudinary.com/djoebsejh/image/upload/v1746338720/Pharos/mvojhytou9inb5zhzleu.avif",
  "https://res.cloudinary.com/djoebsejh/image/upload/v1746338720/Pharos/nnbowqphgmjxthwrvv3t.avif",
  "https://res.cloudinary.com/djoebsejh/image/upload/v1746338720/Pharos/cbqltspm8mapdms39phy.avif",
  "https://res.cloudinary.com/djoebsejh/image/upload/v1746338728/Pharos/sg9aeeb7nqz1hjl7lsme.avif",
  "https://res.cloudinary.com/djoebsejh/image/upload/v1746338728/Pharos/flszlovkqktl4lqojcfz.avif",
  "https://res.cloudinary.com/djoebsejh/image/upload/v1746338728/Pharos/bgpjbuvtktc899gzyfjz.avif"
];

// Store assigned NFT images to ensure consistency across renders
const nftImageAssignments = new Map();

// Cache for project names - global to persist across renders
const projectNameCache = new Map();

export const DashboardINV = () => {
  const { walletAddress, signer } = useContext(WalletContext);
  const [userContributions, setUserContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalInvested, setTotalInvested] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [nftCount, setNftCount] = useState(0);
  const [currentNftPage, setCurrentNftPage] = useState(0);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const itemsPerPage = 4;
  
  // Create chart data from contributions - used for UI statistics
  const [, setDonationData] = useState([
    { name: "Healthcare", value: 0 },
    { name: "Education", value: 0 },
    { name: "Environment", value: 0 },
    { name: "Technology", value: 0 },
  ]);

  // Generate a pseudo-random number based on a string seed
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Get a random NFT image for a contribution
  // If the contribution has been seen before, return the same image for consistency
  const getNftImage = (contributionId) => {
    if (nftImageAssignments.has(contributionId)) {
      return nftImageAssignments.get(contributionId);
    }
    
    // Generate a deterministic index based on the contribution ID
    const index = hashCode(contributionId) % NFT_IMAGE_COLLECTION.length;
    const selectedImage = NFT_IMAGE_COLLECTION[index];
    
    // Store this assignment for future reference
    nftImageAssignments.set(contributionId, selectedImage);
    
    return selectedImage;
  };

  // Fetch project names for each contribution
  const fetchProjectNames = async (contributions) => {
    try {
      // Create array of promises for projects not already in cache
      const projectPromises = [];
      const projectIds = new Set();
      
      contributions.forEach(contrib => {
        const projectId = contrib.projectId;
        if (!projectNameCache.has(projectId) && !projectIds.has(projectId)) {
          projectIds.add(projectId);
          const promise = fetch(`https://pharovest.onrender.com/project/${projectId}`)
            .then(response => {
              if (response.ok) return response.json();
              return null;
            })
            .then(data => {
              if (data && data.title) {
                projectNameCache.set(projectId, data.title);
                return { id: projectId, name: data.title };
              }
              return { id: projectId, name: `Project #${projectId}` };
            })
            .catch(() => {
              return { id: projectId, name: `Project #${projectId}` };
            });
          
          projectPromises.push(promise);
        }
      });
      
      // Execute all promises in parallel
      if (projectPromises.length > 0) {
        await Promise.all(projectPromises);
      }
      
      // Now enhance contributions with project names
      return contributions.map(contrib => ({
        ...contrib,
        projectName: projectNameCache.get(contrib.projectId) || `Project #${contrib.projectId}`
      }));
      
    } catch (error) {
      console.error("Error fetching project names:", error);
      return contributions;
    }
  };

  // Fetch user's contributions from blockchain
  useEffect(() => {
    const fetchUserContributions = async () => {
      if (!signer || !walletAddress) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const contract = await getContract(signer);
        
        // We'll fetch contributions for projects 1-20 as a sample range
        // In a real app, you'd want to fetch all project IDs first
        const allContributions = [];
        const projectIds = new Set();
        
        for (let i = 1; i <= 20; i++) {
          try {
            const projectContributions = await getAllContributions(contract, i);
            
            // Filter only this user's contributions
            const userProjectContributions = projectContributions.filter(
              contrib => contrib.contributor.toLowerCase() === walletAddress.toLowerCase()
            );
            
            if (userProjectContributions.length > 0) {
              projectIds.add(i);
              
              // Process each contribution and add to our collection
              for (const contrib of userProjectContributions) {
                const contributionId = `${i}-${contrib.transactionHash}`;
                const enhancedContrib = {
                  ...contrib,
                  projectName: `Project #${i}`, // Default name, will be updated
                  projectId: i,
                  tokenId: `${i}-${contrib.transactionHash.substring(0, 8)}`,
                  // Assign an NFT image upfront so it's consistent in UI
                  nftImage: getNftImage(contributionId)
                };
                
                allContributions.push(enhancedContrib);
              }
            }
          } catch (error) {
            console.error(`Error fetching contributions for project ${i}:`, error);
          }
        }
        
        // Sort by timestamp (most recent first)
        const sortedContributions = allContributions.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        // Get project names for each contribution
        const enhancedContributions = await fetchProjectNames(sortedContributions);
        
        setUserContributions(enhancedContributions);
        setProjectsLoaded(true); // Mark NFTs as loaded
        
        // Calculate stats
        const totalAmount = enhancedContributions.reduce(
          (sum, contrib) => sum + parseFloat(contrib.amount || 0), 
          0
        );
        
        setTotalInvested(totalAmount);
        setProjectCount(projectIds.size);
        setActiveProjects(projectIds.size); // Assume all projects are active for now
        setNftCount(enhancedContributions.length); // Each contribution earns an NFT
        
        // Update chart data based on contributions
        // In a real app, you'd categorize by actual project categories
        if (enhancedContributions.length > 0) {
          // Simple mock categorization based on project ID for demo
          const categoryMap = {
            Healthcare: 0,
            Education: 0,
            Environment: 0,
            Technology: 0
          };
          
          enhancedContributions.forEach(contrib => {
            const projectId = contrib.projectId;
            const amount = parseFloat(contrib.amount);
            
            // Mock category assignment based on project ID
            if (projectId % 4 === 0) categoryMap.Healthcare += amount;
            else if (projectId % 4 === 1) categoryMap.Education += amount;
            else if (projectId % 4 === 2) categoryMap.Environment += amount;
            else categoryMap.Technology += amount;
          });
          
          setDonationData([
            { name: "Healthcare", value: categoryMap.Healthcare },
            { name: "Education", value: categoryMap.Education },
            { name: "Environment", value: categoryMap.Environment },
            { name: "Technology", value: categoryMap.Technology },
          ]);
        }
        
      } catch (error) {
        console.error("Error fetching user contributions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserContributions();
  }, [signer, walletAddress]);

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount * 3000); // Assuming ETH price of $3000
  };
  
  // Format Ethereum amount
  const formatEth = (amount) => {
    return parseFloat(amount).toFixed(4) + " ETH";
  };
  
  // Format date string
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Date error';
    }
  };

  // Get paginated NFTs based on current page
  const getPaginatedNfts = () => {
    const startIndex = currentNftPage * itemsPerPage;
    return userContributions.slice(startIndex, startIndex + itemsPerPage);
  };
  
  // Handle pagination
  const nextPage = () => {
    if ((currentNftPage + 1) * itemsPerPage < userContributions.length) {
      setCurrentNftPage(currentNftPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentNftPage > 0) {
      setCurrentNftPage(currentNftPage - 1);
    }
  };
  
  // Total number of pages
  const totalPages = Math.ceil(userContributions.length / itemsPerPage);

  return (
    <FadeIn direction="up" delay={0.2} fullWidth>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          <Card className="bg-[#1A3A2C] text-white border-none shadow-none">
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                NFTs Collected
              </CardTitle>
              <Layers className="text-[#2FB574]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nftCount}</div>
              <p className="text-xs text-gray-400">From your contributions</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1A3A2C] text-white border-none shadow-none">
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Investment
              </CardTitle>
              <CreditCard className="text-[#2FB574]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatEth(totalInvested)}</div>
              <p className="text-xs text-gray-400">Across {projectCount} projects</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1A3A2C] text-white border-none shadow-none">
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                Active Investments
              </CardTitle>
              <Activity className="text-[#2FB574]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
              <p className="text-xs text-gray-400">Currently ongoing</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1A3A2C] text-white border-none shadow-none">
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                USD Value
              </CardTitle>
              <CreditCard className="text-[#2FB574]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
              <p className="text-xs text-gray-400">At current rates</p>
            </CardContent>
          </Card>
        </div>

        {/* NFT Collection */}
        <Card className="bg-[#1A3A2C] border-none shadow-none">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-gray-300">NFT Collection</CardTitle>
            {totalPages > 1 && (
              <div className="ml-auto flex items-center space-x-2">
                <p className="text-sm text-gray-400">
                  Page {currentNftPage + 1} of {totalPages}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-4 flex justify-center items-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-[#2FB574]" />
              </div>
            ) : getPaginatedNfts().length > 0 ? (
              getPaginatedNfts().map((contrib, index) => (
                <div key={index} className="p-4 bg-[#2C5440] rounded-lg text-center hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="rounded-lg overflow-hidden mb-3 shadow-md h-40 flex items-center justify-center bg-[#0c2417]">
                    {projectsLoaded ? (
                      <img 
                        src={contrib.nftImage}
                        alt={`NFT for ${contrib.projectName}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback in case the image fails to load
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/200x200/1A3A2C/2FB574?text=${encodeURIComponent(contrib.projectName)}`;
                        }}
                      />
                    ) : (
                      <div className="flex justify-center items-center h-full w-full">
                        <Loader2 className="h-8 w-8 animate-spin text-[#2FB574]" />
                      </div>
                    )}
                  </div>
                  <div className="bg-[#1A3A2C] px-3 py-2 rounded-md">
                    <Badge className="bg-[#2FB574] mb-2">{contrib.projectName}</Badge>
                    <p className="text-sm text-white">{formatEth(contrib.amount)}</p>
                    <p className="text-xs text-gray-400 truncate mt-1">{formatDate(contrib.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center p-6 text-gray-400">
                You haven&apos;t collected any NFTs yet. Contribute to projects to earn NFTs.
              </div>
            )}
          </CardContent>
          {totalPages > 1 && (
            <CardFooter className="flex justify-center space-x-2 pt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                disabled={currentNftPage === 0}
                className="bg-[#2C5440] border-none hover:bg-[#1A3A2C] text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                disabled={currentNftPage >= totalPages - 1}
                className="bg-[#2C5440] border-none hover:bg-[#1A3A2C] text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Transactions */}
        <Card
          className="xl:col-span-2 bg-[#1A3A2C] border-none shadow-none"
            >
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
              <CardTitle className="text-gray-300">Your Transactions</CardTitle>
                        <CardDescription className="text-gray-400">Recent transactions from your projects.</CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1 text-[#2FB574]">
              <Link to="/projects">
                View All Projects
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-[#2FB574]" />
              </div>
            ) : (
                    <Table className="bg-[#1A3A2C] text-white">
                        <TableHeader>
                            <TableRow className="hover:bg-[#2C5440]">
                                <TableHead className="text-gray-400">Project Name</TableHead>
                    <TableHead className="text-gray-400">Transaction ID</TableHead>
                                <TableHead className="hidden sm:table-cell text-gray-400">Date</TableHead>
                                <TableHead className="text-right text-gray-400">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                  {userContributions.length > 0 ? (
                    userContributions.slice(0, 4).map((contrib, index) => (
                      <TableRow key={index} className="hover:bg-[#2C5440]">
                                <TableCell>
                          <div className="font-medium text-white line-clamp-1">{contrib.projectName}</div>
                                </TableCell>
                                <TableCell>
                          <a 
                            href={`https://pharosscan.xyz/tx/${contrib.transactionHash}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#2FB574] hover:underline flex items-center gap-1"
                          >
                            <span>{contrib.transactionHash.substring(0, 8)}...</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                                </TableCell>
                        <TableCell className="hidden sm:table-cell text-white">{formatDate(contrib.timestamp)}</TableCell>
                                <TableCell className="text-right font-medium">
                          <span className="text-[#2FB574]">{formatEth(contrib.amount)}</span>
                                </TableCell>
                            </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                        No transactions found. Contribute to a project to see transactions here.
                                </TableCell>
                            </TableRow>
                  )}
                        </TableBody>
                    </Table>
            )}
                </CardContent>
            </Card>

        {/* Notifications */}
        <Card className="bg-[#1A3A2C] border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-300">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="text-white">
                <Bell className="inline-block text-[#2FB574]" /> New post from <strong>Project Phoenix</strong>: &quot;Upcoming goals for 2024.&quot;
              </li>
              <li className="text-white">
                <Gift className="inline-block text-[#2FB574]" /> You&apos;ve unlocked an NFT for your donation to <strong>Clean Water Fund</strong>.
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </FadeIn>
  );
};
