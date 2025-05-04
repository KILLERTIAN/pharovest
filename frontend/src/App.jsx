import { useEffect, useState } from "react";
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

function App() {
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Primary database URL
    const databaseUrl = 'https://pharovest.onrender.com/project/getAllProjects';
    
    const fetchProjects = async () => {
      try {
        // First try to fetch from database
        const response = await fetch(databaseUrl);
        if (response.ok) {
          const data = await response.json();
          setProjectsData(data);
        } else {
          console.warn(`Failed to fetch from database: ${response.status}`);
          
          // Only use local fallback if database fetch fails
          try {
            const fallbackResponse = await fetch('./projects.json');
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
        }
      } catch (error) {
        console.error('Error fetching from database:', error);
        
        // Try fallback only after primary source fails
        try {
          const fallbackResponse = await fetch('./projects.json');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setProjectsData(fallbackData);
            console.log('Using fallback project data after database error');
          } else {
            setProjectsData([]);
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          setProjectsData([]);
        }
      } finally {
        // Ensure loading state is updated regardless of success/failure
        setTimeout(() => {
          setLoading(false);
        }, 1000); // Reduced duration for better UX
      }
    };

    fetchProjects();
    
    return () => {
      // Cleanup if needed
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
      <Router>
        <ScrollToTop />
        {loading ? (
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
    </div>
  );
}

export default App;
