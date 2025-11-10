import React, { useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Fullscreen as FullscreenIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { emotionColors } from '../../theme';

const VideoPanel = ({ isRecording, currentEmotion, confidence }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isRecording && webcamRef.current && canvasRef.current) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Set canvas size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw face detection overlay
      const drawOverlay = () => {
        if (!isRecording) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw face detection box (mock - replace with actual face detection)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const boxSize = Math.min(canvas.width, canvas.height) * 0.4;
        
        ctx.strokeStyle = currentEmotion ? emotionColors[currentEmotion] : '#667eea';
        ctx.lineWidth = 3;
        ctx.strokeRect(
          centerX - boxSize / 2,
          centerY - boxSize / 2,
          boxSize,
          boxSize
        );

        // Draw corner indicators
        const cornerLength = 20;
        ctx.lineWidth = 4;
        
        // Top-left
        ctx.beginPath();
        ctx.moveTo(centerX - boxSize / 2, centerY - boxSize / 2 + cornerLength);
        ctx.lineTo(centerX - boxSize / 2, centerY - boxSize / 2);
        ctx.lineTo(centerX - boxSize / 2 + cornerLength, centerY - boxSize / 2);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(centerX + boxSize / 2 - cornerLength, centerY - boxSize / 2);
        ctx.lineTo(centerX + boxSize / 2, centerY - boxSize / 2);
        ctx.lineTo(centerX + boxSize / 2, centerY - boxSize / 2 + cornerLength);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(centerX - boxSize / 2, centerY + boxSize / 2 - cornerLength);
        ctx.lineTo(centerX - boxSize / 2, centerY + boxSize / 2);
        ctx.lineTo(centerX - boxSize / 2 + cornerLength, centerY + boxSize / 2);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(centerX + boxSize / 2 - cornerLength, centerY + boxSize / 2);
        ctx.lineTo(centerX + boxSize / 2, centerY + boxSize / 2);
        ctx.lineTo(centerX + boxSize / 2, centerY + boxSize / 2 - cornerLength);
        ctx.stroke();

        requestAnimationFrame(drawOverlay);
      };

      drawOverlay();
    }
  }, [isRecording, currentEmotion]);

  const handleScreenshot = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const link = document.createElement('a');
      link.href = imageSrc;
      link.download = `emotion-capture-${Date.now()}.png`;
      link.click();
    }
  };

  const handleFullscreen = () => {
    if (webcamRef.current?.video) {
      webcamRef.current.video.requestFullscreen();
    }
  };

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <CardContent sx={{ p: 0, height: '100%' }}>
        <Box sx={{ position: 'relative', height: '100%', minHeight: 400 }}>
          {/* Video Feed */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              bgcolor: 'background.default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isRecording ? (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                  }}
                />
              </>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <VideocamOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Camera Inactive
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click "Start Detection" to begin
                </Typography>
              </Box>
            )}
          </Box>

          {/* Overlay Controls */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              gap: 1,
            }}
          >
            <Tooltip title="Take Screenshot">
              <IconButton
                onClick={handleScreenshot}
                disabled={!isRecording}
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                }}
              >
                <CameraIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fullscreen">
              <IconButton
                onClick={handleFullscreen}
                disabled={!isRecording}
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                }}
              >
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Status Bar */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={isRecording ? <VideocamIcon /> : <VideocamOffIcon />}
                label={isRecording ? 'Recording' : 'Stopped'}
                color={isRecording ? 'success' : 'default'}
                size="small"
                sx={{
                  animation: isRecording ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.6 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
              
              <AnimatePresence>
                {currentEmotion && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Chip
                      label={currentEmotion.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: emotionColors[currentEmotion],
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {confidence && (
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: 'white' }}>
                      Confidence
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={confidence * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: confidence > 0.7 ? 'success.main' : 'warning.main',
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'white' }}>
                      {(confidence * 100).toFixed(0)}%
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoPanel;