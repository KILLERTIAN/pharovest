import { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import ScrollToTop from './ScrollToTop';
import Loader from "./components/Loader";
import Projects from "./pages/Projects";
import PostProject from "./pages/PostProject";
import ProjectDetailedView from "./components/ProjectDetailedView";
import { Setting } from "./pages/Setting";
import MilestoneDetailedView from "./components/MileStonesDetailedView";
import Service from "./pages/Posts";
import NewPost from "./pages/NewPost";
import AdminPage from "./pages/AdminPage";
import { Toaster } from 'react-hot-toast';
import DataPreloader from './components/DataPreloader';

// Create DataContext to share loaded data across components
export const DataContext = createContext({
  projectsData: [],
  postsData: [],
  isProjectsLoading: true,
  isPostsLoading: true,
});

function App() {
  const [projectsData, setProjectsData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // Function to fetch projects data
  const fetchProjects = async () => {
    try {
      const urls = [
        'https://pharovest.onrender.com/project/getAllProjects',
        './projects.json' // Local fallback
      ];
      
      // Create a fetch promise with timeout
      const fetchWithTimeout = async (url, timeout = 8000) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      };
      
      // Try primary URL first
      try {
        const response = await fetchWithTimeout(urls[0]);
        if (response.ok) {
          const data = await response.json();
          setProjectsData(data);
          return;
        }
      } catch (primaryError) {
        console.warn('Primary project fetch failed:', primaryError);
      }
      
      // Try fallback if primary fails
      try {
        const fallbackResponse = await fetch(urls[1]);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setProjectsData(fallbackData);
          console.log('Using fallback project data');
        } else {
          console.error('Fallback fetch failed');
          setProjectsData([]);
        }
      } catch (fallbackError) {
        console.error('Error fetching fallback data:', fallbackError);
        setProjectsData([]);
      }
    } catch (error) {
      console.error('Error in fetch projects:', error);
      setProjectsData([]);
    } finally {
      setIsProjectsLoading(false);
    }
  };

  // Function to fetch posts data
  const fetchPosts = async () => {
    try {
      const urls = [
        'https://pharovest.onrender.com/posts',
        'https://finvest-backend.onrender.com/posts'
      ];
      
      // Try each URL until one succeeds
      for (const url of urls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setPostsData(data);
            break;
          }
        } catch (urlError) {
          console.warn(`Failed to fetch posts from ${url}:`, urlError);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPostsData([]);
    } finally {
      setIsPostsLoading(false);
    }
  };

  useEffect(() => {
    // Start the initial loading timer - only show loader for a maximum of 3 seconds
    const loadingTimer = setTimeout(() => {
      setInitialLoading(false);
    }, 3000);

    // Start fetching data immediately
    fetchProjects();
    fetchPosts();

    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <div className="flex items-center flex-col bg-[#05140D] overflow-x-hidden">
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#1A3A2C',
          color: '#ffffff',
        },
        success: {
          style: {
            background: '#1B7A57',
          },
        },
        error: {
          style: {
            background: '#FF4500',
          },
        }
      }} />
      
      <DataContext.Provider value={{ 
        projectsData, 
        postsData, 
        isProjectsLoading, 
        isPostsLoading,
      }}>
        <Router>
          <ScrollToTop />
          <DataPreloader />
          {initialLoading ? (
            <Loader />
          ) : (
            <Routes>
              <Route path='/' exact element={<Home />} />
              <Route path='/login' exact element={<Login />} />
              <Route path='/signup' exact element={<SignUp />} />
              <Route path='/dashboard' exact element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetailedView projects={projectsData} />} />
              <Route path="/projects/milestones/:projectId" element={<MilestoneDetailedView />} />
              <Route path="/projects/post-project" element={<PostProject />} />
              <Route path="settings" element={<Setting />} />
              <Route path="/posts" element={<Service />} />
              <Route path="/posts/new-post" element={<NewPost />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          )}
        </Router>
      </DataContext.Provider>
    </div>
  );
}

export default App;
