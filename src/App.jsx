// src/App.jsx
/**
 * Main Application Component
 * This is the root component of the application that sets up the theme provider,
 * layout structure, and renders the appropriate tag generator based on user selection.
 */
import React, { Suspense } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useTranslation } from "react-i18next";
import Layout from "./components/Layout/Layout";
import ArucoGenerator from "./components/TagGenerator/ArucoGenerator";
import AprilTagGenerator from "./components/TagGenerator/AprilTagGenerator";
import ParameterControls from "./components/TagGenerator/ParameterControls";
import ExportOptions from "./components/Export/ExportOptions";
import { useTagStore } from "./store/tagStore";
import { useColorMode } from "./hooks/useColorMode";

/**
 * App Component
 * Handles theme configuration, responsive layout, and component rendering
 * @returns {JSX.Element} The rendered application
 */
function App() {
  const { t } = useTranslation();
  const { tagType } = useTagStore();
  const { actualMode, toggleColorMode } = useColorMode();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Create theme based on current color mode
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: actualMode,
          primary: {
            main: "#3f51b5",
          },
          secondary: {
            main: "#f50057",
          },
          background: {
            ...(actualMode === "light" ? { paper: "#f5f5f5" } : {}),
          },
        },
      }),
    [actualMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CircularProgress />
              <div>{t("app.loading")}</div>
            </Box>
          }
        >
          <Layout actualMode={actualMode} toggleColorMode={toggleColorMode}>
            <div
              className="app-header"
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              <h1 style={{ margin: "10px 0" }}>{t("app.title")}</h1>
              <p style={{ color: "#666" }}>{t("app.description")}</p>
            </div>

            <Box
              sx={{
                width: "100%",
                minHeight: isMobile ? "auto" : "calc(100vh - 220px)",
              }}
              className="equal-height-container"
            >
              <Grid
                container
                spacing={isMobile ? 2 : 3}
                className="content-area"
                sx={{
                  height: "100%",
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={5}
                  lg={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    mb: isMobile ? 1 : 0,
                    height: "850px",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <ParameterControls />
                  </Box>
                  <Box sx={{ mt: 0 }}>
                    <ExportOptions />
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={7}
                  lg={8}
                  sx={{
                    display: "flex",
                    minHeight: isMobile ? "350px" : "850px",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {tagType === "aruco" ? (
                      <ArucoGenerator />
                    ) : (
                      <AprilTagGenerator />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Layout>
        </Suspense>
      </div>
    </ThemeProvider>
  );
}

export default App;
