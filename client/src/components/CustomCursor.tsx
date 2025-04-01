import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only show cursor after it has moved
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    
    // Function to update mouse position
    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // Check if hovering over clickable elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('[role="button"]');
      
      setIsHovering(!!isClickable);
    };
    
    // Handle mouse clicks
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    
    // Handle cursor leaving the window
    const onMouseLeave = () => {
      setIsVisible(false);
    };
    
    const onMouseEnter = () => {
      setIsVisible(true);
    };
    
    // Register event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    
    // Remove event listeners on cleanup
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);
  
  return (
    <>
      {/* Add a class to the body to hide the default cursor */}
      <style dangerouslySetInnerHTML={{
        __html: `
          body {
            cursor: ${isVisible ? 'none' : 'auto'};
          }
          a, button, input, textarea, [role="button"] {
            cursor: ${isVisible ? 'none' : 'pointer'} !important;
          }
        `
      }} />
    
      {/* Outer circle cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
          opacity: isVisible ? 1 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 28,
          mass: 0.5
        }}
      />
      
      {/* Inner dot cursor */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : isClicking ? 1.2 : 1,
          opacity: isVisible ? 1 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.2
        }}
      />
    </>
  );
};

export default CustomCursor;