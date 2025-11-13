import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Chip,
  Switch,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Topbar = ({ onMenuClick, darkMode, toggleDarkMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const notifications = [
    { id: 1, text: 'New emotion pattern detected', time: '2 min ago' },
    { id: 2, text: 'Weekly report ready', time: '1 hour ago' },
    { id: 3, text: 'Model accuracy improved', time: '3 hours ago' },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(10px)',
        background: 'rgba(26, 31, 58, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            Emotion Detection Dashboard
          </Typography>
          <Chip
            icon={<CircleIcon sx={{ fontSize: 8 }} />}
            label="Live"
            size="small"
            color="success"
            sx={{ 
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.6 },
                '100%': { opacity: 1 },
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Dark Mode Toggle */}
          <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationOpen}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Tooltip title="Account">
            <IconButton
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                }}
              >
                U
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <AccountCircleIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <SettingsIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 300,
              maxHeight: 400,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleNotificationClose}
              sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <Box>
                <Typography variant="body2">{notification.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;