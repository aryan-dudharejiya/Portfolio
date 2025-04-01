import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';

interface ParticlesEffectProps {
  scrollEffect?: boolean;
}

const ParticlesEffect = ({ scrollEffect = true }: ParticlesEffectProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameRef = useRef<number>(0);
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  // For scroll-based interaction
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Optimization helper function
  const getOptimalParticleCount = () => {
    // Reduce particle count on mobile for better performance
    return isMobile ? 800 : 2000;
  };
  
  const getOptimalSize = () => {
    return isMobile ? 0.3 : 0.2; // Larger particles on mobile to be more visible
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
    camera.position.z = 15;
    cameraRef.current = camera;

    // Renderer setup with optimizations
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: !isMobile, // Disable antialiasing on mobile for performance
      powerPreference: 'high-performance',
    });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    // For Three.js v0.149.0 or later
    // renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    
    // Clear the container before appending
    if (containerRef.current.childElementCount > 0) {
      containerRef.current.innerHTML = '';
    }
    containerRef.current.appendChild(renderer.domElement);

    // Create particles with optimization
    const count = getOptimalParticleCount();
    const distance = isMobile ? 50 : 60; // Smaller distance for mobile
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Add a third color for more variety
    const colorOptions = theme === 'dark' 
      ? [
          new THREE.Color('#6366F1'), // Primary
          new THREE.Color('#EC4899'), // Secondary
          new THREE.Color('#8B5CF6')  // Additional purple
        ] 
      : [
          new THREE.Color('#6366F1'), // Primary
          new THREE.Color('#EC4899'), // Secondary
          new THREE.Color('#3B82F6')  // Additional blue
        ];
    
    for (let i = 0; i < count; i++) {
      // Positions - distribute particles in a 3D space
      // Create a more interesting distribution pattern
      let x, y, z;
      
      // Distribute 80% of particles in a sphere shape, 20% randomly in the entire space
      if (Math.random() < 0.8) {
        // Spherical distribution
        const radius = 20 + Math.random() * 15; // Radius between 20 and 35
        const theta = Math.random() * Math.PI * 2; // Around the circle
        const phi = Math.acos(2 * Math.random() - 1); // Up and down the sphere
        
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
      } else {
        // Random in a box
        x = (Math.random() - 0.5) * distance;
        y = (Math.random() - 0.5) * distance;
        z = (Math.random() - 0.5) * distance;
      }
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Colors - weighted random distribution
      const colorIndex = Math.random() < 0.5 ? 0 : Math.random() < 0.7 ? 1 : 2;
      const color = colorOptions[colorIndex];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Randomize particle sizes for more visual interest
      sizes[i] = Math.random() * 0.8 + 0.2; // Between 0.2 and 1.0
    }
    
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create a custom shader material for more control and better performance
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: getOptimalSize() * renderer.getPixelRatio() },
        uScrollY: { value: 0 },
        uMouseX: { value: 0 },
        uMouseY: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        uniform float uSize;
        uniform float uScrollY;
        uniform float uMouseX;
        uniform float uMouseY;
        
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          
          // Animated position
          vec3 newPosition = position;
          
          // Add subtle wave motion
          newPosition.x += sin(position.y * 0.05 + uTime * 0.2) * 0.5;
          newPosition.y += cos(position.x * 0.05 + uTime * 0.1) * 0.5;
          
          // Parallax effect based on mouse position
          newPosition.x += uMouseX * position.z * 0.01;
          newPosition.y += uMouseY * position.z * 0.01;
          
          // Scroll effect
          newPosition.y -= uScrollY * 0.005;
          
          // Make particles in the center move more with scroll
          float distFromCenter = length(position.xy);
          if (distFromCenter < 10.0) {
            newPosition.y -= uScrollY * 0.01 * (1.0 - distFromCenter / 10.0);
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
          gl_PointSize = uSize * size * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create a circular particle
          float strength = distance(gl_PointCoord, vec2(0.5));
          strength = 1.0 - strength;
          strength = pow(strength, 3.0); // Softer edge falloff
          
          // Final color with opacity based on distance from center
          vec3 color = vColor;
          float opacity = strength * 0.8;
          gl_FragColor = vec4(color, opacity);
        }
      `,
      transparent: true,
      depthWrite: false, // Important for correct transparency rendering
      blending: THREE.AdditiveBlending, // Makes bright areas brighter for a glow effect
      vertexColors: true,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation function with performance optimization
    let lastTime = 0;
    const animate = (time: number) => {
      if (!particlesRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      // Limit framerate on mobile for performance
      const elapsed = time - lastTime;
      if (isMobile && elapsed < 33) { // ~30fps on mobile
        frameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTime = time;
      
      // Update uniforms for the shader
      const material = particles.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = time * 0.001; // Convert to seconds
      material.uniforms.uScrollY.value = scrollY;
      material.uniforms.uMouseX.value = mousePosition.x;
      material.uniforms.uMouseY.value = mousePosition.y;
      
      // Add gentle constant rotation regardless of other effects
      particles.rotation.x += 0.0001;
      particles.rotation.y += 0.0001;
      
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);

    // Handle window scroll for parallax effect
    const handleScroll = () => {
      if (scrollEffect) {
        setScrollY(window.scrollY);
      }
    };
    
    // Handle mouse/touch movement for parallax effect
    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      if (!particlesRef.current) return;
      
      let clientX, clientY;
      
      if ('touches' in event) {
        // Touch event
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        // Mouse event
        clientX = (event as MouseEvent).clientX;
        clientY = (event as MouseEvent).clientY;
      }
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate normalized coordinates (-1 to 1)
      const normalizedX = (clientX / windowWidth) * 2 - 1;
      const normalizedY = (clientY / windowHeight) * 2 - 1;
      
      setMousePosition({ x: normalizedX, y: normalizedY });
    };
    
    // Apply scroll effect if enabled
    if (scrollEffect) {
      window.addEventListener('scroll', handleScroll);
    }
    
    // Use the appropriate event listener for mobile/desktop
    if (isMobile) {
      window.addEventListener('touchmove', handleMouseMove, { passive: true });
    } else {
      window.addEventListener('mousemove', handleMouseMove);
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
        rendererRef.current.setSize(width, height);
        
        // Update particle size uniform based on pixel ratio
        if (particlesRef.current) {
          const material = particlesRef.current.material as THREE.ShaderMaterial;
          material.uniforms.uSize.value = getOptimalSize() * rendererRef.current.getPixelRatio();
        }
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
      
      if (particlesRef.current) {
        scene.remove(particlesRef.current);
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }
      
      if (scrollEffect) {
        window.removeEventListener('scroll', handleScroll);
      }
      
      if (isMobile) {
        window.removeEventListener('touchmove', handleMouseMove);
      } else {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [theme, isMobile, scrollEffect]);

  return <div ref={containerRef} className="absolute inset-0 -z-10 opacity-60" />;
};

export default ParticlesEffect;