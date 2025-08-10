import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import MoodIcon from "@mui/icons-material/Mood";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import axios from "axios";

// Enhanced Card for analytics stat
const StatsCard1 = ({ title, value, color, icon }) => (
  <Paper
    elevation={8}
    sx={{
      p: 4,
      borderRadius: 3,
      minWidth: 180,
      bgcolor: "rgba(255,255,255,0.98)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
      textAlign: "center",
      background: `linear-gradient(135deg, ${color}1A 0%, #fff 90%)`,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-7px) scale(1.05)",
        boxShadow: "0 18px 48px rgba(0,0,0,0.2)",
      },
      cursor: "default",
    }}
  >
    <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
      {React.cloneElement(icon, { sx: { fontSize: 48, color } })}
    </Box>
    <Typography
      variant="subtitle2"
      sx={{
        color,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 3,
        mb: 2,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {title}
    </Typography>
    <Typography
      variant="h3"
      sx={{
        color,
        fontWeight: "900",
        fontFamily: "Roboto Mono, monospace",
        lineHeight: 1.0,
      }}
    >
      {value}
    </Typography>
  </Paper>
);

// Main enhanced component
const MoodAnalytics = () => {
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setLoading(true);
    axios
      .get("http://localhost:8080/mood-history", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        setMoodData(
          (res.data.moods || []).map((e) => ({
            ...e,
            date: e.timestamp.substring(0, 10),
            sentiment: Number(e.sentiment),
          }))
        );
      })
      .catch(() => setError("Failed to load mood data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress size={52} color="primary" />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ mt: 5, fontWeight: 700, fontSize: 18 }}>
        {error}
      </Alert>
    );
  if (!moodData.length)
    return (
      <Typography
        sx={{ mt: 6, textAlign: "center", fontStyle: "italic", color: "#909090", fontSize: 16 }}
      >
        Start logging moods to see analytics.
      </Typography>
    );

  // Calculations
  const avgMood = (
    moodData.reduce((acc, cur) => acc + cur.sentiment, 0) / moodData.length
  ).toFixed(2);
  const best = moodData.reduce(
    (max, cur) => (cur.sentiment > max.sentiment ? cur : max),
    moodData[0]
  );
  const worst = moodData.reduce(
    (min, cur) => (cur.sentiment < min.sentiment ? cur : min),
    moodData[0]
  );
  const distribution = moodData.reduce(
    (acc, cur) => {
      if (cur.sentiment > 0.2) acc.positive++;
      else if (cur.sentiment < -0.2) acc.negative++;
      else acc.neutral++;
      return acc;
    },
    { positive: 0, negative: 0, neutral: 0 }
  );
  let maxPositiveStreak = 0,
    streak = 0;
  for (let m of moodData) {
    if (m.sentiment > 0) {
      streak++;
    } else {
      maxPositiveStreak = Math.max(maxPositiveStreak, streak);
      streak = 0;
    }
  }
  maxPositiveStreak = Math.max(maxPositiveStreak, streak);
  const recentChange =
    moodData.length >= 2
      ? (moodData[moodData.length - 1].sentiment -
          moodData[moodData.length - 2].sentiment).toFixed(2)
      : "--";

  // Stats Cards config
  const statsCards = [
    {
      title: "Average Mood",
      value: avgMood,
      color: "#1976d2",
      icon: <MoodIcon />,
    },
    {
      title: "Best Mood Day",
      value: best?.date || "--",
      color: "#43a047",
      icon: <SentimentSatisfiedIcon />,
    },
    {
      title: "Lowest Mood Day",
      value: worst?.date || "--",
      color: "#d32f2f",
      icon: <SentimentDissatisfiedIcon />,
    },
    {
      title: "Mood Distribution",
      value: `+${distribution.positive} / ${distribution.neutral} / -${distribution.negative}`,
      color: "#fbc02d",
      icon: <AccessAlarmIcon />,
    },
    {
      title: "Longest Positive Streak",
      value: `${maxPositiveStreak} day${maxPositiveStreak === 1 ? "" : "s"}`,
      color: "#f57c00",
      icon: <TrendingUpIcon />,
    },
    {
      title: "Recent Mood Change",
      value: recentChange,
      color:
        recentChange === "--"
          ? "#fbc02d"
          : recentChange > 0
          ? "#388e3c"
          : "#d32f2f",
      icon:
        recentChange === "--" ? (
          <MoodIcon />
        ) : recentChange > 0 ? (
          <TrendingUpIcon />
        ) : (
          <TrendingDownIcon />
        ),
    },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h4"
        mb={4}
        fontWeight={900}
        align="center"
        color="#1565c0"
        letterSpacing={3}
      >
        Mood Trend Analytics
      </Typography>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={moodData}
          margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
        >
          <CartesianGrid stroke="#e3e3e3" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-40}
            textAnchor="end"
            tick={{ fontSize: 12, fill: "#1976d2", fontWeight: "600" }}
            interval={Math.floor(moodData.length / 7) || 0}
          />
          <YAxis
            domain={[-1, 1]}
            tickFormatter={(val) => (val > 0.5 ? "😀" : val < -0.5 ? "😞" : "😐")}
            label={{
              value: "Mood",
              angle: -90,
              position: "insideLeft",
              dx: -15,
              dy: 40,
              fill: "#1976d2",
              fontWeight: "bold",
              fontSize: 14,
            }}
          />
          <Tooltip
            labelFormatter={(label) => `Date: ${label}`}
            formatter={(value) => `${(value * 100).toFixed(1)}%`}
            contentStyle={{ fontSize: "0.9rem" }}
          />
          <Line
            type="monotone"
            dataKey="sentiment"
            stroke="#2196f3"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, stroke: "#1976d2" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <Box mt={6}>
        <Grid container spacing={4} justifyContent="center">
          {statsCards.map((card, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <StatsCard {...card} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

const StatsCard = ({ title, value, color, icon }) => (
  <Paper
    elevation={8}
    sx={{
      p: 4,
      borderRadius: 4,
      minWidth: 180,
      bgcolor: "rgba(255,255,255,0.95)",
      boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
      textAlign: "center",
      background: `linear-gradient(135deg, ${color}20 0%, #fff 90%)`,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "scale(1.06) translateY(-6px)",
        boxShadow: "0 30px 50px rgba(0,0,0,0.15)",
      },
      cursor: "default",
    }}
  >
    <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
      {React.cloneElement(icon, { sx: { fontSize: 48, color } })}
    </Box>
    <Typography
      variant="subtitle1"
      sx={{
        color,
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: 3,
        mb: 1,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: 14,
      }}
    >
      {title}
    </Typography>
    <Typography
      variant="h3"
      sx={{
        color,
        fontWeight: "bolder",
        fontFamily: "'Roboto Mono', monospace",
        lineHeight: 1.0,
      }}
    >
      {value}
    </Typography>
  </Paper>
);

export default MoodAnalytics;
