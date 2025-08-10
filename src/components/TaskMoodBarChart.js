import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";

const TaskMoodBarChart = ({ tasks }) => {
  // Prepare grouped data
  const data = [
    { sentiment: "Positive", Done: 0, "Not Done": 0 },
    { sentiment: "Neutral", Done: 0, "Not Done": 0 },
    { sentiment: "Negative", Done: 0, "Not Done": 0 },
  ];

  tasks.forEach((task) => {
    if (typeof task.sentiment !== "number") return;
    let bucket;
    if (task.sentiment > 0.2) bucket = "Positive";
    else if (task.sentiment < -0.2) bucket = "Negative";
    else bucket = "Neutral";

    if (task.done) data.find((d) => d.sentiment === bucket).Done += 1;
    else data.find((d) => d.sentiment === bucket)["Not Done"] += 1;
  });

  return (
    <Box>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sentiment" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Bar dataKey="Done" fill="#4caf50" />
          <Bar dataKey="Not Done" fill="#f44336" />
        </BarChart>
      </ResponsiveContainer>
      <Typography
        align="center"
        variant="caption"
        sx={{ mt: 1, color: "text.secondary" }}
      >
        Completed vs Pending tasks by Mood Sentiment
      </Typography>
    </Box>
  );
};

export default TaskMoodBarChart;
