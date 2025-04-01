import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import ParticlesEffect from '@/components/three/ParticlesEffect';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Home() {
  const isMobile = useIsMobile();
  
  // Smooth scroll behavior
  useEffect(() => {
    // Add smooth scroll to all anchor links
    const handleClick = (e: Event) => {
      e.preventDefault();
      
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (!href) return;
      
      const targetElement = document.querySelector(href);
      if (!targetElement) return;
      
      window.scrollTo({
        top: targetElement.getBoundingClientRect().top + window.pageYOffset,
        behavior: 'smooth'
      });
    };
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleClick);
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleClick);
      });
    };
  }, []);
  
  return (
    <div className="relative bg-background min-h-screen">
      {/* Background particle effect - disabled on mobile for performance */}
      {!isMobile && <ParticlesEffect />}
      
      {/* Custom cursor - only on desktop */}
      {!isMobile && <CustomCursor />}
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main content */}
      <main>
        <Hero />
        <Services />
        <Skills />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}