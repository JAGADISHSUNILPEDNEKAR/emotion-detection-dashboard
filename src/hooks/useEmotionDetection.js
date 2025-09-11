import { useState, useEffect, useCallback, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

const EMOTIONS = ['happy', 'sad', 'angry', 'neutral', 'surprised', 'fearful', 'disgusted'];

const useEmotionDetection = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  
  const modelRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const videoRef = useRef(null);

  // Initialize the model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        
        // Load face detection model
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig = {
          runtime: 'tfjs',
          refineLandmarks: true,
        };
        
        modelRef.current = await faceLandmarksDetection.createDetector(model, detectorConfig);
        setIsModelLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Failed to load model:', err);
        setError('Failed to load AI model. Please refresh the page.');
        setIsModelLoaded(false);
      }
    };

    loadModel();

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Mock emotion detection (replace with actual model inference)
  const detectEmotion = useCallback(async (video) => {
    if (!modelRef.current || !video) return;

    try {
      const predictions = await modelRef.current.estimateFaces(video);
      
      if (predictions.length > 0) {
        // Mock emotion detection - replace with actual emotion classification
        // In production, you would process facial landmarks and classify emotion
        const randomEmotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
        const randomConfidence = 0.6 + Math.random() * 0.4; // 60-100% confidence
        
        setEmotion(randomEmotion);
        setConfidence(randomConfidence);
      } else {
        setEmotion(null);
        setConfidence(0);
      }
    } catch (err) {
      console.error('Detection error:', err);
      setError('Detection error: ' + err.message);
    }
  }, []);

  // Start emotion detection
  const startDetection = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      videoRef.current = video;
      
      setIsDetecting(true);
      setError(null);

      // Run detection every 500ms
      detectionIntervalRef.current = setInterval(() => {
        detectEmotion(video);
      }, 500);
    } catch (err) {
      console.error('Failed to start detection:', err);
      setError('Failed to access camera. Please allow camera permissions.');
      setIsDetecting(false);
    }
  }, [detectEmotion]);

  // Stop emotion detection
  const stopDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsDetecting(false);
    setEmotion(null);
    setConfidence(0);
  }, []);

  return {
    isModelLoaded,
    emotion,
    confidence,
    error,
    isDetecting,
    startDetection,
    stopDetection,
  };
};

export default useEmotionDetection;