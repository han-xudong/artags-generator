/**
 * Language Switcher Component
 * Provides a dropdown menu for users to select their preferred language
 * Uses i18next for internationalization and Material UI for the interface
 */
import React from 'react';
import { Button, Menu, MenuItem, IconButton } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

/**
 * LanguageSwitcher Component
 * Renders a language selection dropdown with available language options
 * @returns {JSX.Element} The rendered language switcher component
 */
const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  /**
   * Handle click on language button to open menu
   * @param {React.MouseEvent} event - The click event
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  /**
   * Close the language menu
   */
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  /**
   * Change the application language
   * @param {string} lng - The language code to switch to
   */
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <div>
      <IconButton 
        color="inherit"
        aria-label="language"
        id="language-button"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        <MenuItem onClick={() => changeLanguage('en')} selected={i18n.language === 'en'}>
          {t('language.en')}
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('zh')} selected={i18n.language === 'zh'}>
          {t('language.zh')}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;
