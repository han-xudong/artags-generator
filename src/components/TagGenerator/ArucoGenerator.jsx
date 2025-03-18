/**
 * ArUco Tag Generator Component
 * Renders and manages the generation of ArUco markers based on user-selected parameters
 * Handles loading states, error conditions, and image display
 */
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { useTagStore} from '../../store/tagStore';
import { generateArucoTagSVG, svgToImageUrl } from '../../utils/svgTagGenerators';
import { useTranslation } from 'react-i18next';

/**
 * ArUco Generator Component
 * Creates and displays ArUco markers with specified parameters
 * @returns {JSX.Element} The rendered ArUco generator component
 */
const ArucoGenerator = () => {
  const { t } = useTranslation();
  // Get tag parameters from global store
  const { dictionary, tagID, tagSize, margin } = useTagStore();
  // Component state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markerId, setMarkerId] = useState(tagID);
  const [svgImage, setSvgImage] = useState(null);
  
  // Generate tag when parameters change
  useEffect(() => {
    let isMounted = true;
    
    /**
     * Generate ArUco tag asynchronously
     * Handles tag generation, error states, and cleanup
     */
    const generateTag = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validate tag ID is within dictionary range
        let validId = tagID;
        if (window.dict && window.dict["aruco"] && tagID >= window.dict["aruco"].length) {
          validId = 0;
          if (isMounted) setMarkerId(validId);
        }
        
        // Generate SVG tag
        const svgElement = await generateArucoTagSVG(
          dictionary,
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
        console.error('Error generating ArUco tag:', err);
        if (isMounted) {
          setError(err.message || 'Failed to generate ArUco tag');
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
  }, [dictionary, tagID, tagSize, margin]);
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        width: '100%',
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography variant="h6" gutterBottom textAlign="center">
        {t('preview.arucoTitle')}
      </Typography>
      
      <Typography variant="subtitle2" gutterBottom color="text.secondary" textAlign="center">
        {t('preview.dictionary')}: {dictionary}, {t('preview.id')}: {markerId}
      </Typography>
      
      <Box 
        sx={{ 
          mt: 2,
          mb: 2, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          width: '100%',
          flexGrow: 1,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <img 
            src={svgImage} 
            alt={`ArUco Tag ${markerId}`}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              objectFit: 'contain'
            }} 
          />
        )}
      </Box>
    </Paper>
  );
};

export default ArucoGenerator;
