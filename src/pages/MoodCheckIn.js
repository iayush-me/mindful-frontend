import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';

import moodService from '../services/moodService';

const MoodCheckIn = () => {
  const [mood, setMood] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submitMood = async () => {
    if (!mood.trim()) {
      setMessage('Please enter your mood.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const res = await moodService.submitMood(mood.trim());
      setMessage(`Mood submitted! AI Sentiment Score: ${res.sentiment ?? 'N/A'}`);
      setMood('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to submit mood.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 5,
          boxShadow:
            '0 12px 20px -10px rgba(0,0,0,0.12), 0 4px 20px 0 rgba(0,0,0,0.07), 0 7px 8px -5px rgba(0,123,255,0.2)',
          bgcolor: '#e3f2fd',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow:
              '0 20px 30px -15px rgba(0,0,0,0.15), 0 6px 30px 0 rgba(0,0,0,0.1), 0 12px 14px -7px rgba(0,123,255,0.35)',
          },
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          fontWeight={900} 
          color="primary.main" 
          sx={{ letterSpacing: 1.2, userSelect: 'none' }}
        >
          Mood Check-in
        </Typography>

        <TextField
          label="How are you feeling?"
          multiline
          rows={6}
          fullWidth
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          disabled={loading}
          placeholder="Write a few words about your current mood..."
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'white',
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
          }}
          inputProps={{
            maxLength: 500,
            style: { fontSize: '1rem', fontWeight: 500 },
          }}
        />

        <Box mt={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={submitMood}
            disabled={loading}
            sx={{
              px: 5,
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 4,
              boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)',
              '&:hover': {
                boxShadow: '0 10px 20px rgba(25, 118, 210, 0.6)',
              },
            }}
          >
            {loading ? <CircularProgress size={26} color="inherit" /> : 'Submit Mood'}
          </Button>
        </Box>

        {message && (
          <Alert
            severity={
              message.toLowerCase().includes('fail') || message.toLowerCase().includes('error')
                ? 'error'
                : 'success'
            }
            sx={{
              mt: 4,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {message}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default MoodCheckIn;
