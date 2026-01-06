// src/components/common/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const ProtectedRoute = ({ children, requireAdmin = false, requireSeller = false }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Debug log
  console.log('ProtectedRoute Check:', {
    isAuthenticated,
    user,
    path: location.pathname,
    requireAdmin,
    requireSeller
  });

  if (!isAuthenticated) {
    // Redirect to login, but save where they wanted to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireSeller && user?.role !== 'seller') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;