// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Menu, X, ShoppingCart, User, ChevronDown, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useCart } from '../../context/useCart';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart(); // Get cart items from context
  
  // Calculate cart item count
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Seller', path: '/seller' },
    { name: 'Admin', path: '/admin' },
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-2 flex items-center justify-center">
              <span className="text-white font-bold">MP</span>
            </div>
            MarketPlace
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button (Mobile) */}
            <button 
              onClick={() => navigate('/search')}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Search"
            >
              <Search size={22} className="text-gray-700" />
            </button>

            {/* Cart Button - UPDATED with dynamic count */}
            <button 
              onClick={() => navigate('/cart')}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={22} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            
            {/* User Profile / Login */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="font-medium text-gray-700 hidden lg:inline">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 font-medium transition-opacity"
              >
                <User size={18} />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t animate-slideDown">
            {/* Mobile Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Navigation Items */}
            <div className="py-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Cart Info in Mobile Menu - ADDED */}
            <div className="border-t pt-2">
              <button 
                onClick={() => {
                  navigate('/cart');
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-blue-50"
              >
                <div className="flex items-center">
                  <ShoppingCart size={20} className="mr-3" />
                  <span>Shopping Cart</span>
                </div>
                {cartCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Actions */}
            <div className="border-t pt-2">
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50"
                  >
                    <User size={20} className="mr-3" />
                    <span>My Profile</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      navigate('/orders');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50"
                  >
                    <ShoppingCart size={20} className="mr-3" />
                    <span>My Orders</span>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 border-t mt-2"
                  >
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg mx-4 mb-2"
                  >
                    <User size={20} className="mr-2" />
                    <span>Sign In</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-blue-500 text-blue-600 font-medium rounded-lg mx-4 hover:bg-blue-50"
                  >
                    <span>Create Account</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;