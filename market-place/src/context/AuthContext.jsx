// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // current logged-in user
  const [loading, setLoading] = useState(true);

  // Example: load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    return { success: true };
  };

  const updateProfile = async (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return { success: true, user: updatedUser };
  };

  // Example stubs for social logins
  const googleLogin = async (googleData) => login(googleData);
  const facebookLogin = async (facebookData) => login(facebookData);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        googleLogin,
        facebookLogin,
        loading,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
