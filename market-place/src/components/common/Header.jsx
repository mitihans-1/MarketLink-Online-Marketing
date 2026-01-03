import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <h1>MarketLink</h1>
          </Link>
          <span className="tagline">Online Marketplace</span>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
          />
          <button className="search-button">
            <FaSearch />
          </button>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/categories" className="nav-link">Categories</Link>
          <Link to="/seller" className="nav-link">Sell</Link>
        </nav>

        {/* User Actions */}
        <div className="user-actions">
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/dashboard" className="user-link">
                <FaUser />
                <span>{user?.name}</span>
              </Link>
              <div className="dropdown">
                <Link to="/profile">Profile</Link>
                <Link to="/orders">Orders</Link>
                {user?.role === 'seller' && (
                  <Link to="/seller">Seller Dashboard</Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin">Admin Panel</Link>
                )}
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;