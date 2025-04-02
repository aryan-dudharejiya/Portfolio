import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';

interface ThreeDModelProps {
  scrollTrigger?: boolean;
  modelType?: 'laptop' | 'workspace' | 'abstract' | 'codeScene';
}

const ThreeDModel = ({ scrollTrigger = false, modelType = 'laptop' }: ThreeDModelProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>(0);
  const modelRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const { theme, isDark } = useTheme();
  const isMobile = useIsMobile();
  
  // State for interactive features
  const [isHovered, setIsHovered] = useState(false);
  const [interactionStartPos, setInteractionStartPos] = useState({ x: 0, y: 0 });
  const [modelRotation, setModelRotation] = useState({ x: -Math.PI / 12, y: 0, z: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInView, setIsInView] = useState(false);
  
  // Enhanced colors based on theme
  const themeColors = useMemo(() => {
    return {
      primary: isDark ? 0x6366F1 : 0x6366F1,
      secondary: isDark ? 0xEC4899 : 0xEF4444,
      accent: isDark ? 0x22D3EE : 0x0EA5E9,
      background: isDark ? 0x111111 : 0xF8F8F8,
      surface: isDark ? 0x333333 : 0xF0F0F0,
      text: isDark ? 0xECECEC : 0x171717,
      dim: isDark ? 0x444444 : 0xDDDDDD,
    };
  }, [isDark]);
  
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

    // Enhanced Scene setup with fog for depth
    const scene = new THREE.Scene();
    if (modelType === 'abstract') {
      scene.fog = new THREE.FogExp2(isDark ? 0x080808 : 0xf5f5f5, 0.035);
    }
    sceneRef.current = scene;

    // Camera setup with better perspective
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = modelType === 'abstract' ? 10 : 5;
    cameraRef.current = camera;

    // Enhanced renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: !isMobile,
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp',
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(getOptimalPixelRatio());
    renderer.shadowMap.enabled = !isMobile; // Enable shadows on desktop
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    
    // Clear the container before appending - safer implementation
    if (containerRef.current) {
      // Remove only canvas elements to avoid unnecessary DOM operations
      Array.from(containerRef.current.children).forEach((child) => {
        if (child instanceof HTMLCanvasElement) {
          containerRef.current?.removeChild(child);
        }
      });
      
      // Append the new renderer
      containerRef.current.appendChild(renderer.domElement);
    }

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x333333 : 0xffffff, 
      0.6
    );
    scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(
      isDark ? 0xffffff : 0xffffff, 
      1
    );
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = !isMobile; // Cast shadows on desktop
    if (directionalLight.shadow) {
      directionalLight.shadow.bias = -0.001;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
    }
    scene.add(directionalLight);
    
    // Add accent lights for visual depth
    const accentLight1 = new THREE.PointLight(themeColors.primary, 1, 10);
    accentLight1.position.set(-3, 2, 3);
    scene.add(accentLight1);
    
    const accentLight2 = new THREE.PointLight(themeColors.secondary, 0.8, 10);
    accentLight2.position.set(3, -2, 3);
    scene.add(accentLight2);

    // Create appropriate 3D model based on modelType
    let model: THREE.Group;
    
    if (modelType === 'abstract') {
      // Create abstract floating elements
      model = createAbstractModel();
      // Add particle system background for visual depth
      addParticleSystem();
    } else if (modelType === 'workspace') {
      // Create developer workspace
      model = createWorkspaceModel();
      // Add ambient particles for workspace model
      addParticleSystem(); // Use default values
    } else if (modelType === 'codeScene') {
      // Create the code scene model (digital environment)
      model = createCodeSceneModel();
      // Add specialized code particles (binary, code symbols)
      addParticleSystem(); // Use default values
    } else {
      // Default laptop model
      model = createLaptopModel();
    }
    
    // Add the model to the scene
    model.position.y = -0.5;
    model.rotation.x = modelRotation.x;
    model.rotation.y = modelRotation.y;
    model.rotation.z = modelRotation.z;
    scene.add(model);
    modelRef.current = model;

    // Animation function with performance optimizations
    let lastTime = 0;
    const animate = (time: number) => {
      if (!modelRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      // Apply constant gentle rotation when not being interacted with
      if (!scrollTrigger && !isHovered && !isDragging) {
        modelRef.current.rotation.y += 0.005;
      }
      
      // Animate particles if they exist
      if (particlesRef.current && modelType === 'abstract') {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < positions.length; i += 3) {
          // Wave effect
          positions[i + 1] += Math.sin((time * 0.001) + (positions[i] * 0.1)) * 0.01;
        }
        
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
      
      // Interactive lighting effect
      if (isHovered && !isDragging && modelType !== 'abstract') {
        // Normalize mouse position
        const normalizedX = (mousePosition.x / window.innerWidth) * 2 - 1;
        const normalizedY = -(mousePosition.y / window.innerHeight) * 2 + 1;
        
        // Move an accent light to follow mouse position slightly
        if (scene.children.length > 3) {
          const accentLight = scene.children[3] as THREE.PointLight;
          gsap.to(accentLight.position, {
            x: normalizedX * 3,
            y: normalizedY * 2,
            duration: 0.5
          });
        }
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

    // Enhanced mouse/touch movement for interactive rotation
    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in event 
        ? event.touches[0].clientX 
        : (event as MouseEvent).clientX;
        
      const clientY = 'touches' in event 
        ? event.touches[0].clientY 
        : (event as MouseEvent).clientY;
        
      // Update mouse position for lighting effects
      setMousePosition({ x: clientX, y: clientY });
      
      if (!modelRef.current || !isDragging) return;
      
      const deltaX = clientX - interactionStartPos.x;
      const deltaY = clientY - interactionStartPos.y;
      
      // Update model rotation based on drag distance with dampening
      const newRotationY = modelRotation.y + (deltaX * 0.005);
      const newRotationX = Math.max(
        -Math.PI / 3, 
        Math.min(Math.PI / 3, modelRotation.x + (deltaY * 0.005))
      );
      
      // Apply new rotation with smoother transition
      setModelRotation({
        x: newRotationX,
        y: newRotationY,
        z: modelRotation.z
      });
      
      if (modelRef.current) {
        gsap.to(modelRef.current.rotation, {
          x: newRotationX,
          y: newRotationY,
          duration: 0.3,
          ease: "power2.out"
        });
      }
      
      // Update start position for next move
      setInteractionStartPos({ x: clientX, y: clientY });
    };
    
    // Enhanced hover effects
    const handlePointerEnter = () => {
      setIsHovered(true);
      
      // No cursor customization needed
      
      // Advanced hover animations
      if (modelRef.current) {
        // Create a more dramatic hover effect
        gsap.to(modelRef.current.position, {
          y: -0.2, 
          duration: 0.8,
          ease: "elastic.out(1, 0.3)"
        });
        
        // Add a smooth pulsing effect
        gsap.to(modelRef.current.scale, {
          x: 1.05,
          y: 1.05,
          z: 1.05,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)"
        });
        
        // Add a slight rotation for a more organic feel
        gsap.to(modelRef.current.rotation, {
          z: modelRotation.z + 0.05,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };
    
    const handlePointerLeave = () => {
      setIsHovered(false);
      setIsDragging(false);
      
      // No cursor customization needed
      
      // Return to original position with a smoother animation
      if (modelRef.current) {
        gsap.to(modelRef.current.position, {
          y: -0.5,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)"
        });
        
        gsap.to(modelRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.6,
          ease: "back.out(1.5)"
        });
        
        gsap.to(modelRef.current.rotation, {
          z: modelRotation.z,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };
    
    // Handle start of drag interaction with visual feedback
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      setIsDragging(true);
      
      // No cursor customization needed
      
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
        
        // Add a quick "grabbing" animation
        gsap.to(modelRef.current.scale, {
          x: 0.95,
          y: 0.95,
          z: 0.95,
          duration: 0.2,
          ease: "power2.out"
        });
      }
    };
    
    // Enhanced drag end animation
    const handlePointerUp = () => {
      setIsDragging(false);
      
      // No cursor customization needed
      
      // Add a nice "release" animation
      if (modelRef.current) {
        gsap.to(modelRef.current.scale, {
          x: isHovered ? 1.05 : 1,
          y: isHovered ? 1.05 : 1,
          z: isHovered ? 1.05 : 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });
      }
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

    // Enhanced scroll-triggered animations
    const handleScroll = () => {
      if (!modelRef.current || !scrollTrigger) return;
      
      const windowHeight = window.innerHeight;
      
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerCenter = containerRect.top + (containerRect.height / 2);
        const viewportCenter = windowHeight / 2;
        const distanceFromCenter = Math.abs(containerCenter - viewportCenter);
        const maxDistance = windowHeight * 0.6; // 60% of viewport height
        
        // Calculate how close the container is to the center of the viewport
        const proximityToCenter = 1 - (distanceFromCenter / maxDistance);
        const isVisible = proximityToCenter > 0;
        
        setIsInView(isVisible);
        
        if (isVisible) {
          const containerVisibleRatio = Math.max(0, Math.min(1, proximityToCenter));
          
          // More dramatic scroll-based animations
          gsap.to(modelRef.current.rotation, {
            y: containerVisibleRatio * Math.PI * 2, // Full rotation
            x: -Math.PI / 12 + (containerVisibleRatio * 0.3), // Enhanced tilt
            duration: 0.7,
            ease: "power2.out"
          });
          
          // Scale up as it comes into view with bounce effect
          gsap.to(modelRef.current.scale, {
            x: 0.8 + (containerVisibleRatio * 0.4),
            y: 0.8 + (containerVisibleRatio * 0.4),
            z: 0.8 + (containerVisibleRatio * 0.4),
            duration: 0.7,
            ease: "back.out(1.7)"
          });
          
          // Add vertical movement based on scroll position
          gsap.to(modelRef.current.position, {
            y: -0.5 + (containerVisibleRatio * 0.3),
            duration: 0.7,
            ease: "power2.out"
          });
          
          // Also animate lights based on scroll
          if (scene.children.length > 3) {
            const accentLight1 = scene.children[3] as THREE.PointLight;
            gsap.to(accentLight1, {
              intensity: 0.5 + containerVisibleRatio * 1.5,
              duration: 0.7
            });
          }
          
          if (scene.children.length > 4) {
            const accentLight2 = scene.children[4] as THREE.PointLight;
            gsap.to(accentLight2, {
              intensity: 0.3 + containerVisibleRatio * 1.2,
              duration: 0.7
            });
          }
        }
      }
    };
    
    if (scrollTrigger) {
      window.addEventListener('scroll', handleScroll);
      // Trigger initial scroll calculation
      handleScroll();
    }

    // Handle window resize with improved debounce for performance
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
        
        // Retrigger scroll handler to adjust animations
        if (scrollTrigger) {
          handleScroll();
        }
      }, 250); // Debounce resize events
    };
    
    window.addEventListener('resize', handleResize);

    // Create the laptop model
    function createLaptopModel(): THREE.Group {
      const laptopGroup = new THREE.Group();
      
      // Higher quality geometries on desktop
      const segments = isMobile ? 1 : 3;
      
      // Create laptop base with rounded corners
      const baseGeometry = new THREE.BoxGeometry(
        3, 
        0.2, 
        2, 
        segments * 2, 
        segments, 
        segments * 2
      );
      
      // Apply rounded corners to the base
      if (!isMobile) {
        const basePositions = baseGeometry.attributes.position.array;
        const baseRadius = 0.1;
        
        for (let i = 0; i < basePositions.length; i += 3) {
          const x = basePositions[i];
          const z = basePositions[i + 2];
          
          // Round the corners by moving the vertices inward
          const absX = Math.abs(x);
          const absZ = Math.abs(z);
          
          if (absX > 1.4 && absZ > 0.9) {
            const normX = (absX - 1.4) / 0.1;
            const normZ = (absZ - 0.9) / 0.1;
            
            if (normX > 0 && normZ > 0) {
              const radius = Math.min(normX, normZ) * baseRadius;
              basePositions[i] = x > 0 ? x - radius : x + radius;
              basePositions[i + 2] = z > 0 ? z - radius : z + radius;
            }
          }
        }
      }
      
      // Enhanced metallic material based on theme
      const baseMaterial = new THREE.MeshPhysicalMaterial({
        color: themeColors.surface,
        metalness: 0.6,
        roughness: 0.2,
        reflectivity: 0.5,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2
      });
      
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.castShadow = !isMobile;
      base.receiveShadow = !isMobile;
      laptopGroup.add(base);
      
      // Use higher quality screen
      const screenWidth = 3;
      const screenHeight = 2;
      const screenDepth = 0.05;
      
      // Create screen with better model and materials
      const screenBaseGeometry = new THREE.BoxGeometry(
        screenWidth, 
        screenHeight, 
        screenDepth,
        segments * 2,
        segments * 2,
        segments
      );
      
      // Enhanced screen material
      const screenBaseMaterial = new THREE.MeshPhysicalMaterial({
        color: themeColors.dim,
        metalness: 0.5,
        roughness: 0.3,
        reflectivity: 0.2,
        clearcoat: 0.1
      });
      
      const screenBase = new THREE.Mesh(screenBaseGeometry, screenBaseMaterial);
      screenBase.position.y = 1.1; // Position above the base
      screenBase.position.z = -0.97; // Move back so it's connected to the base
      screenBase.rotation.x = Math.PI / 6; // Tilt it a bit
      screenBase.castShadow = !isMobile;
      screenBase.receiveShadow = !isMobile;
      laptopGroup.add(screenBase);
      
      // Create a more visually appealing screen display
      const screenDisplayGeometry = new THREE.PlaneGeometry(screenWidth - 0.2, screenHeight - 0.2, 1, 1);
      
      // Create a more sophisticated screen material with glow effect
      const screenDisplayMaterial = new THREE.MeshBasicMaterial({
        color: themeColors.primary,
        opacity: 0.9,
        transparent: true
      });
      
      const screenDisplay = new THREE.Mesh(screenDisplayGeometry, screenDisplayMaterial);
      screenDisplay.position.set(0, 0, 0.03); // Slightly in front of the screen base
      screenBase.add(screenDisplay); // Make it a child of the screen base
      
      // Create enhanced code pattern texture for the screen
      const createCodePattern = () => {
        const canvas = document.createElement('canvas');
        const size = isMobile ? 256 : 512; // Higher resolution textures
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Fill with a gradient background
          const gradient = ctx.createLinearGradient(0, 0, 0, size);
          gradient.addColorStop(0, isDark ? '#111827' : '#f9fafb');
          gradient.addColorStop(1, isDark ? '#1f2937' : '#f3f4f6');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, size, size);
          
          // Generate a more realistic code pattern
          const lineHeight = isMobile ? 10 : 14;
          ctx.font = isMobile ? '8px monospace' : '12px monospace';
          
          // Add line numbers
          ctx.fillStyle = isDark ? '#6B7280' : '#9CA3AF';
          for (let y = 1; y <= 30; y++) {
            ctx.fillText(String(y).padStart(2, ' '), 5, y * lineHeight);
          }
          
          // Generate random code patterns that look more realistic
          const codeElements = [
            'function', 'const', 'let', 'var', 'return', 
            'if', 'else', 'for', 'while', 'async', 'await', 
            'import', 'export', 'class', 'interface'
          ];
          
          const symbols = ['()', '{}', '[]', '=>', ';', ',', '.', '=', '+', '-', '*', '/'];
          
          const getRandomCode = () => {
            const type = Math.random();
            if (type < 0.3) {
              return codeElements[Math.floor(Math.random() * codeElements.length)];
            } else if (type < 0.5) {
              return symbols[Math.floor(Math.random() * symbols.length)];
            } else {
              // Generate variable-like names
              const len = Math.floor(Math.random() * 8) + 2;
              let result = '';
              const chars = 'abcdefghijklmnopqrstuvwxyz';
              for (let i = 0; i < len; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              return result;
            }
          };
          
          // Create syntax highlighting effect
          const syntaxColors = {
            keywords: isDark ? '#EC4899' : '#D946EF', // pink/purple
            variables: isDark ? '#22D3EE' : '#0EA5E9', // cyan/blue
            strings: isDark ? '#10B981' : '#059669', // green
            comments: isDark ? '#6B7280' : '#9CA3AF', // gray
            functions: isDark ? '#F59E0B' : '#D97706', // amber
          };
          
          // Generate random code with syntax highlighting
          for (let y = 1; y <= 30; y++) {
            let linePos = 30; // Start after line numbers
            
            // Indentation
            const indent = Math.floor(Math.random() * 4);
            linePos += indent * 12;
            
            const elementCount = Math.floor(Math.random() * 6) + 1;
            
            for (let i = 0; i < elementCount; i++) {
              const code = getRandomCode();
              
              // Syntax highlighting based on content
              if (codeElements.includes(code)) {
                ctx.fillStyle = syntaxColors.keywords;
              } else if (code.length > 1 && symbols.includes(code)) {
                ctx.fillStyle = syntaxColors.variables;
              } else if (code.startsWith('"') || code.startsWith("'")) {
                ctx.fillStyle = syntaxColors.strings;
              } else if (code.startsWith('//')) {
                ctx.fillStyle = syntaxColors.comments;
                ctx.fillText(code + ' '.repeat(30), linePos, y * lineHeight);
                break; // Comments consume the rest of the line
              } else if (code.endsWith('()')) {
                ctx.fillStyle = syntaxColors.functions;
              } else {
                // Random coloring for variety
                const colorKeys = Object.keys(syntaxColors) as Array<keyof typeof syntaxColors>;
                ctx.fillStyle = syntaxColors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
              }
              
              ctx.fillText(code, linePos, y * lineHeight);
              linePos += (code.length * (isMobile ? 5 : 7)) + 5;
            }
          }
          
          // Add cursor blinking effect at a random position
          const cursorLine = Math.floor(Math.random() * 30) + 1;
          const cursorPos = Math.floor(Math.random() * 300) + 50;
          ctx.fillStyle = isDark ? '#FFFFFF' : '#000000';
          ctx.fillRect(cursorPos, (cursorLine * lineHeight) - 10, 2, 14);
          
          return new THREE.CanvasTexture(canvas);
        }
        
        return null;
      };
      
      const codeTexture = createCodePattern();
      if (codeTexture) {
        screenDisplayMaterial.map = codeTexture;
        screenDisplayMaterial.needsUpdate = true;
      }
      
      // Add keyboard keys on the base with improved quality on desktop
      if (!isMobile) {
        const keySize = 0.15;
        const keySpacing = 0.02;
        const keysPerRow = 15;
        const numRows = 5;
        const keyStartX = -(keySize + keySpacing) * (keysPerRow - 1) / 2;
        const keyStartZ = -(keySize + keySpacing) * (numRows - 1) / 2;
        
        // Create a more rounded key geometry
        const keyGeometry = new THREE.BoxGeometry(keySize, keySize / 4, keySize, 2, 1, 2);
        
        // Apply rounded corners to keys
        const keyPositions = keyGeometry.attributes.position.array;
        const keyRadius = 0.02;
        
        for (let i = 0; i < keyPositions.length; i += 3) {
          const y = keyPositions[i + 1];
          
          // Only round the top face
          if (y > 0) {
            const x = keyPositions[i];
            const z = keyPositions[i + 2];
            
            // Get distance from center of the top face
            const distX = Math.abs(x) / (keySize / 2);
            const distZ = Math.abs(z) / (keySize / 2);
            
            // Apply rounded effect to corners
            if (distX > 0.7 && distZ > 0.7) {
              const cornerDist = Math.sqrt(distX * distX + distZ * distZ);
              if (cornerDist > 1.0) {
                const normCorner = (cornerDist - 1.0) / 0.414; // Max distance beyond 1.0 is sqrt(2)-1
                const adjustY = normCorner * keyRadius;
                keyPositions[i + 1] -= adjustY;
              }
            }
          }
        }
        
        // Better key material with subtle variance
        const specialKeys = [0, 13, 14, 28, 42, 56, 70]; // For visual variety
        const specialKeyMaterial = new THREE.MeshPhysicalMaterial({
          color: isDark ? 0x444444 : 0xe0e0e0,
          metalness: 0.2,
          roughness: 0.8,
          clearcoat: 0.2
        });
        
        // Add all keyboard keys with realistic arrangement
        for (let row = 0; row < numRows; row++) {
          const rowOffset = row * 0.05; // Stagger keys for visual interest
          
          for (let col = 0; col < keysPerRow; col++) {
            const index = row * keysPerRow + col;
            const isSpecialKey = specialKeys.includes(index);
            
            // Create slightly varied key materials for realism
            const hueVariation = (Math.random() - 0.5) * 0.05;
            const keyMaterial = new THREE.MeshStandardMaterial({
              color: new THREE.Color().setHSL(
                0, 
                0, 
                isDark ? 0.15 + hueVariation : 0.9 + hueVariation
              ),
              metalness: 0.3,
              roughness: 0.9
            });
            
            const key = new THREE.Mesh(
              keyGeometry, 
              isSpecialKey ? specialKeyMaterial : keyMaterial
            );
            
            key.position.set(
              keyStartX + col * (keySize + keySpacing) + rowOffset,
              0.12, // Slightly above the base
              keyStartZ + row * (keySize + keySpacing)
            );
            
            // Add subtle random rotation for realism
            if (!isSpecialKey) {
              key.rotation.z = (Math.random() - 0.5) * 0.03;
              key.rotation.x = (Math.random() - 0.5) * 0.03;
            }
            
            key.castShadow = true;
            base.add(key);
          }
        }
        
        // Add a touchpad
        const touchpadWidth = 1.2;
        const touchpadHeight = 0.8;
        const touchpadGeometry = new THREE.BoxGeometry(touchpadWidth, 0.02, touchpadHeight);
        const touchpadMaterial = new THREE.MeshPhysicalMaterial({
          color: isDark ? 0x222222 : 0xd0d0d0,
          metalness: 0.5,
          roughness: 0.3,
          clearcoat: 0.5
        });
        
        const touchpad = new THREE.Mesh(touchpadGeometry, touchpadMaterial);
        touchpad.position.set(0, 0.12, 0.5); // Center in the lower half
        base.add(touchpad);
      }
      
      // Add an Apple-like logo on the back of the screen
      const logoSize = 0.5;
      const logoGeometry = new THREE.CircleGeometry(logoSize / 2, 32);
      const logoMaterial = new THREE.MeshStandardMaterial({
        color: themeColors.primary,
        metalness: 0.8,
        roughness: 0.2,
        emissive: themeColors.primary,
        emissiveIntensity: 0.2
      });
      
      const logo = new THREE.Mesh(logoGeometry, logoMaterial);
      logo.position.set(0, screenHeight / 2 - logoSize / 2 - 0.2, -0.03); // Center on the back
      logo.rotation.y = Math.PI; // Face the back
      screenBase.add(logo);
      
      return laptopGroup;
    }
    
    // Create a developer workspace model
    function createWorkspaceModel(): THREE.Group {
      const workspaceGroup = new THREE.Group();
      
      // Create a desk surface
      const deskWidth = 4;
      const deskDepth = 2;
      const deskHeight = 0.1;
      
      const deskGeometry = new THREE.BoxGeometry(deskWidth, deskHeight, deskDepth);
      const deskMaterial = new THREE.MeshStandardMaterial({
        color: isDark ? 0x362617 : 0x8B5A2B, // Wood color
        roughness: 0.7,
        metalness: 0.1
      });
      
      const desk = new THREE.Mesh(deskGeometry, deskMaterial);
      desk.receiveShadow = !isMobile;
      workspaceGroup.add(desk);
      
      // Add a simplified laptop
      const laptopGroup = new THREE.Group();
      
      // Laptop base
      const laptopBaseGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.8);
      const laptopBaseMaterial = new THREE.MeshStandardMaterial({
        color: isDark ? 0x333333 : 0xdddddd,
        metalness: 0.6,
        roughness: 0.2
      });
      
      const laptopBase = new THREE.Mesh(laptopBaseGeometry, laptopBaseMaterial);
      laptopBase.position.set(0, deskHeight + 0.03, 0);
      laptopBase.castShadow = !isMobile;
      laptopGroup.add(laptopBase);
      
      // Laptop screen
      const screenGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.05);
      const screenMaterial = new THREE.MeshStandardMaterial({
        color: isDark ? 0x222222 : 0xaaaaaa,
        metalness: 0.5,
        roughness: 0.3
      });
      
      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.position.set(0, 0.45, -0.4);
      screen.rotation.x = -Math.PI / 6;
      screen.castShadow = !isMobile;
      laptopGroup.add(screen);
      
      // Screen display
      const displayGeometry = new THREE.PlaneGeometry(1.1, 0.7);
      const displayMaterial = new THREE.MeshBasicMaterial({
        color: themeColors.primary,
        opacity: 0.9,
        transparent: true
      });
      
      const display = new THREE.Mesh(displayGeometry, displayMaterial);
      display.position.set(0, 0, 0.03);
      screen.add(display);
      
      // Add the laptop to the desk, positioned to the side
      laptopGroup.position.set(-1, 0, 0);
      workspaceGroup.add(laptopGroup);
      
      // Add a monitor
      const monitorStandGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 16);
      const monitorStandMaterial = new THREE.MeshStandardMaterial({
        color: isDark ? 0x444444 : 0xcccccc,
        metalness: 0.8,
        roughness: 0.2
      });
      
      const monitorStand = new THREE.Mesh(monitorStandGeometry, monitorStandMaterial);
      monitorStand.position.set(0.5, deskHeight + 0.25, -0.5);
      monitorStand.castShadow = !isMobile;
      workspaceGroup.add(monitorStand);
      
      const monitorFrameGeometry = new THREE.BoxGeometry(1.8, 1.2, 0.08);
      const monitorFrameMaterial = new THREE.MeshStandardMaterial({
        color: isDark ? 0x111111 : 0x222222,
        metalness: 0.5,
        roughness: 0.5
      });
      
      const monitorFrame = new THREE.Mesh(monitorFrameGeometry, monitorFrameMaterial);
      monitorFrame.position.set(0.5, deskHeight + 1.1, -0.5);
      monitorFrame.castShadow = !isMobile;
      workspaceGroup.add(monitorFrame);
      
      const monitorScreenGeometry = new THREE.PlaneGeometry(1.7, 1.1);
      const monitorScreenMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });
      
      const monitorScreen = new THREE.Mesh(monitorScreenGeometry, monitorScreenMaterial);
      monitorScreen.position.set(0, 0, 0.04);
      monitorFrame.add(monitorScreen);
      
      // Create screen content texture
      const createScreenContent = () => {
        const canvas = document.createElement('canvas');
        const size = isMobile ? 256 : 512;
        canvas.width = size;
        canvas.height = size * (9/16);
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Create a gradient background
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, isDark ? '#0f172a' : '#e0f2fe');
          gradient.addColorStop(1, isDark ? '#1e293b' : '#bfdbfe');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw a simple website mockup
          // Header
          ctx.fillStyle = isDark ? '#334155' : '#1e40af';
          ctx.fillRect(0, 0, canvas.width, canvas.height * 0.12);
          
          // Sidebar
          ctx.fillStyle = isDark ? '#1e293b' : '#dbeafe';
          ctx.fillRect(0, canvas.height * 0.12, canvas.width * 0.2, canvas.height * 0.88);
          
          // Content area with cards
          const cardCount = 6;
          const cardWidth = (canvas.width * 0.75) / 3;
          const cardHeight = cardWidth * 0.8;
          const startX = canvas.width * 0.22;
          const startY = canvas.height * 0.18;
          
          for (let i = 0; i < cardCount; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = startX + col * (cardWidth * 1.05);
            const y = startY + row * (cardHeight * 1.2);
            
            // Card background
            ctx.fillStyle = isDark ? '#334155' : '#ffffff';
            ctx.fillRect(x, y, cardWidth, cardHeight);
            
            // Card image area
            ctx.fillStyle = themeColors.primary.toString(16).padStart(6, '0');
            ctx.fillRect(x, y, cardWidth, cardHeight * 0.6);
            
            // Card text lines
            ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
            ctx.fillRect(x + 10, y + cardHeight * 0.65, cardWidth - 20, 5);
            ctx.fillRect(x + 10, y + cardHeight * 0.75, cardWidth - 40, 5);
            ctx.fillRect(x + 10, y + cardHeight * 0.85, cardWidth * 0.6, 5);
          }
          
          return new THREE.CanvasTexture(canvas);
        }
        
        return null;
      };
      
      const screenContent = createScreenContent();
      if (screenContent) {
        monitorScreenMaterial.map = screenContent;
        monitorScreenMaterial.needsUpdate = true;
      }
      
      // Add a keyboard in front of the monitor
      const keyboardGeometry = new THREE.BoxGeometry(1.4, 0.05, 0.5);
      const keyboardMaterial = new THREE.MeshStandardMaterial({
        color: isDark ? 0x333333 : 0xdddddd,
        metalness: 0.5,
        roughness: 0.5
      });
      
      const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
      keyboard.position.set(0.5, deskHeight + 0.025, 0.1);
      keyboard.castShadow = !isMobile;
      workspaceGroup.add(keyboard);
      
      // Add a coffee mug
      if (!isMobile) {
        const mugGroup = new THREE.Group();
        
        const cupGeometry = new THREE.CylinderGeometry(0.12, 0.1, 0.22, 16);
        const cupMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.3,
          metalness: 0
        });
        
        const cup = new THREE.Mesh(cupGeometry, cupMaterial);
        cup.castShadow = true;
        mugGroup.add(cup);
        
        // Coffee inside the cup
        const coffeeGeometry = new THREE.CylinderGeometry(0.11, 0.09, 0.05, 16);
        const coffeeMaterial = new THREE.MeshStandardMaterial({
          color: 0x4b3621,
          roughness: 0.1,
          metalness: 0.1
        });
        
        const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
        coffee.position.y = 0.09;
        mugGroup.add(coffee);
        
        // Handle
        const handleGeometry = new THREE.TorusGeometry(0.08, 0.02, 8, 16, Math.PI);
        const handle = new THREE.Mesh(handleGeometry, cupMaterial);
        handle.rotation.y = Math.PI / 2;
        handle.position.set(0.14, 0, 0);
        handle.castShadow = true;
        mugGroup.add(handle);
        
        mugGroup.position.set(1.5, deskHeight + 0.11, 0.3);
        workspaceGroup.add(mugGroup);
      }
      
      // Add a plant for decoration
      const plantGroup = new THREE.Group();
      
      const potGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.2, 16);
      const potMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF5733,
        roughness: 0.8,
        metalness: 0
      });
      
      const pot = new THREE.Mesh(potGeometry, potMaterial);
      plantGroup.add(pot);
      
      const plantMaterial = new THREE.MeshStandardMaterial({
        color: 0x228B22,
        roughness: 1.0,
        metalness: 0
      });
      
      // Create simple plant leaves
      for (let i = 0; i < (isMobile ? 3 : 5); i++) {
        const leafGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        leafGeometry.scale(1, 1.5, 1);
        
        const leaf = new THREE.Mesh(leafGeometry, plantMaterial);
        const angle = (i / (isMobile ? 3 : 5)) * Math.PI * 2;
        const radius = 0.05;
        
        leaf.position.set(
          Math.cos(angle) * radius,
          0.2 + Math.random() * 0.1,
          Math.sin(angle) * radius
        );
        
        leaf.castShadow = !isMobile;
        plantGroup.add(leaf);
      }
      
      plantGroup.position.set(1.7, deskHeight + 0.1, -0.5);
      workspaceGroup.add(plantGroup);
      
      // Scale the entire workspace
      workspaceGroup.scale.set(0.8, 0.8, 0.8);
      
      return workspaceGroup;
    }
    
    // Create abstract floating elements for visual appeal
    function createAbstractModel(): THREE.Group {
      const abstractGroup = new THREE.Group();
      
      // Create floating shapes with minimal complexity on mobile
      const numShapes = isMobile ? 10 : 20;
      const shapeFunctions = [
        // Torus (Donut shape)
        () => {
          const geometry = new THREE.TorusGeometry(
            0.3 + Math.random() * 0.3, // radius
            0.06 + Math.random() * 0.08, // tube
            isMobile ? 8 : 16, // radialSegments
            isMobile ? 12 : 24 // tubularSegments
          );
          return geometry;
        },
        
        // Icosahedron (20-faced polyhedron)
        () => {
          const geometry = new THREE.IcosahedronGeometry(
            0.2 + Math.random() * 0.3, // radius
            isMobile ? 0 : 1 // detail level
          );
          return geometry;
        },
        
        // Octahedron (8-faced polyhedron)
        () => {
          const geometry = new THREE.OctahedronGeometry(
            0.2 + Math.random() * 0.4, // radius
            isMobile ? 0 : 1 // detail level
          );
          return geometry;
        },
        
        // Torus Knot (complex twisted shape)
        () => {
          const geometry = new THREE.TorusKnotGeometry(
            0.2 + Math.random() * 0.2, // radius
            0.05 + Math.random() * 0.05, // tube
            isMobile ? 24 : 64, // tubularSegments
            isMobile ? 8 : 12, // radialSegments
            Math.floor(2 + Math.random() * 3), // p
            Math.floor(2 + Math.random() * 2) // q
          );
          return geometry;
        }
      ];
      
      // Create themed colors for the shapes
      const colorPalette = [
        themeColors.primary,
        themeColors.secondary,
        themeColors.accent,
        0x8B5CF6, // Purple
        0xFFD700, // Gold
        0x06B6D4, // Cyan
      ];
      
      // Create floating shapes
      for (let i = 0; i < numShapes; i++) {
        // Select random shape and color
        const shapeFunction = shapeFunctions[Math.floor(Math.random() * shapeFunctions.length)];
        const geometry = shapeFunction();
        
        // Create materials with different rendering properties
        let material;
        const materialType = Math.random();
        
        if (materialType < 0.3) {
          // Glossy material with reflections
          material = new THREE.MeshPhysicalMaterial({
            color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
            metalness: 0.9,
            roughness: 0.1,
            clearcoat: 0.5,
            clearcoatRoughness: 0.2,
            reflectivity: 1.0
          });
        } else if (materialType < 0.6) {
          // Matte material with soft appearance
          material = new THREE.MeshStandardMaterial({
            color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
            metalness: 0.1,
            roughness: 0.8,
            emissive: colorPalette[Math.floor(Math.random() * colorPalette.length)],
            emissiveIntensity: 0.2
          });
        } else {
          // Glowing material with emission
          material = new THREE.MeshStandardMaterial({
            color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
            emissive: colorPalette[Math.floor(Math.random() * colorPalette.length)],
            emissiveIntensity: 0.8,
            metalness: 0.3,
            roughness: 0.7
          });
        }
        
        // Create the mesh and position it randomly
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position shapes in a spherical arrangement
        const radius = 3 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2; // Random angle around y-axis
        const phi = Math.random() * Math.PI; // Random angle from y-axis
        
        mesh.position.set(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
        
        // Set random rotation
        mesh.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
        
        // Add animation data as custom properties
        mesh.userData = {
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.002,
            y: (Math.random() - 0.5) * 0.002,
            z: (Math.random() - 0.5) * 0.002
          },
          floatSpeed: 0.001 + Math.random() * 0.003,
          floatDistance: 0.1 + Math.random() * 0.5,
          initialY: mesh.position.y,
          phase: Math.random() * Math.PI * 2 // For varied floating animation
        };
        
        // Enable shadows for desktop
        if (!isMobile) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
        
        abstractGroup.add(mesh);
        
        // Create an animation loop that updates the shapes
        const animateShapes = (time: number) => {
          abstractGroup.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            const data = mesh.userData;
            
            // Rotate each shape independently
            mesh.rotation.x += data.rotationSpeed.x;
            mesh.rotation.y += data.rotationSpeed.y;
            mesh.rotation.z += data.rotationSpeed.z;
            
            // Make shapes float up and down with different phases
            mesh.position.y = data.initialY + 
              Math.sin(time * 0.001 * data.floatSpeed + data.phase) * data.floatDistance;
          });
          
          frameRef.current = requestAnimationFrame(animateShapes);
        };
        
        animateShapes(0);
      }
      
      return abstractGroup;
    }
    
    // Create a new advanced code scene model with holographic effects
    function createCodeSceneModel(): THREE.Group {
      const codeSceneGroup = new THREE.Group();
      
      // Create a circular platform base
      const platformRadius = 3;
      const platformGeometry = new THREE.CylinderGeometry(
        platformRadius,
        platformRadius * 1.2,
        0.2,
        32,
        1,
        false
      );
      
      const platformMaterial = new THREE.MeshPhysicalMaterial({
        color: isDark ? 0x202020 : 0xf0f0f0,
        metalness: 0.8,
        roughness: 0.2,
        reflectivity: 0.8,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
        emissive: themeColors.primary,
        emissiveIntensity: 0.05
      });
      
      const platform = new THREE.Mesh(platformGeometry, platformMaterial);
      platform.position.y = -0.1;
      platform.receiveShadow = !isMobile;
      codeSceneGroup.add(platform);
      
      // Add glowing ring around the platform
      const ringGeometry = new THREE.TorusGeometry(
        platformRadius * 1.05,
        0.05,
        16,
        64
      );
      
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: themeColors.primary,
        transparent: true,
        opacity: 0.8
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.y = 0.05;
      ring.rotation.x = Math.PI / 2;
      codeSceneGroup.add(ring);
      
      // Animate the ring glow
      gsap.to(ringMaterial, {
        opacity: 0.4,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Create floating code panels
      const panelCount = 6;
      const panelRadius = 2;
      const panelGroup = new THREE.Group();
      
      for (let i = 0; i < panelCount; i++) {
        // Create panel
        const angle = (i / panelCount) * Math.PI * 2;
        const panelWidth = 1.2;
        const panelHeight = 1.6;
        
        const panelGeometry = new THREE.PlaneGeometry(panelWidth, panelHeight);
        const panelMaterial = new THREE.MeshBasicMaterial({
          color: isDark ? 0x101010 : 0xfafafa,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide
        });
        
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        
        // Position in a circle
        panel.position.x = Math.cos(angle) * panelRadius;
        panel.position.z = Math.sin(angle) * panelRadius;
        panel.position.y = 1.2;
        
        // Rotate to face center
        panel.rotation.y = angle + Math.PI / 2;
        
        // Add glow frame to panel
        const frameGeometry = new THREE.BoxGeometry(
          panelWidth + 0.1,
          panelHeight + 0.1,
          0.05
        );
        
        const frameMaterial = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? themeColors.primary : themeColors.secondary,
          transparent: true,
          opacity: 0.5
        });
        
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.z = -0.03;
        panel.add(frame);
        
        // Add code content to panel
        const codeLines = 8;
        const codeGroup = new THREE.Group();
        
        for (let j = 0; j < codeLines; j++) {
          const lineGeometry = new THREE.PlaneGeometry(
            0.6 + Math.random() * 0.4,
            0.04
          );
          
          const lineColor = j % 3 === 0 
            ? themeColors.primary 
            : j % 3 === 1 
              ? themeColors.secondary 
              : themeColors.accent;
              
          const lineMaterial = new THREE.MeshBasicMaterial({
            color: lineColor,
            transparent: true,
            opacity: 0.9
          });
          
          const line = new THREE.Mesh(lineGeometry, lineMaterial);
          
          // Position lines to look like code
          line.position.y = panelHeight * 0.4 - j * 0.15;
          line.position.x = -panelWidth * 0.3 + Math.random() * 0.1;
          line.position.z = 0.01;
          
          codeGroup.add(line);
          
          // Animate typing effect
          gsap.fromTo(
            line.scale,
            { x: 0 },
            {
              x: 1,
              duration: 1 + Math.random(),
              delay: j * 0.2 + i * 0.3,
              ease: "steps(10)"
            }
          );
        }
        
        panel.add(codeGroup);
        
        // Add floating animation
        gsap.to(panel.position, {
          y: panel.position.y + 0.2,
          duration: 2 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2
        });
        
        panelGroup.add(panel);
      }
      
      // Rotate all panels slowly
      gsap.to(panelGroup.rotation, {
        y: Math.PI * 2,
        duration: 40,
        repeat: -1,
        ease: "none"
      });
      
      codeSceneGroup.add(panelGroup);
      
      // Add central holographic element
      const hologramGroup = new THREE.Group();
      
      // Core sphere
      const coreGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: themeColors.primary,
        emissive: themeColors.primary,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
        metalness: 1,
        roughness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.1
      });
      
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.position.y = 1.2;
      hologramGroup.add(core);
      
      // Add orbiting rings
      const ringCount = 3;
      
      for (let i = 0; i < ringCount; i++) {
        const orbitRadius = 0.8 + i * 0.4;
        const orbitGeometry = new THREE.TorusGeometry(
          orbitRadius,
          0.03,
          8,
          64
        );
        
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: i === 0 ? themeColors.primary : i === 1 ? themeColors.secondary : themeColors.accent,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide
        });
        
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.position.y = 1.2;
        
        // Rotate each ring differently
        orbit.rotation.x = Math.PI / 2 + (i * Math.PI / 4);
        orbit.rotation.y = i * Math.PI / 3;
        
        // Animate each ring
        gsap.to(orbit.rotation, {
          x: orbit.rotation.x + Math.PI * 2,
          y: orbit.rotation.y + Math.PI * 2,
          duration: 10 + i * 5,
          repeat: -1,
          ease: "none"
        });
        
        hologramGroup.add(orbit);
        
        // Add particles along the ring orbit
        const particleCount = 12;
        
        for (let j = 0; j < particleCount; j++) {
          const particleAngle = (j / particleCount) * Math.PI * 2;
          const particleGeometry = new THREE.SphereGeometry(0.04, 8, 8);
          const particleMaterial = new THREE.MeshBasicMaterial({
            color: orbitMaterial.color,
            transparent: true,
            opacity: 0.8
          });
          
          const particle = new THREE.Mesh(particleGeometry, particleMaterial);
          
          // Position on the ring
          particle.position.x = Math.cos(particleAngle) * orbitRadius;
          particle.position.z = Math.sin(particleAngle) * orbitRadius;
          
          // Animate particle pulse
          gsap.to(particle.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 1 + Math.random(),
            repeat: -1,
            yoyo: true,
            delay: j * 0.2,
            ease: "sine.inOut"
          });
          
          orbit.add(particle);
        }
      }
      
      // Add a light beam from core to ground
      const beamGeometry = new THREE.CylinderGeometry(0.1, 0.5, 1.2, 16, 4, true);
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: themeColors.primary,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.position.y = 0.6;
      beam.rotation.x = Math.PI;
      hologramGroup.add(beam);
      
      // Animate beam opacity
      gsap.to(beamMaterial, {
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      codeSceneGroup.add(hologramGroup);
      
      return codeSceneGroup;
    }
    
    // Enhanced and flexible particle system for background effect
    function addParticleSystem(
      count?: number, 
      size?: number, 
      spread?: number, 
      isCodeParticles?: boolean
    ) {
      if (isMobile && particlesRef.current) return; // Skip on mobile if already exists
      
      if (!sceneRef.current) return;
      
      // Create a particle system with optimized count for mobile
      const particleCount = count || (isMobile ? 500 : 2000);
      const particleSize = size || 0.1;
      const particleSpread = spread || 15;
      const particles = new Float32Array(particleCount * 3);
      const particleSizes = new Float32Array(particleCount);
      const particleColors = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        if (isCodeParticles) {
          // For code particles, create a more structured pattern
          // Grid-like distribution with some randomness
          const gridX = Math.floor(i % 10) - 5;
          const gridY = Math.floor(i / 10) % 10 - 5;
          const gridZ = Math.floor(i / 100) - 5;
          
          particles[i3] = gridX * (particleSpread / 10) + (Math.random() - 0.5) * (particleSpread / 5);
          particles[i3+1] = gridY * (particleSpread / 10) + (Math.random() - 0.5) * (particleSpread / 5);
          particles[i3+2] = gridZ * (particleSpread / 10) + (Math.random() - 0.5) * (particleSpread / 5);
          
          // Digital appearance
          particleSizes[i] = Math.random() > 0.8 ? particleSize * 2 : particleSize;
          
          // Binary colors (green or blue tones)
          if (Math.random() > 0.5) {
            particleColors[i3] = 0.2; // R
            particleColors[i3+1] = 0.8; // G
            particleColors[i3+2] = 0.4; // B
          } else {
            particleColors[i3] = 0.2; // R
            particleColors[i3+1] = 0.4; // G
            particleColors[i3+2] = 0.9; // B
          }
        } else {
          // For normal particles, use a spherical distribution
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const r = particleSpread * Math.cbrt(Math.random()); // Cube root for more even distribution
          
          particles[i3] = r * Math.sin(phi) * Math.cos(theta);
          particles[i3+1] = r * Math.cos(phi);
          particles[i3+2] = r * Math.sin(phi) * Math.sin(theta);
          
          // Randomize sizes for visual interest
          particleSizes[i] = particleSize * 0.5 + Math.random() * particleSize;
          
          // Color based on theme with variations
          const primaryColor = new THREE.Color(themeColors.primary);
          const secondaryColor = new THREE.Color(themeColors.secondary);
          const accentColor = new THREE.Color(themeColors.accent);
          
          // Mix colors for more interesting particles
          let finalColor;
          const colorRand = Math.random();
          
          if (colorRand < 0.7) {
            finalColor = primaryColor;
          } else if (colorRand < 0.9) {
            finalColor = secondaryColor;
          } else {
            finalColor = accentColor;
          }
          
          particleColors[i3] = finalColor.r;
          particleColors[i3+1] = finalColor.g;
          particleColors[i3+2] = finalColor.b;
        }
      }
      
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
      
      // Create optimized particle texture to improve performance
      const particleTexture = createParticleTexture(isCodeParticles);
      
      const particleMaterial = new THREE.PointsMaterial({
        size: particleSize,
        transparent: true,
        opacity: 0.6,
        map: particleTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        vertexColors: true
      });
      
      const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
      sceneRef.current.add(particleSystem);
      particlesRef.current = particleSystem;
      
      // Utility function to create an optimized particle texture
      function createParticleTexture(isCode = false) {
        const canvas = document.createElement('canvas');
        const size = isCode ? 32 : 16; // Higher resolution for code particles
        canvas.width = size;
        canvas.height = size;
        
        const context = canvas.getContext('2d');
        if (!context) return null;
        
        if (isCode) {
          // Create binary-looking particles
          context.fillStyle = 'rgba(255, 255, 255, 0)';
          context.fillRect(0, 0, size, size);
          
          context.font = '20px monospace';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillStyle = 'rgba(255, 255, 255, 1)';
          
          // Randomly choose 0 or 1 for the binary look
          context.fillText(Math.random() > 0.5 ? '0' : '1', size/2, size/2);
        } else {
          // Create a radial gradient for softer particles
          const gradient = context.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
          gradient.addColorStop(0.5, 'rgba(200, 200, 200, 0.5)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          context.fillStyle = gradient;
          context.fillRect(0, 0, size, size);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
      }
    }

    return () => {
      // Cancel animation frame to stop rendering
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      // Properly dispose of THREE.js resources to prevent memory leaks
      if (rendererRef.current) {
        // Dispose of the renderer and its resources
        rendererRef.current.dispose();
        
        // Safely remove renderer DOM element if it exists
        if (rendererRef.current.domElement) {
          const parent = rendererRef.current.domElement.parentElement;
          
          // Safe check to avoid "not a child" DOM errors
          if (parent && parent.contains && parent.contains(rendererRef.current.domElement)) {
            try {
              parent.removeChild(rendererRef.current.domElement);
            } catch (error) {
              console.log('DOM removal error handled gracefully');
            }
          }
        }
      }
      
      // Dispose scene resources properly
      if (sceneRef.current) {
        // Dispose geometries and materials
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
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
      
      // Remove custom cursor text
      containerRef.current?.removeAttribute('data-cursor-text');
    };
  }, [theme, isDark, themeColors, scrollTrigger, isMobile, isHovered, isDragging, interactionStartPos, modelRotation, mousePosition, modelType, isInView]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full cursor-grab active:cursor-grabbing relative"
      style={{ touchAction: 'none' }} // Prevent default touch actions on mobile
      data-cursor-text={isHovered && !isDragging ? "Drag to Rotate" : undefined}
    >
      {/* Optional loading indicator for slow devices */}
      {!isInView && scrollTrigger && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ThreeDModel;