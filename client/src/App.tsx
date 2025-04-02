import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "./pages/home";
import { useEffect, useState, lazy, Suspense } from "react";
import CustomCursor from "./components/CustomCursor";
import { HelmetProvider } from "react-helmet-async";
import SEOHead from "./components/SEOHead";
import { ThemeProvider } from "./context/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { SkipToContent, MainContent } from "./components/AccessibilityComponents";

// Lazy load the project details page for better performance
const ProjectDetails = lazy(() => import("./pages/project-details"));

// Lazy loading for better performance
const LoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        {/* Project details route */}
        <Route path="/projects/:id" component={ProjectDetails} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Prevent horizontal scroll and handle initial loading
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    
    // Hide loader after everything is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Remove initial loader
      const initialLoader = document.querySelector('.loading-container');
      if (initialLoader && initialLoader.parentNode) {
        initialLoader.parentNode.removeChild(initialLoader);
      }
    }, 1000);
    
    return () => {
      document.body.style.overflowX = "";
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return null; // Initial loader is in the HTML already
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <HelmetProvider>
          <SEOHead />
          <SkipToContent />
          <CustomCursor />
          <MainContent className="flex flex-col min-h-screen overflow-x-hidden">
            <Router />
          </MainContent>
          <Toaster />
        </HelmetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
