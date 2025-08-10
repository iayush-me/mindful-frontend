import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box component="footer" sx={{ py: 2, textAlign: 'center', mt: 6, bgcolor: 'background.paper' }}>
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} Mindful Moments. All rights reserved.
    </Typography>
  </Box>
);

export default Footer;
