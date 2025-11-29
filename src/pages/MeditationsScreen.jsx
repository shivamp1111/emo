import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import { RiPlayFill, RiSeedlingLine } from 'react-icons/ri';

const tabs = ['Beginner', 'Intermediate', 'Advanced'];

const MeditationsScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [meditations, setMeditations] = useState({ Beginner: [], Intermediate: [], Advanced: [] });
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        const response = await api.get('/api/meditations');
        
        const sorted = { Beginner: [], Intermediate: [], Advanced: [] };
        response.data.forEach(med => {
          if (sorted[med.category]) {
            sorted[med.category].push(med);
          }
        });
        
        setMeditations(sorted);
      } catch (err)
        {
        setError('Could not fetch meditations.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeditations();
  }, []);

  const renderList = (list) => {
    if (list.length === 0) {
      return <p className="text-center text-[var(--color-text-muted)]">No meditations in this category yet.</p>;
    }
    
    return (
      <ul className="space-y-3">
        {list.map(med => (
          <li
            key={med._id} 
            onClick={() => navigate(`/meditations/${med._id}`)}
            className="flex cursor-pointer items-center justify-between rounded-lg bg-black/20 p-4 transition-all hover:bg-black/40"
          >
            <div className="flex items-center gap-4">
              <RiSeedlingLine size={24} className="text-[var(--color-primary)]" />
              <div>
                <h3 className="text-lg font-semibold text-white">{med.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{med.description}</p>
              </div>
            </div>
            <RiPlayFill size={28} className="text-[var(--color-text-muted)]" />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-[var(--color-surface)] shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white">Meditations Library</h2>
      </div>

      {/* --- MOBILE TWEAK: Added overflow-x-auto and whitespace-nowrap --- */}
      <div className="flex border-b border-white/10 px-6 overflow-x-auto whitespace-nowrap">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`-mb-px border-b-2 px-6 py-3 font-semibold ${
              activeTab === tab
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex-grow overflow-y-auto p-6">
        {isLoading && <div className="flex justify-center"><FaSpinner className="animate-spin text-white" /></div>}
        {error && <p className="text-center text-[var(--color-error)]">{error}</p>}
        {!isLoading && !error && renderList(meditations[activeTab])}
      </div>
    </div>
  );
};

export default MeditationsScreen;