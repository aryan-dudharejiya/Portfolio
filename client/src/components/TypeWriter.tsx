import { useEffect, useState, useRef } from 'react';

interface TypeWriterProps {
  texts: string[];
  className?: string;
  speed?: number;
  loop?: boolean;
  delay?: number;
}

const TypeWriter = ({
  texts,
  className = '',
  speed = 100,
  loop = true,
  delay = 1500
}: TypeWriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  
  // Refs to track timeouts
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Handle cleanup of timeouts
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // If there are no texts, don't do anything
    if (texts.length === 0) return;
    
    // Get the current text
    const currentText = texts[textIndex];
    
    // If waiting, don't type or delete
    if (isWaiting) return;
    
    // Set typing/deleting speed (deleting is generally faster)
    const typingSpeed = isDeleting ? speed / 2 : speed;
    
    // Start typing process
    if (!isDeleting && displayText !== currentText) {
      // Type the next character
      typingTimeoutRef.current = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length + 1));
      }, typingSpeed);
    } 
    // Start deleting process
    else if (isDeleting && displayText !== '') {
      // Delete the last character
      typingTimeoutRef.current = setTimeout(() => {
        setDisplayText(displayText.substring(0, displayText.length - 1));
      }, typingSpeed);
    } 
    // Handle transition between typing and deleting
    else if (!isDeleting && displayText === currentText) {
      // Pause at full word before deleting
      setIsWaiting(true);
      delayTimeoutRef.current = setTimeout(() => {
        setIsDeleting(true);
        setIsWaiting(false);
      }, delay);
    } 
    // Handle transition to next text
    else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      
      // Move to next text or loop back to first
      setTextIndex((textIndex + 1) % texts.length);
      
      // If we've gone through all texts once and loop is false, stop
      if (textIndex === texts.length - 1 && !loop) {
        return;
      }
    }
  }, [displayText, isDeleting, textIndex, texts, speed, loop, delay, isWaiting]);
  
  // Add a blinking cursor effect
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    // Blink the cursor every 500ms
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  return (
    <span className={className}>
      {displayText}
      <span 
        className="inline-block w-[2px] h-5 ml-1 bg-primary animate-pulse"
        style={{ opacity: showCursor ? 1 : 0 }}
      ></span>
    </span>
  );
};

export default TypeWriter;