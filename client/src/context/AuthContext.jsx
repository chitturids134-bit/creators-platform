import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../services/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Ensure socket connects for authenticated sessions
        try {
          socket.connect();
        } catch (e) {
          console.warn('Socket connect failed on auth init', e);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false); // Finished checking
  }, []);

  // Login function
  const login = (userData, userToken) => {
    // Update state
    setUser(userData);
    setToken(userToken);
    
    // Store in localStorage
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));

    // Connect socket after login
    try {
      socket.connect();
    } catch (e) {
      console.warn('Socket connect failed on login', e);
    }
  };

  // Logout function
  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    try {
      socket.disconnect();
    } catch (e) {
      console.warn('Socket disconnect failed on logout', e);
    }

    navigate('/login');
  };

  // Check if authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};