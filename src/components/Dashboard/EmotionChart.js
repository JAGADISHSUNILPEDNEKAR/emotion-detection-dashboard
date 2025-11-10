import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { emotionColors } from '../../theme';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EmotionChart = ({ currentEmotion, sessionData }) => {
  const theme = useTheme();

  const emotionData = useMemo(() => {
    const emotions = ['happy', 'sad', 'angry', 'neutral', 'surprised', 'fearful', 'disgusted'];
    const counts = {};
    
    emotions.forEach(emotion => {
      counts[emotion] = 0;
    });

    sessionData.forEach(item => {
      if (counts[item.emotion] !== undefined) {
        counts[item.emotion]++;
      }
    });

    // Generate mock probabilities for current detection
    const currentProbabilities = {};
    emotions.forEach(emotion => {
      if (currentEmotion === emotion) {
        currentProbabilities[emotion] = 70 + Math.random() * 20;
      } else {
        currentProbabilities[emotion] = Math.random() * 30;
      }
    });

    // Normalize probabilities
    const total = Object.values(currentProbabilities).reduce((a, b) => a + b, 0);
    Object.keys(currentProbabilities).forEach(key => {
      currentProbabilities[key] = (currentProbabilities[key] / total) * 100;
    });

    return {
      labels: emotions.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
      datasets: [{
        data: emotions.map(e => currentProbabilities[e]),
        backgroundColor: emotions.map(e => emotionColors[e]),
        borderWidth: 0,
      }],
      counts,
      probabilities: currentProbabilities,
    };
  }, [currentEmotion, sessionData]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme.palette.text.primary,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.parsed.toFixed(1)}%`;
          },
        },
      },
    },
    cutout: '60%',
  };

  const barData = {
    labels: Object.keys(emotionData.counts).map(e => e.charAt(0).toUpperCase() + e.slice(1)),
    datasets: [{
      label: 'Detection Count',
      data: Object.values(emotionData.counts),
      backgroundColor: Object.keys(emotionData.counts).map(e => emotionColors[e]),
      borderRadius: 8,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Count: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Current Emotion Analysis
          </Typography>
          {currentEmotion && (
            <Chip
              label={currentEmotion.toUpperCase()}
              size="small"
              sx={{
                bgcolor: emotionColors[currentEmotion],
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, height: 300 }}>
          {/* Doughnut Chart */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Probability Distribution
            </Typography>
            <Box sx={{ height: 250, position: 'relative' }}>
              <Doughnut data={emotionData} options={doughnutOptions} />
              {currentEmotion && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700, color: emotionColors[currentEmotion] }}>
                    {emotionData.probabilities[currentEmotion]?.toFixed(0)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Confidence
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Bar Chart */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Session Statistics
            </Typography>
            <Box sx={{ height: 250 }}>
              <Bar data={barData} options={barOptions} />
            </Box>
          </Box>
        </Box>

        {/* Emotion Indicators */}
        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(emotionData.probabilities).map(([emotion, probability]) => (
            <Box
              key={emotion}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor: currentEmotion === emotion ? 'action.selected' : 'transparent',
                border: '1px solid',
                borderColor: currentEmotion === emotion ? emotionColors[emotion] : 'divider',
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: emotionColors[emotion],
                }}
              />
              <Typography variant="caption">
                {emotion}: {probability.toFixed(1)}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmotionChart;