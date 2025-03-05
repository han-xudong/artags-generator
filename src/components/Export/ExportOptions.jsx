import React from "react";
import { Button, Paper, Typography, Box, Grid} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  Code as SvgIcon,
  Image as PngIcon,
} from "@mui/icons-material";
import { useTagStore } from "../../store/tagStore";
import { exportAsSVG, exportAsPDF, exportAsPNG } from "../../utils/exportHelpers";
import { useTranslation } from "react-i18next";


const ExportOptions = () => {
  const { t } = useTranslation();
  const { tagType, tagID, dictionary, tagFamily, tagSize, margin } = useTagStore();

  const getFilename = () => {
    if (tagType === "aruco") {
      return `Aruco-${dictionary}-ID${tagID}`;
    } else {
      return `AprilTag-${tagFamily}-ID${tagID}`;
    }
  };

  const handleExport = (format) => {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      console.error("No canvas element found");
      return;
    }

    const filename = getFilename();

    if (format === "svg") {
      exportAsSVG(canvas, filename, tagSize, margin);
    } else if (format === "pdf") {
      exportAsPDF(canvas, filename, tagSize, margin);
    } else if (format === "png") {
      exportAsPNG(canvas, filename);
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
