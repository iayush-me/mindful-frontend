import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import userService from "../services/userService";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [form, setForm] = useState({
    email: "",
    displayName: "",
    birthday: "",
    notifications: true,
  });

  useEffect(() => {
    setForm({
      email: user?.email || "",
      displayName: user?.displayName || "",
      birthday: user?.birthday || "",
      notifications: user?.notifications ?? true,
    });
  }, [user]);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [pwError, setPwError] = useState("");

  const isDirty =
    JSON.stringify(form) !==
    JSON.stringify({
      email: user?.email || "",
      displayName: user?.displayName || "",
      birthday: user?.birthday || "",
      notifications: user?.notifications ?? true,
    });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleaned = Object.fromEntries(
        Object.entries(form).filter(
          ([k, v]) => v !== "" && v !== undefined && v !== null
        )
      );
      const updated = await userService.updateProfile(cleaned);
      updateUser(updated);
      notifySuccess("Profile updated!");
      setEditing(false);
    } catch (e) {
      notifyError(e?.response?.data?.error || "Failed to update profile preferences");
    }
    setSaving(false);
  };

  const handlePwChange = (setter) => (e) => {
    setter(e.target.value);
    if (pwError) setPwError("");
  };

  const handleChangePw = async () => {
    setChangingPw(true);
    setPwError("");
    if (!newPassword || newPassword.trim().length < 6) {
      setPwError("Password must be at least 6 characters.");
      setChangingPw(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match.");
      setChangingPw(false);
      return;
    }
    try {
      await userService.changePassword(newPassword);
      notifySuccess("Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      notifyError(e?.response?.data?.error || "Failed to change password.");
    }
    setChangingPw(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: "0 8px 16px rgba(21,101,192,0.12)",
          textAlign: "center",
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 3,
            bgcolor: "primary.main",
            fontWeight: 700,
            fontSize: 36,
            boxShadow: "0 4px 15px rgba(21,101,192,0.3)",
          }}
        >
          {form.displayName ? form.displayName[0].toUpperCase() : form.email[0]?.toUpperCase()}
        </Avatar>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Profile & Preferences
        </Typography>

        {editing ? (
          <Box component="form" mt={3} noValidate>
            <TextField
              label="Display Name"
              name="displayName"
              fullWidth
              value={form.displayName}
              onChange={handleChange}
              sx={{ mb: 3 }}
              disabled={saving}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              sx={{ mb: 3 }}
              disabled={saving}
            />
            <TextField
              label="Birthday"
              name="birthday"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.birthday}
              onChange={handleChange}
              sx={{ mb: 3 }}
              disabled={saving}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.notifications}
                  onChange={handleChange}
                  name="notifications"
                  disabled={saving}
                />
              }
              label="Email notifications"
              sx={{ mb: 4 }}
            />

            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving || !isDirty}
                sx={{ minWidth: 120, fontWeight: 700 }}
              >
                {saving ? <CircularProgress size={24} /> : "Save"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setEditing(false)}
                disabled={saving}
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box mt={3} textAlign="left">
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Display Name:</strong> {form.displayName || "-"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {form.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Birthday:</strong> {form.birthday || "-"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              <strong>Notifications:</strong> {form.notifications ? "On" : "Off"}
            </Typography>
            <Button variant="outlined" onClick={() => setEditing(true)} sx={{ fontWeight: 700 }}>
              Edit Profile
            </Button>
          </Box>
        )}
      </Paper>

      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: "0 8px 16px rgba(21,101,192,0.12)",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={3} textAlign="center">
          Change Password
        </Typography>
        <Grid container spacing={3} justifyContent="center" mb={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={handlePwChange(setNewPassword)}
              fullWidth
              disabled={changingPw}
              autoComplete="new-password"
              inputProps={{ minLength: 6 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handlePwChange(setConfirmPassword)}
              fullWidth
              disabled={changingPw}
              autoComplete="new-password"
              inputProps={{ minLength: 6 }}
            />
          </Grid>
        </Grid>

        <Box textAlign="center">
          <Button
            variant="contained"
            onClick={handleChangePw}
            disabled={changingPw}
            sx={{ minWidth: 160, fontWeight: 700, letterSpacing: 1, py: 1.2 }}
          >
            {changingPw ? <CircularProgress size={24} /> : "Change Password"}
          </Button>
        </Box>

        {pwError && (
          <Alert severity="error" sx={{ mt: 3, fontWeight: 700, fontSize: 16 }}>
            {pwError}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
