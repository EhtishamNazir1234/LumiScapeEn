import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // TEMPORARY: Mock user for screenshots
  // TODO: Remove this after taking screenshots
  const BYPASS_AUTH = true;
  
  const mockUser = {
    _id: 'mock-user-id',
    name: 'Admin User',
    email: 'admin@lumiscape.com',
    role: 'super-admin',
    userId: 'ADMIN-001',
    subscription: 'Premium',
    subscriptionStatus: 'Active',
    country: 'Nigeria',
    status: 'Active'
  };

  const [user, setUser] = useState(BYPASS_AUTH ? mockUser : null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(BYPASS_AUTH);

  useEffect(() => {
    // Skip auth check if bypassing
    if (BYPASS_AUTH) {
      setLoading(false);
      return;
    }

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');

    if (token && userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Verify token is still valid by fetching current user
        authService.getCurrentUser()
          .then((currentUser) => {
            setUser(currentUser);
            localStorage.setItem('userInfo', JSON.stringify(currentUser));
          })
          .catch(() => {
            // Token invalid, clear storage
            handleLogout();
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error('Error parsing user info:', error);
        handleLogout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      const userData = await authService.login(email, password, rememberMe);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    handleLogout();
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
