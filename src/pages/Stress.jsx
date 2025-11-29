import React, { useState, useRef, useEffect } from 'react'; // Added useRef and useEffect
import { motion, AnimatePresence } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import ReactPlayer from 'react-player/youtube';
import { RiPlayFill, RiCloseFill, RiVideoLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Helper Components
const Spinner = () => <FaSpinner className="h-12 w-12 animate-spin text-[var(--color-secondary)]" />;
const ButtonSpinner = () => <FaSpinner className="h-6 w-6 animate-spin" />;

const Stress = () => {
  const [inputs, setInputs] = useState({ heart_rate: '', steps: '', sleep: '', age: '' });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();

  // --- FIX: Create a ref for the results card ---
  const resultsRef = useRef(null);

  const handleInputChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError('');
    try {
      const response = await api.post('/api/predict-stress', {
        heart_rate: parseFloat(inputs.heart_rate),
        steps: parseFloat(inputs.steps),
        sleep: parseFloat(inputs.sleep),
        age: parseFloat(inputs.age),
      });

      setResult({
        score: response.data.stress_level,
        suggestions: response.data.suggestions,
      });

    } catch (err) {
      setError('Could not get prediction. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FIX: useEffect to auto-scroll when 'result' changes ---
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]); // This runs every time 'result' is updated

  const getGaugeColor = (level) => {
    if (level <= 3) return "text-green-400";
    if (level <= 6) return "text-yellow-400";
    return "text-red-400";
  };
  
  const playVideo = (url) => {
    setVideoUrl(url);
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
    setVideoUrl('');
  };

  const getStressExplanation = (level) => {
    if (level <= 3) {
      return "Low Stress: You seem to be in a calm state. Keep up the good habits!";
    } else if (level <= 6) {
      return "Moderate Stress: You're showing some signs of stress. Now is a good time to reflect and use a relaxation tool.";
    } else {
      return "High Stress: Your stress levels appear high. We strongly recommend taking a break and trying one of the guided exercises below.";
    }
  };

  return (
    <>
      {/* Video Modal (unchanged) */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={closeVideo}
          >
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-50 text-white hover:text-[var(--color-primary)]"
            >
              <RiCloseFill size={40} />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ReactPlayer url={videoUrl} playing controls width="100%" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-y-auto pb-10">
        <h3 className="text-2xl font-bold text-white mb-6">Stress Predictor</h3>
        
        {/* The grid now contains the form AND the result card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Form Card (Left) */}
          <div className="p-6 bg-[var(--color-surface)] rounded-xl shadow-md">
            <h4 className="font-bold text-lg text-white mb-4">Enter Your Daily Metrics</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="number" name="heart_rate" placeholder="Avg. Heart Rate (e.g., 75)" value={inputs.heart_rate} onChange={handleInputChange} required />
              <input type="number" name="steps" placeholder="Daily Steps (e.g., 8000)" value={inputs.steps} onChange={handleInputChange} required />
              <input type="number" name="sleep" placeholder="Sleep Hours (e.g., 7.5)" value={inputs.sleep} onChange={handleInputChange} required />
              <input type="number" name="age" placeholder="Age (e.g., 35)" value={inputs.age} onChange={handleInputChange} required />
              
              {/* --- THIS IS THE FIX --- */}
              {/* Replaced 'btn-secondary' with hard-coded cyan button styles */}
              <button 
                type="submit" 
                disabled={isLoading} 
                className="btn w-full flex justify-center items-center disabled:opacity-50 bg-[rgb(var(--color-primary-rgb))] text-[var(--color-on-primary)] hover:bg-[rgb(var(--color-primary-rgb)/0.9)] focus:ring-[var(--color-primary)] shadow-lg shadow-[rgb(var(--color-primary-rgb)/0.3)]"
              >
                {isLoading ? <ButtonSpinner /> : 'Predict Stress'}
              </button>
            </form>
          </div>
          
          {/* --- FIX: UPDATED Result Card (Right) --- */}
          {/* We add the ref here */}
          <div ref={resultsRef} className="p-6 bg-[var(--color-surface)] rounded-xl shadow-md">
            {/* We now use logic to show one of 4 states */}

            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Spinner />
              </div>
            )}
            
            {!isLoading && !result && !error && (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg text-[var(--color-text-muted)]">Your results will appear here.</p>
              </div>
            )}
            
            {error && (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg text-[var(--color-error)]">{error}</p>
              </div>
            )}
            
            {/* The result is now rendered *inside* this card */}
            {result && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <p className={`text-7xl font-bold ${getGaugeColor(result.score)}`}>
                  {result.score}<span className="text-3xl text-gray-400">/10</span>
                </p>
                <p className="text-white font-semibold mt-2">Your Estimated Stress Level</p>
                <p className="mt-4 max-w-2xl mx-auto text-base text-[var(--color-text-muted)]">
                  {getStressExplanation(result.score)}
                </p>
                
                <div className="my-6 border-b border-white/10"></div>
                
                <h4 className="text-xl font-bold text-white mb-4 text-left">Personalized Suggestions</h4>
                <div className="space-y-3 text-left">
                  {result.suggestions.map((item) => (
                    <SuggestionCard
                      key={item.title}
                      item={item}
                      onPlayVideo={playVideo}
                      onPlayMeditation={(id) => navigate(`/meditations/${id}`)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* --- FIX: REMOVED the old, separate result card --- */}
        {/* {result && ( ... )} */}

      </motion.div>
    </>
  );
};

// SuggestionCard component (unchanged)
const SuggestionCard = ({ item, onPlayVideo, onPlayMeditation }) => {
  const isYouTube = item.type === 'youtube';

  const handleClick = () => {
    if (isYouTube) {
      onPlayVideo(item.link);
    } else {
      onPlayMeditation(item.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex cursor-pointer items-center justify-between rounded-lg bg-black/20 p-4 transition-all hover:bg-black/40"
    >
      <div className="flex items-center gap-4">
        <div className="text-[var(--color-secondary)]">
          {isYouTube ? <RiVideoLine size={24} /> : <RiPlayFill size={24} />}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
          <p className="text-sm text-[var(--color-text-muted)]">{item.description}</p>
        </div>
      </div>
      <RiPlayFill size={28} className="text-[var(--color-text-muted)]" />
    </div>
  );
};

export default Stress;