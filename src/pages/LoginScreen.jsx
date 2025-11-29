import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, register } = useAuth();

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      localStorage.setItem('hasSeenGetStarted', 'true');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--color-background)] to-[var(--color-surface)] p-4 md:p-8">
      {/* Background Animation */}
      <motion.div
        className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[var(--color-secondary)]/10 blur-3xl"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-3xl bg-[var(--color-surface)]/80 backdrop-blur-md p-8 md:p-10 shadow-2xl border border-white/10"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent"
        >
          {isLogin ? 'Welcome Back' : 'Join Us'}
        </motion.h2>

        <form onSubmit={submitForm} className="mt-8 space-y-5">
          {!isLogin && (
            <motion.div
              custom={0}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10"
              />
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            </motion.div>
          )}

          <motion.div
            custom={!isLogin ? 1 : 0}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10"
            />
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          </motion.div>

          <motion.div
            custom={!isLogin ? 2 : 1}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10"
            />
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-[var(--color-error)]"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            custom={!isLogin ? 3 : 2}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            type="submit"
            disabled={isLoading}
            // --- THIS IS THE FIX ---
            // I removed 'btn-primary' and added specific styles for a high-contrast white button
            className="btn w-full mt-6 bg-white text-[var(--color-on-primary)] hover:bg-gray-100 focus:ring-white shadow-lg shadow-white/20"
          >
            {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="mt-8 w-full text-center text-sm text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LoginScreen;