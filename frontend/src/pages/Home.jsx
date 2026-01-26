import { useContext } from "react"
import Faq from "@/components/Faq"
import Feature from "@/components/Feature"
import Hero from "@/components/Hero"
import Navbar from "@/components/Navbar"
import Services from "@/components/Services"
import Subscribe from "@/components/Subscribe"
import Why from "@/components/Why"
import { DataContext } from "../App"

function Home() {
    const { isProjectsLoading, isPostsLoading } = useContext(DataContext);
    
    // Check if any data is still loading
    const isLoading = isProjectsLoading || isPostsLoading;
    
    return (
        <div className="bg-[#05140D] overflow-hidden">
            <Navbar />
            {isLoading && (
                <div className="fixed bottom-4 right-4 z-50 bg-[#1B7A57] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                    <span>Loading content in background...</span>
                </div>
            )}
            <Hero />
            <Services />
            <Why />
            <Feature />
            <Faq />
            <Subscribe />
        </div>
    )
}

export default Home