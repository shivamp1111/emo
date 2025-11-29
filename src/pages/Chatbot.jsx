import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';
import { RiRobot2Line, RiSendPlane2Fill } from 'react-icons/ri';
import { FaSpinner } from 'react-icons/fa';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/chat/history');
        const history = response.data;

        const formattedHistory = [];
        if (history.length > 0) {
          history.forEach((item) => {
            formattedHistory.push({
              id: item.id + '_user',
              text: item.user_message,
              isUser: true,
            });
            formattedHistory.push({
              id: item.id + '_ai',
              text: item.ai_response,
              isUser: false,
            });
          });
        } else {
          formattedHistory.push({
            id: 'init1',
            text: "Hello! I'm your mindful assistant. How are you feeling today?",
            isUser: false,
          });
        }

        setMessages(formattedHistory);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setMessages([{ id: 'error1', text: 'Could not load chat history.', isUser: false }]);
      } finally {
        setIsFetchingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '' || isLoading) return;

    const userMessage = { id: Date.now().toString(), text: inputText.trim(), isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/chat', {
        message: messageText,
        user_id: user?.id || 'anonymous',
      });

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        isUser: false,
        emotion: response.data.emotion,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat API error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-[var(--color-surface)]/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/10"
    >
      {/* Header */}
      <div className="border-b border-white/10 p-6 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10">
        <h3 className="text-xl font-bold text-white">AI Companion</h3>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">A safe space to share.</p>
      </div>

      {/* Chat Container */}
      <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto">
        {isFetchingHistory ? (
          <div className="flex h-full items-center justify-center">
            <FaSpinner className="animate-spin text-[var(--color-primary)]" size={32} />
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isUser && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] text-white flex items-center justify-center flex-shrink-0">
                    <RiRobot2Line size={20} />
                  </div>
                )}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl backdrop-blur-sm border ${
                    msg.isUser
                      ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/80 text-[var(--color-on-primary)] rounded-br-none border-[var(--color-primary)]/30'
                      : 'bg-[var(--color-surface-light)]/60 text-white rounded-bl-none border-white/10'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </motion.div>
                {msg.isUser && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] text-white flex items-center justify-center flex-shrink-0 font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-3 justify-start"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] text-white flex items-center justify-center flex-shrink-0">
                  <RiRobot2Line size={20} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[var(--color-surface-light)]/60 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 bg-[var(--color-primary)] rounded-full animate-bounce"></span>
                    <span className="h-2 w-2 bg-[var(--color-primary)] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-[var(--color-primary)] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4 bg-[var(--color-surface-light)]/30 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            // --- TYPO FIX ---
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Share what's on your mind..."
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[var(--color-surface-light)]/60 border border-white/10 rounded-full focus:ring-2 focus:ring-[var(--color-primary)] outline-none text-white placeholder:text-[var(--color-text-muted)]"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="text-[var(--color-primary)] disabled:text-gray-600 transition-colors"
          >
            <RiSendPlane2Fill size={24} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default Chatbot;