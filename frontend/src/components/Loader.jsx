import { useState, useEffect } from 'react';
import "./Loader.css"; 
import "../App.css"

const loadingMessages = [
    "Connecting to Pharos Network...",
    "Loading blockchain projects...",
    "Fetching latest posts...",
    "Preparing a great experience for you..."
];

const Loader = () => {
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState(0);
    
    useEffect(() => {
        // Simulate progress
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return Math.min(prev + 2, 100); // Increment by 2% each time
            });
        }, 50);
        
        // Rotate through loading messages
        const messageTimer = setInterval(() => {
            setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
        }, 2000);
        
        return () => {
            clearInterval(timer);
            clearInterval(messageTimer);
        };
    }, []);
    
    return (
        <div className="neon-mist1 loader-container flex flex-col items-center justify-center">
            <div className="loader-logo">
                <img src="https://res.cloudinary.com/djoebsejh/image/upload/v1746277693/Pharos/b4l4e8yqnyde0p4tbs6r.png" alt="Logo" />
            </div>
            <div className="text-white my-4 text-center text-lg font-light">
                {loadingMessages[currentMessage]}
            </div>
            <div className="loader-progress w-72 h-2 bg-[#081F14] rounded-full overflow-hidden">
                <div 
                    className="loader-progress-bar h-full bg-[#1B7A57] rounded-full"
                    style={{ transform: `scaleX(${progress / 100})` }}
                ></div>
            </div>
            <div className="text-[#1B7A57] mt-2 text-sm font-medium">
                {progress}%
            </div>
        </div>
    );
};

export default Loader;
