import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import { Line, Area } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { format } from 'date-fns';
import { emotionColors } from '../../theme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EmotionHistory = ({ sessionData }) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    if (sessionData.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Get last 30 data points for better visualization
    const recentData = sessionData.slice(-30);
    
    const labels = recentData.map(item => 
      format(new Date(item.timestamp), 'HH:mm:ss')
    );

    const emotionMap = {
      happy: [],
      sad: [],
      angry: [],
      neutral: [],
      surprised: [],
      fearful: [],
      disgusted: [],
    };

    recentData.forEach(item => {
      Object.keys(emotionMap).forEach(emotion => {
        emotionMap[emotion].push(emotion === item.emotion ? item.confidence * 100 : 0);
      });
    });

    const datasets = Object.entries(emotionMap)
      .filter(([emotion, data]) => data.some(value => value > 0))
      .map(([emotion, data]) => ({
        label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        data,
        borderColor: emotionColors[emotion],
        backgroundColor: `${emotionColors[emotion]}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      }));

    return { labels, datasets };
  }, [sessionData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.palette.text.primary,
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
          callback: function(value) {
            return value + '%';
          },
        },
      },
    },
  };

  const getEmotionHighlights = () => {
    const highlights = {};
    sessionData.forEach(item => {
      if (item.confidence > 0.8) {
        if (!highlights[item.emotion]) {
          highlights[item.emotion] = 0;
        }
        highlights[item.emotion]++;
      }
    });
    return highlights;
  };

  const highlights = getEmotionHighlights();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Emotion Timeline
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time emotion tracking over session
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={`${sessionData.length} samples`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        {sessionData.length > 0 ? (
          <>
            <Box sx={{ height: 400, mb: 3 }}>
              <Line data={chartData} options={options} />
            </Box>

            {/* Highlights Section */}
            {Object.keys(highlights).length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  High Confidence Detections
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(highlights).map(([emotion, count]) => (
                    <Chip
                      key={emotion}
                      label={`${emotion}: ${count}`}
                      size="small"
                      sx={{
                        bgcolor: `${emotionColors[emotion]}20`,
                        color: emotionColors[emotion],
                        borderColor: emotionColors[emotion],
                        textTransform: 'capitalize',
                      }}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.default',
              borderRadius: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No emotion data available. Start detection to see timeline.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;