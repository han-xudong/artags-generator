/**
 * Color Mode Hook
 * Custom React hook for managing theme color mode (light/dark)
 * Handles user preferences, local storage persistence, and system preference detection
 */
import { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";

/**
 * useColorMode Hook
 * Provides functionality to get and toggle between light and dark themes
 * @returns {Object} Object containing the current mode and toggle function
 */
export function useColorMode() {
  // Detect system preference for dark mode
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  // State to track the current color mode - initialize with system preference
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

  // The actual mode to be used by the application
  const actualMode = mode;

  // Load saved color mode preference from localStorage on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem("colorMode");
    if (savedMode) {
      setMode(savedMode);
    } else if (prefersDarkMode) {
      // If no saved preference but system prefers dark mode
      setMode("dark");
    }
  }, [prefersDarkMode]);

  /**
   * Toggle between light and dark color modes
   * Saves the preference to localStorage for persistence
   */
  const toggleColorMode = () => {
    const newMode = actualMode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("colorMode", newMode);
  };

  return { actualMode, toggleColorMode };
}
