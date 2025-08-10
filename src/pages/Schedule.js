import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';

import scheduleService from '../services/scheduleService';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [newBreak, setNewBreak] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load schedule on page mount
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const data = await scheduleService.getSchedule();
        setSchedule(data.break_time || []);
      } catch (error) {
        setMessage(error.response?.data?.error || 'Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  // Add a new break time entry
  const addBreak = async () => {
    if (!newBreak.trim()) {
      setMessage('Please enter a break time in HH:MM format');
      return;
    }
    setLoading(true);
    try {
      const updatedSchedule = [...schedule, newBreak.trim()];
      await scheduleService.setSchedule({ break_time: updatedSchedule });
      setSchedule(updatedSchedule);
      setNewBreak('');
      setMessage('Break added successfully!');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add break');
    } finally {
      setLoading(false);
    }
  };

  // Optional: Remove a break time entry (simple filter)
  const removeBreak = async (indexToRemove) => {
    setLoading(true);
    try {
      const updatedSchedule = schedule.filter((_, idx) => idx !== indexToRemove);
      await scheduleService.setSchedule({ break_time: updatedSchedule });
      setSchedule(updatedSchedule);
      setMessage('Break removed successfully!');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to remove break');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Your Break Schedule
      </Typography>

      <Box sx={{ mb: 4, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Scheduled Breaks
        </Typography>
        {loading && <CircularProgress sx={{ display: 'block', my: 2 }} />}
        {!loading && schedule.length === 0 && <Typography>No breaks scheduled yet.</Typography>}

        <List>
          {schedule.map((time, idx) => (
            <React.Fragment key={idx}>
              <ListItem
                secondaryAction={
                  <Button
                    edge="end"
                    color="error"
                    onClick={() => removeBreak(idx)}
                    disabled={loading}>
                    Remove
                  </Button>
                }
              >
                {time}
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <Box sx={{ display: 'flex', mt: 2 }}>
          <TextField
            label="Add Break Time (HH:MM)"
            value={newBreak}
            onChange={(e) => setNewBreak(e.target.value)}
            size="small"
            disabled={loading}
            sx={{ flexGrow: 1, mr: 2 }}
          />
          <Button variant="contained" onClick={addBreak} disabled={loading}>
            Add Break
          </Button>
        </Box>

        {message && (
          <Alert severity={message.toLowerCase().includes('fail') || message.toLowerCase().includes('error') ? 'error' : 'success'} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Schedule;
