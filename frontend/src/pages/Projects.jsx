import { useState, useEffect, useContext } from 'react';
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Share2, ArrowBigUpDash, Search, Sparkles } from "lucide-react";
import { Input } from '../components/ui/input';
import Sidebar from '../components/Sidebar';
import FadeIn from '../components/FadeIn';
import Filter from '../components/Filter';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import UserProfileIcon from '../components/ui/UserProfileIcon';
import { SkeletonCard } from "../components/ui/SkeletonCard";
import '../App.css';
import useAuth from '../utils/auth';
import { DataContext } from '../App';

const fetchProjectData = async (urls) => {
    for (const url of urls) {
        try {
            // Add cache-busting parameter to ensure fresh data
            const timestamp = new Date().getTime();
            const fetchUrl = url.includes('?') ? `${url}&_t=${timestamp}` : `${url}?_t=${timestamp}`;

            const response = await fetch(fetchUrl, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching project data from ${url}:`, error);
        }
    }
    throw new Error('All fetch attempts failed');
};

function Projects() {
    // Get pre-loaded projects data from context
    const { projectsData, isProjectsLoading } = useContext(DataContext);
    
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [recommendedProjects, setRecommendedProjects] = useState([]);
    const [hoveredProject, setHoveredProject] = useState(null);
    const [userUpvotes, setUserUpvotes] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        // Retrieve user data from local storage
        const userData = localStorage.getItem('user');

        if (userData) {
            try {
                const data = JSON.parse(userData);
                setUserRole(data.user?.role);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }

        // Check if we already have projects data from context
        if (projectsData && projectsData.length > 0) {
            setProjects(projectsData);
            setFilteredProjects(projectsData);

            // Set top 3 projects as recommended
            const top3 = [...projectsData]
                .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
                .slice(0, 3);
            setRecommendedProjects(top3);
            setLoading(false);
        } else if (!isProjectsLoading) {
            // If context data loading is finished but we don't have data, fetch it directly
            const urls = [
                'https://pharovest.onrender.com/project/getAllProjects',
                'https://finvest-backend.onrender.com/project/getAllProjects',
                // '/projects.json'  // Local fallback
            ];

            const fetchData = async () => {
                try {
                    const data = await fetchProjectData(urls);
                    if (data && data.length > 0) {
                        setProjects(data);
                        setFilteredProjects(data);

                        // Set top 3 projects as recommended
                        const top3 = [...data]
                            .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
                            .slice(0, 3);
                        setRecommendedProjects(top3);
                    }
                } catch (error) {
                    console.error('Failed to fetch project data from all sources:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        } else {
            // If context data is still loading, wait for it
            setLoading(true);
        }
    }, [projectsData, isProjectsLoading]);

    // Filter projects based on search term and selected filter
    useEffect(() => {
        if (!projects.length) return;

        let result = [...projects];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(project =>
                project.title?.toLowerCase().includes(term) ||
                project.description?.toLowerCase().includes(term) ||
                project.creator?.toLowerCase().includes(term)
            );
        }

        // Apply category filter
        if (selectedFilter !== 'all' && selectedFilter !== 'ai-recommended') {
            result = result.filter(project => project.category === selectedFilter);
        }

        setFilteredProjects(result);
    }, [searchTerm, selectedFilter, projects]);

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleUpvote = (projectId) => {
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.id === projectId
                    ? { ...project, upvotes: userUpvotes[projectId] ? project.upvotes - 1 : project.upvotes + 1 }
                    : project
            )
        );

        setUserUpvotes((prevUserUpvotes) => ({
            ...prevUserUpvotes,
            [projectId]: !prevUserUpvotes[projectId],
        }));
    };

    const handleProjectClick = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    return (
        <div className="flex min-h-screen w-full overflow-hidden scrollbar-hidden bg-[#05140D] text-white">
            <div className="flex-1 sm:gap-4 sm:py-4 sm:pl-14 overflow-hidden scrollbar-hidden">
                <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-[#05140D] border-b border-gray-800 gap-4">
                    <Sidebar />
                    <FadeIn direction="down" delay={0.1} fullWidth>
                        <h1 className="md:text-4xl text-2xl font-semibold text-left text-white w-full px-2 pl-4 md:px-3 z-[5]">Projects</h1>
                    </FadeIn>

                    {/* Search Bar */}
                    <FadeIn direction="down" delay={0.2}>
                        <div className="relative ml-auto flex-1 md:grow-0">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-300" />
                            <Input
                                type="search"
                                placeholder="Search Projects..."
                                className="w-full rounded-lg bg-[#05140D] text-white placeholder-gray-300 pl-8 md:w-[200px] lg:w-[336px] border border-gray-600"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </FadeIn>

                    <div className="flex items-center gap-4">
                        {/* Conditional Buttons */}
                        {isLoggedIn ? (
                            <>
                                {/* Post a Project Button (for Organisations only) */}
                                {userRole === 'Organisation' && (
                                    <FadeIn direction="down" delay={0.1}>
                                        <Link to="/projects/post-project">
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2 text-[#2FB574] border-[#2FB574] bg-[#05140D] hover:bg-[#2FB574] hover:text-white hover:border-[#2FB574] "
                                            >
                                                <PlusCircle className="h-5 w-5" />
                                                Post a Project
                                            </Button>
                                        </Link>
                                    </FadeIn>
                                )}
                                {/* User Profile Icon */}
                                <FadeIn direction="left" delay={0.2}>
                                    <UserProfileIcon />
                                </FadeIn>
                            </>
                        ) : (
                            /* Sign Up Button for not logged-in users */
                            <FadeIn direction="down" delay={0.1}>
                                <Link to="/signup">
                                    <Button variant="custom" size="lg" className="md:block m-0">
                                        Sign Up
                                    </Button>
                                </Link>
                            </FadeIn>
                        )}
                    </div>
                </header>

                <FadeIn direction="up" delay={0.2} fullWidth className="pl-4">

                    <div className='w-full'>
                        <Filter onFilterChange={handleFilterChange} currentFilter={selectedFilter} />

                    </div>

                </FadeIn>

                {(selectedFilter === 'ai-recommended' || selectedFilter === 'all') && recommendedProjects.length > 0 && (
                    <FadeIn direction="up" delay={0.2} fullWidth>
                        <div className="p-5 md:px-10 pb-0">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="h-5 w-5 text-[#2FB574]" />
                                <h2 className="text-xl font-semibold text-white">AI Recommended Projects</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                                {recommendedProjects.map((project) => (
                                    <div
                                        key={`recommended-${project.id}`}
                                        className="relative h-[400px] w-full max-w-sm mx-auto overflow-hidden rounded-xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer bg-[#10251C]"
                                        onMouseEnter={() => setHoveredProject(`recommended-${project.id}`)}
                                        onMouseLeave={() => setHoveredProject(null)}
                                        onClick={() => handleProjectClick(project.id)}
                                    >
                                        <div className="absolute top-2 right-2 z-10 bg-[#2FB574] px-2 py-1 rounded-md text-white text-xs flex items-center gap-1">
                                            <Sparkles className="h-3 w-3" />
                                            <span>Recommended</span>
                                        </div>
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="h-full w-full object-cover"
                                        />
                                        <div
                                            className={`absolute inset-0 rounded-xl p-4 bg-gradient-to-t from-[#10251C] to-[#13261F] transition-transform duration-500 ease-in-out ${hoveredProject === `recommended-${project.id}` ? "translate-y-[15%]" : "translate-y-[30%]"}`}
                                        >
                                            <div
                                                className="absolute top-2 right-4 flex items-center justify-center p-2 bg-[#1A3A2C] rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpvote(project.id);
                                                }}
                                            >
                                                <ArrowBigUpDash
                                                    className={`h-6 w-6 ${userUpvotes[project.id] ? "text-[#2FB574]" : "text-white"} transition-colors`}
                                                />
                                                {project.upvotes > 0 && (
                                                    <span className="ml-1 text-xs font-semibold text-white">
                                                        {project.upvotes}
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="xl:text-2xl text-xl font-bold sm:line-clamp-1 text-white">
                                                {project.title}
                                            </h2>
                                            <div className="flex items-center mt-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={project.avatar} alt={project.creator || 'Creator'} />
                                                    <AvatarFallback>{project.creator ? project.creator.charAt(0) : '?'}</AvatarFallback>
                                                </Avatar>
                                                <p className="ml-2 text-sm font-medium text-white">
                                                    {project.creator || 'Unknown Creator'}
                                                </p>
                                            </div>
                                            <p className="mt-4 text-gray-300 sm:line-clamp-3 line-clamp-2">
                                                {project.description}
                                            </p>
                                            <div className="mt-4 flex justify-between">
                                                <p className="text-[#2FB574] font-semibold text-xl flex flex-col">
                                                    {project.amountRaised}
                                                    <span className="bg-[#2FB574] text-white text-[12px] px-3 py-0 mt-2 rounded-full line-clamp-1">
                                                        Total Amount Raised
                                                    </span>
                                                </p>
                                                <p className="text-gray-300 font-medium text-sm">
                                                    {project.contributors} contributors
                                                </p>
                                            </div>
                                            {hoveredProject === `recommended-${project.id}` && (
                                                <Button className="mt-4 w-full bg-[#2FB574] text-white py-2 rounded-md hover:bg-green-700">
                                                    Donate / Invest
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                )}

                <FadeIn direction="up" delay={0.3} fullWidth className="overflow-hidden scrollbar-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 p-5 md:p-10 overflow-hidden scrollbar-hidden w-full">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : selectedFilter === 'ai-recommended' ? (
                            // If AI recommended is selected, we've already shown them above, so this can be empty
                            <></>
                        ) : filteredProjects.length === 0 ? (
                            <div className="col-span-full text-center py-10">
                                <p className="text-gray-300 text-lg">No projects found matching your criteria.</p>
                            </div>
                        ) : (
                            // Display projects based on filters
                            filteredProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="relative h-[400px] w-full max-w-sm mx-auto overflow-hidden rounded-xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer bg-[#10251C]"
                                    onMouseEnter={() => setHoveredProject(project.id)}
                                    onMouseLeave={() => setHoveredProject(null)}
                                    onClick={() => handleProjectClick(project.id)}
                                >
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 p-2 bg-[#1A3A2C] rounded-full shadow-md hover:bg-[#2FB574] transition-colors cursor-pointer">
                                        <Share2 className="h-4 w-4 text-white" />
                                    </div>
                                    <div
                                        className={`absolute inset-0 rounded-xl p-4 bg-gradient-to-t from-[#10251C] to-[#13261F] transition-transform duration-500 ease-in-out ${hoveredProject === project.id ? "translate-y-[15%]" : "translate-y-[30%]"}`}
                                    >
                                        <div
                                            className="absolute top-2 right-4 flex items-center justify-center p-2 bg-[#1A3A2C] rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpvote(project.id);
                                            }}
                                        >
                                            <ArrowBigUpDash
                                                className={`h-6 w-6 ${userUpvotes[project.id] ? "text-[#2FB574]" : "text-white"} transition-colors`}
                                            />
                                            {project.upvotes > 0 && (
                                                <span className="ml-1 text-xs font-semibold text-white">
                                                    {project.upvotes}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="xl:text-2xl text-xl font-bold sm:line-clamp-1 text-white">
                                            {project.title}
                                        </h2>
                                        <div className="flex items-center mt-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={project.avatar} alt={project.creator || 'Creator'} />
                                                <AvatarFallback>{project.creator ? project.creator.charAt(0) : '?'}</AvatarFallback>
                                            </Avatar>
                                            <p className="ml-2 text-sm font-medium text-white">
                                                {project.creator || 'Unknown Creator'}
                                            </p>
                                        </div>
                                        <p className="mt-4 text-gray-300 sm:line-clamp-3 line-clamp-2">
                                            {project.description}
                                        </p>
                                        <div className="mt-4 flex justify-between">
                                            <p className="text-[#2FB574] font-semibold text-xl flex flex-col">
                                                {project.amountRaised}
                                                <span className="bg-[#2FB574] text-white text-[12px] px-3 py-0 mt-2 rounded-full line-clamp-1">
                                                    Total Amount Raised
                                                </span>
                                            </p>
                                            <p className="text-gray-300 font-medium text-sm">
                                                {project.contributors} contributors
                                            </p>
                                        </div>
                                        {hoveredProject === project.id && (
                                            <Button className="mt-4 w-full bg-[#2FB574] text-white py-2 rounded-md hover:bg-green-700">
                                                Donate / Invest
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}

export default Projects;
