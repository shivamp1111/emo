import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import {
  RiPlayFill,
  RiPauseFill,
  RiReplay10Line,
  RiForward10Line,
  RiArrowLeftLine,
  RiSeedlingLine 
} from 'react-icons/ri';

// Helper to format time
const formatDuration = (seconds) => {
  // ... (same as before) ...
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const MeditationPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meditation, setMeditation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Audio state
  const audioRef = useRef(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // --- FIX: State for the corrected audio path ---
  const [audioSrc, setAudioSrc] = useState('');

  // Fetch meditation data
  useEffect(() => {
    const fetchMeditation = async () => {
      try {
        const response = await api.get('/api/meditations');
        const foundMeditation = response.data.find(med => med._id === id);
        
        if (foundMeditation) {
          setMeditation(foundMeditation);

          // --- FIX: Clean the asset_path ---
          // 1. Get just the filename (e.g., "exercise.mp3")
          const fileName = foundMeditation.asset_path.split('/').pop();
          // 2. Set the correct path relative to the 'public' folder
          setAudioSrc(`/audio/${fileName}`);

        } else {
          setError('Could not find this meditation.');
        }
      } catch (err) {
        setError('Could not load meditation.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeditation();
  }, [id]);

  // ... (Audio Control Functions are the same) ...
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };
  const seekForward = () => seek(Math.min(currentTime + 10, duration));
  const seekBackward = () => seek(Math.max(currentTime - 10, 0));
  const onLoadedMetadata = () => setDuration(audioRef.current.duration);
  const onTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
  const onEnded = () => setIsPlaying(false);

  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center"><FaSpinner className="animate-spin text-white" /></div>;
  }
  
  if (error) {
    return <div className="flex h-full w-full items-center justify-center text-[var(--color-error)]">{error}</div>;
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-[var(--color-surface)] p-6 text-center">
      <button
        onClick={() => navigate('/meditations')}
        className="absolute left-6 top-6 text-white/50 transition-all hover:text-white"
      >
        <RiArrowLeftLine size={24} />
      </button>

      {/* --- FIX: Use the 'audioSrc' state --- */}
      <audio
        ref={audioRef}
        src={audioSrc} 
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />

      <RiSeedlingLine size={100} className="text-[var(--color-primary)]" />
      <h2 className="mt-6 text-3xl font-bold text-white">{meditation.title}</h2>
      <p className="mt-2 text-lg text-[var(--color-text-muted)]">{meditation.description}</p>
      
      {/* ... (Rest of the player controls are the same) ... */}
      <div className="mt-12 w-full max-w-lg">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => seek(e.target.value)}
          className="h-1 w-full cursor-pointer accent-[var(--color-primary)]"
        />
        <div className="mt-2 flex justify-between text-sm text-[var(--color-text-muted)]">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-6">
        <button onClick={seekBackward} className="text-white/70 transition-all hover:text-white">
          <RiReplay10Line size={32} />
        </button>
        <button
          onClick={togglePlayPause}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] transition-transform hover:scale-110"
        >
          {isPlaying ? <RiPauseFill size={44} /> : <RiPlayFill size={44} />}
        </button>
        <button onClick={seekForward} className="text-white/70 transition-all hover:text-white">
          <RiForward10Line size={32} />
        </button>
      </div>
    </div>
  );
};

export default MeditationPlayer;