import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaVideo, FaSpinner, FaUserMd } from 'react-icons/fa';

const TeleTherapy = ({ onBack }) => {
  const [status, setStatus] = useState("idle"); // idle, waiting, connected
  const [roomID, setRoomID] = useState(null);
  const [reqID, setReqID] = useState(null);

  // 1. User Requests Help
  const requestHelp = async () => {
    setStatus("waiting");
    try {
      const res = await api.post('/api/consultation/request');
      setRoomID(res.data.room_id);
      setReqID(res.data.request_id);
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  // 2. Poll for Therapist Acceptance (Every 2 seconds)
  useEffect(() => {
    let interval = null;
    if (status === "waiting" && reqID) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/api/consultation/status/${reqID}`);
          if (res.data.status === "accepted") {
            setStatus("connected");
            clearInterval(interval);
          }
        } catch (e) { console.log("Polling error", e); }
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [status, reqID]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
      
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaVideo className="text-green-400"/> Tele-Therapy Session
        </h3>
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-white">Back to Map</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        {/* STATE 1: IDLE */}
        {status === "idle" && (
          <div className="text-center max-w-md">
            <div className="bg-gray-800 p-6 rounded-full inline-block mb-6 shadow-lg border border-gray-700">
                <FaUserMd className="text-6xl text-blue-400" />
            </div>
            <h2 className="text-2xl text-white font-bold mb-4">Connect with a Specialist</h2>
            <p className="text-gray-400 mb-8">
                Skip the travel. Get matched with an available therapist for an instant secure video consultation.
            </p>
            <button 
              onClick={requestHelp}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full text-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-3 mx-auto"
            >
              <FaVideo /> Start Video Session
            </button>
          </div>
        )}

        {/* STATE 2: WAITING */}
        {status === "waiting" && (
          <div className="text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <FaSpinner className="text-6xl text-blue-400 animate-spin relative z-10 mx-auto" />
            </div>
            <h2 className="text-2xl text-white font-bold mb-2">Finding a Therapist...</h2>
            <p className="text-gray-400">Please wait while we connect you to the next available professional.</p>
            <p className="text-xs text-gray-500 mt-8">Do not close this window.</p>
          </div>
        )}

        {/* STATE 3: CONNECTED (Jitsi Iframe) */}
        {status === "connected" && (
          <div className="absolute inset-0 bg-black">
            <iframe 
              src={`https://meet.jit.si/${roomID}#config.prejoinPageEnabled=false`} 
              className="w-full h-full border-0"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              title="Therapy Session"
            ></iframe>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeleTherapy;