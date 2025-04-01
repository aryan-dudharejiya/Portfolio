import { Button } from "@/components/ui/button";
import { Home, AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function NotFound() {
  const { isDark } = useTheme();
  const [countdown, setCountdown] = useState(10);
  
  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = '/';
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);
  
  return (
    <>
      <SEOHead 
        title="Page Not Found | 404 Error"
        description="The page you are looking for doesn't exist or has been moved."
      />
      
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0" />
        
        {/* Glowing orbs for visual interest */}
        <div className="absolute top-1/4 -left-20 w-60 h-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />
        
        {/* Content */}
        <motion.div 
          className="relative z-10 max-w-md w-full mx-auto text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Error code */}
          <motion.h1 
            className="text-9xl font-bold text-primary/80 mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 10 
            }}
          >
            404
          </motion.h1>
          
          {/* Icon */}
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <AlertTriangle size={60} className="text-secondary" />
          </motion.div>
          
          {/* Message */}
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved to another URL.
          </p>
          
          {/* Countdown */}
          <p className="text-sm text-muted-foreground mb-6">
            Redirecting to homepage in <span className="text-primary font-semibold">{countdown}</span> seconds...
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button
                variant="default"
                className="flex gap-2 items-center"
              >
                <Home size={18} />
                Return Home
              </Button>
            </Link>
            
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex gap-2 items-center"
            >
              <ArrowLeft size={18} />
              Go Back
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="ghost"
              className="flex gap-2 items-center"
            >
              <RotateCcw size={18} />
              Reload Page
            </Button>
          </div>
        </motion.div>
        
        {/* Footer */}
        <div className="absolute bottom-6 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} John Doe Portfolio
        </div>
      </div>
    </>
  );
}
