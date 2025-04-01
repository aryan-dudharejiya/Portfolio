/**
 * Accessibility utilities for improving website accessibility
 */

/**
 * Generates ARIA attributes for interactive elements
 * @param id Element ID
 * @param label Accessible label
 * @param description Optional description
 * @returns Object with ARIA attributes
 */
export function getAriaProps(id: string, label: string, description?: string) {
  const props: Record<string, string> = {
    'aria-labelledby': `${id}-label`,
    id,
  };
  
  if (description) {
    props['aria-describedby'] = `${id}-description`;
  }
  
  return props;
}

/**
 * Creates a visually hidden element for screen readers
 * @param children Content to be visually hidden but read by screen readers
 * @returns JSX element that's visually hidden but accessible to screen readers
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  // This is JSX that will be used in React components
  return {
    type: 'span',
    props: {
      className: "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
      style: { clip: 'rect(0, 0, 0, 0)' },
      children
    }
  };
}

/**
 * Creates a skip link for keyboard navigation
 * Allows keyboard users to skip to main content
 */
export function SkipToContent() {
  // This is JSX that will be used in React components
  return {
    type: 'a',
    props: {
      href: "#main-content",
      className: "absolute left-0 top-0 z-50 p-2 bg-primary text-white transform -translate-y-full focus:translate-y-0 transition-transform",
      children: "Skip to main content"
    }
  };
}

/**
 * Check if a color contrast meets WCAG standards
 * @param foreground Foreground color in hex
 * @param background Background color in hex
 * @returns Boolean indicating if the contrast meets WCAG AA standard
 */
export function meetsContrastStandards(foreground: string, background: string): boolean {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } 
      : { r: 0, g: 0, b: 0 };
  };
  
  // Calculate relative luminance
  const luminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };
  
  const rgb1 = hexToRgb(foreground);
  const rgb2 = hexToRgb(background);
  
  const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  // WCAG AA requires a contrast ratio of at least 4.5:1 for normal text
  // and 3:1 for large text
  return ratio >= 4.5; 
}

/**
 * Keyboard accessibility utilities
 */
export const KeyboardUtils = {
  /**
   * Handles keyboard navigation for interactive elements
   * @param event Keyboard event
   * @param callback Callback function to execute on Enter/Space
   */
  handleKeyDown: (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  },
  
  /**
   * Makes an element focusable and keyboard interactive
   * @param callback Function to call on activation
   * @returns Props for interactive element
   */
  makeInteractive: (callback: () => void) => ({
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => KeyboardUtils.handleKeyDown(e, callback),
    onClick: callback,
  }),
}