import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Central API instance
const api = axios.create({
  // FIX: Base URL is the root of the server
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    // Read the token from localStorage
    const token = localStorage.getItem('access_token'); // Use the correct key
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Get the token from localStorage on initial load
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const localUser = localStorage.getItem('user');
          if (localUser) {
            setUser(JSON.parse(localUser));
          } else {
             // If no user in storage, let's assume token is valid for now
             // A '/me' endpoint call would be ideal here
             setUser({ name: "User" }); // Placeholder
          }
        } catch (error) {
          console.error("Token validation failed", error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      // Increased splash time to match your Flutter app
      setTimeout(() => setIsLoading(false), 3000);
    };
    initAuth();
  }, [token]);

  // Replicates _authService.login
  const login = async (email, password) => {
    // FIX: Add /api prefix
    const response = await api.post('/api/auth/login', { email, password });
    
    const { access_token, user } = response.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user)); // Save user info too
    
    setToken(access_token);
    setUser(user);
  };

  // Replicates _authService.register
  const register = async (name, email, password) => {
    // FIX: Add /api prefix
    const response = await api.post('/api/auth/register', { name, email, password });

    const { access_token, user } = response.data;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user)); // Save user info too
    
    setToken(access_token);
    setUser(user);
  };

  // Replicates _authService.logout
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the centralized API instance for other files to use
export default api;