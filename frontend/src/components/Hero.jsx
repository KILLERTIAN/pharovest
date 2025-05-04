import { ArrowRight, TrendingUp, Shield, Sparkles, BarChart3, LayoutGrid, Globe } from "lucide-react";
import { Button } from "./ui/button";
import FadeIn from "./FadeIn";
import '../App.css';
import { Link } from "react-router-dom";

function Hero() {
    return (
        <div className="hero relative flex flex-col items-center justify-center w-full bg-[#05140D] p-5 py-16 md:py-24 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#05140D] via-[#071f14] to-[#05140D] z-0"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#2FB574]/10 blur-[100px] top-20 -left-40 z-1"></div>
            <div className="absolute w-[300px] h-[300px] rounded-full bg-[#2FB574]/10 blur-[100px] bottom-40 right-10 z-1"></div>
            
            {/* Animated grid pattern in background */}
            <div className="absolute inset-0 z-1 opacity-5">
                <div className="absolute inset-0 grid grid-cols-12 gap-2">
                    {Array(48).fill().map((_, i) => (
                        <div key={i} className="col-span-1 h-8 bg-[#2FB574] rounded-sm opacity-30"></div>
                    ))}
                </div>
            </div>
            
            <div className="relative z-10 container mx-auto max-w-7xl px-4">
                {/* Main hero section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Left Column - Text content */}
                    <div className="lg:col-span-6 flex flex-col space-y-8">
                        <FadeIn direction="down" delay={0.2} fullWidth>
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#2FB574]/10 border border-[#2FB574]/30 mb-4 w-fit">
                                <Sparkles className="h-4 w-4 text-[#2FB574] mr-2" />
                                <span className="text-[#2FB574] font-medium">Blockchain Crowdfunding Revolution</span>
                            </div>
                        </FadeIn>
                        
            <FadeIn direction="down" delay={0.3} fullWidth>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight gradient-text">
                                Transform Your <span className="text-[#2FB574]">Financial Future</span> With Pharovest
                </h1>
            </FadeIn>
                        
                        <FadeIn direction="down" delay={0.4} fullWidth>
                            <p className="text-lg md:text-xl text-gray-300/90 leading-relaxed">
                                The most transparent and secure blockchain-powered funding platform connecting visionary creators with forward-thinking investors through milestone-based accountability.
                            </p>
            </FadeIn>

                        {/* CTA Section */}
                        <FadeIn direction="down" delay={0.5} fullWidth>
                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <Link to="/signup">
                                    <Button variant="custom" size="lg" className="group flex items-center px-6 py-6 text-base font-semibold">
                                        Start Your Project 
                                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                    </Link>
                                <Link to="/projects">
                                    <Button variant="outline" size="lg" className="border-[#2FB574]/40 hover:border-[#2FB574] text-black px-6 py-6 text-base font-semibold">
                                        {/* <Shield className="mr-2 text-[#2FB574]" /> */}
                                        Browse Projects
                    </Button>
                                </Link>
                            </div>
                </FadeIn>

                        {/* Stats Section */}
                        <FadeIn direction="down" delay={0.6} fullWidth>
                            <div className="flex flex-wrap gap-8 mt-6">
                                <div className="flex flex-col">
                                    <span className="text-[#2FB574] text-3xl font-bold">$12M+</span>
                                    <span className="text-gray-400 text-sm">Funds Raised</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#2FB574] text-3xl font-bold">500+</span>
                                    <span className="text-gray-400 text-sm">Projects Funded</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#2FB574] text-3xl font-bold">98%</span>
                                    <span className="text-gray-400 text-sm">Success Rate</span>
                                </div>
            </div>
                </FadeIn>
            </div>

                    {/* Right Column - Interactive visual */}
                    <div className="lg:col-span-6">
                        <FadeIn direction="up" delay={0.4} fullWidth>
                            <div className="relative">
                                {/* Glowing border effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#2FB574]/30 to-[#1B7A57]/30 rounded-2xl blur-lg"></div>
                                
                                {/* Main dashboard/app preview */}
                                <div className="relative bg-[#071f14] p-4 rounded-2xl border border-[#2FB574]/20">
                                    {/* Nav bar of the app preview */}
                                    <div className="flex items-center justify-between mb-4 px-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="flex-1 flex justify-center">
                                            <div className="h-6 w-48 bg-[#0A1F15] rounded-full"></div>
                                        </div>
                                    </div>
                                    
                                    {/* App content */}
                                    <div className="bg-[#0A1F15] rounded-xl p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h3 className="text-white font-bold text-xl">Project Dashboard</h3>
                                                <p className="text-gray-400 text-sm">Milestone-based tracking</p>
                                            </div>
                                            <div className="bg-[#2FB574]/20 p-2 rounded-lg">
                                                <BarChart3 className="text-[#2FB574] h-6 w-6" />
                                            </div>
                                        </div>
                                        
                                        {/* Project cards */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-[#071f14] p-4 rounded-lg border border-[#2FB574]/20">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="bg-blue-500/20 p-1.5 rounded">
                                                        <Globe className="text-blue-500 h-4 w-4" />
                                                    </div>
                                                    <span className="text-white text-xs font-medium px-2 py-1 bg-blue-500/20 rounded-full">Active</span>
                                                </div>
                                                <h4 className="text-white font-medium mb-1">Clean Energy Project</h4>
                                                <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                                                    <div className="bg-blue-500 h-1.5 rounded-full w-[65%]"></div>
                                                </div>
                                                <p className="text-gray-400 text-xs">65% of 120 ETH</p>
                                            </div>
                                            
                                            <div className="bg-[#071f14] p-4 rounded-lg border border-[#2FB574]/20">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="bg-[#2FB574]/20 p-1.5 rounded">
                                                        <TrendingUp className="text-[#2FB574] h-4 w-4" />
                                                    </div>
                                                    <span className="text-white text-xs font-medium px-2 py-1 bg-[#2FB574]/20 rounded-full">Trending</span>
                                                </div>
                                                <h4 className="text-white font-medium mb-1">AI Healthcare</h4>
                                                <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                                                    <div className="bg-[#2FB574] h-1.5 rounded-full w-[85%]"></div>
                                                </div>
                                                <p className="text-gray-400 text-xs">85% of 50 ETH</p>
                                            </div>
                                        </div>
                                        
                                        {/* Feature highlights */}
                                        <div className="bg-[#071f14] p-4 rounded-lg border border-[#2FB574]/10">
                                            <h4 className="text-white font-medium mb-3">Platform Benefits</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded bg-purple-500/20 flex items-center justify-center">
                                                        <Shield className="text-purple-400 h-4 w-4" />
                                                    </div>
                                                    <span className="text-gray-300 text-sm">Blockchain Security</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded bg-amber-500/20 flex items-center justify-center">
                                                        <LayoutGrid className="text-amber-400 h-4 w-4" />
                                                    </div>
                                                    <span className="text-gray-300 text-sm">NFT Rewards</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating notification */}
                                <div className="absolute -right-8 top-1/4 bg-[#071f14] border border-[#2FB574]/30 rounded-lg p-3 shadow-lg max-w-[200px] animate-pulse">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                            <Sparkles className="text-white h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-white text-xs font-medium">New Investment!</p>
                                            <p className="text-gray-400 text-xs">5 ETH contributed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default Hero;
