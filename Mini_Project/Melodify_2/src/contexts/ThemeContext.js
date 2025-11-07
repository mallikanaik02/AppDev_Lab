import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, StatusBar } from 'react-native';
import { Colors } from '../constants/Colors';

// Create Theme Context
const ThemeContext = createContext();

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Get system theme preference
  const systemTheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });
    
    return () => subscription?.remove();
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Get current theme colors
  const theme = isDarkMode ? Colors.dark : Colors.light;

  // Update status bar style based on theme
  useEffect(() => {
    StatusBar.setBarStyle(
      isDarkMode ? 'light-content' : 'dark-content',
      true
    );
  }, [isDarkMode]);

  const value = {
    isDarkMode,
    theme,
    toggleTheme,
    colors: theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
