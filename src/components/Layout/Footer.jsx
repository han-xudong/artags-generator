import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <Box sx={{ mt: 6, mb: 3, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </Typography>
    </Box>
  );
};

export default Footer;
