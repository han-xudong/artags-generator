import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

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
      <Header actualMode={actualMode} toggleColorMode={toggleColorMode} />

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

      <Footer />
    </Box>
  );
}

export default Layout;
