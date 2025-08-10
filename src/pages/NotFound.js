import React from 'react';
import { Container, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Container sx={{ mt: 6, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>404 - Page Not Found</Typography>
      <Typography>The page you requested does not exist.</Typography>
    </Container>
  );
}
