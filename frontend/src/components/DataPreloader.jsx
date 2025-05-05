import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { DataContext } from '../App';

/**
 * Component that preloads data based on the current route
 * and user navigation patterns
 */
const DataPreloader = () => {
  const location = useLocation();
  const { 
    isProjectsLoading, 
    isPostsLoading 
  } = useContext(DataContext);
  
  useEffect(() => {
    // Predict which data the user might need next based on current page
    const predictNextData = async () => {
      // If on home page and projects data isn't loaded yet, prioritize projects
      if (location.pathname === '/' && isProjectsLoading && !isPostsLoading) {
        console.log('Preloading projects data from home page');
        // This will happen through App.jsx's context
      }
      
      // If on projects page, preload posts data
      if (location.pathname.includes('/projects') && isPostsLoading && !isProjectsLoading) {
        console.log('Preloading posts data while browsing projects');
        // Posts will be loaded through App.jsx's context
      }
      
      // If on a single project page, preload related projects
      if (location.pathname.includes('/projects/') && !location.pathname.includes('/post-project')) {
        // Future enhancement: preload related projects based on current project category
        console.log('On project detail page, could preload related projects');
      }
    };
    
    predictNextData();
  }, [location, isProjectsLoading, isPostsLoading]);
  
  // This component doesn't render anything
  return null;
};

export default DataPreloader; 