import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";

function Header({ actualMode, toggleColorMode }) {
  const { t } = useTranslation();

  return (
    <AppBar position="static" elevation={0} color="transparent">
      <Toolbar sx={{ flexGrow: 1}}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* {t("header.title")} */}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={actualMode === "dark" ? t("theme.dark") : t("theme.light")}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {actualMode === "dark" ? (
                <Brightness4Icon />
              ) : (
                <Brightness7Icon />
              )}
            </IconButton>
          </Tooltip>
          <LanguageSwitcher />
          <IconButton
            color="inherit"
            href={t("app.sourceCodeURL")}
            target="_blank"
          >
            <GitHubIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
