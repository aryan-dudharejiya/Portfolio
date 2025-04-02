import { useState, useEffect, lazy, Suspense } from "react";
import SEOHead from "@/components/SEOHead";
import { Box, AlertTriangle, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load the 3D model component
const OptimizedThreeDModel = lazy(
  () => import("@/components/three/ThreeDModel")
);

// Loading placeholder
const ModelLoading = () => (
  <div className="w-full h-full flex items-center justify-center bg-card">
    <div className="text-center p-8">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading 3D model...</p>
    </div>
  </div>
);

const ModelDemo = () => {
  const [modelType, setModelType] = useState<
    "geometric" | "abstract" | "showcase" | "product"
  >("geometric");
  const [quality, setQuality] = useState<
    "low" | "medium" | "high" | "ultra" | "auto"
  >(
    "auto" // Changed default to auto-detect for better performance
  );
  const [postProcessing, setPostProcessing] = useState(false); // Default to off for better performance
  const [hasError, setHasError] = useState(false);
  const [devicePerformance, setDevicePerformance] = useState<
    "high" | "medium" | "low"
  >("medium");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Detect device performance on mount
  useEffect(() => {
    // Simple performance detection
    const detectPerformance = () => {
      // Check for mobile device
      if (isMobile) {
        return "low";
      }

      // Check for CPU cores
      const cpuCores = navigator.hardwareConcurrency || 2;

      if (cpuCores >= 8) {
        return "high";
      } else if (cpuCores >= 4) {
        return "medium";
      } else {
        return "low";
      }
    };

    setDevicePerformance(detectPerformance());
  }, [isMobile]);

  // Catch any rendering errors from the 3D model
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("3D rendering error:", event);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  // If there's an error, show a fallback UI
  if (hasError) {
    return (
      <div className="container mx-auto py-20 px-4 min-h-screen flex flex-col items-center justify-center">
        <SEOHead
          title="3D Model Showcase | Error"
          description="There was an error loading the 3D showcase."
        />

        <div className="text-center max-w-md mx-auto">
          <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
          <h1 className="text-3xl font-bold mb-4">3D Rendering Error</h1>
          <p className="mb-6 text-muted-foreground">
            There was an issue loading the 3D visualization. This could be due
            to browser compatibility or hardware constraints.
          </p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <SEOHead
        title="3D Model Showcase | High-Performance 3D Models"
        description="Experience high-performance, optimized 3D models that provide stunning visuals with flawless performance on all devices."
      />

      <h1 className="text-4xl font-bold text-center mb-8">
        High-Performance 3D Showcase
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="col-span-1 md:col-span-2 bg-card rounded-xl shadow-lg overflow-hidden h-[500px]">
          <Suspense fallback={<ModelLoading />}>
            <OptimizedThreeDModel
              modelType={modelType}
              quality={quality}
              enablePostProcessing={postProcessing}
              className="w-full h-full"
            />
          </Suspense>
        </div>

        <div className="space-y-6 p-6 bg-card rounded-xl shadow-lg">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Model Controls</h2>
            <div className="flex items-center gap-2 mb-4">
              <Cpu size={16} className="text-primary" />
              <p className="text-sm">
                <span className="font-medium">Device Performance:</span>{" "}
                <span
                  className={
                    devicePerformance === "high"
                      ? "text-green-500"
                      : devicePerformance === "medium"
                      ? "text-amber-500"
                      : "text-red-500"
                  }
                >
                  {devicePerformance.charAt(0).toUpperCase() +
                    devicePerformance.slice(1)}
                </span>
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Experience top-tier 3D visualization with uncompromising
              performance. These models are optimized for all devices while
              maintaining stunning visuals.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Model Type
              </label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value as any)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
              >
                <option value="geometric">Geometric</option>
                <option value="abstract">Abstract</option>
                <option value="showcase">Showcase</option>
                <option value="product">Product</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as any)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
              >
                <option value="auto">Auto (Recommended)</option>
                <option value="low">Low (Mobile-Optimized)</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="ultra">Ultra (High-End Devices)</option>
              </select>
              {quality === "ultra" && devicePerformance !== "high" && (
                <p className="text-xs text-yellow-500 mt-1">
                  Ultra quality may impact performance on your device
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Post-Processing</label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={postProcessing}
                  onChange={() => setPostProcessing(!postProcessing)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-xl font-semibold mb-2">Model Information</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Model interactions are disabled</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Models rotate automatically for viewing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Try different quality settings to optimize for your device
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Technical Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2">Performance Optimizations</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Adaptive quality based on device capability</li>
              <li>• Dynamic geometry simplification</li>
              <li>• Efficient memory usage with proper disposal</li>
              <li>• Frame rate control for consistent performance</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Visual Enhancements</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Physically-based materials and lighting</li>
              <li>• Optimized real-time shadows</li>
              <li>• Dynamic material response to interaction</li>
              <li>• Efficient particle systems</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Technical Features</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• WebGL with Three.js for optimal performance</li>
              <li>• Automatic memory cleanup</li>
              <li>• Frustum culling for improved rendering</li>
              <li>• Instanced rendering for complex scenes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDemo;
