import React from "react";
import { Container, Box, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 12, mb: 8 }}>
      <Box
        sx={{
          textAlign: "center",
          px: 3,
          py: 6,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ letterSpacing: 2 }}
        >
          Mindful Moments
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{ maxWidth: 600, mx: "auto", mb: 5 }}
        >
          Track your moods, build mindful habits, and get AI-powered insights
          to better understand yourself — all in one beautiful app.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="center"
        >
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              px: 5,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Get Started
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            size="large"
            sx={{
              px: 5,
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                borderColor: "primary.dark",
                color: "primary.dark",
                bgcolor: "action.hover",
              },
            }}
          >
            Log In
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Home;
