import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if cursor is over a clickable element
      const target = e.target as HTMLElement;
      const clickableElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
      
      if (
        clickableElements.includes(target.tagName) ||
        target.closest('a') ||
        target.closest('button') ||
        target.onclick ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    const onMouseDown = () => {
      setIsClicking(true);
    };

    const onMouseUp = () => {
      setIsClicking(false);
    };

    const onMouseLeave = () => {
      setIsHidden(true);
    };

    const onMouseEnter = () => {
      setIsHidden(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  // Media query for mobile devices
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Don't render custom cursor on mobile devices
  if (isMobile) return null;

  return (
    <>
      {/* Main cursor ring */}
      <motion.div
        className="fixed z-50 pointer-events-none rounded-full"
        style={{
          left: position.x,
          top: position.y,
          backgroundColor: 'transparent',
          border: `1.5px solid ${theme === 'dark' ? '#EC4899' : '#6366F1'}`, // Theme-based colors
          opacity: isHidden ? 0 : 0.8,
        }}
        animate={{
          width: isPointer ? 40 : isClicking ? 16 : 24,
          height: isPointer ? 40 : isClicking ? 16 : 24,
          x: isPointer ? -20 : isClicking ? -8 : -12,
          y: isPointer ? -20 : isClicking ? -8 : -12,
          opacity: isHidden ? 0 : 0.8,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed z-50 pointer-events-none rounded-full"
        style={{
          left: position.x,
          top: position.y,
          backgroundColor: theme === 'dark' ? '#EC4899' : '#6366F1', // Theme-based colors
          opacity: isHidden ? 0 : isPointer ? 0.5 : 0.8,
        }}
        animate={{
          width: isPointer ? 6 : isClicking ? 12 : 6,
          height: isPointer ? 6 : isClicking ? 12 : 6,
          x: -3,
          y: -3,
          opacity: isHidden ? 0 : isPointer ? 0.5 : 0.8,
          scale: isClicking ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      />
    </>
  );
};

export default CustomCursor;