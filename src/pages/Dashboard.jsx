import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

// Import Dashboard Components
import QuickExerciseCard from '../components/dashboard/QuickExerciseCard';
import QuoteCard from '../components/dashboard/QuoteCard';
import CbtCard from '../components/dashboard/CbtCard';
import DailyVitalsCard from '../components/dashboard/DailyVitalsCard';
import StressCharts from '../components/dashboard/StressCharts';

// Mock quotes
const quotes = [
  "The best way to predict the future is to create it.",
  "Believe you can and you're halfway there.",
  "Your limitation is only your imagination."
];

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [lastEmotion, setLastEmotion] = useState(null);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [latestCbtRecord, setLatestCbtRecord] = useState(null);
  const [vitals, setVitals] = useState({ heartRate: 'N/A', steps: 'N/A', sleep: 'N/A' });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Use Promise.all to fetch data concurrently
        // --- THIS IS THE FIX ---
        // Changed '/api/dashboard' to '/api/history' to match your app.py
        const [apiDataRes, cbtRecordsRes] = await Promise.all([
          api.get('/api/history'), 
          api.get('/api/cbt-records'), 
        ]);

        const apiData = apiDataRes.data;
        const cbtRecords = cbtRecordsRes.data;

        // Get emotion from localStorage (replaces SharedPreferences)
        const savedEmotion = localStorage.getItem('last_emotion');

        // --- Set all the states ---
        setDashboardData(apiData);
        setLastEmotion(savedEmotion);
        setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        setLatestCbtRecord(cbtRecords.length > 0 ? cbtRecords[0] : null);

        if (apiData.last_stress_log) {
          setVitals({
            heartRate: apiData.last_stress_log.heart_rate?.toString() || 'N/A',
            steps: apiData.last_stress_log.steps?.toString() || 'N/A',
            sleep: apiData.last_stress_log.sleep?.toString() || 'N/A',
          });
        }
        
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); 

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FaSpinner className="h-12 w-12 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  // Once loading is false, render the dashboard
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="h-full overflow-y-auto space-y-6 pb-10" // Replaces ListView
    >
      <h2 className="text-3xl font-bold text-white">
        Welcome back, {user?.name || 'Guest'}!
      </h2>
      
      {/* Grid layout for the cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QuickExerciseCard />
        <CbtCard latestRecord={latestCbtRecord} />
      </div>

      <DailyVitalsCard
        vitals={{ ...vitals, emotion: lastEmotion }}
      />
      
      {motivationalQuote && <QuoteCard quote={motivationalQuote} />}
      
      {dashboardData && (
        <StressCharts
          historyData={dashboardData.stress_history || []}
          summaryData={dashboardData.stress_summary_pie || []}
        />
      )}
    </motion.div>
  );
};

export default Dashboard;