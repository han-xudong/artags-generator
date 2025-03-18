/**
 * AprilTag Generator Component
 * Renders and manages the generation of AprilTag markers based on user-selected parameters
 * Handles loading states, error conditions, and image display
 */
import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { useTagStore } from "../../store/tagStore";
import { generateAprilTagSVG, svgToImageUrl } from "../../utils/svgTagGenerators";
import { useTranslation } from "react-i18next";

/**
 * AprilTag Generator Component
 * Creates and displays AprilTag markers with specified parameters
 * @returns {JSX.Element} The rendered AprilTag generator component
 */
const AprilTagGenerator = () => {
  const { t } = useTranslation();
  // Get tag parameters from global store
  const { tagFamily, tagID, tagSize, margin } = useTagStore();
  // Component state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markerId, setMarkerId] = useState(tagID);
  const [svgImage, setSvgImage] = useState(null);

  // Mapping of tag families to dictionary keys
  const familyToDict = {
    tag16h5: "april_16h5",
    tag25h9: "april_25h9",
    tag36h11: "april_36h11",
  };

  // Generate tag when parameters change
  useEffect(() => {
    let isMounted = true;

    /**
     * Generate AprilTag asynchronously
     * Handles tag generation, error states, and cleanup
     */
    const generateTag = async () => {
      try {
        setLoading(true);
        setError(null);

        // Map tag family to dictionary key and validate tag ID
        const dictKey = familyToDict[tagFamily] || "april_36h11";
        let validId = tagID;

        if (
          window.dict &&
          window.dict[dictKey] &&
          tagID >= window.dict[dictKey].length
        ) {
          validId = 0;
          if (isMounted) setMarkerId(validId);
        }

        // Generate SVG tag
        const svgElement = await generateAprilTagSVG(
          tagFamily,
          validId,
          tagSize,
          margin
        );
        
        // Convert SVG to image URL
        const imageUrl = svgToImageUrl(svgElement);

        if (isMounted) {
          setSvgImage(imageUrl);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error generating AprilTag:", err);
        if (isMounted) {
          setError(err.message || "Failed to generate AprilTag");
          setLoading(false);
        }
      }
    };

    generateTag();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
      // Clean up image URL
      if (svgImage) {
        URL.revokeObjectURL(svgImage);
      }
    };
  }, [tagFamily, tagID, tagSize, margin]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" gutterBottom textAlign="center">
        {t("preview.apriltagTitle")}
      </Typography>

      <Typography
        variant="subtitle2"
        gutterBottom
        color="text.secondary"
        textAlign="center"
      >
        {t("preview.family")}: {tagFamily}, {t("preview.id")}: {markerId}
      </Typography>

      <Box
        sx={{
          mt: 2,
          mb: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flexGrow: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <img
            src={svgImage}
            alt={`AprilTag ${markerId}`}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default AprilTagGenerator;
