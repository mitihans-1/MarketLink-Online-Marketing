import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Add this
import { useAuth } from '../../context';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requireAdmin = false, requireSeller = false }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  if (requireSeller && user?.role !== 'seller') {
    return <Navigate to="/" />;
  }

  return children;
};

// Add PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool,
  requireSeller: PropTypes.bool
};

// Add default props (optional)
ProtectedRoute.defaultProps = {
  requireAdmin: false,
  requireSeller: false
};

export default ProtectedRoute;