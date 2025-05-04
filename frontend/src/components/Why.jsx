import FadeIn from "./FadeIn";
import { CodeXml, Link2, Lock, Rocket, Lightbulb, Shield, Coins, History, UserCheck } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function Why() {
    const navigate = useNavigate();
    
    return (
        <div className="relative flex flex-col items-center justify-center bg-[#05140D] w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background elements */}
            <div className="absolute w-[600px] h-[600px] rounded-full bg-[#2FB574]/5 blur-[120px] -bottom-300 left-1/2 transform -translate-x-1/2 z-0"></div>
            <div className="absolute w-[300px] h-[300px] rounded-full bg-[#2FB574]/5 blur-[80px] top-20 right-10 z-0"></div>
            
            {/* Decorative code blocks in background */}
            <div className="absolute top-40 left-10 opacity-10 hidden lg:block">
                <CodeBlock />
            </div>
            <div className="absolute bottom-40 right-10 opacity-10 hidden lg:block">
                <CodeBlock />
            </div>
            
            {/* Heading Section */}
            <div className="relative z-10 container mx-auto max-w-7xl mb-12 md:mb-20">
                <FadeIn direction="up" delay={0.2} fullWidth>
                    <div className="text-center mb-5">
                        <span className="inline-block px-4 py-2 bg-[#2FB574]/10 rounded-full text-[#2FB574] font-medium text-xs sm:text-sm mb-4">
                            BLOCKCHAIN ADVANTAGE
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4 md:mb-6">
                            Why Choose <span className="text-[#2FB574]">Pharovest</span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                            Harness the power of blockchain technology for transparent, secure, and efficient crowdfunding with built-in accountability.
                        </p>
                    </div>
                </FadeIn>
                
                {/* Main Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
                    {/* Feature 1 - Blockchain Security */}
                    <FadeIn direction="up" delay={0.3} fullWidth>
                        <div className="bg-gradient-to-br from-[#0A1F15] to-[#071f14] rounded-2xl p-6 sm:p-8 border border-[#2FB574]/20 h-full transform transition-all hover:translate-y-[-5px] hover:shadow-xl hover:shadow-[#2FB574]/5">
                            <div className="bg-[#2FB574]/10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6">
                                <Shield className="text-[#2FB574] h-7 w-7 sm:h-8 sm:w-8" />
                            </div>
                            <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 md:mb-4">Blockchain Security</h3>
                            <p className="text-gray-400 mb-6 text-sm md:text-base">
                                Every transaction is immutably recorded on the blockchain, providing unparalleled security and transparency for all stakeholders.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                <span className="px-3 py-1 bg-[#2FB574]/10 rounded-full text-[#2FB574] text-xs font-medium">
                                    Tamper-proof
                                </span>
                                <span className="px-3 py-1 bg-[#2FB574]/10 rounded-full text-[#2FB574] text-xs font-medium">
                                    Decentralized
                                </span>
                            </div>
                        </div>
                    </FadeIn>
                    
                    {/* Feature 2 - Smart Contracts */}
                    <FadeIn direction="up" delay={0.4} fullWidth>
                        <div className="bg-gradient-to-br from-[#0A1F15] to-[#071f14] rounded-2xl p-6 sm:p-8 border border-[#2FB574]/20 h-full transform transition-all hover:translate-y-[-5px] hover:shadow-xl hover:shadow-[#2FB574]/5">
                            <div className="bg-[#2FB574]/10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6">
                                <CodeXml className="text-[#2FB574] h-7 w-7 sm:h-8 sm:w-8" />
                            </div>
                            <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 md:mb-4">Smart Contracts</h3>
                            <p className="text-gray-400 mb-6 text-sm md:text-base">
                                Automatically enforced agreements ensure funds are only released when pre-defined milestones are verifiably achieved.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                <span className="px-3 py-1 bg-[#2FB574]/10 rounded-full text-[#2FB574] text-xs font-medium">
                                    Self-executing
                                </span>
                                <span className="px-3 py-1 bg-[#2FB574]/10 rounded-full text-[#2FB574] text-xs font-medium">
                                    Trustless
                                </span>
                            </div>
                        </div>
                    </FadeIn>
                    
                    {/* Feature 3 - Digital Ownership */}
                    <FadeIn direction="up" delay={0.5} fullWidth>
                        <div className="bg-gradient-to-br from-[#0A1F15] to-[#071f14] rounded-2xl p-6 sm:p-8 border border-[#2FB574]/20 h-full transform transition-all hover:translate-y-[-5px] hover:shadow-xl hover:shadow-[#2FB574]/5">
                            <div className="bg-[#2FB574]/10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6">
                                <Coins className="text-[#2FB574] h-7 w-7 sm:h-8 sm:w-8" />
                            </div>
                            <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 md:mb-4">NFT Rewards</h3>
                            <p className="text-gray-400 mb-6 text-sm md:text-base">
                                Contributors receive unique NFTs representing their stake in projects, providing verifiable proof of participation with potential for future value.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                <span className="px-3 py-1 bg-[#2FB574]/10 rounded-full text-[#2FB574] text-xs font-medium">
                                    Digital Assets
                                </span>
                                <span className="px-3 py-1 bg-[#2FB574]/10 rounded-full text-[#2FB574] text-xs font-medium">
                                    Collectible
                                </span>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
            
            {/* Advanced Features Section */}
            <div className="relative z-10 container mx-auto max-w-7xl mt-8 md:mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6">
                    <FadeIn direction="left" delay={0.3} fullWidth>
                        <div className="relative overflow-hidden rounded-2xl border border-[#2FB574]/20 p-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#2FB574]/20 to-transparent opacity-30 blur-xl"></div>
                            <div className="relative bg-[#071f14] rounded-xl p-5 sm:p-8">
                                <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                                    <Lock className="text-[#2FB574] h-5 w-5 sm:h-6 sm:w-6 mr-3 flex-shrink-0" />
                                    <span>For Project Creators</span>
                                </h3>
                                <ul className="space-y-3">
                                    {[
                                        { icon: <UserCheck size={18} />, text: "Direct connection with global investor pool" },
                                        { icon: <History size={18} />, text: "Milestone-based fund release for better budgeting" },
                                        { icon: <Lightbulb size={18} />, text: "AI-assisted project management tools" },
                                        { icon: <Link2 size={18} />, text: "Blockchain-verified project transparency" }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="flex-shrink-0 p-1 rounded-full bg-[#2FB574]/20 text-[#2FB574] mr-3">
                                                {item.icon}
                                            </span>
                                            <span className="text-gray-300 text-sm sm:text-base">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </FadeIn>
                    
                    <FadeIn direction="right" delay={0.4} fullWidth>
                        <div className="relative overflow-hidden rounded-2xl border border-[#2FB574]/20 p-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#2FB574]/20 opacity-30 blur-xl"></div>
                            <div className="relative bg-[#071f14] rounded-xl p-5 sm:p-8">
                                <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                                    <Rocket className="text-[#2FB574] h-5 w-5 sm:h-6 sm:w-6 mr-3 flex-shrink-0" />
                                    <span>For Investors</span>
                                </h3>
                                <ul className="space-y-3">
                                    {[
                                        { icon: <Shield size={18} />, text: "Guaranteed milestone-based fund allocation" },
                                        { icon: <Coins size={18} />, text: "Unique NFTs as proof of contribution" },
                                        { icon: <History size={18} />, text: "Transparent progress tracking" },
                                        { icon: <Link2 size={18} />, text: "Ability to vote on project direction" }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="flex-shrink-0 p-1 rounded-full bg-[#2FB574]/20 text-[#2FB574] mr-3">
                                                {item.icon}
                                            </span>
                                            <span className="text-gray-300 text-sm sm:text-base">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </FadeIn>
                </div>
                
                {/* CTA Section */}
                <FadeIn direction="up" delay={0.5} fullWidth>
                    <div className="mt-12 md:mt-20 text-center">
                        <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 px-4">
                            Ready to revolutionize your funding experience?
                        </h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button 
                                variant="custom" 
                                size="lg" 
                                onClick={() => navigate('/signup')}
                                className="px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base"
                            >
                                Get Started Now
                            </Button>
                            <Button 
                                variant="outline" 
                                size="lg" 
                                onClick={() => navigate('/projects')}
                                className="px-6 sm:px-8 py-5 sm:py-6 border-[#2FB574]/40 hover:border-[#2FB574] text-sm sm:text-base"
                            >
                                Browse Projects
                            </Button>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}

// Decorative code block component
function CodeBlock() {
    return (
        <div className="font-mono text-[#2FB574] text-xs">
            <pre>{`contract Pharovest {
  struct Project {
    uint256 id;
    address owner;
    uint256 fundingGoal;
    uint256 raisedAmount;
    Milestone[] milestones;
  }
            
  function invest(uint256 _projectId) 
    public payable {
    // Smart contract logic
  }
}`}</pre>
        </div>
    );
}

export default Why;
