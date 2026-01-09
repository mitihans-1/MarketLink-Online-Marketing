// src/components/common/Header.jsx
import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      if (query) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:opacity-90"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">MP</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">MarketPlace</h1>
              <p className="text-sm text-blue-100">Your Trusted Marketplace</p>
            </div>
          </button>

          {/* Search Bar */}
          <div className="w-full md:w-auto md:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, categories..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                onKeyDown={handleSearch}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => navigate('/help')}
              className="inline-flex items-center space-x-1 text-sm hover:text-blue-200"
            >
              <span>📞</span>
              <span>Support</span>
            </button>
            
            <div className="w-px h-6 bg-white/30"></div>
            
          <button 
            onClick={() => navigate('/seller/register')}
            className="text-sm font-medium px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
          >
            Become a Seller
          </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;