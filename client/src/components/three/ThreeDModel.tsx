import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';

interface ThreeDModelProps {
  scrollTrigger?: boolean;
}

const ThreeDModel = ({ scrollTrigger = false }: ThreeDModelProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>(0);
  const modelRef = useRef<THREE.Group | null>(null);
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  // State for interactive features
  const [isHovered, setIsHovered] = useState(false);
  const [interactionStartPos, setInteractionStartPos] = useState({ x: 0, y: 0 });
  const [modelRotation, setModelRotation] = useState({ x: -Math.PI / 12, y: 0, z: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Optimize rendering for mobile devices
  const getOptimalPixelRatio = () => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    return isMobile ? Math.min(devicePixelRatio, 1.5) : Math.min(devicePixelRatio, 2);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous animation frame if it exists
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup with optimizations
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: !isMobile, // Disable antialiasing on mobile for performance
      powerPreference: 'high-performance',
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(getOptimalPixelRatio());
    // For Three.js v0.149.0 or later
    // renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    
    // Clear the container before appending
    if (containerRef.current.childElementCount > 0) {
      containerRef.current.innerHTML = '';
    }
    containerRef.current.appendChild(renderer.domElement);

    // Lighting with optimization
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create simplified laptop model
    const laptopGroup = new THREE.Group();
    
    // Use simpler geometries on mobile
    const baseGeometry = new THREE.BoxGeometry(
      3, 
      0.2, 
      2, 
      isMobile ? 1 : 2, 
      isMobile ? 1 : 2, 
      isMobile ? 1 : 2
    );
    
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0x333333 : 0xf0f0f0,
      metalness: 0.5,
      roughness: 0.2
    });
    
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    laptopGroup.add(base);

    // Create screen of laptop
    const screenWidth = 3;
    const screenHeight = 2;
    const screenDepth = 0.05;
    
    const screenBaseGeometry = new THREE.BoxGeometry(
      screenWidth, 
      screenHeight, 
      screenDepth,
      isMobile ? 1 : 2,
      isMobile ? 1 : 2,
      isMobile ? 1 : 2
    );
    
    const screenBaseMaterial = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0x444444 : 0xdddddd,
      metalness: 0.5,
      roughness: 0.2
    });
    
    const screenBase = new THREE.Mesh(screenBaseGeometry, screenBaseMaterial);
    screenBase.position.y = 1.1; // Position above the base
    screenBase.position.z = -0.97; // Move back so it's connected to the base
    screenBase.rotation.x = Math.PI / 6; // Tilt it a bit
    laptopGroup.add(screenBase);

    // Create screen display (the actual screen part)
    const screenDisplayGeometry = new THREE.PlaneGeometry(screenWidth - 0.2, screenHeight - 0.2);
    const screenDisplayMaterial = new THREE.MeshBasicMaterial({
      color: theme === 'dark' ? 0x6366F1 : 0x6366F1, // Primary color
      opacity: 0.9,
      transparent: true
    });
    
    const screenDisplay = new THREE.Mesh(screenDisplayGeometry, screenDisplayMaterial);
    screenDisplay.position.set(0, 0, 0.03); // Slightly in front of the screen base
    screenBase.add(screenDisplay); // Make it a child of the screen base

    // Create code pattern texture for the screen - less detailed on mobile
    const createCodePattern = () => {
      const canvas = document.createElement('canvas');
      const size = isMobile ? 128 : 256; // Lower resolution on mobile
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = theme === 'dark' ? '#111111' : '#f8f8f8';
        ctx.fillRect(0, 0, size, size);
        
        ctx.font = isMobile ? '4px monospace' : '6px monospace';
        ctx.fillStyle = theme === 'dark' ? '#EC4899' : '#6366F1'; // Use theme colors
        
        // Generate random code-like pattern - fewer lines on mobile
        const lineSpacing = isMobile ? 12 : 8;
        for (let y = 5; y < size; y += lineSpacing) {
          let line = '';
          for (let i = 0; i < (isMobile ? 6 : 10); i++) {
            line += Math.random() > 0.5 ? '1' : '0';
          }
          ctx.fillText(line, 5, y);
          
          if (y % 24 === 5 && !isMobile) { // Every few lines, skip on mobile
            ctx.fillText('function()', 50, y);
          }
          
          if (y % 32 === 5 && !isMobile) { // Some different patterns, skip on mobile
            ctx.fillText('{ return }', 110, y);
          }
        }
        
        return new THREE.CanvasTexture(canvas);
      }
      
      return null;
    };
    
    const codeTexture = createCodePattern();
    if (codeTexture) {
      screenDisplayMaterial.map = codeTexture;
      screenDisplayMaterial.needsUpdate = true;
    }

    // Add keyboard keys on the base (skip on mobile for performance)
    if (!isMobile) {
      const keySize = 0.15;
      const keySpacing = 0.02;
      const keysPerRow = 15;
      const numRows = 5;
      const keyStartX = -(keySize + keySpacing) * (keysPerRow - 1) / 2;
      const keyStartZ = -(keySize + keySpacing) * (numRows - 1) / 2;
      
      const keyGeometry = new THREE.BoxGeometry(keySize, keySize / 3, keySize);
      const keyMaterial = new THREE.MeshStandardMaterial({
        color: theme === 'dark' ? 0x222222 : 0xeeeeee,
        metalness: 0.3,
        roughness: 0.8
      });
      
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < keysPerRow; col++) {
          const key = new THREE.Mesh(keyGeometry, keyMaterial);
          key.position.set(
            keyStartX + col * (keySize + keySpacing),
            0.15, // Slightly above the base
            keyStartZ + row * (keySize + keySpacing)
          );
          base.add(key);
        }
      }
    }

    // Add the laptop to the scene
    laptopGroup.position.y = -0.5; // Lower it a bit
    laptopGroup.rotation.x = modelRotation.x;
    laptopGroup.rotation.y = modelRotation.y;
    laptopGroup.rotation.z = modelRotation.z;
    scene.add(laptopGroup);
    modelRef.current = laptopGroup;

    // Animation function with performance optimizations
    let lastTime = 0;
    const animate = (time: number) => {
      if (!modelRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      // Apply constant gentle rotation when not being interacted with
      if (!scrollTrigger && !isHovered && !isDragging) {
        modelRef.current.rotation.y += 0.005;
      }
      
      // Limit framerate on mobile for performance
      const elapsed = time - lastTime;
      if (isMobile && elapsed < 33) { // ~30fps on mobile
        frameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTime = time;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);

    // Handle mouse/touch movement for interactive rotation
    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      if (!modelRef.current || !isDragging) return;
      
      const clientX = 'touches' in event 
        ? event.touches[0].clientX 
        : (event as MouseEvent).clientX;
        
      const clientY = 'touches' in event 
        ? event.touches[0].clientY 
        : (event as MouseEvent).clientY;
      
      const deltaX = clientX - interactionStartPos.x;
      const deltaY = clientY - interactionStartPos.y;
      
      // Update model rotation based on drag distance
      const newRotationY = modelRotation.y + (deltaX * 0.01);
      const newRotationX = Math.max(
        -Math.PI / 4, 
        Math.min(Math.PI / 4, modelRotation.x + (deltaY * 0.01))
      );
      
      // Apply new rotation
      setModelRotation({
        x: newRotationX,
        y: newRotationY,
        z: modelRotation.z
      });
      
      if (modelRef.current) {
        gsap.to(modelRef.current.rotation, {
          x: newRotationX,
          y: newRotationY,
          duration: 0.5
        });
      }
      
      // Update start position for next move
      setInteractionStartPos({ x: clientX, y: clientY });
    };
    
    // Handle mouse hover effect
    const handlePointerEnter = () => {
      setIsHovered(true);
      
      // Add subtle hover animation
      if (modelRef.current) {
        gsap.to(modelRef.current.position, {
          y: -0.3, // Lift the model slightly
          duration: 0.5,
          ease: "power2.out"
        });
        
        // Add a subtle pulsing effect to indicate interactivity
        gsap.to(modelRef.current.scale, {
          x: 1.05,
          y: 1.05,
          z: 1.05,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)"
        });
      }
    };
    
    const handlePointerLeave = () => {
      setIsHovered(false);
      setIsDragging(false);
      
      // Return to original position and scale
      if (modelRef.current) {
        gsap.to(modelRef.current.position, {
          y: -0.5,
          duration: 0.5
        });
        
        gsap.to(modelRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.5
        });
      }
    };
    
    // Handle start of drag interaction
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      setIsDragging(true);
      
      const clientX = 'touches' in event 
        ? event.touches[0].clientX 
        : (event as MouseEvent).clientX;
        
      const clientY = 'touches' in event 
        ? event.touches[0].clientY 
        : (event as MouseEvent).clientY;
      
      setInteractionStartPos({ x: clientX, y: clientY });
      
      if (modelRef.current) {
        setModelRotation({
          x: modelRef.current.rotation.x,
          y: modelRef.current.rotation.y,
          z: modelRef.current.rotation.z
        });
      }
    };
    
    // Handle end of drag interaction
    const handlePointerUp = () => {
      setIsDragging(false);
    };

    // Add different event listeners for mobile vs desktop
    if (isMobile) {
      containerRef.current.addEventListener('touchstart', handlePointerDown);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    } else {
      containerRef.current.addEventListener('mouseenter', handlePointerEnter);
      containerRef.current.addEventListener('mouseleave', handlePointerLeave);
      containerRef.current.addEventListener('mousedown', handlePointerDown);
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
    }

    // Handle scroll for scroll-triggered animations
    const handleScroll = () => {
      if (!modelRef.current || !scrollTrigger) return;
      
      const windowHeight = window.innerHeight;
      
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerVisibleRatio = 1 - (containerRect.top / windowHeight);
        
        if (containerVisibleRatio > 0 && containerVisibleRatio < 1) {
          // More dramatic scroll-based animation
          gsap.to(modelRef.current.rotation, {
            y: containerVisibleRatio * Math.PI * 2, // Full rotation
            x: -Math.PI / 12 + (containerVisibleRatio * 0.2), // Subtle tilt
            duration: 0.5
          });
          
          // Scale up as it comes into view
          gsap.to(modelRef.current.scale, {
            x: 0.8 + (containerVisibleRatio * 0.3),
            y: 0.8 + (containerVisibleRatio * 0.3),
            z: 0.8 + (containerVisibleRatio * 0.3),
            duration: 0.5
          });
        }
      }
    };
    
    if (scrollTrigger) {
      window.addEventListener('scroll', handleScroll);
    }

    // Handle window resize with debounce for performance
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        // Update camera aspect ratio
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        
        // Update renderer size
        rendererRef.current.setPixelRatio(getOptimalPixelRatio());
        rendererRef.current.setSize(width, height);
      }, 250); // Debounce resize events
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      // Clean up resources
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      if (rendererRef.current && rendererRef.current.domElement.parentElement) {
        rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
      }
      
      if (isMobile) {
        containerRef.current?.removeEventListener('touchstart', handlePointerDown);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('touchend', handlePointerUp);
      } else {
        containerRef.current?.removeEventListener('mouseenter', handlePointerEnter);
        containerRef.current?.removeEventListener('mouseleave', handlePointerLeave);
        containerRef.current?.removeEventListener('mousedown', handlePointerDown);
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
      }
      
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      
      if (scrollTrigger) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [theme, scrollTrigger, isMobile, isHovered, isDragging, interactionStartPos, modelRotation]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }} // Prevent default touch actions on mobile
    />
  );
};

export default ThreeDModel;