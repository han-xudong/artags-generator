import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { useTagStore} from '../../store/tagStore';
import { generateArucoTag } from '../../utils/tagGenerators';
import { useTranslation } from 'react-i18next';

const ArucoGenerator = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const { dictionary, tagID, tagSize, margin, dpi } = useTagStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markerId, setMarkerId] = useState(tagID);
  
  useEffect(() => {
    let isMounted = true;
    
    const generateTag = async () => {
      if (!canvasRef.current) return;
      
      try {
        setLoading(true);
        setError(null);
        
        let validId = tagID;
        if (window.dict && window.dict["aruco"] && tagID >= window.dict["aruco"].length) {
          validId = 0;
          if (isMounted) setMarkerId(validId);
        }
        
        await generateArucoTag(
          canvasRef.current,
          dictionary,
          validId,
          tagSize,
          dpi,
          margin
        );
        
        if (isMounted) setLoading(false);
      } catch (err) {
        console.error('Error generating ArUco tag:', err);
        if (isMounted) {
          setError(err.message || 'Failed to generate ArUco tag');
          setLoading(false);
        }
      }
    };
    
    generateTag();
    
    return () => {
      isMounted = false;
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
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : null}
        
        <canvas 
          ref={canvasRef} 
          className="preview-canvas"
          style={{ 
            border: '1px solid #e0e0e0', 
            maxHeight: '90%',
            maxWidth: '90%',
            objectFit: 'contain',
            display: loading || error ? 'none' : 'block'
          }}
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {tagSize} x {tagSize} mm ({margin} mm margin)
      </Typography>
    </Paper>
  );
};

export default ArucoGenerator;
