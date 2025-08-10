import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const schema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { notifyError, notifySuccess } = useNotification();

  const { handleSubmit, control, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await authService.register(data.email, data.password);
      if (response.token) {
        await login(response.token);
        notifySuccess("Registered and logged in!");
        reset();
        // Navigation handled by login's effect on isAuthenticated
      } else {
        notifySuccess(response.message || "Registration successful!");
        reset();
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      notifyError(error.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              autoComplete="email"
              error={!!formState.errors.email}
              helperText={formState.errors.email?.message}
              {...field}
              disabled={formState.isSubmitting}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              autoComplete="new-password"
              error={!!formState.errors.password}
              helperText={formState.errors.password?.message}
              {...field}
              disabled={formState.isSubmitting}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={formState.isSubmitting}
          sx={{ mt: 3 }}
        >
          {formState.isSubmitting ? "Registering..." : "Register"}
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
