import React from 'react';

/**
 * Creates a visually hidden element for screen readers
 * @param children Content to be visually hidden but read by screen readers
 * @returns JSX element that's visually hidden but accessible to screen readers
 */
export const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span 
      className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
      style={{ clip: 'rect(0, 0, 0, 0)' }}
    >
      {children}
    </span>
  );
};

/**
 * Creates a skip link for keyboard navigation
 * Allows keyboard users to skip to main content
 */
export const SkipToContent: React.FC = () => {
  return (
    <a 
      href="#main-content" 
      className="absolute left-0 top-0 z-50 p-2 bg-primary text-white transform -translate-y-full focus:translate-y-0 transition-transform"
    >
      Skip to main content
    </a>
  );
};

/**
 * Accessible icon button with proper ARIA attributes
 */
export const AccessibleIconButton: React.FC<{
  onClick: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}> = ({ onClick, label, className = '', children }) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={className}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </button>
  );
};

/**
 * Adds a role landmark to indicate main content section
 */
export const MainContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <main id="main-content" role="main" className={className} tabIndex={-1}>
      {children}
    </main>
  );
};

/**
 * Wraps a section with proper ARIA role and heading
 */
export const Section: React.FC<{
  children: React.ReactNode;
  id: string;
  title: string;
  className?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}> = ({ children, id, title, className = '', headingLevel = 'h2' }) => {
  const Heading = headingLevel;
  
  return (
    <section 
      id={id} 
      className={className} 
      aria-labelledby={`${id}-heading`}
    >
      <Heading id={`${id}-heading`}>{title}</Heading>
      {children}
    </section>
  );
};

/**
 * Creates a navigation landmark for better screen reader navigation
 */
export const Navigation: React.FC<{
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}> = ({ children, className = '', ariaLabel = 'Main Navigation' }) => {
  return (
    <nav className={className} role="navigation" aria-label={ariaLabel}>
      {children}
    </nav>
  );
};