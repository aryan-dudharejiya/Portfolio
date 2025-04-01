import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Theme types
type Theme = "light" | "dark";
type ThemeMode = "system" | "light" | "dark";

// Define the context type
interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

// Create the context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  themeMode: "system",
  toggleTheme: () => {},
  setThemeMode: () => {},
  isDark: true,
});

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get the system preference
  const getSystemTheme = (): Theme => {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) 
      ? 'dark' 
      : 'light';
  };

  // Try to get theme mode from localStorage
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedThemeMode = localStorage.getItem('themeMode') as ThemeMode;
      if (savedThemeMode === 'light' || savedThemeMode === 'dark' || savedThemeMode === 'system') {
        return savedThemeMode;
      }
    }
    return 'system'; // Default to system theme preference
  });
  
  // Calculate the actual theme based on mode
  const calculateTheme = useCallback((): Theme => {
    if (themeMode === 'system') {
      return getSystemTheme();
    }
    return themeMode;
  }, [themeMode]);
  
  // Set the initial theme
  const [theme, setTheme] = useState<Theme>(calculateTheme());
  
  // Listen for changes to system theme preference
  useEffect(() => {
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        setTheme(getSystemTheme());
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);
  
  // Update theme when themeMode changes
  useEffect(() => {
    setTheme(calculateTheme());
  }, [themeMode, calculateTheme]);

  // Apply theme class to document and save to localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes and add the active one
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Update meta theme-color for browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        theme === 'dark' ? '#1e1e2e' : '#ffffff'
      );
    }
    
    // Store preferences
    localStorage.setItem('themeMode', themeMode);
  }, [theme, themeMode]);

  // Toggle between light and dark modes
  const toggleTheme = useCallback(() => {
    setThemeMode((prevMode) => {
      // If system, directly set to light/dark based on current theme
      if (prevMode === 'system') {
        return theme === 'dark' ? 'light' : 'dark';
      }
      // Otherwise toggle between light and dark
      return prevMode === 'dark' ? 'light' : 'dark';
    });
  }, [theme]);

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        themeMode, 
        toggleTheme, 
        setThemeMode,
        isDark: theme === 'dark'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;