import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "./pages/home";
import { useEffect, useState, lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import SEOHead from "./components/SEOHead";
import { ThemeProvider } from "./context/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import {
  SkipToContent,
  MainContent,
} from "./components/AccessibilityComponents";

// Lazy load the project details page for better performance
const ProjectDetails = lazy(() => import("./pages/project-details"));

// Enhanced loading fallback with progress indication
const LoadingFallback = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
);

// Preload essential modules in the background
const preloadEssentialModules = () => {
  // Execute preloading after initial render
  setTimeout(() => {
    // Any preloading needed
  }, 2000); // Delay preloading to prioritize main content
};

function Router() {
  // State to track route changes
  const [activeRoute, setActiveRoute] = useState("");

  // Listen to route changes
  useEffect(() => {
    const checkRoute = () => {
      setActiveRoute(window.location.pathname);
    };

    // Check initially
    checkRoute();

    // Listen for route changes
    window.addEventListener("popstate", checkRoute);

    return () => {
      window.removeEventListener("popstate", checkRoute);
    };
  }, []);

  return (
    <Suspense fallback={<LoadingFallback message="Loading..." />}>
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
      const initialLoader = document.querySelector(".loading-container");
      if (initialLoader && initialLoader.parentNode) {
        initialLoader.parentNode.removeChild(initialLoader);
      }

      // Start preloading modules for better performance
      preloadEssentialModules();
    }, 500); // Reduced timeout

    return () => {
      document.body.style.overflowX = "";
      clearTimeout(timer);
    };
  }, []);

  // Make sure we always render something, even if we're loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <HelmetProvider>
          <SEOHead />
          <SkipToContent />
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
