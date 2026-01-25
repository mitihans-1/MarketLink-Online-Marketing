import React, { useState } from 'react';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useCart } from '../../context/useCart';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();

  // Calculate cart item count
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', roles: ['all'] },
    { name: 'Products', path: '/products', roles: ['all'] },
    { name: 'Categories', path: '/categories', roles: ['all'] },
    { name: 'My Dashboard', path: '/dashboard', roles: ['buyer', 'both', 'admin'] },
    { name: 'Seller Port', path: '/seller', roles: ['seller', 'both', 'admin'] },
    { name: 'Admin', path: '/admin', roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.roles.includes('all')) return true;
    if (!isAuthenticated || !user) return false;

    // Normalize role (default to buyer)
    let role = (user.role || 'buyer').toLowerCase();
    if (role === 'user') role = 'buyer';

    return item.roles.includes(role) || role === 'admin' || role === 'both';
  });

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
      setShowMobileSearch(false);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setShowMobileSearch(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setShowMobileSearch(false);
  };

  return (
    <nav className={`bg-white shadow-md border-b sticky top-0 z-50 transition-all duration-200 ${isScrolled ? 'shadow-lg' : 'shadow-md'
      }`}>
      <div className="container mx-auto px-4">
        {/* Mobile Search Bar - Shows on top when activated */}
        {showMobileSearch && (
          <div className="md:hidden py-3 border-b animate-slideDown">
            <div className="flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                {searchQuery && (
                  <button
                    onClick={handleSearchClick}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowMobileSearch(false)}
                className="ml-2 p-2 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Main Navbar Content */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-2 flex items-center justify-center">
              <span className="text-white font-bold">MP</span>
            </div>
            <span className="hidden sm:inline">MarketPlace</span>
            <span className="sm:hidden">MP</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
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
              {searchQuery && (
                <button
                  onClick={handleSearchClick}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                >
                  <Search size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation - Responsive spacing */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {filteredNavItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className="text-gray-700 hover:text-blue-600 font-medium px-2 xl:px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Toggle Button (Mobile) */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Search"
            >
              <Search size={22} className="text-gray-700" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => handleNavigation('/cart')}
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
                  onClick={() => handleNavigation('/profile')}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="font-medium text-gray-700 hidden xl:inline">
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
                onClick={() => handleNavigation('/login')}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 font-medium transition-opacity"
              >
                <User size={18} />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t animate-slideDown">
            {/* Navigation Items */}
            <div className="py-2">
              {filteredNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Search in Mobile Menu */}
            <div className="p-4 border-t border-b">
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

            {/* Cart Info in Mobile Menu */}
            <div className="border-t pt-2">
              <button
                onClick={() => handleNavigation('/cart')}
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
                    onClick={() => handleNavigation('/profile')}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50"
                  >
                    <User size={20} className="mr-3" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/orders')}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50"
                  >
                    <ShoppingCart size={20} className="mr-3" />
                    <span>My Orders</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/search')}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50"
                  >
                    <Search size={20} className="mr-3" />
                    <span>Search Products</span>
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
                    onClick={() => handleNavigation('/login')}
                    className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg mx-4 mb-2"
                  >
                    <User size={20} className="mr-2" />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/register')}
                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-blue-500 text-blue-600 font-medium rounded-lg mx-4 hover:bg-blue-50"
                  >
                    <span>Create Account</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/search')}
                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg mx-4 mt-2 hover:bg-gray-50"
                  >
                    <Search size={20} className="mr-2" />
                    <span>Search Products</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Secondary Desktop Nav for extra items (on larger screens) */}
        <div className="hidden lg:flex justify-center border-t pt-2 pb-1">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleNavigation('/search')}
              className="text-sm text-gray-600 hover:text-blue-600 flex items-center"
            >
              <Search size={16} className="mr-1" />
              Advanced Search
            </button>
            <button
              onClick={() => handleNavigation('/deals')}
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Today's Deals
            </button>
            <button
              onClick={() => handleNavigation('/help')}
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Help Center
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;