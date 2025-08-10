import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  Checkbox,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import scheduleService from "../services/scheduleService";
import moodService from "../services/moodService";

const moodColors = {
  pos: "#4caf50",
  neg: "#f44336",
  neu: "#ffc107",
};

function renderSentimentIcon(score) {
  if (score === null || score === undefined) return null;
  if (score > 0.5) return <SentimentSatisfiedIcon sx={{ color: moodColors.pos }} />;
  if (score < -0.5) return <SentimentVeryDissatisfiedIcon sx={{ color: moodColors.neg }} />;
  return <SentimentNeutralIcon sx={{ color: moodColors.neu }} />;
}

const DailyScheduleMood = () => {
  const [tasks, setTasks] = useState([]);
  const [newTime, setNewTime] = useState("");
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const sched = await scheduleService.getScheduleToday();
        const statRes = await scheduleService.getDailyMoodSummary();
        setTasks(
          (sched.tasks || []).map((t) => ({
            ...t,
            done: t.done || false,
            moodCaption: t.moodCaption || "",
            sentiment: t.sentiment ?? null,
          }))
        );
        setStats(statRes.dailyMood);
        setMsg("");
      } catch (err) {
        setMsg("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addTask = async () => {
    if (!newTime.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) {
      setMsg("Enter time in HH:mm 24-hour format.");
      return;
    }
    if (!newTask.trim()) {
      setMsg("Enter a task description.");
      return;
    }
    const task = {
      taskId: Date.now().toString(),
      time: newTime,
      task: newTask.trim(),
      done: false,
      moodCaption: "",
      sentiment: null,
    };
    try {
      setLoading(true);
      await scheduleService.addTask(task);
      setTasks((prev) => [...prev, task]);
      setNewTime("");
      setNewTask("");
      setMsg("Task added.");
    } catch {
      setMsg("Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDone = async (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.taskId === taskId ? { ...t, done: !t.done } : t))
    );
    try {
      const currentDone = tasks.find((t) => t.taskId === taskId)?.done;
      await scheduleService.updateTaskDone(taskId, !currentDone);
    } catch {
      setMsg("Failed to update task.");
    }
  };

  const updateMoodCaption = (taskId, caption) => {
    setTasks((prev) =>
      prev.map((t) => (t.taskId === taskId ? { ...t, moodCaption: caption } : t))
    );
  };

  const submitMood = async (taskId) => {
    const task = tasks.find((t) => t.taskId === taskId);
    if (!task || !task.moodCaption.trim()) {
      setMsg("Enter a mood caption before submitting.");
      return;
    }
    try {
      setLoading(true);
      const sentimentRes = await moodService.analyzeSentiment(task.moodCaption);
      const sentiment = sentimentRes.sentiment;
      const updatedTasks = tasks.map((t) =>
        t.taskId === taskId ? { ...t, sentiment } : t
      );
      setTasks(updatedTasks);
      await scheduleService.saveMood(taskId, task.moodCaption, sentiment);
      const statRes = await scheduleService.getDailyMoodSummary();
      setStats(statRes.dailyMood);
      setMsg("Mood saved.");
    } catch {
      setMsg("Failed to analyze or save mood.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "18px",
          boxShadow: 3,
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 5 },
          mb: 4,
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
          Daily Schedule & Mood Check-in
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            bgcolor: "#f7f9fc",
            boxShadow: 1,
            borderColor: "#e0e7ef",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            mb={2}
          >
            <TextField
              label="Time (HH:mm)"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              size="small"
              sx={{ width: 120, bgcolor: "white" }}
              inputProps={{ maxLength: 5 }}
            />
            <TextField
              label="Task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              fullWidth
              size="small"
              sx={{ bgcolor: "white" }}
            />
            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="contained"
              color="primary"
              onClick={addTask}
              disabled={loading || !newTime || !newTask}
              sx={{ px: 2, minWidth: 120, textTransform: "none", fontWeight: "bold" }}
            >
              Add Task
            </Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 5 }} />}
          {!loading && tasks.length === 0 && (
            <Typography color="text.secondary">No tasks today.</Typography>
          )}
          <List sx={{ mt: 1 }}>
            {tasks
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((task) => (
                <Paper
                  key={task.taskId}
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                    borderLeft: `6px solid ${
                      task.sentiment == null
                        ? "#c5d0e6"
                        : task.sentiment > 0.5
                        ? moodColors.pos
                        : task.sentiment < -0.5
                        ? moodColors.neg
                        : moodColors.neu
                    }`,
                    transition: "border-color 0.3s",
                  }}
                >
                  <ListItem
                    disableGutters
                    disablePadding
                    sx={{
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                      <Checkbox
                        checked={task.done}
                        onChange={() => toggleDone(task.taskId)}
                        sx={{ mr: 1 }}
                      />
                      <Typography sx={{ minWidth: "60px", color: "#8897af" }}>
                        {task.time}
                      </Typography>
                      <Typography
                        sx={{
                          flexGrow: 1,
                          fontWeight: 500,
                          fontSize: "1.1rem",
                          letterSpacing: 0.1,
                          ml: 1,
                        }}
                      >
                        {task.task}
                      </Typography>
                      <Box ml={2}>{renderSentimentIcon(task.sentiment)}</Box>
                    </Box>
                    {task.done && (
                      <Box sx={{ mt: 1, width: "100%", display: "flex", gap: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          sx={{
                            bgcolor: "#fffbe6",
                            borderRadius: 1,
                          }}
                          placeholder="Add a note about your mood..."
                          value={task.moodCaption}
                          onChange={(e) => updateMoodCaption(task.taskId, e.target.value)}
                          disabled={loading}
                        />
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            borderRadius: 2,
                          }}
                          onClick={() => submitMood(task.taskId)}
                          disabled={!task.moodCaption.trim() || loading}
                        >
                          Submit Mood
                        </Button>
                      </Box>
                    )}
                  </ListItem>
                </Paper>
              ))}
          </List>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "#f2f8fd",
            borderColor: "#c8e6fa",
            boxShadow: 1,
            mb: 2,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Today's Mood Summary
          </Typography>
          {stats ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: 2,
              }}
            >
              <Box>
                <Typography>Average Mood:</Typography>
                <Typography color="primary.main" fontWeight={700} fontSize="2rem" pl={0.5}>
                  {stats.avgMood !== undefined ? stats.avgMood.toFixed(2) : "--"}
                </Typography>
              </Box>
              <Box>
                <Typography>
                  <span style={{ color: moodColors.pos, fontWeight: 500 }}>
                    Positive:
                  </span>{" "}
                  {stats.positiveCount ?? 0}
                </Typography>
                <Typography>
                  <span style={{ color: moodColors.neu, fontWeight: 500 }}>
                    Neutral:
                  </span>{" "}
                  {stats.neutralCount ?? 0}
                </Typography>
                <Typography>
                  <span style={{ color: moodColors.neg, fontWeight: 500 }}>
                    Negative:
                  </span>{" "}
                  {stats.negativeCount ?? 0}
                </Typography>
                <Typography>Total Entries: {stats.total ?? 0}</Typography>
              </Box>
            </Box>
          ) : (
            <Typography>No mood data for today yet.</Typography>
          )}
        </Paper>

        {msg && (
          <Alert
            severity={msg.toLowerCase().includes("fail") ? "error" : "success"}
            sx={{ mt: 2 }}
          >
            {msg}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default DailyScheduleMood;
