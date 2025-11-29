import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const PIE_COLORS = {
  Low: '#A8D5BA',
  Medium: '#F5D56D',
  High: '#E8A0A0',
};

const StressCharts = ({ historyData, summaryData }) => {
  const formattedHistory = historyData.map((entry, index) => ({
    ...entry,
    level: entry.level ?? 0,
    day: entry.date,
  }));

  const pieData = summaryData.filter((e) => e.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card"
    >
      <h3 className="text-2xl font-bold text-white mb-6">Your Stress Insights</h3>

      {/* Area Chart */}
      {formattedHistory.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ width: '100%', height: 280 }}
          className="mb-8"
        >
          <ResponsiveContainer>
            <AreaChart data={formattedHistory}>
              <defs>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7ED4D4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#7ED4D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#9BA9B1" />
              <YAxis domain={[0, 10]} stroke="#9BA9B1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid rgba(126, 212, 212, 0.3)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#E8F0F2' }}
              />
              <Area
                type="monotone"
                dataKey="level"
                stroke="#7ED4D4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorStress)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      ) : (
        <div className="flex h-[280px] items-center justify-center text-[var(--color-text-muted)]">
          No stress data for this week.
        </div>
      )}

      <h3 className="text-2xl font-bold text-white mb-6 mt-8">Stress Distribution</h3>

      {/* Pie Chart */}
      {pieData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ width: '100%', height: 280 }}
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#7ED4D4"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[entry.name] || '#7ED4D4'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid rgba(126, 212, 212, 0.3)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#E8F0F2' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      ) : (
        <div className="flex h-[280px] items-center justify-center text-[var(--color-text-muted)]">
          No summary data to display.
        </div>
      )}
    </motion.div>
  );
};

export default StressCharts;