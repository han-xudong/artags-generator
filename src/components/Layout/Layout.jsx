/**
 * Layout Component
 * Provides the main application layout structure with header, content area, and footer
 * Handles theme mode toggling and responsive layout adjustments
 */
import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Layout Component
 * Wraps the application content with consistent header and footer
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in the main content area
 * @param {string} props.actualMode - Current theme mode (light/dark)
 * @param {Function} props.toggleColorMode - Function to toggle between light and dark modes
 * @returns {JSX.Element} The rendered layout component
 */
function Layout({ children, actualMode, toggleColorMode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Application header with theme toggle */}
      <Header actualMode={actualMode} toggleColorMode={toggleColorMode} />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: "100%",
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3 },
          mx: "auto",
        }}
      >
        {children}
      </Box>

      {/* Application footer */}
      <Footer />
    </Box>
  );
}

export default Layout;
