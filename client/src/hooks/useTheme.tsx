import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

/**
 * Custom hook for accessing and manipulating theme settings
 * 
 * @returns {Object} Theme context object with the following properties:
 * - theme: The current theme ('light' or 'dark')
 * - themeMode: The current theme mode ('system', 'light', or 'dark')
 * - toggleTheme: Function to toggle between light and dark themes
 * - setThemeMode: Function to set the theme mode directly
 * - isDark: Boolean indicating if the current theme is dark
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default useTheme;