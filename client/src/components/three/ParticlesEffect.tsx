import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/hooks/useTheme';

const ParticlesEffect = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameRef = useRef<number>(0);
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
    camera.position.z = 15;
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

    // Create particles
    const count = 2000;
    const distance = 60;
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorOptions = theme === 'dark' 
      ? [new THREE.Color('#6366F1'), new THREE.Color('#EC4899')]  // primary and secondary colors
      : [new THREE.Color('#6366F1'), new THREE.Color('#EC4899')];
    
    for (let i = 0; i < count; i++) {
      // Positions - distribute particles in a 3D space
      const x = (Math.random() - 0.5) * distance;
      const y = (Math.random() - 0.5) * distance;
      const z = (Math.random() - 0.5) * distance;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Colors - randomly choose between color options
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation function
    const animate = () => {
      if (!particlesRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      particles.rotation.x += 0.0004;
      particles.rotation.y += 0.0002;
      
      // Follow mouse movement
      renderer.render(scene, camera);
      
      frameRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Handle mouse movement to create parallax effect
    const handleMouseMove = (event: MouseEvent) => {
      if (!particlesRef.current) return;
      
      const { clientX, clientY } = event;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate normalized coordinates (-1 to 1)
      const normalizedX = (clientX / windowWidth) * 2 - 1;
      const normalizedY = (clientY / windowHeight) * 2 - 1;
      
      // Apply subtle rotation based on mouse position
      particles.rotation.x = normalizedY * 0.1;
      particles.rotation.y = normalizedX * 0.1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

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
      
      if (particlesRef.current) {
        scene.remove(particlesRef.current);
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return <div ref={containerRef} className="absolute inset-0 -z-10 opacity-60" />;
};

export default ParticlesEffect;