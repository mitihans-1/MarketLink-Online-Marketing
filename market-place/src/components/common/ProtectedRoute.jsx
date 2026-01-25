import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    // Normalize user role (default to buyer if missing or empty)
    let userRole = (user.role || 'buyer').toLowerCase();

    // Normalize synonym for buyer
    if (userRole === 'user') userRole = 'buyer';

    const targetRole = requiredRole.toLowerCase();

    const hasRole =
      userRole === 'admin' ||
      userRole === 'both' ||
      userRole === targetRole;

    if (!hasRole) {
      console.warn(`Access denied. User role: ${userRole}, Required: ${targetRole}`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;