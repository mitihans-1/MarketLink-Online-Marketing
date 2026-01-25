// src/context/AuthProvider.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import authService from '../services/authService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const checkStoredUser = () => {
      const storedUser = localStorage.getItem('marketplace_user');
      const token = localStorage.getItem('marketplace_token');

      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          localStorage.removeItem('marketplace_user');
          localStorage.removeItem('marketplace_token');
        }
      }
      setLoading(false);
    };

    checkStoredUser();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const result = await authService.login(email, password);

      if (result.success) {
        const { token, success, message, ...userData } = result;
        localStorage.setItem('marketplace_token', token);
        localStorage.setItem('marketplace_user', JSON.stringify(userData));
        setUser(userData);
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    return { success: true };
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const result = await authService.register(userData);
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }, []);

  const googleLogin = useCallback(async (data) => {
    try {
      const result = await authService.googleLogin(data);
      if (result.success) {
        const { token, success, message, ...userData } = result;
        localStorage.setItem('marketplace_token', token);
        localStorage.setItem('marketplace_user', JSON.stringify(userData));
        setUser(userData);
      }
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Google Login failed'
      };
    }
  }, []);

  const facebookLogin = useCallback(async (data) => {
    try {
      const result = await authService.facebookLogin(data);
      if (result.success) {
        const { token, success, message, ...userData } = result;
        localStorage.setItem('marketplace_token', token);
        localStorage.setItem('marketplace_user', JSON.stringify(userData));
        setUser(userData);
      }
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Facebook Login failed'
      };
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const result = await authService.updateProfile(profileData);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      };
    }
  }, []);

  const switchToSeller = useCallback(async () => {
    try {
      const result = await authService.switchToSeller();
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to switch to seller'
      };
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    login,
    logout,
    register,
    googleLogin,
    facebookLogin,
    updateProfile,
    switchToSeller,
    loading,
    isAuthenticated: !!user
  }), [user, loading, login, logout, register, googleLogin, facebookLogin, updateProfile, switchToSeller]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes for better development experience
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;