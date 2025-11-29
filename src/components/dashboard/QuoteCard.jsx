import React from 'react';
import { motion } from 'framer-motion';
import { RiDoubleQuotesL } from 'react-icons/ri';

const QuoteCard = ({ quote }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card gradient-primary backdrop-blur-md border border-[var(--color-primary)]/20"
    >
      <div className="flex flex-col items-center py-6">
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <RiDoubleQuotesL size={40} className="text-[var(--color-primary)]/60" />
        </motion.div>
        <p className="mt-6 text-center text-xl italic text-white leading-relaxed">
          "{quote}"
        </p>
      </div>
    </motion.div>
  );
};

export default QuoteCard;