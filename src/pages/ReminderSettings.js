import React, { useEffect, useState } from "react";
import { 
  Box, 
  Switch, 
  FormControlLabel, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Paper 
} from "@mui/material";
import axios from "axios";

const ReminderSettings = () => {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState("09:00");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [initialEnabled, setInitialEnabled] = useState(false);
  const [initialTime, setInitialTime] = useState("09:00");

  useEffect(() => {
    // Fetch current reminder settings on component mount
    axios.get(`${process.env.REACT_APP_PUBLIC_BACKEND_URL}/user/profile`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then(res => {
      setEnabled(res.data.reminderEnabled || false);
      setInitialEnabled(res.data.reminderEnabled || false);
      if (res.data.reminderTime) {
        const trimmedTime = res.data.reminderTime.slice(0, 5); // e.g., "09:00"
        setTime(trimmedTime);
        setInitialTime(trimmedTime);
      }
    })
    .catch(err => {
      console.error("Failed to fetch reminder settings:", err);
      setMsg("Failed to load reminder settings. Please try again.");
    });
  }, []);

  // Determine if form data changed to enable Save button
  const hasChanged = enabled !== initialEnabled || time !== initialTime;

  // Optional: Validate time string format HH:mm
  const isValidTime = /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(time);

  const saveSettings = async () => {
    if (enabled && !isValidTime) {
      setMsg("Please enter a valid time (HH:mm).");
      return;
    }

    setLoading(true);
    setMsg("");
    try {
      await axios.patch(`${process.env.REACT_APP_PUBLIC_BACKEND_URL}/user/reminder`, 
        {
          reminderEnabled: enabled,
          reminderTime: time
        }, 
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") }}
      );
      setMsg("Reminder settings saved!");
      // Update initial states so Save button disables
      setInitialEnabled(enabled);
      setInitialTime(time);
      // Automatically clear success message after 4 seconds
      setTimeout(() => setMsg(""), 4000);
    } catch (error) {
      console.error("Failed to update reminder settings:", error);
      setMsg("Failed to update reminder settings.");
    }
    setLoading(false);
  };

  return (
    <Paper sx={{ maxWidth: 400, mx: "auto", mt: 6, p: 4 }}>
      <Typography variant="h5" mb={2}>Mindful Break Reminders</Typography>

      <FormControlLabel
        control={
          <Switch 
            checked={enabled} 
            onChange={e => setEnabled(e.target.checked)} 
            color="primary"
            disabled={loading}
          />
        }
        label="Enable Reminders"
      />

      {enabled && (
        <TextField
          label="Reminder Time"
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          inputProps={{ step: 300 }} // step = 5 minutes
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
          helperText={!isValidTime && "Please enter a valid time between 00:00 and 23:59."}
          error={!isValidTime}
        />
      )}

      <Button 
        variant="contained" 
        sx={{ mt: 3 }} 
        onClick={saveSettings} 
        disabled={loading || !hasChanged || (enabled && !isValidTime)}
      >
        {loading ? "Saving..." : "Save Settings"}
      </Button>

      {msg && (
        <Alert 
          severity={msg.toLowerCase().includes("failed") ? "error" : "success"} 
          sx={{ mt: 2 }}
        >
          {msg}
        </Alert>
      )}
    </Paper>
  );
};

export default ReminderSettings;
