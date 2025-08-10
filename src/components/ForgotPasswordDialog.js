import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Alert } from "@mui/material";
import apiClient from '../services/apiClient';  // Updated import

const ForgotPasswordDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    setError("");
    setSent(false);
    try {
      await apiClient.post("/forgot-password", { email });  // Use apiClient here
      setSent(true);
    } catch (e) {
      setError("Failed to send reset link (please try again).");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Forgot Password?</DialogTitle>
      <DialogContent>
        {sent ? (
          <Alert severity="success">
            Check your email for reset link (if an account exists).
          </Alert>
        ) : (
          <>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ my: 2 }}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button variant="contained" onClick={handleSend}>
              Send
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
