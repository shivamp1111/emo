import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiPsychotherapyLine } from 'react-icons/ri';

const CbtCard = ({ latestRecord }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="card hover:shadow-xl"
    >
      <h3 className="text-2xl font-bold text-white">Challenge a Negative Thought</h3>
      <p className="mt-3 h-12 text-[var(--color-text-muted)] overflow-hidden">
        {latestRecord
          ? `Your last reframed thought: "${latestRecord.alternative_thought}"`
          : 'A simple exercise to reframe unhelpful thinking patterns.'}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/cbt')}
        // --- THIS IS THE FIX ---
        // Replaced 'btn-primary' with hard-coded white button styles
        className="btn mt-6 flex w-full items-center justify-center gap-2 bg-white text-[var(--color-on-primary)] hover:bg-gray-100 focus:ring-white shadow-lg shadow-white/20"
      >
        <RiPsychotherapyLine size={20} />
        Start a Thought Record
      </motion.button>
    </motion.div>
  );
};

export default CbtCard;