import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const CustomCursor = () => {
  const { isDark } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'button' | 'text' | 'link' | 'image'>('default');
  
  // Mouse trail effect
  const trailPointsCount = 10;
  const [trailPoints, setTrailPoints] = useState<Array<{x: number, y: number}>>([]);
  const trailTimer = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Only show cursor after it has moved
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 800);
    
    // Start with empty trail points to prevent errors
    setTrailPoints([]);
    
    // Function to update mouse position with smoothing and magnetic effect
    const onMouseMove = (e: MouseEvent) => {
      // Safely update position when component is mounted
      if (document.body.contains(document.documentElement)) {
        let newX = e.clientX;
        let newY = e.clientY;
        
        // Apply magnetic effect for buttons and links
        const target = e.target as HTMLElement;
        const isButton = 
          target.tagName === 'BUTTON' || 
          target.closest('button') || 
          target.closest('[role="button"]');
        
        const isLink = 
          target.tagName === 'A' || 
          target.closest('a');
          
        if (isButton || isLink) {
          const element = isButton ? 
            (target.tagName === 'BUTTON' ? target : target.closest('button') || target.closest('[role="button"]')) : 
            (target.tagName === 'A' ? target : target.closest('a'));
            
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;
            
            const distanceFromCenterX = newX - elementCenterX;
            const distanceFromCenterY = newY - elementCenterY;
            
            // Determine if we're close to the element
            const distance = Math.sqrt(distanceFromCenterX * distanceFromCenterX + distanceFromCenterY * distanceFromCenterY);
            const magnetStrength = Math.min(rect.width, rect.height) * 1.5;
            
            if (distance < magnetStrength) {
              // Calculate magnetic pull (stronger as we get closer)
              const pull = 1 - (distance / magnetStrength);
              const pullX = distanceFromCenterX * pull * 0.3;
              const pullY = distanceFromCenterY * pull * 0.3;
              
              // Apply magnetic effect to cursor position
              newX = newX - pullX;
              newY = newY - pullY;
            }
          }
        }
        
        setMousePosition({ x: newX, y: newY });
        
        // Update trail points with debounce
        if (trailTimer.current) clearTimeout(trailTimer.current);
        
        trailTimer.current = setTimeout(() => {
          setTrailPoints(prev => {
            const newPoints = [...prev, { x: newX, y: newY }];
            return newPoints.slice(-trailPointsCount);
          });
        }, 10);
      }
    };
    
    // Check if hovering over specific elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for buttons and links
      const isButton = 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('[role="button"]');
      
      const isLink = 
        target.tagName === 'A' || 
        target.closest('a');
      
      const isInput = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA';
      
      const isImage = 
        target.tagName === 'IMG' ||
        target.closest('.image-container') ||
        target.closest('.project-card');
      
      // Handle text elements with data attributes
      const cursorTextElement = target.closest('[data-cursor-text]');
      
      if (cursorTextElement) {
        const text = cursorTextElement.getAttribute('data-cursor-text');
        setCursorText(text || '');
      } else {
        setCursorText('');
      }
      
      // Set appropriate cursor variant based on element type
      if (isButton) {
        setCursorVariant('button');
        setIsHovering(true);
      } else if (isLink) {
        setCursorVariant('link');
        setIsHovering(true);
      } else if (isInput) {
        setCursorVariant('text');
        setIsHovering(true);
      } else if (isImage) {
        setCursorVariant('image');
        setIsHovering(true);
      } else {
        setCursorVariant('default');
        setIsHovering(false);
      }
    };
    
    // Handle mouse clicks with ripple effect
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setTimeout(() => setIsClicking(false), 150);
    
    // Handle cursor leaving the window
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);
    
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
      if (trailTimer.current) clearTimeout(trailTimer.current);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);
  
  // Dynamic cursor styles based on state and theme
  const getCursorStyles = () => {
    const common = {
      x: mousePosition.x,
      y: mousePosition.y,
      opacity: isVisible ? 1 : 0
    };
    
    // Different animations based on cursor variant
    switch (cursorVariant) {
      case 'button':
        return {
          ...common,
          scale: isClicking ? [1, 1.4, 1] : 1.4,
          borderColor: isClicking ? 
            ['rgba(var(--primary), 0.5)', 'rgba(var(--primary), 0.8)', 'rgba(var(--primary), 0.3)'] : 
            'rgba(var(--primary), 0.5)',
          backgroundColor: 'rgba(var(--primary), 0.05)',
          transition: {
            scale: isClicking ? {
              duration: 0.4,
              times: [0, 0.2, 1]
            } : { duration: 0.2 },
            borderColor: isClicking ? {
              duration: 0.4,
              times: [0, 0.2, 1]
            } : { duration: 0.2 }
          }
        } as any; // Type assertion to avoid TypeScript errors with animation arrays
      case 'link':
        return {
          ...common,
          scale: isClicking ? 0.8 : 1.2,
          borderColor: 'rgba(var(--primary), 0.8)',
          backgroundColor: 'rgba(var(--primary), 0.1)',
        };
      case 'text':
        return {
          ...common,
          scale: 0.5,
          backgroundColor: 'rgba(var(--primary), 0.8)',
          mixBlendMode: isDark ? 'difference' : 'normal',
        };
      case 'image':
        return {
          ...common,
          scale: 1.5,
          backgroundColor: 'transparent',
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: 3,
          mixBlendMode: 'difference',
        };
      default:
        return {
          ...common,
          scale: isClicking ? 0.8 : 1,
          borderColor: 'rgba(var(--primary), 0.8)',
          backgroundColor: 'transparent',
        };
    }
  };
  
  // Create trail points with decreasing opacity
  const getTrailStyles = (index: number) => {
    const point = trailPoints[trailPoints.length - 1 - index] || { x: 0, y: 0 };
    const opacity = (trailPointsCount - index) / (trailPointsCount * 1.5);
    const scale = (trailPointsCount - index) / trailPointsCount * 0.6;
    
    return {
      x: point.x, // No need for offset since we use transform in the className
      y: point.y,
      opacity,
      scale,
    };
  };
  
  return (
    <>
      {/* Add a class to the body to hide the default cursor */}
      <style dangerouslySetInnerHTML={{
        __html: `
          body {
            cursor: ${isVisible ? 'none' : 'auto'};
          }
          a, button, input, textarea, [role="button"], .interactive {
            cursor: ${isVisible ? 'none' : 'pointer'} !important;
          }
          img, .image-container, .project-card {
            cursor: ${isVisible ? 'none' : 'default'} !important;
          }
          
          /* Add a data attribute to specify custom cursor text */
          [data-cursor-text] {
            cursor: none !important;
          }
        `
      }} />
    
      {/* Trail effect */}
      {trailPoints.map((_, index) => index > 0 && (
        <motion.div
          key={`trail-${index}`}
          className="fixed transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9998]"
          animate={getTrailStyles(index)}
          transition={{
            type: 'tween',
            duration: 0.05,
            ease: 'linear'
          }}
        />
      ))}
      
      {/* Main cursor */}
      <motion.div
        className="fixed transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 pointer-events-none z-[9999] flex items-center justify-center text-xs font-medium"
        animate={{
          ...getCursorStyles(),
          x: mousePosition.x,
          y: mousePosition.y,
        } as any}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 25,
          mass: 0.2
        }}
      >
        {/* Optional text inside cursor */}
        {cursorText && (
          <span className="text-white text-xs whitespace-nowrap px-2 py-1 rounded-full bg-primary bg-opacity-90">
            {cursorText}
          </span>
        )}
      </motion.div>
      
      {/* Click effect ripple */}
      {isClicking && (
        <motion.div
          className="fixed transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary pointer-events-none z-[9998]"
          initial={{ 
            opacity: 0.5, 
            scale: 0.4,
            x: mousePosition.x,
            y: mousePosition.y
          }}
          animate={{ 
            opacity: 0,
            scale: 2
          }}
          transition={{
            duration: 0.5,
            ease: 'easeOut'
          }}
          exit={{ opacity: 0 }}
        />
      )}
    </>
  );
};

export default CustomCursor;