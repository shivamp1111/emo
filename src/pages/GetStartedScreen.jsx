import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeartPulse } from 'react-icons/fa6';

const bgImageUrl = '/get_started_bg.jpg';

const GetStartedScreen = () => {
  const navigate = useNavigate();

  const onGetStarted = () => {
    localStorage.setItem('hasSeenGetStarted', 'true');
    navigate('/login');
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImageUrl})` }}
    >
      {/* Enhanced Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />

      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 right-20 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-20 h-72 w-72 rounded-full bg-[var(--color-secondary)]/10 blur-3xl"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center p-6 text-center text-white max-w-md"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaHeartPulse size={100} className="text-[var(--color-primary)]" />
        </motion.div>

        <h1 className="mt-8 text-5xl font-bold">Welcome to EmoCare+</h1>

        <p className="mt-6 text-lg text-white/90 leading-relaxed">
          Your intelligent companion for proactive mental wellness and emotional fitness.
        </p>

     <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={onGetStarted}
  className="mt-12 w-full bg-white text-black border border-gray-300 rounded-lg py-3"
>
  Get Started
</motion.button>


        <p className="mt-8 text-xs text-white/60">
          Taking care of your mental health, one step at a time.
        </p>
      </motion.div>
    </div>
  );
};

export default GetStartedScreen;
