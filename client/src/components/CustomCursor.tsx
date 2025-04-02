import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import gsap from 'gsap';

const CustomCursor = () => {
  const { isDark } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'button' | 'text' | 'link' | 'image'>('default');
  
  // Mouse trail effect with more points for richer trail
  const trailPointsCount = 15;
  const [trailPoints, setTrailPoints] = useState<Array<{x: number, y: number}>>([]);
  
  // Refs for performance optimization
  const animationFrameId = useRef<number | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const cursorVariantRef = useRef<'default' | 'button' | 'text' | 'link' | 'image'>('default');
  const lastUpdateTimeRef = useRef(0);
  
  // Enhanced mouse position tracking with requestAnimationFrame
  useEffect(() => {
    // Only show cursor after it has moved
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    // Function to detect hover over interactive elements and apply magnetic effect
    const onMouseMove = (e: MouseEvent) => {
      // Store raw position in ref for access in animation frame
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      
      // Calculate magnetic effect for buttons and links
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
          
          const distanceFromCenterX = mousePosRef.current.x - elementCenterX;
          const distanceFromCenterY = mousePosRef.current.y - elementCenterY;
          
          // Determine if we're close to the element
          const distance = Math.sqrt(distanceFromCenterX * distanceFromCenterX + distanceFromCenterY * distanceFromCenterY);
          const magnetStrength = Math.min(rect.width, rect.height) * 1.5;
          
          if (distance < magnetStrength) {
            // Calculate magnetic pull (stronger as we get closer)
            const pull = 1 - (distance / magnetStrength);
            const pullX = distanceFromCenterX * pull * 0.4; // Stronger effect
            const pullY = distanceFromCenterY * pull * 0.4;
            
            // Apply magnetic effect to cursor position
            mousePosRef.current.x = mousePosRef.current.x - pullX;
            mousePosRef.current.y = mousePosRef.current.y - pullY;
          }
        }
      }
      
      // If animation frame not yet running, start it
      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(updateCursorPosition);
      }
    };
    
    // Using requestAnimationFrame for ultra-smooth cursor movement
    const updateCursorPosition = (timestamp: number) => {
      // Calculate delta time for consistent animation regardless of frame rate
      const deltaTime = timestamp - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = timestamp;
      
      // Only update at a maximum of 60fps for performance
      if (deltaTime > 0) {
        // Calculate easing factor based on delta time
        // Lower value = more instant tracking
        const easeAmount = Math.min(0.3, deltaTime / 16); // 16ms = ~60fps
        
        // Calculate target position with smoothed easing
        targetPosRef.current.x += (mousePosRef.current.x - targetPosRef.current.x) * easeAmount;
        targetPosRef.current.y += (mousePosRef.current.y - targetPosRef.current.y) * easeAmount;
        
        // Update position state
        setMousePosition({
          x: Math.round(targetPosRef.current.x * 100) / 100,
          y: Math.round(targetPosRef.current.y * 100) / 100
        });
        
        // Update trail points for smoother trail
        setTrailPoints(prev => {
          // Add current position to the beginning
          const newPoints = [
            { x: targetPosRef.current.x, y: targetPosRef.current.y },
            ...prev
          ];
          
          // Keep only the last N points
          return newPoints.slice(0, trailPointsCount);
        });
      }
      
      // Continue animation loop
      animationFrameId.current = requestAnimationFrame(updateCursorPosition);
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
        cursorVariantRef.current = 'button';
        setIsHovering(true);
        isHoveringRef.current = true;
      } else if (isLink) {
        setCursorVariant('link');
        cursorVariantRef.current = 'link';
        setIsHovering(true);
        isHoveringRef.current = true;
      } else if (isInput) {
        setCursorVariant('text');
        cursorVariantRef.current = 'text';
        setIsHovering(true);
        isHoveringRef.current = true;
      } else if (isImage) {
        setCursorVariant('image');
        cursorVariantRef.current = 'image';
        setIsHovering(true);
        isHoveringRef.current = true;
      } else {
        setCursorVariant('default');
        cursorVariantRef.current = 'default';
        setIsHovering(false);
        isHoveringRef.current = false;
      }
    };
    
    // Enhanced click effects with ripple effect and haptic feedback
    const onMouseDown = () => {
      setIsClicking(true);
      
      // Add a subtle scale effect to the page to simulate haptic feedback
      gsap.to('body', {
        scale: 0.995,
        duration: 0.1,
        ease: 'power2.out'
      });
    };
    
    const onMouseUp = () => {
      setTimeout(() => setIsClicking(false), 120);
      
      // Restore page scale with a slight bounce effect
      gsap.to('body', {
        scale: 1,
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)'
      });
    };
    
    // Handle cursor leaving the window with smooth transition
    const onMouseLeave = () => {
      setIsVisible(false);
      
      // Add transition effect as cursor exits
      gsap.to(targetPosRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3
      });
    };
    
    const onMouseEnter = () => {
      setIsVisible(true);
      
      // Add entrance effect when cursor re-enters
      gsap.from(targetPosRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3
      });
    };
    
    // Register event listeners
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    
    // Start animation loop
    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(updateCursorPosition);
    }
    
    // Remove event listeners and cancel animation on cleanup
    return () => {
      clearTimeout(timeout);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      
      // Reset body scale
      gsap.set('body', { scale: 1 });
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
        } as any; // Type assertion for animation arrays
      case 'link':
        return {
          ...common,
          scale: isClicking ? 0.8 : 1.2,
          borderColor: 'rgba(var(--primary), 0.8)',
          backgroundColor: 'rgba(var(--primary), 0.1)',
          borderWidth: 2,
          boxShadow: '0 0 8px rgba(var(--primary), 0.5)'
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
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
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
  
  // Enhanced trail with motion blur effect
  const getTrailStyles = (index: number) => {
    const point = trailPoints[index] || { x: 0, y: 0 };
    // Opacity decreases faster with larger trail
    const opacity = (trailPointsCount - index) / (trailPointsCount * 2);
    // Size decreases with distance
    const scale = (trailPointsCount - index) / trailPointsCount * 0.6;
    
    return {
      x: point.x,
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
          
          /* Motion blur effect for cursor trail */
          @keyframes trailFade {
            from { opacity: 0.7; transform: scale(0.8); }
            to { opacity: 0; transform: scale(0.2); }
          }
        `
      }} />
    
      {/* Enhanced trail effect with more dots and motion blur */}
      <AnimatePresence>
        {trailPoints.map((_, index) => index > 0 && (
          <motion.div
            key={`trail-${index}`}
            className="fixed transform -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-[9998]"
            style={{
              width: `${Math.max(2, 12 - index)}px`,
              height: `${Math.max(2, 12 - index)}px`,
              background: `rgba(var(--primary), ${0.8 - index * 0.05})`,
              filter: `blur(${Math.min(2, index * 0.2)}px)`,
              boxShadow: index < 5 ? `0 0 ${6 - index}px rgba(var(--primary), ${0.3 - index * 0.05})` : 'none'
            }}
            animate={getTrailStyles(index)}
            transition={{
              type: 'tween',
              duration: 0.02,
              ease: 'linear'
            }}
            exit={{ opacity: 0, scale: 0 }}
          />
        ))}
      </AnimatePresence>
      
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
          <motion.span 
            className="text-white text-xs whitespace-nowrap px-2 py-1 rounded-full bg-primary bg-opacity-90"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
      
      {/* Enhanced click effect ripple with outward wave */}
      <AnimatePresence>
        {isClicking && (
          <>
            {/* Inner ripple */}
            <motion.div
              className="fixed transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary pointer-events-none z-[9997]"
              initial={{ 
                opacity: 0.8, 
                scale: 0.4,
                width: '12px',
                height: '12px',
                x: mousePosition.x,
                y: mousePosition.y
              }}
              animate={{ 
                opacity: 0,
                scale: 2.5
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: 'easeOut'
              }}
            />
            
            {/* Outer ripple - delayed for wave effect */}
            <motion.div
              className="fixed transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary pointer-events-none z-[9996]"
              initial={{ 
                opacity: 0.3, 
                scale: 0.2,
                width: '24px',
                height: '24px',
                x: mousePosition.x,
                y: mousePosition.y
              }}
              animate={{ 
                opacity: 0,
                scale: 3
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
                delay: 0.1
              }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;