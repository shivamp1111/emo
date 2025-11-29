import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import { RiCheckFill } from 'react-icons/ri';

const steps = [
  {
    title: 'The Situation',
    field: 'situation',
    hint: 'e.g., I received critical feedback at work.',
    rows: 3,
  },
  {
    title: 'Automatic Thought',
    field: 'automatic_thought',
    hint: 'e.g., "I\'m terrible at my job."',
    rows: 3,
  },
  {
    title: 'Emotions',
    field: 'emotions',
    hint: 'e.g., Anxious, sad, ashamed.',
    rows: 2,
  },
  {
    title: 'Alternative Thought',
    field: 'alternative_thought',
    hint: 'e.g., "This feedback is a chance to learn and improve."',
    rows: 4,
  },
];


const CbtScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    situation: '',
    automatic_thought: '',
    emotions: '',
    alternative_thought: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => {
    const currentField = steps[currentStep].field;
    if (formData[currentField].trim() === '') {
      setError('Please complete this field before continuing.');
      return;
    }
    setError('');
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setError('');
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveRecord = async () => {
    if (formData.alternative_thought.trim() === '') {
      setError('Please complete the final field.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await api.post('/api/cbt-records', formData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard'); 
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Error saving record.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading || success) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[var(--color-surface)] p-6 text-center">
        {isLoading ? (
          <FaSpinner className="h-12 w-12 animate-spin text-[var(--color-primary)]" />
        ) : (
          <>
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500"
            >
              <RiCheckFill size={60} className="text-white" />
            </motion.div>
            <h2 className="mt-6 text-2xl font-bold text-white">
              Your thought record has been saved!
            </h2>
          </>
        )}
      </div>
    );
  }
  
  const activeStep = steps[currentStep];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-[var(--color-surface)] shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white">Challenge a Thought</h2>
        <p className="text-[var(--color-text-muted)]">A CBT Thought Record</p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="flex px-6 pb-6">
        {steps.map((step, index) => (
          <div key={step.field} className="flex-1">
            <div
              className={`h-1 rounded-full transition-all ${
                index <= currentStep ? 'bg-[var(--color-primary)]' : 'bg-gray-700'
              }`}
            />
            <p
              className={`mt-2 text-xs font-semibold ${
                index <= currentStep ? 'text-white' : 'text-gray-500'
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>

      {/* Form Content Area */}
      <div className="flex-grow overflow-y-auto bg-black/10 p-6">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <label
            htmlFor={activeStep.field}
            className="text-xl font-semibold text-white"
          >
            {activeStep.title}
          </label>
          <textarea
            id={activeStep.field}
            name={activeStep.field}
            value={formData[activeStep.field]}
            onChange={handleChange}
            placeholder={activeStep.hint}
            rows={activeStep.rows}
            className="mt-4 w-full resize-none"
          />
          
          {error && <p className="mt-4 text-[var(--color-error)]">{error}</p>}
          
        </motion.div>
      </div>

      {/* --- MOBILE TWEAK: Added flex-col, sm:flex-row, and gap-4 --- */}
      <div className="flex flex-col sm:flex-row justify-between p-6 gap-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          // --- MOBILE TWEAK: Added w-full sm:w-auto ---
          className="btn w-full sm:w-auto px-8 disabled:cursor-not-allowed disabled:opacity-50 bg-[rgb(var(--color-primary-rgb))] text-[var(--color-on-primary)] hover:bg-[rgb(var(--color-primary-rgb)/0.9)] focus:ring-[var(--color-primary)] shadow-lg shadow-[rgb(var(--color-primary-rgb)/0.3)]"
        >
          Back
        </button>

        {currentStep === steps.length - 1 ? (
          <button 
            onClick={saveRecord} 
            // --- MOBILE TWEAK: Added w-full sm:w-auto ---
            className="btn w-full sm:w-auto px-8 bg-white text-[var(--color-on-primary)] hover:bg-gray-100 focus:ring-white shadow-lg shadow-white/20"
          >
            Save Record
          </button>
        ) : (
          <button 
            onClick={nextStep} 
            // --- MOBILE TWEAK: Added w-full sm:w-auto ---
            className="btn w-full sm:w-auto px-8 bg-white text-[var(--color-on-primary)] hover:bg-gray-100 focus:ring-white shadow-lg shadow-white/20"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default CbtScreen;