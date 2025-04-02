import { useRef, useEffect, useState, lazy, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { Box, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load the 3D model component for better initial page load
const OptimizedThreeDModel = lazy(
  () => import("@/components/three/ThreeDModel")
);

const ModelShowcase = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const isMobile = useIsMobile();
  const [hasError, setHasError] = useState(false);
  const [shouldRender3D, setShouldRender3D] = useState(false);

  // Catch any rendering errors from the 3D model
  useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  // Only render the 3D model when it comes into view
  useEffect(() => {
    if (isInView && !shouldRender3D) {
      // Add a small delay to ensure smooth scrolling
      const timer = setTimeout(() => {
        setShouldRender3D(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isInView, shouldRender3D]);

  return (
    <section id="model-showcase" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          className="flex flex-col lg:flex-row items-center gap-12"
          ref={containerRef}
        >
          {/* Text content */}
          <motion.div
            className="lg:w-1/2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Top-Tier 3D Visualization
              </h2>
              <p className="text-lg text-muted-foreground">
                Experience stunning 3D models with uncompromising performance on
                any device. Our optimized rendering engine ensures smooth,
                flawless visuals at all times.
              </p>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-1 mt-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-primary"
                  >
                    <path
                      d="M13.3334 4L6.00002 11.3333L2.66669 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Optimized for high performance on all devices</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-1 mt-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-primary"
                  >
                    <path
                      d="M13.3334 4L6.00002 11.3333L2.66669 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Physically-based rendering with advanced lighting</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-1 mt-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-primary"
                  >
                    <path
                      d="M13.3334 4L6.00002 11.3333L2.66669 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Interactive elements with responsive animations</span>
              </li>
            </ul>

            <Link href="/3d-showcase">
              <Button className="mt-4 group">
                <span>Explore 3D Showcase</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* 3D Model */}
          <motion.div
            className="lg:w-1/2 h-[400px] lg:h-[500px] bg-card rounded-xl overflow-hidden shadow-lg border"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            {!hasError ? (
              <>
                {shouldRender3D ? (
                  <Suspense fallback={<ModelPlaceholder />}>
                    <OptimizedThreeDModel
                      modelType="abstract"
                      quality={isMobile ? "low" : "medium"} // Use lower quality settings for better performance
                      enablePostProcessing={false} // Disable post-processing for better performance
                      autoRotate={true}
                      className="w-full h-full"
                    />
                  </Suspense>
                ) : (
                  <ModelPlaceholder />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/30 text-muted-foreground text-center p-6">
                <div>
                  <Box size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2">3D Visualization</h3>
                  <p>
                    View our complete 3D showcase for interactive models and
                    demos.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Simple placeholder component shown while the 3D model is loading
const ModelPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground">
    <div className="text-center">
      <Box size={32} className="mx-auto mb-2 opacity-40" />
      <p className="text-sm">Loading visualization...</p>
    </div>
  </div>
);

export default ModelShowcase;
