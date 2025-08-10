import React, { useEffect, useRef, useState } from "react";
import {
  IconButton,
  Badge,
  Popover,
  Typography,
  List,
  ListItem,
  Button,
  Box,
  Divider,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const NotificationBell = ({ scheduledBreaks }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const notifiedRef = useRef({});

  const todayKey = () => {
    const d = new Date();
    return `${d.getMonth() + 1}-${d.getDate()}`;
  };

  const handleBellClick = (e) => setAnchorEl(e.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!Array.isArray(scheduledBreaks)) return;
    const checkReminders = () => {
      const now = new Date();
      const hhmm = now.toTimeString().slice(0, 5);
      const fiveMinLater = new Date(now.getTime() + 5 * 60000)
        .toTimeString()
        .slice(0, 5);

      scheduledBreaks.forEach((breakTime) => {
        if (
          fiveMinLater === breakTime &&
          !notifiedRef.current[`reminder_${todayKey()}_${breakTime}`]
        ) {
          setNotifications((prev) => [
            ...prev,
            {
              type: "reminder",
              time: breakTime,
              id: `reminder_${breakTime}_${Date.now()}`,
              label: `Upcoming break at ${breakTime} in 5 minutes!`,
            },
          ]);
          notifiedRef.current[`reminder_${todayKey()}_${breakTime}`] = true;
        }
        if (
          hhmm === breakTime &&
          !notifiedRef.current[`start_${todayKey()}_${breakTime}`]
        ) {
          setNotifications((prev) => [
            ...prev,
            {
              type: "start",
              time: breakTime,
              id: `start_${breakTime}_${Date.now()}`,
              label: `It's ${breakTime}! Time for your mindful break 🌿`,
            },
          ]);
          notifiedRef.current[`start_${todayKey()}_${breakTime}`] = true;
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [scheduledBreaks]);

  useEffect(() => {
    const now = new Date();
    const midnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime() +
      1000;
    const resetTimeout = setTimeout(() => {
      notifiedRef.current = {};
    }, midnight);

    return () => clearTimeout(resetTimeout);
  }, []);

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <IconButton
        color={notifications.length ? "primary" : "default"}
        onClick={handleBellClick}
        aria-label="notifications"
        sx={{
          transition: "color 0.3s ease",
          '&:hover': {
            color: notifications.length ? 'primary.dark' : 'grey.700',
          }
        }}
      >
        <Badge
          badgeContent={notifications.length}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontWeight: "bold",
              fontSize: '0.85rem',
              minWidth: 18,
              height: 18,
              boxShadow: '0 0 6px rgba(255,0,0,0.6)',
              transition: "all 0.3s ease"
            },
          }}
        >
          <NotificationsActiveIcon sx={{ fontSize: 28 }} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 340,
            p: 2,
            maxHeight: 420,
            overflowY: "auto",
            boxShadow:
              "0 6px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)",
            borderRadius: 3
          },
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 700, color: "text.primary" }}
        >
          {notifications.length ? "Break Notifications" : "No New Notifications"}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        {notifications.length > 0 ? (
          <List dense disablePadding>
            {notifications.map(({ id, type, label }) => (
              <ListItem
                key={id}
                divider
                secondaryAction={
                  <Button
                    size="small"
                    color={type === "reminder" ? "info" : "success"}
                    onClick={() => dismissNotification(id)}
                    sx={{ fontWeight: 600, textTransform: 'none' }}
                  >
                    Dismiss
                  </Button>
                }
                sx={{
                  px: 0,
                  py: 1,
                  '&:hover': {
                    bgcolor: '#e3f2fd'
                  },
                  borderRadius: 1,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} color={type === "reminder" ? "info.main" : "success.main"}>
                  <AccessTimeIcon sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, fontStyle: "italic" }}
          >
            You have no new break reminders.
          </Typography>
        )}
      </Popover>
    </>
  );
};

export default NotificationBell;
