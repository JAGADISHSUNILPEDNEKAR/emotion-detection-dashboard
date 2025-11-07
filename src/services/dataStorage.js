import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { format } from 'date-fns';

// Generate CSV report
export const generateCSVReport = (sessionData) => {
  const csvData = sessionData.map(item => ({
    timestamp: item.timestamp,
    emotion: item.emotion,
    confidence: (item.confidence * 100).toFixed(2) + '%',
    date: format(new Date(item.timestamp), 'yyyy-MM-dd'),
    time: format(new Date(item.timestamp), 'HH:mm:ss'),
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `emotion-report-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate PDF report
export const generatePDFReport = (sessionData) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Emotion Detection Report', 14, 22);
  
  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`, 14, 32);
  
  // Summary Statistics
  doc.setFontSize(14);
  doc.text('Summary Statistics', 14, 45);
  
  const stats = calculateStatistics(sessionData);
  doc.setFontSize(10);
  let yPos = 55;
  
  Object.entries(stats).forEach(([key, value]) => {
    doc.text(`${key}: ${value}`, 14, yPos);
    yPos += 7;
  });
  
  // Emotion Distribution Table
  doc.setFontSize(14);
  doc.text('Emotion Distribution', 14, yPos + 10);
  
  const distribution = calculateDistribution(sessionData);
  const tableData = Object.entries(distribution).map(([emotion, data]) => [
    emotion.charAt(0).toUpperCase() + emotion.slice(1),
    data.count.toString(),
    `${data.percentage.toFixed(1)}%`,
    `${data.avgConfidence.toFixed(1)}%`,
  ]);
  
  doc.autoTable({
    startY: yPos + 15,
    head: [['Emotion', 'Count', 'Percentage', 'Avg Confidence']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [102, 126, 234] },
  });
  
  // Session Details
  if (sessionData.length > 0) {
    const detailsStartY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Session Details', 14, detailsStartY);
    
    const sessionDetails = sessionData.slice(-10).map(item => [
      format(new Date(item.timestamp), 'HH:mm:ss'),
      item.emotion.charAt(0).toUpperCase() + item.slice(1),
      `${(item.confidence * 100).toFixed(1)}%`,
    ]);
    
    doc.autoTable({
      startY: detailsStartY + 5,
      head: [['Time', 'Emotion', 'Confidence']],
      body: sessionDetails,
      theme: 'striped',
      headStyles: { fillColor: [102, 126, 234] },
    });
  }
  
  // Save the PDF
  doc.save(`emotion-report-${Date.now()}.pdf`);
};

// Generate JSON report
export const generateJSONReport = (sessionData) => {
  const report = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalDetections: sessionData.length,
      sessionDuration: calculateSessionDuration(sessionData),
    },
    statistics: calculateStatistics(sessionData),
    distribution: calculateDistribution(sessionData),
    timeline: sessionData,
  };
  
  const json = JSON.stringify(report, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `emotion-report-${Date.now()}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Main export function
export const generateReport = (sessionData, format = 'pdf') => {
  switch (format.toLowerCase()) {
    case 'csv':
      generateCSVReport(sessionData);
      break;
    case 'json':
      generateJSONReport(sessionData);
      break;
    case 'pdf':
    default:
      generatePDFReport(sessionData);
      break;
  }
};

// Helper functions
const calculateStatistics = (sessionData) => {
  if (sessionData.length === 0) return {};
  
  const emotions = sessionData.map(item => item.emotion);
  const uniqueEmotions = [...new Set(emotions)];
  const dominantEmotion = getMostFrequent(emotions);
  const avgConfidence = sessionData.reduce((sum, item) => sum + item.confidence, 0) / sessionData.length;
  
  return {
    'Total Detections': sessionData.length,
    'Unique Emotions': uniqueEmotions.length,
    'Dominant Emotion': dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1),
    'Average Confidence': `${(avgConfidence * 100).toFixed(1)}%`,
    'Session Duration': calculateSessionDuration(sessionData),
  };
};

const calculateDistribution = (sessionData) => {
  const distribution = {};
  
  sessionData.forEach(item => {
    if (!distribution[item.emotion]) {
      distribution[item.emotion] = {
        count: 0,
        totalConfidence: 0,
      };
    }
    distribution[item.emotion].count++;
    distribution[item.emotion].totalConfidence += item.confidence;
  });
  
  const total = sessionData.length;
  
  Object.keys(distribution).forEach(emotion => {
    const data = distribution[emotion];
    distribution[emotion] = {
      count: data.count,
      percentage: (data.count / total) * 100,
      avgConfidence: (data.totalConfidence / data.count) * 100,
    };
  });
  
  return distribution;
};

const calculateSessionDuration = (sessionData) => {
  if (sessionData.length < 2) return '0s';
  
  const start = new Date(sessionData[0].timestamp);
  const end = new Date(sessionData[sessionData.length - 1].timestamp);
  const durationMs = end - start;
  
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

const getMostFrequent = (arr) => {
  const frequency = {};
  let maxFreq = 0;
  let mostFrequent = arr[0];
  
  arr.forEach(item => {
    frequency[item] = (frequency[item] || 0) + 1;
    if (frequency[item] > maxFreq) {
      maxFreq = frequency[item];
      mostFrequent = item;
    }
  });
  
  return mostFrequent;
};

// Local storage functions
export const saveSession = (sessionData) => {
  const sessions = getSessions();
  const newSession = {
    id: Date.now(),
    date: new Date().toISOString(),
    data: sessionData,
    stats: calculateStatistics(sessionData),
  };
  
  sessions.push(newSession);
  localStorage.setItem('emotionSessions', JSON.stringify(sessions));
  return newSession.id;
};

export const getSessions = () => {
  const stored = localStorage.getItem('emotionSessions');
  return stored ? JSON.parse(stored) : [];
};

export const getSession = (id) => {
  const sessions = getSessions();
  return sessions.find(session => session.id === id);
};

export const deleteSession = (id) => {
  const sessions = getSessions();
  const filtered = sessions.filter(session => session.id !== id);
  localStorage.setItem('emotionSessions', JSON.stringify(filtered));
};