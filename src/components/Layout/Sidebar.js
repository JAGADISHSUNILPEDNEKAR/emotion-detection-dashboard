import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  ChevronLeft as ChevronLeftIcon,
  Psychology as PsychologyIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'Help', icon: <HelpIcon />, path: '/help' },
];

const Sidebar = ({ open, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const drawerWidth = open ? 280 : 80;

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #1a1f3a 0%, #0a0e27 100%)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
        }}
      >
        {open && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              <PsychologyIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                EmotionAI
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Real-time Detection
              </Typography>
            </Box>
          </Box>
        )}
        {!open && (
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <PsychologyIcon />
          </Avatar>
        )}
        {open && !isMobile && (
          <IconButton onClick={onClose} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, p: 2 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    borderLeft: '3px solid',
                    borderColor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.2)',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                    minWidth: open ? 40 : 'auto',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>

      {/* Status */}
      {open && (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CircleIcon sx={{ fontSize: 12, color: '#10b981' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                System Status
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              All systems operational
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip
                label="TensorFlow Ready"
                size="small"
                color="success"
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;