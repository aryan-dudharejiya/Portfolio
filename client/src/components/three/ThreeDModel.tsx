import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useTheme } from '@/hooks/useTheme';

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

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    
    // Clear the container before appending
    if (containerRef.current.childElementCount > 0) {
      containerRef.current.innerHTML = '';
    }
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create simplified laptop model
    const laptopGroup = new THREE.Group();
    
    // Create base of laptop (keyboard part)
    const baseGeometry = new THREE.BoxGeometry(3, 0.2, 2);
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
    
    const screenBaseGeometry = new THREE.BoxGeometry(screenWidth, screenHeight, screenDepth);
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

    // Create code pattern texture for the screen
    const createCodePattern = () => {
      const canvas = document.createElement('canvas');
      const size = 256;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = theme === 'dark' ? '#111111' : '#f8f8f8';
        ctx.fillRect(0, 0, size, size);
        
        ctx.font = '6px monospace';
        ctx.fillStyle = theme === 'dark' ? '#EC4899' : '#6366F1'; // Use theme colors
        
        // Generate random code-like pattern
        for (let y = 5; y < size; y += 8) {
          let line = '';
          for (let i = 0; i < 10; i++) {
            line += Math.random() > 0.5 ? '1' : '0';
          }
          ctx.fillText(line, 5, y);
          
          if (y % 24 === 5) { // Every few lines
            ctx.fillText('function()', 50, y);
          }
          
          if (y % 32 === 5) { // Some different patterns
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

    // Add the laptop to the scene
    laptopGroup.position.y = -0.5; // Lower it a bit
    laptopGroup.rotation.x = -Math.PI / 12; // Tilt up slightly
    scene.add(laptopGroup);
    modelRef.current = laptopGroup;

    // Animation function
    const animate = () => {
      if (!modelRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      // Apply constant gentle rotation
      if (!scrollTrigger) {
        modelRef.current.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Handle mouse movement to create interactive rotation
    const handleMouseMove = (event: MouseEvent) => {
      if (!modelRef.current) return;
      
      const { clientX, clientY } = event;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate normalized coordinates (-1 to 1)
      const normalizedX = (clientX / windowWidth) * 2 - 1;
      const normalizedY = (clientY / windowHeight) * 2 - 1;
      
      // Apply subtle additional rotation based on mouse position
      gsap.to(modelRef.current.rotation, {
        x: -Math.PI / 12 + normalizedY * 0.1,
        y: normalizedX * 0.5,
        duration: 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Handle scroll for scroll-triggered animations
    const handleScroll = () => {
      if (!modelRef.current || !scrollTrigger) return;
      
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerVisibleRatio = 1 - (containerRect.top / windowHeight);
        
        if (containerVisibleRatio > 0 && containerVisibleRatio < 1) {
          // Rotate the model based on scroll position
          gsap.to(modelRef.current.rotation, {
            y: containerVisibleRatio * Math.PI * 2, // Full rotation as you scroll
            duration: 0.5
          });
        }
      }
    };
    
    if (scrollTrigger) {
      window.addEventListener('scroll', handleScroll);
    }

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      // Update camera aspect ratio
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      // Update renderer size
      rendererRef.current.setSize(width, height);
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
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (scrollTrigger) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [theme, scrollTrigger]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default ThreeDModel;