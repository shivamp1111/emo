import React, { useState, useEffect } from 'react';
import api from '../contexts/AuthContext';
import { FaUserCircle, FaVideo, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const TherapistDashboard = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshQueue = async () => {
    try {
      const res = await api.get('/api/therapist/queue');
      setQueue(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    refreshQueue();
    // Poll for new patients every 5 seconds
    const interval = setInterval(refreshQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const acceptCall = async (reqId, roomId) => {
    // 1. Tell backend we accepted
    await api.post('/api/therapist/accept', { request_id: reqId });
    // 2. Open Jitsi in a new tab
    window.open(`https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false`, '_blank');
    // 3. Refresh list
    refreshQueue();
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-gray-700 pb-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <FaUserCircle className="text-blue-500"/> Therapist Portal
                </h1>
                <p className="text-gray-400 mt-2">Manage incoming consultation requests</p>
            </div>
            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online & Receiving
            </div>
        </header>
        
        {loading ? (
            <div className="text-center py-20"><FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto"/></div>
        ) : queue.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-xl border border-gray-700 border-dashed">
            <p className="text-gray-500 text-lg">No active patients waiting.</p>
            <p className="text-sm text-gray-600 mt-2">New requests will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {queue.map(item => (
              <div key={item.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex justify-between items-center hover:border-blue-500 transition-colors">
                <div>
                  <h3 className="font-bold text-xl text-white flex items-center gap-2">
                    {item.user_name}
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">New</span>
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Waiting since: {new Date(item.wait_time).toLocaleTimeString()}
                  </p>
                </div>
                <button 
                  onClick={() => acceptCall(item.id, item.room_id)}
                  className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/20"
                >
                  <FaVideo /> Accept & Join
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistDashboard;