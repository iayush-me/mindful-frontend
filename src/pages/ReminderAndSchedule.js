import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  Stack,
  CircularProgress,
} from "@mui/material";

const ReminderAndSchedule = ({ scheduledBreaks, onBreaksUpdate }) => {
  const [schedule, setSchedule] = useState(scheduledBreaks || []);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [newBreak, setNewBreak] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSchedule(scheduledBreaks || []);
  }, [scheduledBreaks]);

  // Your effect to load reminder settings here (not repeated for brevity)

  const addBreak = () => {
    if (!newBreak.match(/^([0-1]?\d|2[0-3]):[0-5]\d$/)) {
      setMsg("Break time must be in 24h format: HH:MM");
      return;
    }
    if (schedule.includes(newBreak)) {
      setMsg("This break time is already scheduled.");
      return;
    }
    setSchedule([...schedule, newBreak]);
    setNewBreak("");
    setMsg("");
  };

  const removeBreak = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
    setMsg("");
  };

  const saveAllSettings = async () => {
    setLoading(true);
    setMsg("");

    if (reminderEnabled && !reminderTime.match(/^([0-1]?\d|2[0-3]):[0-5]\d$/)) {
      setMsg("Reminder time must be in 24h format: HH:MM");
      setLoading(false);
      return;
    }

    try {
      // Your axios calls to save reminder and schedule go here (omitted for brevity)

      if (onBreaksUpdate) onBreaksUpdate(schedule);

      setMsg("Reminder and break schedule saved successfully!");
    } catch (error) {
      setMsg("Failed to save settings. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        maxWidth: 640,
        mx: "auto",
        mt: 8,
        p: { xs: 4, md: 6 },
        borderRadius: 4,
        bgcolor: "#f9fbfd",
        boxShadow:
          "0 20px 34px -10px rgba(21,101,192,0.15), 0 12px 12px -8px rgba(21,101,192,0.1), 0 6px 12px rgba(255,255,255,0.5)",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow:
            "0 30px 45px -15px rgba(21,101,192,0.25), 0 16px 16px -12px rgba(21,101,192,0.12), 0 10px 20px rgba(255,255,255,0.6)",
        },
      }}
    >
      <Typography
        variant="h4"
        mb={4}
        fontWeight={800}
        color="primary.main"
        letterSpacing={1.1}
      >
        Reminders & Break Schedule
      </Typography>

      <Box mb={5}>
        <Typography
          variant="h6"
          mb={2}
          fontWeight={700}
          color="text.primary"
        >
          Mindful Break Reminders
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
              disabled={loading}
              color="primary"
              sx={{ "& .MuiSwitch-thumb": { boxShadow: "0 2px 5px rgba(0,0,0,0.3)" } }}
            />
          }
          label="Enable Reminders"
          sx={{ fontWeight: 700 }}
        />
        {reminderEnabled && (
          <TextField
            label="Reminder Time"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            inputProps={{ step: 300 }}
            sx={{
              ml: 3,
              width: 160,
              mt: 1,
              bgcolor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
              boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
            }}
            disabled={loading}
            size="small"
          />
        )}
      </Box>

      <Box mb={5}>
        <Typography
          variant="h6"
          gutterBottom
          fontWeight={700}
          color="text.primary"
        >
          Scheduled Breaks
        </Typography>

        {schedule.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ mb: 2, fontStyle: "italic" }}
          >
            No breaks scheduled yet.
          </Typography>
        ) : (
          <List
            dense
            sx={{
              mb: 3,
              maxHeight: 180,
              overflowY: "auto",
              bgcolor: "#ffffff",
              borderRadius: 2,
              boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            {schedule
              .slice()
              .sort()
              .map((breakTime, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <Button
                      color="error"
                      size="small"
                      onClick={() => removeBreak(idx)}
                      disabled={loading}
                      sx={{ fontWeight: 700, textTransform: "none" }}
                    >
                      Remove
                    </Button>
                  }
                  sx={{
                    px: 2,
                    py: 1,
                    borderBottom: idx !== schedule.length - 1 ? "1px solid #e0e0e0" : "none",
                    fontWeight: 600,
                  }}
                >
                  <Typography
                    sx={{ fontFamily: "monospace", fontSize: 16 }}
                  >
                    {breakTime}
                  </Typography>
                </ListItem>
              ))}
          </List>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Add Break (HH:MM)"
            value={newBreak}
            onChange={(e) => setNewBreak(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: 160 },
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
            disabled={loading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addBreak}
            disabled={loading || !newBreak}
            sx={{ fontWeight: 700, textTransform: "none", minWidth: 120 }}
          >
            Add Break
          </Button>
        </Stack>
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={saveAllSettings}
        disabled={loading}
        sx={{
          px: 4,
          py: 1.5,
          fontWeight: 700,
          boxShadow: "0 6px 20px rgba(21,101,192,0.4)",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 30px rgba(21,101,192,0.6)",
          },
        }}
      >
        {loading ? <CircularProgress size={28} color="inherit" /> : "Save All Settings"}
      </Button>

      {msg && (
        <Alert
          severity={msg.toLowerCase().includes("failed") ? "error" : "success"}
          sx={{
            mt: 3,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          {msg}
        </Alert>
      )}
    </Paper>
  );
};

export default ReminderAndSchedule;
