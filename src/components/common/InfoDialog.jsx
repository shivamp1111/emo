import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInfoDialog } from '../../hooks/useInfoDialog';
import { RiCloseFill, RiInformationLine } from 'react-icons/ri';

const InfoDialog = () => {
  const { isOpen, title, content, hideInfo } = useInfoDialog();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md rounded-3xl bg-[var(--color-surface)]/95 shadow-2xl border border-white/10 backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <RiInformationLine size={24} className="text-[var(--color-primary)]" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={hideInfo}
                className="text-[var(--color-text-muted)] hover:text-white transition-colors"
              >
                <RiCloseFill size={24} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="whitespace-pre-wrap text-[var(--color-text-muted)] leading-relaxed">
                {content}
              </p>
            </div>

            {/* Footer Button */}
            <div className="border-t border-white/10 p-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={hideInfo}
                className="btn btn-primary w-full"
              >
                Got it
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoDialog;