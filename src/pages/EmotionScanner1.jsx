import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const EmotionScanner1 = () => {
  const [status, setStatus] = useState('loading');
  const [detectedEmotion, setDetectedEmotion] = useState({ emotion: '...', confidence: 0 });
  const [message, setMessage] = useState("Looking for emotions...");
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateMessage = (emotion) => {
    switch (emotion.toLowerCase()) {
      case 'happy':
        return "Good to see you smiling! Who got you smiling like that?";
      case 'sad':
        return "Why the long face? Hope things get better!";
      case 'angry':
        return "Take a deep breath. Stay calm!";
      case 'neutral':
        return "Feeling calm and collected.";
      case 'surprise':
        return "Whoa! Something exciting happening?";
      case 'fear':
        return "Don't worry, everything's alright.";
      case 'disgust':
        return "Something not quite right?";
      case 'error':
        return "Couldn't detect emotion. Try again!";
      default:
        return "Analyzing your mood...";
    }
  };

  // This useEffect is better for updating the message
  useEffect(() => {
    setMessage(generateMessage(detectedEmotion.emotion));
  }, [detectedEmotion.emotion]);


  const analyzeFrame = async () => {
    if (isAnalyzing || !videoRef.current || !videoRef.current.videoWidth) {
      return;
    }
    setIsAnalyzing(true);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = videoRef.current.videoWidth;
    tempCanvas.height = videoRef.current.videoHeight;
    const ctx = tempCanvas.getContext('2d');
    
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, -tempCanvas.width, 0, tempCanvas.width, tempCanvas.height);
    ctx.restore();

    const imageBase64 = tempCanvas.toDataURL('image/jpeg', 0.7);

    try {
      const response = await api.post('/api/analyze-emotion', { image: imageBase64 });
      setDetectedEmotion(response.data);
    } catch (error) {
      console.error("Error analyzing emotion:", error);
      setDetectedEmotion({ emotion: 'Error', confidence: 0 });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    let stream = null; 

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
          setStatus('ready'); 
            
            intervalRef.current = setInterval(() => {
              analyzeFrame();
            }, 1500); 
          };
        }
      } catch (err) {
        console.error("Could not access camera:", err);
        setStatus('error'); 
      }
    };

    startCamera();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); 

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
      <h3 className="text-2xl font-bold text-white mb-6">Real-time Emotion Detector</h3>
      <div 
        // --- THIS LINE IS CHANGED ---
        // We now use aspect-[4/5] (taller) for mobile by default
        // and md:aspect-video (widescreen) for medium screens and up
        className="relative w-full max-w-4xl mx-auto 
                   aspect-[4/5] md:aspect-video 
                   bg-[var(--color-surface)] rounded-xl shadow-md overflow-hidden
                   border-2 border-gray-400" // Using gray-400 as a safe default
      >
        
        {/* Status Indicators */}
        {status === 'loading' && (
         <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FaSpinner className="animate-spin text-white" />
            <p className="mt-2 text-[var(--color-text-muted)]">Starting camera...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="mt-2 text-[var(--color-error)]">Could not access camera.</p>
         S</div>
        )}
        
        <video 
          ref={videoRef} 
    	    className="w-full h-full object-cover transform scaleX(-1)" 
          autoPlay 
          playsInline
        ></video>
        
        {/* Emotion Display */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
      <p className="font-bold text-base md:text-lg">
            Detected Emotion: <span className="text-green-300">{detectedEmotion.emotion}</span>
          </p>
          <p className="text-sm">
            Confidence: <span className="text-green-300">{detectedEmotion.confidence}%</span>
          </p>
        </div>
        
        {/* Message Display */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg text-center">
          <p className="font-semibold text-base md:text-lg">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionScanner1;