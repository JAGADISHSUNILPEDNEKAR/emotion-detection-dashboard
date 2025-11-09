import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AnimatePresence } from 'framer-motion';

import { darkTheme, lightTheme } from './theme';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './components/Dashboard/Dashboard';
import ReportView from './components/Reports/ReportView';
import ErrorBoundary from './components/Common/ErrorBoundary';
import LoadingOverlay from './components/Common/LoadingOverlay';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  if (loading) {
    return <LoadingOverlay fullScreen />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SnackbarProvider 
            maxSnack={3} 
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Router>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="reports" element={<ReportView />} />
                    <Route path="settings" element={<div>Settings Page</div>} />
                    <Route path="help" element={<div>Help Page</div>} />
                  </Route>
                </Routes>
              </AnimatePresence>
            </Router>
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;