import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
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

  const updateProfile = async (profileData) => {
    if (!user?._id) throw new Error('Not authenticated');
    const updatedUser = await userService.update(user._id, profileData);
    setUser(updatedUser);
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
