import { useState, useContext } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from '@/context/WalletContext';
import { getContractAddress } from "@/utils/blockchainUtils";
import PharovestABI from '@/utils/PharovestABI.json';
import { pharosDevnet } from '@/wagmi';
import { toast } from 'react-hot-toast';

const AdminPage = () => {
  const { walletAddress, signer, connectWallet, isConnected, currentChainId, switchToPharosDevnet } = useContext(WalletContext);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(0);
  const [totalAmount, setTotalAmount] = useState('2');
  const [milestones, setMilestones] = useState([
    { title: "Initial Planning", amountRequired: "0.5", recipient: "", isCompleted: false },
    { title: "Development Phase", amountRequired: "1.0", recipient: "", isCompleted: false },
    { title: "Final Delivery", amountRequired: "0.5", recipient: "", isCompleted: false }
  ]);
  const [result, setResult] = useState(null);

  const handleCreateProject = async () => {
    if (!isConnected || !signer) {
      await connectWallet();
      return;
    }

    try {
      setLoading(true);
      
      // Check if on Pharos Devnet
      if (currentChainId !== pharosDevnet.id) {
        await switchToPharosDevnet();
        // Wait a bit for network switch
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const contractAddress = getContractAddress(currentChainId);
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send('eth_requestAccounts', []);
      const txSigner = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, PharovestABI, txSigner);
      
      // Format milestones for the contract
      const formattedMilestones = milestones.map(m => ({
        title: m.title,
        amountRequired: ethers.utils.parseEther(m.amountRequired),
        recipient: m.recipient || walletAddress,
        isCompleted: m.isCompleted
      }));
      
      // Parse total amount to ETH
      const parsedTotalAmount = ethers.utils.parseEther(totalAmount);
      
      console.log("Creating project with data:", {
        totalAmount: parsedTotalAmount.toString(),
        milestones: formattedMilestones
      });
      
      // Create project
      const tx = await contract.createProject(parsedTotalAmount, formattedMilestones);
      
      console.log("Transaction sent:", tx.hash);
      toast.success("Project creation transaction sent!");
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      // Get current project count
      const projectCount = await contract.projectCount();
      const newProjectId = projectCount.sub(1).toString();
      setProjectId(newProjectId);
      
      setResult({
        success: true,
        message: `Project created successfully! Project ID: ${newProjectId}`,
        transactionHash: tx.hash
      });
      
      toast.success(`Project created! ID: ${newProjectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      setResult({
        success: false,
        message: `Error: ${error.message}`,
        error
      });
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckProject = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    try {
      setLoading(true);
      
      const contractAddress = getContractAddress(currentChainId);
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      const contract = new ethers.Contract(contractAddress, PharovestABI, provider);
      
      // Get project details
      const project = await contract.projects(projectId);
      
      setResult({
        success: true,
        message: "Project details retrieved",
        project: {
          totalAmount: ethers.utils.formatEther(project.totalAmount),
          amountRaised: ethers.utils.formatEther(project.amountRaised),
          isActive: project.isActive
        }
      });
    } catch (error) {
      console.error("Error checking project:", error);
      setResult({
        success: false,
        message: `Error: ${error.message}`,
        error
      });
      toast.error("Failed to check project");
    } finally {
      setLoading(false);
    }
  };

  // Update milestone
  const updateMilestone = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  // Add new milestone
  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { title: "New Milestone", amountRequired: "0.5", recipient: "", isCompleted: false }
    ]);
  };

  // Remove milestone
  const removeMilestone = (index) => {
    if (milestones.length > 1) {
      const newMilestones = milestones.filter((_, i) => i !== index);
      setMilestones(newMilestones);
    } else {
      toast.error("At least one milestone is required");
    }
  };

  return (
    <div className="min-h-screen bg-[#05140D] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Project Admin</h1>
      
      {!isConnected ? (
        <button 
          onClick={connectWallet}
          className="px-4 py-2 bg-[#2FB574] rounded-md hover:bg-[#238A56] transition-colors"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-8">
          <div className="p-6 bg-[#1A3A2C] rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>
            
            <div className="mb-4">
              <label className="block mb-2">Total Amount (ETH)</label>
              <input
                type="text"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D251A] rounded border border-gray-700 focus:border-[#2FB574] focus:outline-none"
              />
            </div>
            
            <h3 className="text-xl font-medium mb-3">Milestones</h3>
            
            {milestones.map((milestone, index) => (
              <div key={index} className="mb-6 p-4 bg-[#0D251A] rounded-lg border border-gray-700">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Milestone {index + 1}</h4>
                  <button 
                    onClick={() => removeMilestone(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm">Title</label>
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-[#05140D] rounded border border-gray-700 focus:border-[#2FB574] focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm">Amount Required (ETH)</label>
                    <input
                      type="text"
                      value={milestone.amountRequired}
                      onChange={(e) => updateMilestone(index, 'amountRequired', e.target.value)}
                      className="w-full px-3 py-2 bg-[#05140D] rounded border border-gray-700 focus:border-[#2FB574] focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm">Recipient Address (leave blank to use your address)</label>
                    <input
                      type="text"
                      value={milestone.recipient}
                      onChange={(e) => updateMilestone(index, 'recipient', e.target.value)}
                      className="w-full px-3 py-2 bg-[#05140D] rounded border border-gray-700 focus:border-[#2FB574] focus:outline-none"
                      placeholder={walletAddress}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={addMilestone}
                className="px-4 py-2 bg-[#1A3A2C] border border-[#2FB574] rounded-md hover:bg-[#2C5440] transition-colors"
              >
                Add Milestone
              </button>
              
              <button
                onClick={handleCreateProject}
                disabled={loading}
                className="px-4 py-2 bg-[#2FB574] rounded-md hover:bg-[#238A56] transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
          
          <div className="p-6 bg-[#1A3A2C] rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Check Project Status</h2>
            
            <div className="mb-4">
              <label className="block mb-2">Project ID</label>
              <input
                type="number"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D251A] rounded border border-gray-700 focus:border-[#2FB574] focus:outline-none"
                min="0"
              />
            </div>
            
            <button
              onClick={handleCheckProject}
              disabled={loading}
              className="px-4 py-2 bg-[#2FB574] rounded-md hover:bg-[#238A56] transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Checking...' : 'Check Project'}
            </button>
          </div>
          
          {result && (
            <div className={`p-6 ${result.success ? 'bg-[#1A3A2C]' : 'bg-[#3A1A1A]'} rounded-xl`}>
              <h2 className="text-2xl font-semibold mb-4">Result</h2>
              <p className="mb-2">{result.message}</p>
              
              {result.transactionHash && (
                <div className="mb-4">
                  <p>Transaction Hash:</p>
                  <a 
                    href={`${pharosDevnet.blockExplorers.default.url}/tx/${result.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2FB574] hover:underline break-all"
                  >
                    {result.transactionHash}
                  </a>
                </div>
              )}
              
              {result.project && (
                <div className="mt-4">
                  <h3 className="text-xl font-medium mb-2">Project Details</h3>
                  <ul className="space-y-2">
                    <li><strong>Total Amount:</strong> {result.project.totalAmount} ETH</li>
                    <li><strong>Amount Raised:</strong> {result.project.amountRaised} ETH</li>
                    <li><strong>Is Active:</strong> {result.project.isActive ? 'Yes' : 'No'}</li>
                  </ul>
                </div>
              )}
              
              {!result.success && result.error && (
                <pre className="mt-4 p-4 bg-[#0D1A25] rounded overflow-x-auto text-red-300 text-sm">
                  {JSON.stringify(result.error, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage; 