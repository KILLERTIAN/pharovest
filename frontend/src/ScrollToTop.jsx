import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; 
import { useLocation } from 'react-router-dom'; 
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation(); 

  useEffect(() => {

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };


    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };


    window.addEventListener('scroll', handleScroll);

    scrollToTop();


    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]); 

  return (
    isVisible && (
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
        className="fixed bottom-6 right-6 bg-[#2FB574] text-white p-3 rounded-full shadow-lg hover:bg-[#31a76e] transition duration-300 z-[999]"
        aria-label="Scroll to top"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ChevronUp className="h-5 w-5" />
      </motion.button>
    )
  );
};

export default ScrollToTop;
