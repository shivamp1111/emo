import React from 'react';
import { motion } from 'framer-motion';
import {
  RiHeartPulseFill,
  RiFireFill,
  RiMoonFill,
  RiEmotionHappyLine,
  RiEmotionSadLine,
  RiEmotionUnhappyLine,
  RiQuestionLine,
} from 'react-icons/ri';

const VitalsItem = ({ icon, value, label, gradientFrom, gradientTo, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.05, y: -5 }}
    className={`flex flex-col items-center rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} p-6 text-center shadow-md backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all`}
  >
    <motion.div
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
      className="text-4xl"
    >
      {icon}
    </motion.div>
    <p className="mt-4 text-2xl font-bold text-white">{value}</p>
    <p className="mt-1 text-xs text-white/70">{label}</p>
  </motion.div>
);

const getEmotionIcon = (emotion) => {
  const iconClass = "text-4xl";
  switch (emotion?.toLowerCase()) {
    case 'happy':
      return <RiEmotionHappyLine className={`${iconClass} text-yellow-300`} />;
    case 'sad':
      return <RiEmotionSadLine className={`${iconClass} text-blue-300`} />;
    case 'angry':
      return <RiEmotionUnhappyLine className={`${iconClass} text-red-300`} />;
    default:
      return <RiQuestionLine className={`${iconClass} text-gray-300`} />;
  }
};

const DailyVitalsCard = ({ vitals }) => {
  const vitalsData = [
    {
      icon: <RiHeartPulseFill className="text-4xl text-red-300" />,
      value: vitals.heartRate,
      label: "bpm",
      gradientFrom: "from-red-500/10",
      gradientTo: "to-red-500/5",
      delay: 0,
    },
    {
      icon: <RiFireFill className="text-4xl text-orange-300" />,
      value: vitals.steps,
      label: "Steps",
      gradientFrom: "from-orange-500/10",
      gradientTo: "to-orange-500/5",
      delay: 0.1,
    },
    {
      icon: <RiMoonFill className="text-4xl text-indigo-300" />,
      value: vitals.sleep,
      label: "Hours",
      gradientFrom: "from-indigo-500/10",
      gradientTo: "to-indigo-500/5",
      delay: 0.2,
    },
    {
      icon: getEmotionIcon(vitals.emotion),
      value: vitals.emotion || 'N/A',
      label: "Emotion",
      gradientFrom: "from-purple-500/10",
      gradientTo: "to-purple-500/5",
      delay: 0.3,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card"
    >
      <h3 className="text-2xl font-bold text-white mb-6">Your Daily Vitals</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {vitalsData.map((item, idx) => (
          <VitalsItem key={idx} {...item} />
        ))}
      </div>
    </motion.div>
  );
};

export default DailyVitalsCard;