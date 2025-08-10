import React, { useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import ForgotPasswordDialog from '../components/ForgotPasswordDialog';

const schema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  // State for showing/hiding forgot password dialog
  const [showForgot, setShowForgot] = React.useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const { notifyError, notifySuccess } = useNotification();

  // Redirect only when authenticated AND user profile loaded
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const { handleSubmit, control, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await authService.login(data.email, data.password);
      if (response.token) {
        await login(response.token);
        notifySuccess("Logged in successfully!");
      } else {
        notifyError("No token received");
      }
    } catch (error) {
      notifyError(error.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Login
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
              autoComplete="current-password"
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
          startIcon={formState.isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {formState.isSubmitting ? "Logging in..." : "Log In"}
        </Button>

        {/* Forgot Password Button */}
        <Button
          size="small"
          onClick={() => setShowForgot(true)}
          sx={{ mt: 1 }}
        >
          Forgot Password?
        </Button>
      </Box>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={showForgot}
        onClose={() => setShowForgot(false)}
      />
    </Container>
  );
};

export default Login;
