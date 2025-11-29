
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const EmotionScanner = () => {
  const [status, setStatus] = useState('loading');
  const [detectedEmotion, setDetectedEmotion] = useState({ emotion: '...', confidence: 0 });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const [mediaPipeReady, setMediaPipeReady] = useState(false);

  const euclideanDistance = (p1, p2) => (p1 && p2) ? Math.hypot(p1.x - p2.x, p1.y - p2.y) : 0;

  useEffect(() => {
    const checkMediaPipe = setInterval(() => {
      if (window.FaceMesh && window.Camera) {
        setMediaPipeReady(true);
        clearInterval(checkMediaPipe);
      }
    }, 100);
    return () => clearInterval(checkMediaPipe);
  }, []);

  const onResults = async (results) => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      
      if (!landmarks || landmarks.length < 468) return;

      const ear_left = (euclideanDistance(landmarks[386], landmarks[374]) + euclideanDistance(landmarks[385], landmarks[373])) / (2 * euclideanDistance(landmarks[362], landmarks[263]));
      const ear_right = (euclideanDistance(landmarks[159], landmarks[145]) + euclideanDistance(landmarks[158], landmarks[144])) / (2 * euclideanDistance(landmarks[133], landmarks[33]));
      const avg_ear = (ear_left + ear_right) / 2.0;
      const mar = euclideanDistance(landmarks[13], landmarks[14]) / euclideanDistance(landmarks[61], landmarks[291]);
      const eyebrow_dist = (euclideanDistance(landmarks[105], landmarks[10]) + euclideanDistance(landmarks[334], landmarks[10])) / 2.0;
      const jaw_drop = euclideanDistance(landmarks[175], landmarks[152]);

      try {
        const response = await api.post('/api/predict-emotion', { avg_ear, mar, eyebrow_dist, jaw_drop });
        setDetectedEmotion(response.data);
      } catch (error) {
        console.error("Error predicting emotion:", error);
        setDetectedEmotion({ emotion: 'Error', confidence: 0 });
      }

      if (window.FaceMesh && Array.isArray(window.FaceMesh.FACEMESH_TESSELATION)) {
        for (const conn of window.FaceMesh.FACEMESH_TESSELATION) {
          const start = landmarks[conn[0]];
          const end = landmarks[conn[1]];
          if (start && end) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(start.x * canvasRef.current.width, start.y * canvasRef.current.height);
            canvasCtx.lineTo(end.x * canvasRef.current.width, end.y * canvasRef.current.height);
            canvasCtx.strokeStyle = 'rgba(224, 224, 224, 0.5)';
            canvasCtx.stroke();
          }
        }
      }
    }
    canvasCtx.restore();
  };

  useEffect(() => {
    if (!mediaPipeReady || !videoRef.current) return;

    const faceMesh = new window.FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }
    });
    
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
    faceMesh.onResults(onResults);

    cameraRef.current = new window.Camera(videoRef.current, {
      onFrame: async () => { if (videoRef.current) { await faceMesh.send({ image: videoRef.current }); } },
      width: 640,
      height: 480,
    });
    
    cameraRef.current.start().then(() => setStatus('ready')).catch(() => setStatus('error'));

    return () => { if (cameraRef.current) cameraRef.current.stop(); };
  }, [mediaPipeReady]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
      <h3 className="text-2xl font-bold text-white mb-6">Real-time Emotion Detector</h3>
      <div className="relative w-full max-w-2xl mx-auto aspect-video bg-[var(--color-surface)] rounded-xl shadow-md overflow-hidden">
        {status === 'loading' && <div className="absolute inset-0 flex flex-col items-center justify-center"><FaSpinner className="animate-spin text-white" /><p className="mt-2 text-[var(--color-text-muted)]">Starting camera...</p></div>}
        {status === 'error' && <div className="absolute inset-0 flex flex-col items-center justify-center"><p className="mt-2 text-[var(--color-error)]">Could not access camera.</p></div>}
        <video ref={videoRef} className="w-full h-full object-cover transform scaleX(-1)" autoPlay playsInline></video>
        <canvas ref={canvasRef} width="640" height="480" className="absolute top-0 left-0 w-full h-full transform scaleX(-1)"></canvas>
        <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
          {/* --- MOBILE TWEAK: Changed text-lg to text-base md:text-lg --- */}
          <p className="font-bold text-base md:text-lg">Detected Emotion: <span className="text-green-300">{detectedEmotion.emotion}</span></p>
          <p className="text-sm">Confidence: <span className="text-green-300">{detectedEmotion.confidence}%</span></p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionScanner;