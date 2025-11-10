import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Psychology as PsychologyIcon,
  AutoGraph as AutoGraphIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  MoodBad as MoodBadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { emotionColors } from '../../theme';

const StatsCards = ({ stats, totalDetections, isRecording }) => {
  const getDominantEmotion = () => {
    if (!stats || Object.keys(stats).length === 0) return null;
    return Object.entries(stats).reduce((a, b) => (parseFloat(b[1]) > parseFloat(a[1]) ? b : a))[0];
  };

  const dominantEmotion = getDominantEmotion();

  const statCards = [
    {
      title: 'Total Detections',
      value: totalDetections.toString(),
      subtitle: isRecording ? 'Live tracking' : 'Session complete',
      icon: <AutoGraphIcon />,
      color: '#667eea',
      progress: isRecording ? 100 : 0,
    },
    {
      title: 'Dominant Emotion',
      value: dominantEmotion ? dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1) : 'None',
      subtitle: dominantEmotion ? `${stats[dominantEmotion]}% of session` : 'No data yet',
      icon: <EmojiEmotionsIcon />,
      color: dominantEmotion ? emotionColors[dominantEmotion] : '#9ca3af',
      progress: dominantEmotion ? parseFloat(stats[dominantEmotion]) : 0,
    },
    {
      title: 'Emotion Changes',
      value: totalDetections > 0 ? Math.floor(totalDetections / 10).toString() : '0',
      subtitle: 'Transitions detected',
      icon: <TrendingUpIcon />,
      color: '#10b981',
      progress: 65,
    },
    {
      title: 'Session Duration',
      value: Math.floor(totalDetections / 2).toString() + 's',
      subtitle: 'Active recording time',
      icon: <AccessTimeIcon />,
      color: '#f59e0b',
      progress: 45,
    },
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 500 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: `${card.color}20`,
                      color: card.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
                
                <Box sx={{ mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={card.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: card.color,
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
                
                <Typography variant="caption" color="text.secondary">
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}

      {/* Emotion Breakdown Card */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Emotion Distribution
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(stats).map(([emotion, percentage]) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={emotion}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: `${emotionColors[emotion]}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {emotion === 'happy' ? <EmojiEmotionsIcon sx={{ color: emotionColors[emotion] }} /> :
                         emotion === 'sad' ? <MoodBadIcon sx={{ color: emotionColors[emotion] }} /> :
                         <PsychologyIcon sx={{ color: emotionColors[emotion] }} />}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                          {emotion}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: emotionColors[emotion] }}>
                          {percentage}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatsCards;