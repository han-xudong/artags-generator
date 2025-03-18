/**
 * Tag Preview Component
 * Displays a preview of the currently configured AR tag (Aruco or AprilTag)
 * Shows the visual representation and tag information based on user settings
 */
import React from 'react';
import { Paper, Box, Typography, Divider } from '@mui/material';
import { useTagStore } from '../../store/tagStore';
import ArucoGenerator from './ArucoGenerator';
import AprilTagGenerator from './AprilTagGenerator';

/**
 * TagPreview Component
 * Renders the appropriate tag generator component based on selected tag type
 * Displays tag information including type, dictionary/family, ID and size
 * @returns {JSX.Element} The rendered tag preview component
 */
const TagPreview = () => {
  // Get current tag configuration from store
  const { tagType, dictionary, tagFamily, tagID, tagSize } = useTagStore();
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Tag Preview
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ mt: 2, mb: 2 }}>
        {tagType === 'aruco' 
          ? <ArucoGenerator /> 
          : <AprilTagGenerator />
        }
      </Box>
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {tagType === 'aruco' 
            ? `Aruco (${dictionary}) ID: ${tagID}, Size: ${tagSize}mm` 
            : `AprilTag (${tagFamily}) ID: ${tagID}, Size: ${tagSize}mm`
          }
        </Typography>
      </Box>
    </Paper>
  );
};

export default TagPreview;
