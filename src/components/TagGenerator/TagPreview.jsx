import React from 'react';
import { Paper, Box, Typography, Divider } from '@mui/material';
import { useTagStore } from '../../store/tagStore';
import ArucoGenerator from './ArucoGenerator';
import AprilTagGenerator from './AprilTagGenerator';


const TagPreview = () => {
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
