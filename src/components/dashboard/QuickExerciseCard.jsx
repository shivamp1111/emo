import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiPlayFill } from 'react-icons/ri';

const QuickExerciseCard = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-secondary)]/80 via-[var(--color-secondary)]/60 to-[var(--color-accent)]/40 p-8 shadow-lg border border-white/10"
    >
      {/* Animated Background Orbs */}
      <motion.div
        className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/5 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white">Feeling Overwhelmed?</h3>
        <p className="mt-3 text-white/80 text-base">Take a moment to reset and find your calm.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/breathing')}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 px-6 py-4 font-semibold text-[var(--color-on-primary)] transition-all shadow-lg hover:shadow-xl"
        >
          <RiPlayFill size={22} />
          Start Breathing Exercise
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuickExerciseCard;