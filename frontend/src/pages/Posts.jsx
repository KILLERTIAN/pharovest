import { useEffect, useState, useContext } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
    HeartIcon, 
    Share2, 
    Search, 
    MessageCircle, 
    Send, 
    PlusCircle, 
    ArrowBigUpDash, 
    ArrowBigDownDash,
    Calendar,
    Bookmark,
    Tag as Tags
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import FadeIn from '../components/FadeIn';
import UserProfileIcon from '../components/ui/UserProfileIcon';
import { Link } from 'react-router-dom';
import PostsPageSkeleton from '../components/ui/PostsPageSkeleton';
import useAuth from '../utils/auth';
import { motion } from 'framer-motion';
import { DataContext } from '../App';

// Sample tags for posts
const postTags = [
    { id: 1, name: 'Blockchain' },
    { id: 2, name: 'Finance' },
    { id: 3, name: 'Technology' },
    { id: 4, name: 'Innovation' },
    { id: 5, name: 'Crowdfunding' },
    { id: 6, name: 'Sustainability' }
];

function PostsPage() {
    // Access preloaded data from context
    const { postsData, isPostsLoading } = useContext(DataContext);
    
    const [posts, setPosts] = useState([]);
    const [userLikes, setUserLikes] = useState({});
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const userData = localStorage.getItem('user');

        // Check if userData is not null or undefined
        if (userData) {
            try {
                const data = JSON.parse(userData);
                console.log('Parsed data:', data); // Debugging line
                // Access the nested user object and set the role
                setUserRole(data.user?.role); // Use optional chaining
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        } else {
            console.log('No user data found in local storage');
        }

        // Check if we already have posts data from context
        if (postsData && postsData.length > 0) {
            // Add random tags to each post for demo
            const enhancedPosts = postsData.map(post => ({
                ...post,
                tags: [
                    postTags[Math.floor(Math.random() * postTags.length)],
                    postTags[Math.floor(Math.random() * postTags.length)]
                ]
            }));
            setPosts(enhancedPosts);
            setLoading(false);
        } else if (!isPostsLoading) {
            // If context data loading finished but no data, fetch it directly
            const urls = [
                'https://pharovest.onrender.com/posts',
                'https://finvest-backend.onrender.com/posts'
            ];

            const fetchPosts = async () => {
                try {
                    const data = await fetchPostData(urls);
                    // Add random tags to each post for demo
                    const enhancedPosts = data.map(post => ({
                        ...post,
                        tags: [
                            postTags[Math.floor(Math.random() * postTags.length)],
                            postTags[Math.floor(Math.random() * postTags.length)]
                        ]
                    }));
                    setPosts(enhancedPosts);
                } catch (error) {
                    console.error('Failed to fetch post data from all sources:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchPosts();
        } else {
            // If context data is still loading, wait for it
            setLoading(true);
        }
    }, [postsData, isPostsLoading]);

    const fetchPostData = async (urls) => {
        for (const url of urls) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    return await response.json();
                }
            } catch (error) {
                console.error(`Failed to fetch from ${url}`, error);
            }
        }
        throw new Error('All fetch attempts failed.');
    };

    const handleLike = (postId) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
                    ? { ...post, likes: userLikes[postId] ? post.likes - 1 : post.likes + 1 }
                    : post
            )
        );

        setUserLikes((prevUserLikes) => ({
            ...prevUserLikes,
            [postId]: !prevUserLikes[postId],
        }));
    };

    // Filter posts based on tag
    const filterPosts = () => {
        if (activeFilter === 'All') return posts;
        return posts.filter(post => 
            post.tags.some(tag => tag.name === activeFilter)
        );
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#05140D]">
            <div className="flex-1 sm:py-3 sm:pl-14 bg-[#05140D] overflow-hidden">
                <header className="sticky top-0 z-30 flex items-center justify-between gap-4 h-16 px-4 bg-[#05140D] border-b border-gray-700">
                    <Sidebar />

                    {/* Page Title */}
                    <FadeIn direction="down" delay={0.2} fullWidth>
                        <h1 className="md:text-4xl text-2xl font-semibold text-left text-white w-full md:px-3 z-[5] line-clamp-1">
                            Posts
                        </h1>
                    </FadeIn>

                    {/* Search Bar */}
                    <FadeIn direction="down" delay={0.2}>
                        <div className="relative ml-auto flex-1 md:grow-0">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-300" />
                            <Input
                                type="search"
                                placeholder="Search posts..."
                                className="w-full rounded-lg bg-[#05140D] text-white placeholder-gray-300 pl-8 md:w-[200px] lg:w-[336px] border border-gray-600 focus:border-[#2FB574] focus:ring-[#2FB574]"
                            />
                        </div>
                    </FadeIn>

                    <div className="flex items-center gap-4">
                        {/* Conditional Buttons */}
                        {isLoggedIn ? (
                            <>
                                {/* New Post Button (for Organisation role only) */}
                                {userRole === 'Organisation' && (
                                    <FadeIn direction="down" delay={0.1}>
                                        <Link to="/posts/new-post">
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2 text-[#2FB574] border-[#2FB574] bg-[#05140D] hover:bg-[#2FB574] hover:text-white hover:border-[#2FB574] transition-all duration-300"
                                            >
                                                <PlusCircle className="h-5 w-5" />
                                                New Post
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
                                    <Button 
                                        variant="custom" 
                                        size="lg" 
                                        className="md:block m-0 bg-[#2FB574] hover:bg-[#2FB574]/80 text-white transition-all duration-300"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            </FadeIn>
                        )}
                    </div>
                </header>

               

                {/* Display Skeleton while loading */}
                {loading ? (
                    <PostsPageSkeleton />
                ) : (
                    <FadeIn direction="up" delay={0.2} fullWidth>
                        <div className="p-4 md:p-10 grid grid-cols-1 gap-8 w-full">
                            {filterPosts().map((post, index) => (
                                <motion.div 
                                    key={post.id}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="bg-[#13261F] text-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row w-full border-0 hover:shadow-[0_0_15px_rgba(47,181,116,0.2)] transition-all duration-300">
                                        <div className="flex-1 p-4">
                                            <div className="relative">
                                                <img 
                                                    src={post.image} 
                                                    alt={post.description} 
                                                    className="w-full h-96 object-cover rounded-lg transition-transform duration-500 hover:scale-[1.02]" 
                                                />
                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    {post.tags.map((tag, idx) => (
                                                        <Badge 
                                                            key={idx} 
                                                            className="bg-[#2FB574]/90 text-white hover:bg-[#2FB574]"
                                                        >
                                                            {tag.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <button className="absolute bottom-3 right-3 p-2 bg-[#05140D]/80 rounded-full hover:bg-[#2FB574] transition-colors duration-300">
                                                    <Bookmark className="h-5 w-5 text-white" />
                                                </button>
                                            </div>
                                            
                                            <CardHeader className="flex flex-row items-center gap-4 p-4 border-b border-gray-700/50">
                                                <Avatar className="h-12 w-12 border-2 border-[#2FB574]">
                                                    <AvatarImage src={post.avatar} alt={post.name} />
                                                    <AvatarFallback className="bg-[#05140D] text-[#2FB574]">{post.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-lg font-semibold text-white">{post.name}</p>
                                                    <div className="flex items-center text-sm text-gray-400">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {format(new Date(post.date), 'MMMM dd, yyyy')}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            
                                            <CardContent className="p-4 flex-grow">
                                                <p className="text-gray-200 leading-relaxed">{post.description}</p>
                                            </CardContent>
                                            
                                            <CardFooter className="flex lg:flex-row flex-col gap-6 md:gap-4 justify-between items-center border-t border-gray-700/50 pt-4">
                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        variant="ghost"
                                                        className={`flex items-center gap-1 mb-0 transition-all duration-300 ${userLikes[post.id] ? 'text-red-500 animate-heart' : 'text-gray-400 hover:text-red-400'}`}
                                                        onClick={() => handleLike(post.id)}
                                                    >
                                                        <HeartIcon
                                                            className="w-5 h-5"
                                                            fill={userLikes[post.id] ? '#ff4d4f' : 'none'}
                                                            stroke={userLikes[post.id] ? '#ff4d4f' : 'currentColor'}
                                                        />
                                                        <span className="ml-1">{post.likes}</span>
                                                    </Button>

                                                    <Button 
                                                        variant="ghost" 
                                                        className="flex items-center gap-1 text-gray-400 mb-0 hover:text-white transition-all duration-300"
                                                    >
                                                        <MessageCircle className="w-5 h-5" />
                                                        <span className="ml-1">{post.comments.length}</span>
                                                    </Button>
                                                    
                                                    <Button 
                                                        variant="ghost" 
                                                        className="flex items-center gap-1 text-gray-400 mb-0 hover:text-[#2FB574] transition-all duration-300"
                                                    >
                                                        <Share2 className="w-5 h-5" />
                                                        <span className="ml-1">{post.shares}</span>
                                                    </Button>
                                                </div>
                                                <div className="flex flex-row gap-3 items-center justify-center">
                                                    <Button
                                                        className="px-4 py-2 bg-[#2FB574] hover:bg-[#2FB574]/80 text-white rounded-md transition-all duration-300 transform hover:scale-105"
                                                    >
                                                        <ArrowBigUpDash className="h-5 w-5 mr-2" />
                                                        Upvote
                                                    </Button>
                                                    <Button
                                                        className="px-4 py-2 bg-[#0c2f1f] hover:bg-[#13261F] text-white rounded-md border border-gray-700 transition-all duration-300"
                                                    >
                                                        <ArrowBigDownDash className="h-5 w-5 mr-2" />
                                                        Downvote
                                                    </Button>
                                                </div>
                                            </CardFooter>
                                        </div>
                                        <div className="flex-2 p-4 pt-2 bg-[#0c2f1f] md:border-l border-t md:border-t-0 border-gray-600 md:min-w-[320px] md:max-w-[350px] transition-all duration-300">
                                            <div className="flex flex-col w-full h-full justify-between">
                                                <div className="mb-4">
                                                    <h3 className="text-lg font-semibold text-[#2FB574] mb-3 flex items-center">
                                                        <MessageCircle className="h-4 w-4 mr-2" />
                                                        Comments
                                                    </h3>
                                                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {post.comments.map((comment) => (
                                                            <div 
                                                                key={comment.id} 
                                                                className="flex items-start gap-3 mt-3 p-3 rounded-lg bg-[#05140D]/50 hover:bg-[#05140D] transition-colors duration-300"
                                                            >
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={comment.avatar} alt={typeof comment.name === 'string' ? comment.name : 'User'} />
                                                                    <AvatarFallback className="bg-[#13261F] text-[#2FB574]">
                                                                        {typeof comment.name === 'string' ? comment.name.charAt(0) : 'U'}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-white">
                                                                        {typeof comment.name === 'string' ? comment.name : `User${Math.floor(Math.random() * 1000)}`}
                                                                    </p>
                                                                    <p className="text-sm text-gray-300 mt-1">{comment.text}</p>
                                                                    <div className="flex items-center gap-3 mt-2">
                                                                        <button className="text-xs text-gray-400 hover:text-[#2FB574] transition-colors">Reply</button>
                                                                        <button className="text-xs text-gray-400 hover:text-[#2FB574] transition-colors">Like</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="relative mt-4 flex flex-row bottom-0 items-center justify-evenly gap-2">
                                                    <Input
                                                        placeholder="Write a comment..."
                                                        className="rounded-lg bg-[#05140D] text-white placeholder-gray-400 pl-4 pr-12 py-2 border border-gray-700 focus:border-[#2FB574] focus:ring-[#2FB574]"
                                                    />
                                                    <Button className="bg-[#2FB574] text-white py-2 px-4 rounded-lg hover:bg-[#2FB574]/80 transition-all duration-300 transform hover:scale-105">
                                                        <Send className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}

                            {/* Empty state when no posts match filter */}
                            {filterPosts().length === 0 && (
                                <div className="flex flex-col items-center justify-center p-10 text-center">
                                    <div className="bg-[#13261F] p-8 rounded-xl">
                                        <Tags className="h-16 w-16 text-[#2FB574] mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
                                        <p className="text-gray-400 mb-4">There are no posts matching the selected filter.</p>
                                        <Button 
                                            onClick={() => setActiveFilter('All')}
                                            className="bg-[#2FB574] hover:bg-[#2FB574]/80 text-white"
                                        >
                                            View all posts
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </FadeIn>
                )}
            </div>
        </div>
    );
}

export default PostsPage;
