/* eslint-disable @sonarlint/javascript:S6774 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import AuthContext from './AuthContext';

// Provider component ONLY - no hook here
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!email || !password) {
        setError('Email and password are required');
        return { success: false, error: 'Email and password are required' };
      }
      
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'buyer',
        avatar: null,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
      
    } catch (error) {
      setError('Login failed: ' + error.message);
      return { success: false, error: error.message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        role: userData.role || 'buyer',
        avatar: null,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
      
    } catch (error) {
      setError('Registration failed: ' + error.message);
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isSeller: user?.role === 'seller',
    isBuyer: user?.role === 'buyer'
  }), [user, loading, error, login, register, logout, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export ONLY the component
export default AuthProvider;

