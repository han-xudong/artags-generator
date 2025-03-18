import React, { useState, useEffect } from "react";
import { Button, Paper, Typography, Box, Grid} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  Code as SvgIcon,
  Image as PngIcon,
} from "@mui/icons-material";
import { useTagStore } from "../../store/tagStore";
import { exportAsSVG, exportAsPDF, exportAsPNG } from "../../utils/exportHelpers";
import { generateArucoTagSVG, generateAprilTagSVG } from "../../utils/svgTagGenerators";
import { useTranslation } from "react-i18next";


const ExportOptions = () => {
  const { t } = useTranslation();
  const { tagType, tagID, dictionary, tagFamily, tagSize, margin } = useTagStore();
  const [svgElement, setSvgElement] = useState(null);
  
  useEffect(() => {
    const generateSvg = async () => {
      try {
        if (tagType === "aruco") {
          const svg = await generateArucoTagSVG(dictionary, tagID, tagSize, margin);
          setSvgElement(svg);
        } else {
          const svg = await generateAprilTagSVG(tagFamily, tagID, tagSize, margin);
          setSvgElement(svg);
        }
      } catch (error) {
        console.error("Error generating SVG for export:", error);
      }
    };
    
    generateSvg();
  }, [tagType, tagID, dictionary, tagFamily, tagSize, margin]);

  const getFilename = () => {
    if (tagType === "aruco") {
      return `Aruco-${dictionary}-ID${tagID}`;
    } else {
      return `AprilTag-${tagFamily}-ID${tagID}`;
    }
  };

  const handleExport = (format) => {
    if (!svgElement) {
      console.error("No SVG element available for export");
      return;
    }

    const filename = getFilename();

    if (format === "svg") {
      // 直接导出SVG元素
      exportAsSVG(svgElement, filename, tagSize, margin);
    } else if (format === "pdf") {
      // 使用SVG元素导出PDF
      exportAsPDF(svgElement, filename, tagSize, margin);
    } else if (format === "png") {
      // 使用SVG元素导出PNG
      exportAsPNG(svgElement, filename);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        {t("export.title")}
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        {t("export.description")}
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            startIcon={<SvgIcon />}
            onClick={() => handleExport("svg")}
            color="primary"
          >
            {t("export.svg")}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={() => handleExport("pdf")}
            color="secondary"
          >
            {t("export.pdf")}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<PngIcon />}
            onClick={() => handleExport("png")}
            color="info"
          >
            {t("export.png")}
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          display="block"
        >
          {t("export.hint")}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ExportOptions;
