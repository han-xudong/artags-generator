/**
 * Parameter Controls Component
 * Provides UI controls for configuring tag generation parameters
 * Allows users to select tag type, dictionary/family, ID, size, and margin
 */
import React from "react";
import {
  Paper,
  Typography,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Tabs,
  Tab,
  TextField,
  Divider,
} from "@mui/material";
import { useTagStore } from "../../store/tagStore";
import { useTranslation } from "react-i18next";

/**
 * Parameter Controls Component
 * Renders a panel with controls for all tag generation parameters
 * @returns {JSX.Element} The rendered parameter controls component
 */
const ParameterControls = () => {
  const { t } = useTranslation();
  // Get tag parameters and setters from global store
  const {
    tagType,
    setTagType,
    dictionary,
    setDictionary,
    tagFamily,
    setTagFamily,
    tagID,
    setTagID,
    tagSize,
    setTagSize,
    margin,
    setMargin,
  } = useTagStore();

  // Available ArUco dictionaries with descriptive labels
  const arucoDictionaries = [
    { value: "DICT_4X4 (50, 100, 250, 1000)", label: "DICT_4X4_1000" },
    { value: "DICT_5X5 (50, 100, 250, 1000)", label: "DICT_5X5_1000" },
    { value: "DICT_6X6 (50, 100, 250, 1000)", label: "DICT_6X6_1000" },
    { value: "DICT_7X7 (50, 100, 250, 1000)", label: "DICT_7X7_1000" },
  ];

  // Available AprilTag families
  const tagFamilies = ["tag16h5", "tag25h9", "tag36h10", "tag36h11"];

  /**
   * Get maximum valid ID based on selected tag type and family
   * @returns {number} Maximum valid tag ID
   */
  const getMaxID = () => {
    if (tagType === "aruco") {
      return 999; // 1000 markers (0-999)
    } else {
      if (tagFamily === "tag16h5") return 29;
      if (tagFamily === "tag25h9") return 34;
      if (tagFamily === "tag36h10") return 2319;
      return 586; // tag36h11
    }
  };

  /**
   * Handle tag ID input changes with validation
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleIDChange = (e) => {
    const newID = parseInt(e.target.value, 10);
    if (isNaN(newID)) return;
    const maxID = getMaxID();
    if (newID >= 0 && newID <= maxID) {
      setTagID(newID);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        {t("controls.title")}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tagType}
          onChange={(e, newValue) => setTagType(newValue)}
          centered
        >
          <Tab value="aruco" label={t("controls.tagType.aruco")} />
          <Tab value="apriltag" label={t("controls.tagType.apriltag")} />
        </Tabs>
      </Box>

      {tagType === "aruco" ? (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t("controls.dictionary")}</InputLabel>
          <Select
            value={dictionary}
            onChange={(e) => setDictionary(e.target.value)}
            label={t("controls.dictionary")}
          >
            {arucoDictionaries.map((dict) => (
              <MenuItem key={dict.value} value={dict.label}>
                {dict.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t("controls.tagFamily")}</InputLabel>
          <Select
            value={tagFamily}
            onChange={(e) => setTagFamily(e.target.value)}
            label={t("controls.tagFamily")}
          >
            {tagFamilies.map((family) => (
              <MenuItem key={family} value={family}>
                {family}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>
          {t("controls.tagID")} (0-{getMaxID()})
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Slider
            value={tagID}
            onChange={(e, newValue) => setTagID(newValue)}
            min={0}
            max={getMaxID()}
            sx={{ flexGrow: 1, mr: 2 }}
            valueLabelDisplay="auto"
          />
          <TextField
            type="number"
            value={tagID}
            onChange={handleIDChange}
            inputProps={{
              min: 0,
              max: getMaxID(),
              step: 1,
            }}
            sx={{ width: "100px" }}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>{t("controls.tagSize")}</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Slider
            value={tagSize}
            onChange={(e, newValue) => setTagSize(newValue)}
            min={1}
            max={1000}
            step={1}
            sx={{ flexGrow: 1, mr: 2 }}
            valueLabelDisplay="auto"
          />
          <TextField
            type="number"
            value={tagSize}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 1 && value <= 1000) {
                setTagSize(value);
              }
            }}
            inputProps={{
              min: 1,
              max: 1000,
              step: 1,
            }}
            sx={{ width: "100px" }}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 1 }}>
        <Typography gutterBottom>{t("controls.margin")}</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Slider
            value={margin}
            onChange={(e, newValue) => setMargin(newValue)}
            min={0}
            max={200}
            sx={{ flexGrow: 1, mr: 2 }}
            valueLabelDisplay="auto"
          />
          <TextField
            type="number"
            value={margin}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 0 && value <= 200) {
                setMargin(value);
              }
            }}
            inputProps={{
              min: 0,
              max: 200,
              step: 5,
            }}
            sx={{ width: "100px" }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default ParameterControls;
