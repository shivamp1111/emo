import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiPlayFill, RiPauseFill, RiVolumeUpLine, RiVolumeMuteLine } from 'react-icons/ri';

const CYCLES = {
  simple: [
    { text: 'Breathe In', duration: 4, scale: 1, opacity: 0.7 },
    { text: 'Breathe Out', duration: 6, scale: 0.5, opacity: 0.3 },
  ],
  box: [
    { text: 'Breathe In', duration: 4, scale: 1, opacity: 0.7 },
    { text: 'Hold', duration: 4, scale: 1, opacity: 0.7 },
    { text: 'Breathe Out', duration: 4, scale: 0.5, opacity: 0.3 },
    { text: 'Hold', duration: 4, scale: 0.5, opacity: 0.3 },
  ],
  '4-7-8': [
    { text: 'Breathe In', duration: 4, scale: 1, opacity: 0.7 },
    { text: 'Hold', duration: 7, scale: 1, opacity: 0.7 },
    { text: 'Breathe Out', duration: 8, scale: 0.5, opacity: 0.3 },
  ],
};
const DURATIONS = { '30 sec': 30, '2 min': 120, '5 min': 300, 'Until Stopped': Infinity };
const PROGRESS_INTERVAL = 100;
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  return new AudioContext();
}

const BreathingScreen = () => {
  const [activeTechnique, setActiveTechnique] = useState('simple');
  const [activeDuration, setActiveDuration] = useState(30);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [instruction, setInstruction] = useState('Ready to begin');
  const [circleStyle, setCircleStyle] = useState({
    transform: 'scale(0.5)',
    opacity: 0.3,
    transitionDuration: '4s'
  });
  const [progress, setProgress] = useState(0);
  const cycleTimerRef = useRef(null);
  const durationTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const audioCtxRef = useRef(getAudioContext());
  const isPlayingRef = useRef(false);

  useEffect(() => {
    return () => {
      clearAllTimers();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playSound = () => {
    if (!isSoundEnabled || !audioCtxRef.current) return;
    try {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const oscillator = audioCtxRef.current.createOscillator();
      const gainNode = audioCtxRef.current.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtxRef.current.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioCtxRef.current.currentTime);
      oscillator.start(audioCtxRef.current.currentTime);
      oscillator.stop(audioCtxRef.current.currentTime + 0.1);
    } catch (e) {
      console.error("Web Audio API error:", e);
    }
  };

  const clearAllTimers = () => {
    clearTimeout(cycleTimerRef.current);
    clearTimeout(durationTimerRef.current);
    clearInterval(progressIntervalRef.current);
  };

  const runCycle = (index) => {
    if (!isPlayingRef.current) return;
    const cycle = CYCLES[activeTechnique];
    const newIndex = index % cycle.length;
    const step = cycle[newIndex];
    setInstruction(step.text);
    playSound();
    setCircleStyle({
      transform: `scale(${step.scale})`,
      opacity: step.opacity,
      transitionDuration: `${step.duration}s`,
    });
    cycleTimerRef.current = setTimeout(() => {
      runCycle(newIndex + 1);
    }, step.duration * 1000);
  };

  const startExercise = () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setProgress(0);
    runCycle(0);
    if (activeDuration !== Infinity) {
      const startTime = Date.now();
      durationTimerRef.current = setTimeout(() => {
        stopExercise();
      }, activeDuration * 1000);
      progressIntervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = (elapsedTime / (activeDuration * 1000)) * 100;
        if (!isPlayingRef.current) {
          clearInterval(progressIntervalRef.current);
          return;
        }
        if (newProgress >= 100) {
          setProgress(100);
          clearInterval(progressIntervalRef.current);
        } else {
          setProgress(newProgress);
        }
      }, PROGRESS_INTERVAL);
    }
  };

  const stopExercise = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    clearAllTimers();
    setInstruction('Ready to begin');
    setCircleStyle({
      transform: 'scale(0.5)',
      opacity: 0.3,
      transitionDuration: '4s'
    });
    setProgress(0);
  };

  const renderButton = (key, value, state, setter) => (
    <button
      key={key}
      onClick={() => setter(value)}
      disabled={isPlaying}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
        state === value
          ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-lg'
          : 'bg-black/20 text-[var(--color-text-muted)] hover:bg-black/40'
      } ${isPlaying ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {key}
    </button>
  );

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto rounded-xl bg-[var(--color-surface)] shadow-lg">

      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full w-full flex-col"
          >
            <div className="p-6">
              <h3 className="font-semibold text-white">Breathing Technique</h3>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {renderButton('Simple', 'simple', activeTechnique, setActiveTechnique)}
                {renderButton('Box Breathing', 'box', activeTechnique, setActiveTechnique)}
                {renderButton('4-7-8', '4-7-8', activeTechnique, setActiveTechnique)}
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                {activeTechnique === 'simple' && 'Simple 4-count inhale and 6-count exhale.'}
                {activeTechnique === 'box' && 'Equal 4-count inhale, hold, exhale, and hold.'}
                {activeTechnique === '4-7-8' && 'Inhale for 4, hold for 7, exhale for 8.'}
              </p>
              <h3 className="mt-4 font-semibold text-white">Duration</h3>
              {/* --- MOBILE TWEAK: Changed grid-cols-4 to grid-cols-2 sm:grid-cols-4 --- */}
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(DURATIONS).map(([key, value]) =>
                  renderButton(key, value, activeDuration, setActiveDuration)
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-semibold text-white">Sound Enabled</h3>
                <button onClick={() => setIsSoundEnabled(!isSoundEnabled)}>
                  {isSoundEnabled ? (
                    <RiVolumeUpLine size={24} className="text-[var(--color-primary)]" />
                  ) : (
                    <RiVolumeMuteLine size={24} className="text-[var(--color-text-muted)]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-grow flex-col items-center justify-center space-y-8">
              <div
                className="h-56 w-56 rounded-full bg-[var(--color-secondary)]"
                style={{ transform: 'scale(0.5)', opacity: 0.3 }}
              />
              <h3 className="text-center text-3xl font-semibold text-white">
                {instruction}
              </h3>
              <button
                onClick={startExercise}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-lg transition-all hover:scale-110"
              >
                <RiPlayFill size={32} />
              </button>
            </div>
            <div className="h-10 w-full p-4" /> {/* Spacer */}
          </motion.div>

        ) : (

          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full w-full flex-col"
          >
            <div className="flex flex-grow flex-col items-center justify-center space-y-8">
              <div
                className="h-56 w-56 rounded-full bg-[var(--color-secondary)] shadow-2xl shadow-[var(--color-secondary)]/20"
                style={{
                  ...circleStyle,
                  transitionProperty: 'transform, opacity',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              <div className="h-12">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={instruction}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center text-3xl font-semibold text-white"
                  >
                    {instruction}
                  </motion.h3>
                </AnimatePresence>
              </div>
              <button
                onClick={stopExercise}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-[var(--color-on-primary)] shadow-lg transition-all hover:scale-110"
              >
                <RiPauseFill size={32} />
              </button>
            </div>

            <div className="h-10 w-full p-4">
              {activeDuration !== Infinity && (
                <div className="h-2 w-full rounded-full bg-black/20">
                  <motion.div
                    className="h-2 rounded-full bg-[var(--color-primary)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BreathingScreen;