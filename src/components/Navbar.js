import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../pages/NotificationBell";

const Navbar = ({ scheduledBreaks }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = isAuthenticated
    ? [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Reminder-Schedule", path: "/settings/reminder-schedule" },
        { title: "DailyScheduleMood", path: "/daily-schedule" },
        { title: "MoodCheckIn", path: "/mood-check" },
        { title: "Mood Analytics", path: "/analytics" },
        { title: "Stats", path: "/stats" },
      ]
    : [
        { title: "Login", path: "/login" },
        { title: "Register", path: "/register" },
      ];

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        px: 0,
        py: 0,
      }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
      onKeyDown={() => setDrawerOpen(false)}
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          background: "linear-gradient(135deg, #e3f0fa 60%, #cde1f5 100%)",
          borderBottom: "2px solid #1976d2",
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 1,
            bgcolor: "primary.main",
            fontWeight: 700,
            fontSize: 36,
            boxShadow: "0 4px 14px rgba(21,101,192,0.1)",
            border: "4px solid #fff",
          }}
        >
          {(user?.displayName ? user.displayName[0] : user?.email ? user.email[0] : "U").toUpperCase()}
        </Avatar>
        <Typography
          variant="subtitle1"
          sx={{
            mt: 0.5,
            fontWeight: 700,
            color: "#1565c0",
            maxWidth: 220,
            textAlign: "center",
            letterSpacing: 1.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user?.displayName
            ? user.displayName.toUpperCase()
            : user?.email || ""}
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1, overflowY: "auto", mt: 1 }}>
        {navLinks.map((link) => (
          <ListItem key={link.title} disablePadding>
            <ListItemButton component={Link} to={link.path}>
              <ListItemText primary={link.title} primaryTypographyProps={{
                sx: { fontWeight: 600, letterSpacing: 0.5, fontSize: 17 }
              }} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
          <>
            <Divider sx={{ mt: 2, mb: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    sx: { fontWeight: 700, color: "#e53935", letterSpacing: 1 }
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
      <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0", textAlign: "center", fontSize: 14, color: "#999" }}>
        &copy; 2025 Mindful Moments
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={4} sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
            }}
          >
            Mindful Moments
          </Typography>
          {isAuthenticated && !isMobile && (
            <Box sx={{ mr: 2 }}>
              <NotificationBell scheduledBreaks={scheduledBreaks} />
            </Box>
          )}
          {isMobile ? (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              size="large"
              onClick={() => setDrawerOpen(true)}
              sx={{
                boxShadow:
                  "0 2px 8px 1px rgba(21,101,192,0.07), 0 1.5px 10px 0 #1976d215",
              }}
            >
              <MenuIcon sx={{ fontSize: 32 }} />
            </IconButton>
          ) : (
            <>
              {navLinks.map(({ title, path }) => (
                <Button
                  key={title}
                  color="inherit"
                  component={Link}
                  to={path}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: 17,
                    mx: 0.5,
                    letterSpacing: 1,
                  }}
                >
                  {title}
                </Button>
              ))}
              {isAuthenticated && (
                <Button color="inherit" onClick={handleLogout} sx={{ textTransform: 'none', fontWeight: 700, fontSize: 17, ml: 1 }}>
                  Logout
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
