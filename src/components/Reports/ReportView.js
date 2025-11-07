import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
  Code as JsonIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { getSessions, deleteSession, generateReport } from '../../services/dataStorage';
import { emotionColors } from '../../theme';

const ReportView = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const storedSessions = getSessions();
    setSessions(storedSessions.reverse()); // Show newest first
  };

  const handleViewSession = (session) => {
    setSelectedSession(session);
  };

  const handleCloseDetails = () => {
    setSelectedSession(null);
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete.id);
      loadSessions();
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleExport = (session, format) => {
    generateReport(session.data, format);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        Session Reports
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        View and export your emotion detection session history
      </Typography>

      {sessions.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No sessions recorded yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Start a new emotion detection session to generate reports
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Detections</TableCell>
                <TableCell>Dominant Emotion</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session, index) => (
                <motion.tr
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  component={TableRow}
                >
                  <TableCell>
                    {format(new Date(session.date), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {session.stats['Session Duration'] || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {session.stats['Total Detections'] || 0}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={session.stats['Dominant Emotion'] || 'None'}
                      size="small"
                      sx={{
                        bgcolor: session.stats['Dominant Emotion'] 
                          ? `${emotionColors[session.stats['Dominant Emotion'].toLowerCase()]}20`
                          : 'transparent',
                        color: session.stats['Dominant Emotion']
                          ? emotionColors[session.stats['Dominant Emotion'].toLowerCase()]
                          : 'text.secondary',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewSession(session)}
                        title="View Details"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleExport(session, 'pdf')}
                        title="Export PDF"
                        color="primary"
                      >
                        <PdfIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleExport(session, 'csv')}
                        title="Export CSV"
                        color="success"
                      >
                        <CsvIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleExport(session, 'json')}
                        title="Export JSON"
                        color="info"
                      >
                        <JsonIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(session)}
                        title="Delete"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Session Details Dialog */}
      <Dialog
        open={!!selectedSession}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedSession && (
          <>
            <DialogTitle>
              Session Details - {format(new Date(selectedSession.date), 'MMM dd, yyyy HH:mm')}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Statistics</Typography>
                {Object.entries(selectedSession.stats).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">{key}:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Close</Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport(selectedSession, 'pdf')}
              >
                Export Report
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this session? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportView;