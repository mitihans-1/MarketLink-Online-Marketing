// src/context/AuthContext.js
import { createContext } from 'react';

// Create the context with default values
export const AuthContext = createContext({
  user: null,
  login: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => ({ success: false }),
  register: async () => ({ success: false, message: 'Not implemented' }),
  updateProfile: async () => ({ success: false, message: 'Not implemented' }),
  loading: true,
  isAuthenticated: false
});