import React from 'react';
import { motion } from 'framer-motion';
import { IoLeafOutline } from 'react-icons/io5';

const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-surface)] to-[var(--color-background)]">
      {/* Background Orbs */}
      <motion.div
        className="absolute top-20 left-20 h-64 w-64 rounded-full bg-[var(--color-primary)]/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-[var(--color-secondary)]/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0.7, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <IoLeafOutline size={100} className="text-[var(--color-primary)]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8 text-4xl font-bold text-[var(--color-on-surface)]"
        >
          EmoCare+
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-4 text-sm text-[var(--color-text-muted)]"
        >
          Your wellness journey starts here
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;