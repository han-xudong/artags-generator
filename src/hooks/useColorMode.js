import { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";

export function useColorMode() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState("light");

  const actualMode =
    mode === "dark" ? (prefersDarkMode ? "dark" : "light") : mode;

  useEffect(() => {
    const savedMode = localStorage.getItem("colorMode");
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = actualMode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("colorMode", newMode);
  };

  return { actualMode, toggleColorMode };
}
