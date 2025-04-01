import { useEffect, useRef } from "react";

interface ScrollAnimationOptions {
  threshold?: number;
  delay?: number;
  once?: boolean;
}

export const useScrollAnimation = (
  options: ScrollAnimationOptions = {}
) => {
  const {
    threshold = 0.1,
    delay = 0,
    once = true,
  } = options;
  
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-in");
              
              if (once) {
                observer.unobserve(entry.target);
              }
            }, delay);
          } else if (!once) {
            entry.target.classList.remove("animate-in");
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -100px 0px"
      }
    );
    
    observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, delay, once]);
  
  return ref;
};
