import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../contexts/AuthContext';
// <--- CHANGED: Added FaWallet icon --->
import { FaSpinner, FaCoins, FaWallet, FaTimes } from 'react-icons/fa'; 

const EmotionScanner = () => {
  const [status, setStatus] = useState('loading');
  const [detectedEmotion, setDetectedEmotion] = useState({ emotion: '...', confidence: 0 });
  const [message, setMessage] = useState("Looking for emotions...");
  
  // Rewards State
  const [totalCoins, setTotalCoins] = useState(0); 
  const [showRewardPopup, setShowRewardPopup] = useState(false);

  // <--- NEW: State for Claiming Logic --->
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [claimStatus, setClaimStatus] = useState("idle"); // idle, processing, success, error
  const [txHash, setTxHash] = useState("");
  // ---------------------------------------

  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initial Fetch of Balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // Assuming your backend sends 'user' object with 'pending_coins' on login/profile fetch
        // If not, this might initially be 0 until the first smile detection updates it.
        const res = await api.get('/api/auth/login'); // Or whichever endpoint gives user details
        if (res.data && res.data.user) {
            setTotalCoins(res.data.user.pending_coins || 0);
        }
      } catch (err) {
        // Silent fail on fetch
      }
    };
    fetchBalance();
  }, []);

  const generateMessage = (emotion) => {
    switch (emotion.toLowerCase()) {
      case 'happy': return "Great smile! Keep it up!";
      default: return "Show me a happy face to earn coins!";
    }
  };

  useEffect(() => {
    setMessage(generateMessage(detectedEmotion.emotion));
  }, [detectedEmotion.emotion]);

  // <--- NEW: Function to handle Claiming --->
  const handleClaimRewards = async () => {
    if (!walletAddress) return;
    setClaimStatus("processing");
    
    try {
      const res = await api.post('/api/claim-rewards', { wallet_address: walletAddress });
      
      // On success:
      setClaimStatus("success");
      setTxHash(res.data.tx_hash);
      setTotalCoins(0); // Reset local counter
      
    } catch (err) {
      console.error(err);
      setClaimStatus("error");
    }
  };
  // -----------------------------------------

  const analyzeFrame = async () => {
    if (isAnalyzing || !videoRef.current || !videoRef.current.videoWidth) return;
    setIsAnalyzing(true);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = videoRef.current.videoWidth;
    tempCanvas.height = videoRef.current.videoHeight;
    const ctx = tempCanvas.getContext('2d');
    
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, -tempCanvas.width, 0, tempCanvas.width, tempCanvas.height);
    ctx.restore();

    const imageBase64 = tempCanvas.toDataURL('image/jpeg', 0.7);

    try {
      const response = await api.post('/api/analyze-emotion', { image: imageBase64 });
      const data = response.data;
      
      setDetectedEmotion(data);

      // <--- CHANGED: Sync total coins from backend --->
      if (data.total_coins !== undefined) {
          setTotalCoins(data.total_coins);
      }

      if (data.reward_status === 'collected') {
        setShowRewardPopup(true);
        setTimeout(() => setShowRewardPopup(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    let stream = null; 
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setStatus('ready'); 
            intervalRef.current = setInterval(() => analyzeFrame(), 1500); 
          };
        }
      } catch (err) {
        setStatus('error'); 
      }
    };
    startCamera();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []); 

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Real-time Emotion Detector</h3>
        
        {/* <--- CHANGED: Coin Counter + Claim Button Group ---> */}
        <div className="flex items-center gap-3">
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-4 py-2 rounded-full flex items-center gap-2 font-bold">
                <FaCoins />
                <span>{totalCoins}</span>
            </div>
            
            {/* Show Claim button only if user has coins */}
            {totalCoins > 0 && (
                <button 
                    onClick={() => {
                        setShowClaimModal(true);
                        setClaimStatus("idle"); // Reset status on open
                    }}
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                    <FaWallet /> Claim
                </button>
            )}
        </div>
        {/* -------------------------------------------------- */}
      </div>

      {/* <--- NEW: CLAIM MODAL OVERLAY ---> */}
      <AnimatePresence>
        {showClaimModal && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Claim Your Rewards</h2>
                        <button onClick={() => setShowClaimModal(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
                    </div>

                    {claimStatus === "idle" && (
                        <>
                            <p className="text-gray-300 mb-4">You have <strong>{totalCoins} HAPY</strong> coins. Enter your wallet address to withdraw them.</p>
                            <input 
                                type="text" 
                                placeholder="0x..." 
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white mb-4 focus:border-green-500 outline-none"
                            />
                            <button 
                                onClick={handleClaimRewards}
                                disabled={!walletAddress}
                                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all"
                            >
                                Withdraw to Wallet
                            </button>
                        </>
                    )}

                    {claimStatus === "processing" && (
                        <div className="flex flex-col items-center py-6">
                            <FaSpinner className="animate-spin text-4xl text-green-500 mb-4" />
                            <p className="text-white">Processing Blockchain Transaction...</p>
                            <p className="text-xs text-gray-400 mt-2">This may take 10-20 seconds.</p>
                        </div>
                    )}

                    {claimStatus === "success" && (
                        <div className="flex flex-col items-center py-6 text-center">
                            <FaCoins className="text-5xl text-yellow-400 mb-4 animate-bounce" />
                            <h3 className="text-xl font-bold text-green-400 mb-2">Success!</h3>
                            <p className="text-gray-300 text-sm mb-4">Your coins are on their way.</p>
                            <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-blue-400 underline text-xs mb-4">View on Etherscan</a>
                            <button onClick={() => setShowClaimModal(false)} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">Close</button>
                        </div>
                    )}

                    {claimStatus === "error" && (
                        <div className="text-center py-4">
                            <p className="text-red-400 font-bold mb-2">Transaction Failed</p>
                            <p className="text-sm text-gray-400 mb-4">Please check your internet or try again later.</p>
                            <button onClick={() => setClaimStatus("idle")} className="bg-gray-700 text-white px-4 py-2 rounded-lg">Try Again</button>
                        </div>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
      {/* ---------------------------------- */}

      <div className="relative w-full max-w-4xl mx-auto aspect-[4/5] md:aspect-video bg-[var(--color-surface)] rounded-xl shadow-md overflow-hidden border-2 border-gray-400">
        
        {/* Reward +1 Popup */}
        <AnimatePresence>
          {showRewardPopup && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-2xl flex flex-col items-center transform rotate-3">
                <FaCoins className="text-6xl text-white mb-2 drop-shadow-md animate-bounce" />
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Happy Coin!</h2>
                <p className="text-white font-medium">+1 Added</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video & Status Layers (Same as before) */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FaSpinner className="animate-spin text-white" />
            <p className="mt-2 text-[var(--color-text-muted)]">Starting camera...</p>
          </div>
        )}
        
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover transform scaleX(-1)" 
          autoPlay 
          playsInline
        ></video>
        
        <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          <p className="font-bold text-base md:text-lg">Detected: <span className="text-green-300">{detectedEmotion.emotion}</span></p>
          <p className="text-sm">Confidence: <span className="text-green-300">{detectedEmotion.confidence}%</span></p>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg text-center backdrop-blur-sm">
          <p className="font-semibold text-base md:text-lg">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionScanner;