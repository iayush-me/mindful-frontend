import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import statsService from "../services/statsService";
import { format } from "date-fns";

const Stats = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await statsService.getStats();
        setMoods(data.moods || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load mood stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = moods
    .map((mood) => ({
      date: format(new Date(mood.timestamp), "MM/dd/yyyy"),
      sentiment: mood.sentiment,
      message: mood.message,
    }))
    .reverse();

  return (
    <Container maxWidth="md" sx={{ my: { xs: 4, md: 6 } }}>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight={900}
        color="primary.main"
        sx={{ letterSpacing: 1.3, userSelect: 'none' }}
        mb={4}
      >
        Mood Stats & History
      </Typography>

      <Paper
        elevation={5}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          mb: 5,
          bgcolor: "#f5f7fa",
          boxShadow:
            "0 12px 25px -8px rgba(25, 118, 210, 0.25), 0 8px 10px -5px rgba(25, 118, 210, 0.12)",
        }}
      >
        {loading && (
          <Box textAlign="center" my={6}>
            <CircularProgress size={48} />
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ fontWeight: 'bold', fontSize: '1rem', mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {!loading && !error && moods.length === 0 && (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            fontStyle="italic"
          >
            No mood entries found.
          </Typography>
        )}

        {!loading && !error && moods.length > 0 && (
          <>
            <Box sx={{ width: "100%", height: 350, mb: 5 }}>
              <ResponsiveContainer>
                <LineChart
                  data={chartData}
                  margin={{ top: 12, right: 30, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#1976d2", fontWeight: "bold", fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[-1, 1]}
                    tickCount={7}
                    tick={{ fill: "#1976d2", fontWeight: "600" }}
                    axisLine={{ stroke: "#1976d2" }}
                  />
                  <Tooltip
                    formatter={(value) => value.toFixed(2)}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ fontSize: "0.875rem" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sentiment"
                    stroke="#1976d2"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2, stroke: '#1976d2' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            <Typography
              variant="h6"
              gutterBottom
              fontWeight={700}
              color="text.primary"
              mb={3}
            >
              Recent Moods
            </Typography>

            <List>
              {moods.map((mood, idx) => (
                <React.Fragment key={idx}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      mb: 1.5,
                      px: 0,
                      backgroundColor: "#ffffff",
                      borderRadius: 2,
                      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                      cursor: "default",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                      },
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        sx={{ marginBottom: 0.5 }}
                      >
                        <strong>{format(new Date(mood.timestamp), "PPP p")}:</strong>{" "}
                        {mood.message}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            mood.sentiment > 0.5
                              ? "#2e7d32"
                              : mood.sentiment < -0.5
                              ? "#c62828"
                              : "#ed6c02",
                          fontWeight: 700,
                          fontStyle: "italic",
                        }}
                      >
                        Sentiment Score: {mood.sentiment.toFixed(2)}
                      </Typography>
                    </Box>
                  </ListItem>
                  {idx !== moods.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Stats;
