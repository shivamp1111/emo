import React, { useState, useEffect } from 'react';
import api from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import { RiExternalLinkLine, RiBookReadLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

const ResourcesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // FIX: Add /api prefix
        const response = await api.get('/api/resources');
        setCategories(response.data);
      } catch (err) {
        setError('Could not fetch resources.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center"><FaSpinner className="animate-spin text-white" /></div>;
  }
  
  if (error) {
    return <div className="flex h-full w-full items-center justify-center text-[var(--color-error)]">{error}</div>;
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Helpful Resources</h2>
      <div className="space-y-4">
        {categories.map((category) => (
          <CategoryItem key={category.category} category={category} />
        ))}
      </div>
    </div>
  );
};

// Replaces the ExpansionTile
const CategoryItem = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl bg-[var(--color-surface)] shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <h3 className="text-xl font-semibold text-white">{category.category}</h3>
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
          <RiBookReadLine size={24} className="text-[var(--color-primary)]" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ul className="border-t border-white/10 px-5 pb-5">
              {category.items.map((item) => (
                <li key={item.title} className="border-b border-white/5 py-4 last:border-b-0">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-[var(--color-primary)]">{item.title}</h4>
                      <p className="text-sm text-[var(--color-text-muted)]">{item.description}</p>
                    </div>
                    <RiExternalLinkLine className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourcesScreen;