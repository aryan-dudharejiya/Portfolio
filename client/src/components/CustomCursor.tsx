import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show custom cursor on desktop
    if (window.innerWidth > 768) {
      setIsVisible(true);
      
      const onMouseMove = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
      };

      const onMouseEnter = () => {
        setIsVisible(true);
      };

      const onMouseLeave = () => {
        setIsVisible(false);
      };

      // Track hover state on interactive elements
      const handleLinkHoverStart = () => setIsHovering(true);
      const handleLinkHoverEnd = () => setIsHovering(false);

      const links = document.querySelectorAll('a, button');
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
      
      links.forEach(link => {
        link.addEventListener('mouseenter', handleLinkHoverStart);
        link.addEventListener('mouseleave', handleLinkHoverEnd);
      });

      return () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseenter', onMouseEnter);
        document.removeEventListener('mouseleave', onMouseLeave);
        
        links.forEach(link => {
          link.removeEventListener('mouseenter', handleLinkHoverStart);
          link.removeEventListener('mouseleave', handleLinkHoverEnd);
        });
      };
    }
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="custom-cursor hidden lg:block"
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 200,
        mass: 0.5,
      }}
    />
  );
};

export default CustomCursor;
