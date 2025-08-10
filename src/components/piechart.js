import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";

const MOOD_COLORS = {
  positive: "#4caf50",
  neutral: "#ffc107",
  negative: "#f44336"
};

const MoodDistributionChart = ({ moods, loading }) => {
  // Count moods
  const data = [
    { name: "Positive", value: moods.filter(m => m.sentiment > 0.2).length },
    { name: "Neutral", value: moods.filter(m => m.sentiment <= 0.2 && m.sentiment >= -0.2).length },
    { name: "Negative", value: moods.filter(m => m.sentiment < -0.2).length },
  ];

  // Don't show chart if loading or no data yet
  if (loading || data.every(entry => entry.value === 0)) {
    return (
      <Box sx={{ textAlign: "center", my: 3 }}>
        <Typography color="text.secondary">Mood distribution will appear here once you log some moods.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h6" color="primary.main" fontWeight={900} sx={{ mb: 2 }} >
        Mood Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            paddingAngle={2}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={
                  entry.name === "Positive"
                    ? MOOD_COLORS.positive
                    : entry.name === "Negative"
                    ? MOOD_COLORS.negative
                    : MOOD_COLORS.neutral
                }
              />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};
export default MoodDistributionChart;
