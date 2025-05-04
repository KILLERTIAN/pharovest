"use client";
import { useEffect, useState } from "react";
import {
    Search,
} from "lucide-react";
import "../App.css";
import { Input } from "@/components/ui/input";
import FadeIn from "@/components/FadeIn";
import Sidebar from "@/components/Sidebar";
import UserProfileIcon from "@/components/ui/UserProfileIcon";
import { DashboardORG } from "@/components/DashboardORG";
import { DashboardINV } from "@/components/DashboardINV";
import { DashboardAdmin } from "@/components/DashboardAdmin";

export function Dashboard() {
    const [userRole, setUserRole] = useState(null);

    // Load user data from localStorage on component mount
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const data = JSON.parse(userData);
                setUserRole(data.user?.role || null); // Set the user role or null if undefined
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []); // Empty dependency array ensures it runs only once on mount

    // Render based on user role
    let dashboardContent;
    if (userRole === "Organisation") {
        dashboardContent = <DashboardORG />;
    } else if (userRole === "Investor") {
        dashboardContent = <DashboardINV />;
    } else if (userRole === "Admin") {
        dashboardContent = <DashboardAdmin />;
    } else {
        dashboardContent = <p className="text-white">Loading dashboard...</p>; // Placeholder for no role or loading
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#05140D]">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 overflow-hidden scrollbar-hidden">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-gray-700 bg-[#05140D] px-4 sm:static sm:h-auto sm:bg-transparent sm:px-6">
                    <Sidebar />

                    <FadeIn direction="down" delay={0.2} fullWidth>
                        <h3 className="md:text-4xl text-2xl font-semibold text-left text-white w-full py-3 md:px-3 z-[5]">
                            Dashboard
                        </h3>
                    </FadeIn>

                    <FadeIn direction="down" delay={0.2}>
                        <div className="relative ml-auto flex-1 md:grow-0">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-300" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full rounded-lg bg-[#05140D] text-white placeholder-gray-300 pl-8 md:w-[200px] lg:w-[336px] border border-gray-600"
                            />
                        </div>
                    </FadeIn>

                    <FadeIn direction="left" delay={0.2}>
                        <UserProfileIcon className="text-white" />
                    </FadeIn>
                </header>
                
                {/* Render the appropriate dashboard */}
                {dashboardContent}
            </div>
        </div>
    );
}
