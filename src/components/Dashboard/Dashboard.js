import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';

import VideoPanel from './VideoPanel';
import EmotionChart from './EmotionChart';
import EmotionHistory from './EmotionHistory';
import StatsCards from './StatsCards';
import useEmotionDetection from '../../hooks/useEmotionDetection';
import { generateReport } from '../../services/dataStorage';

const Dashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isRecording, setIsRecording] = useState(false);
  const [sessionData, setSessionData] = useState([]);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [showAlert, setShowAlert] = useState(true);

  const {
    startDetection,
    stopDetection,
    emotion,
    confidence,
    isModelLoaded,
    error,
  } = useEmotionDetection();

  useEffect(() => {
    if (emotion && isRecording) {
      const dataPoint = {
        emotion,
        confidence,
        timestamp: new Date().toISOString(),
      };
      setCurrentEmotion(emotion);
      setSessionData(prev => [...prev, dataPoint]);
    }
  }, [emotion, confidence, isRecording]);

  const handleStartRecording = async () => {
    try {
      await startDetection();
      setIsRecording(true);
      setSessionData([]);
      enqueueSnackbar('Emotion detection started', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Failed to start detection: ' + err.message, { variant: 'error' });
    }
  };

  const handleStopRecording = () => {
    stopDetection();
    setIsRecording(false);
    enqueueSnackbar('Emotion detection stopped', { variant: 'info' });
  };

  const handleDownloadReport = () => {
    if (sessionData.length === 0) {
      enqueueSnackbar('No data to export', { variant: 'warning' });
      return;
    }
    generateReport(sessionData);
    enqueueSnackbar('Report downloaded successfully', { variant: 'success' });
  };

  const getEmotionStats = () => {
    if (sessionData.length === 0) return {};
    
    const emotionCounts = sessionData.reduce((acc, item) => {
      acc[item.emotion] = (acc[item.emotion] || 0) + 1;
      return acc;
    }, {});

    const total = sessionData.length;
    const stats = {};
    Object.keys(emotionCounts).forEach(emotion => {
      stats[emotion] = ((emotionCounts[emotion] / total) * 100).toFixed(1);
    });

    return stats;
  };

  return (
    <Box>
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowAlert(false)} severity="info" sx={{ width: '100%' }}>
          Allow camera access to start emotion detection. The AI model processes everything locally for your privacy.
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Real-Time Emotion Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor emotional states in real-time using advanced AI technology
        </Typography>
      </Box>

      {/* Control Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={isRecording ? <StopIcon /> : <PlayIcon />}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={!isModelLoaded && !isRecording}
          sx={{
            background: isRecording 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {isRecording ? 'Stop Detection' : 'Start Detection'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadReport}
          disabled={sessionData.length === 0}
        >
          Download Report
        </Button>
      </Box>

      {/* Main Dashboard Grid */}
      <Grid container spacing={3}>
        {/* Video Feed */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VideoPanel 
              isRecording={isRecording}
              currentEmotion={currentEmotion}
              confidence={confidence}
            />
          </motion.div>
        </Grid>

        {/* Current Emotion Chart */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <EmotionChart 
              currentEmotion={currentEmotion}
              sessionData={sessionData}
            />
          </motion.div>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatsCards 
              stats={getEmotionStats()}
              totalDetections={sessionData.length}
              isRecording={isRecording}
            />
          </motion.div>
        </Grid>

        {/* Emotion History */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <EmotionHistory sessionData={sessionData} />
          </motion.div>
        </Grid>
      </Grid>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => {}}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default Dashboard;