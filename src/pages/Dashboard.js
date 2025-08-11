import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Box,
  Avatar,
  Paper,
  Chip,
} from "@mui/material";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import MoodIcon from "@mui/icons-material/Mood";
import MoodAnalytics from "./MoodAnalytics";
import { useAuth } from "../context/AuthContext";
import moodService from "../services/moodService";
import statsService from "../services/statsService";
import { Link } from "react-router-dom";
import MoodDistributionChart from "../components/piechart";
import TaskMoodBarChart from "../components/TaskMoodBarChart";

const Dashboard = () => {
  const { user } = useAuth();
  const [mood, setMood] = useState("");
  const [moods, setMoods] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [todayTasks, setTodayTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);

  useEffect(() => {
    const fetchTodayTasks = async () => {
      setTasksLoading(true);
      setTasksError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_PUBLIC_BACKEND_URL}/schedule/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodayTasks(res.data.tasks || []);
      } catch (error) {
        setTasksError("Failed to load today's tasks");
      } finally {
        setTasksLoading(false);
      }
    };
    fetchTodayTasks();
  }, []);

  useEffect(() => {
    setLoading(true);
    statsService
      .getStats()
      .then((res) => {
        setMoods(res.moods || []);
        setMessage("");
      })
      .catch(() => setMessage("Failed to load mood data"))
      .finally(() => setLoading(false));
  }, []);

  const submitMood = async () => {
    if (!mood.trim()) {
      setMessage("Please enter your mood.");
      return;
    }
    setLoading(true);
    try {
      const res = await moodService.submitMood(mood.trim());
      setMessage(
        `Mood submitted! AI sentiment score: ${
          res.sentiment !== undefined ? res.sentiment.toFixed(2) : "N/A"
        }`
      );
      setMood("");
      const refreshed = await statsService.getStats();
      setMoods(refreshed.moods || []);
    } catch {
      setMessage("Failed to submit mood");
    }
    setLoading(false);
  };

  const renderSentiment = (score) => {
    if (score > 0.5)
      return <SentimentSatisfiedIcon sx={{ color: "#4caf50" }} />;
    if (score < -0.5)
      return <SentimentVeryDissatisfiedIcon sx={{ color: "#f44336" }} />;
    return <SentimentNeutralIcon sx={{ color: "#ffc107" }} />;
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ mt: { xs: 3, md: 8 }, mb: 6, px: { xs: 1, sm: 2, md: 5 } }}
    >
      <Typography
        variant="h4"
        component="h1"
        fontWeight="900"
        color="primary"
        align="center"
        letterSpacing={3}
        sx={{
          mb: { xs: 3, md: 5 },
          textShadow: "0 2px 10px rgba(21,101,192,0.1)",
          fontSize: { xs: "1.8rem", md: "3rem" },
        }}
      >
        WELCOME TO DASHBOARD,{" "}
        {user?.displayName ? user.displayName.toUpperCase() : " "}!
      </Typography>

      {/* Centered Box for content symmetry */}
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Top row: Profile, Mood Check-in, Mood Distribution */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
          sx={{ mb: { xs: 2, md: 4 } }}
        >
          {[ // This array pattern keeps the order and config compact
            {
              key: "profile",
              content: (
                <>
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      mb: 2,
                      bgcolor: "primary.main",
                      fontWeight: 700,
                      fontSize: 36,
                    }}
                  >
                    {user?.email ? user.email[0].toUpperCase() : <MoodIcon />}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#1565c0", mb: 1 }}
                    gutterBottom
                  >
                    {user?.email ? "Welcome," : "Welcome!"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={2} align="center">
                    {user?.email}
                  </Typography>
                  <Chip
                    label="Remember to take mindful breaks!"
                    size="small"
                    sx={{ mb: 3 }}
                    color="primary"
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to="/profile"
                  >
                    Edit Profile
                  </Button>
                </>
              ),
            },
            {
              key: "checkin",
              content: (
                <>
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight={900}
                    mb={2}
                    align="center"
                  >
                    Mood Check-in
                  </Typography>
                  <TextField
                    label="How are you feeling?"
                    multiline
                    rows={2}
                    fullWidth
                    margin="normal"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    disabled={loading}
                    sx={{
                      background: "#fff",
                      borderRadius: 2,
                      ".MuiOutlinedInput-root": { fontSize: 18 },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={submitMood}
                    disabled={loading || !mood.trim()}
                    sx={{
                      fontWeight: 700,
                      letterSpacing: 1,
                      py: 1.2,
                      mt: 2,
                      fontSize: 18,
                    }}
                  >
                    {loading ? <CircularProgress size={23} /> : "Submit Mood"}
                  </Button>
                </>
              ),
            },
            {
              key: "chart",
              content: (
                <>
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    align="center"
                    sx={{ mb: 2, color: "#1565c0" }}
                  >
                   
                  </Typography>
                  <MoodDistributionChart moods={moods} loading={loading} />
                </>
              ),
            },
          ].map(({ key, content }) => (
            <Grid
              key={key}
              item
              xs={12}
              sm={6}
              md={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Paper
                elevation={6}
                sx={{
                  borderRadius: 4,
                  width: "100%",
                  maxWidth: 340,
                  minHeight: { xs: 260, md: 340 },
                  p: { xs: 2, sm: 3, md: 4 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#f6fbfe",
                  boxShadow: "0 4px 30px 0 rgba(21,101,192,0.10)",
                }}
              >
                {content}
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Next row: Recent Moods, Task Outcome */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
          sx={{ mt: { xs: 1, md: 2 }, mb: { xs: 1, md: 3 } }}
        >
          <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: "center" }}>
          <Paper
              elevation={4}
              sx={{
                borderRadius: 4,
                p: { xs: 1, sm: 2, md: 4 },
                bgcolor: "#f1f7fa",
                minHeight: { xs: 220, md: 320 },
                boxShadow: "0 2px 10px rgba(21,101,192,0.06)",
                width: "100%",
                maxWidth: 520,
                overflowX: "auto", // enables horizontal scroll on small devices
              }}
            >
              <Typography
                variant="h6"
                color="primary"
                fontWeight={900}
                mb={2}
                sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}
              >
                Recent Moods
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <CircularProgress />
                </Box>
              ) : !moods || moods.length === 0 ? (
                <Typography color="text.secondary" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                  No mood entries yet.
                </Typography>
              ) : (
                <Box component="table" sx={{ width: "100%", fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" }, minWidth: 450 }}>
                  <tbody>
                    {moods.slice(0, 8).map((entry, idx) => (
                      <tr
                        key={idx}
                        style={{
                          background: idx % 2 ? "#f0f3f8" : "inherit",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <td style={{ width: 36, textAlign: "center" }}>
                          {renderSentiment(entry.sentiment)}
                        </td>
                        <td
                          style={{
                            minWidth: 120,
                            color: "#6d789b",
                            fontFamily: "monospace",
                            padding: "6px 8px",
                            fontSize: "inherit",
                          }}
                        >
                          [{entry.timestamp?.substring(0, 16).replace("T", " ")}]
                        </td>
                        <td
                          style={{
                            maxWidth: 220,
                            padding: "6px 8px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            fontSize: "inherit",
                          }}
                          title={entry.message}
                        >
                          {entry.message}
                        </td>
                        <td
                          style={{
                            width: 54,
                            fontWeight: 700,
                            color: "#1565c0",
                            textAlign: "right",
                            padding: "6px 8px",
                            fontSize: "inherit",
                          }}
                        >
                          {entry.sentiment !== undefined ? entry.sentiment.toFixed(2) : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 4,
                width: "100%",
                maxWidth: 520,
                minHeight: { xs: 220, md: 320 },
                p: { xs: 2, md: 4 },
                bgcolor: "#f3f8ff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" color="primary" fontWeight={900} mb={3}>
                Task Completion vs Mood Sentiment
              </Typography>
              {tasksLoading ? (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : tasksError ? (
                <Typography color="error">{tasksError}</Typography>
              ) : (
                <TaskMoodBarChart tasks={todayTasks} />
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Analytics Row - always centered */}
        <Grid container justifyContent="center" sx={{ mt: 5 }}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={7}
              sx={{
                borderRadius: 4,
                p: { xs: 2, md: 5 },
                width: "90%",
                // maxWidth: 650,
                mx: "auto",
                bgcolor: "rgba(134, 191, 249, 0.13)",
              }}
            >
              <MoodAnalytics />
            </Paper>
          </Grid>
        </Grid>

        {/* Alert messages */}
        {message && (
          <Alert
            severity={
              message.toLowerCase().includes("fail") || message.toLowerCase().includes("error")
                ? "error"
                : "success"
            }
            sx={{ mt: 4, fontSize: 18, maxWidth: 600, mx: "auto" }}
          >
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
