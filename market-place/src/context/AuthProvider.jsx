// src/context/AuthProvider.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';

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
      console.log('Attempting login with:', email);
      
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo users - replace with actual API response
      let userInfo = null;
      
      if (email === 'user@example.com' && password === 'password123') {
        userInfo = {
          id: '1',
          email: 'user@example.com',
          name: 'Demo User',
          role: 'user',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
        };
      } else if (email === 'seller@example.com' && password === 'password123') {
        userInfo = {
          id: '2',
          email: 'seller@example.com',
          name: 'Demo Seller',
          role: 'seller',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller',
          storeName: 'Awesome Store'
        };
      } else if (email === 'admin@example.com' && password === 'password123') {
        userInfo = {
          id: '3',
          email: 'admin@example.com',
          name: 'Demo Admin',
          role: 'admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
        };
      } else {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Store user data
      const token = `demo-token-${Date.now()}`;
      localStorage.setItem('marketplace_token', token);
      localStorage.setItem('marketplace_user', JSON.stringify(userInfo));
      setUser(userInfo);

      return {
        success: true,
        user: userInfo,
        token,
        message: 'Login successful'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please try again.'
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('marketplace_token');
    localStorage.removeItem('marketplace_user');
    setUser(null);
    return { success: true };
  }, []);

  const register = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Registration successful! Please login.'
      };
    } catch {
      return {
        success: false,
        message: 'Registration failed'
      };
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('marketplace_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { 
        success: true, 
        user: updatedUser,
        message: 'Profile updated successfully'
      };
    } catch {
      return { 
        success: false, 
        message: 'Failed to update profile' 
      };
    }
  }, [user]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    login,
    logout,
    register,
    updateProfile,
    loading,
    isAuthenticated: !!user
  }), [user, loading, login, logout, register, updateProfile]);

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