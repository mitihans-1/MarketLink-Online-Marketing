import React, { useState } from 'react';
import { 
  TrendingUp, 
  Star, 
  ShoppingBag, 
  DollarSign, 
  Eye, 
  MoreVertical,
  ArrowUp,
  Filter,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopProducts = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('sales');
  const [timeRange, setTimeRange] = useState('month');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    { 
      id: 'P001',
      name: 'Wireless Headphones Pro', 
      category: 'Electronics',
      sales: 234, 
      revenue: 4680, 
      rating: 4.8,
      reviews: 128,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60',
      growth: 25.3,
      price: 199.99
    },
    { 
      id: 'P002',
      name: 'Smart Watch Series 5', 
      category: 'Electronics',
      sales: 189, 
      revenue: 5670, 
      rating: 4.6,
      reviews: 94,
      stock: 28,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60',
      growth: 18.7,
      price: 299.99
    },
    { 
      id: 'P003',
      name: 'Ergonomic Laptop Stand', 
      category: 'Office',
      sales: 156, 
      revenue: 1872, 
      rating: 4.9,
      reviews: 76,
      stock: 62,
      image: 'https://images.unsplash.com/photo-1586950012036-b957f2c7cbf3?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60',
      growth: 32.1,
      price: 119.99
    },
    { 
      id: 'P004',
      name: 'Premium Phone Case', 
      category: 'Accessories',
      sales: 142, 
      revenue: 1136, 
      rating: 4.7,
      reviews: 203,
      stock: 150,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60',
      growth: 12.5,
      price: 39.99
    },
    { 
      id: 'P005',
      name: 'LED Desk Lamp', 
      category: 'Home',
      sales: 128, 
      revenue: 2560, 
      rating: 4.5,
      reviews: 87,
      stock: 34,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60',
      growth: 8.9,
      price: 79.99
    },
    { 
      id: 'P006',
      name: 'Bluetooth Speaker', 
      category: 'Electronics',
      sales: 112, 
      revenue: 2688, 
      rating: 4.4,
      reviews: 56,
      stock: 21,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60',
      growth: 15.6,
      price: 89.99
    },
    { 
      id: 'P007',
      name: 'Wireless Mouse', 
      category: 'Electronics',
      sales: 98, 
      revenue: 784, 
      rating: 4.3,
      reviews: 45,
      stock: 89,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60',
      growth: 22.4,
      price: 29.99
    },
    { 
      id: 'P008',
      name: 'Yoga Mat', 
      category: 'Fitness',
      sales: 87, 
      revenue: 1305, 
      rating: 4.7,
      reviews: 67,
      stock: 42,
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60',
      growth: 19.2,
      price: 49.99
    }
  ];

  const sortProducts = (products, sortBy) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'sales': return b.sales - a.sales;
        case 'revenue': return b.revenue - a.revenue;
        case 'rating': return b.rating - a.rating;
        case 'growth': return b.growth - a.growth;
        default: return 0;
      }
    });
  };

  const sortedProducts = sortProducts(products, sortBy).slice(0, 5);

  const getGrowthColor = (growth) => {
    if (growth > 20) return 'text-green-600 bg-green-50';
    if (growth > 10) return 'text-blue-600 bg-blue-50';
    if (growth > 0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-orange-400';
      case 2: return 'from-gray-400 to-gray-600';
      case 3: return 'from-amber-600 to-amber-800';
      default: return 'from-blue-100 to-blue-200';
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewAnalytics = (productId) => {
    navigate(`/analytics/products/${productId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Top Products</h2>
                <p className="text-gray-600 mt-1">Best performing products this month</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
              >
                <option value="sales">Sort by Sales</option>
                <option value="revenue">Sort by Revenue</option>
                <option value="rating">Sort by Rating</option>
                <option value="growth">Sort by Growth</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* Time Range */}
            <div className="inline-flex rounded-lg border border-gray-200 p-1">
              {['week', 'month', 'quarter', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm font-medium rounded-md capitalize transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
              <Download size={18} className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="divide-y divide-gray-100">
        {sortedProducts.map((product, index) => (
          <div 
            key={product.id}
            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
              selectedProduct === product.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => setSelectedProduct(product.id)}
          >
            <div className="flex items-center">
              {/* Rank Badge */}
              <div className={`w-10 h-10 bg-gradient-to-r ${getRankColor(index + 1)} rounded-lg flex items-center justify-center mr-4`}>
                <span className="text-white font-bold text-lg">#{index + 1}</span>
              </div>

              {/* Product Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h3 
                      className="text-lg font-semibold text-gray-800 hover:text-blue-600 truncate"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-gray-500">{product.category}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${getGrowthColor(product.growth)}`}>
                        <ArrowUp size={10} className="inline mr-1" />
                        {product.growth}%
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="flex items-center text-gray-600">
                        <ShoppingBag size={14} className="mr-1" />
                        <span className="text-sm">Sales</span>
                      </div>
                      <div className="font-bold text-gray-800">{product.sales}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center text-gray-600">
                        <DollarSign size={14} className="mr-1" />
                        <span className="text-sm">Revenue</span>
                      </div>
                      <div className="font-bold text-gray-800">${product.revenue.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center text-gray-600">
                        <Star size={14} className="mr-1" />
                        <span className="text-sm">Rating</span>
                      </div>
                      <div className="font-bold text-gray-800">{product.rating}</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Additional Info */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Sales progress</span>
                    <span className="text-xs font-medium">
                      {Math.round((product.sales / sortedProducts[0].sales) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                      style={{ width: `${(product.sales / sortedProducts[0].sales) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>Stock: {product.stock} units</span>
                    <span>{product.reviews} reviews</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="ml-4 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product.id);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Product"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewAnalytics(product.id);
                  }}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="View Analytics"
                >
                  <TrendingUp size={18} />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="More Options"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing top 5 products by {sortBy.replace('Sort by ', '')}
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
              {timeRange === 'week' ? 'Last 7 days' : 
               timeRange === 'month' ? 'Last 30 days' : 
               timeRange === 'quarter' ? 'Last 90 days' : 'Last 365 days'}
            </span>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/products')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              View All Products
            </button>
            <button 
              onClick={() => navigate('/analytics/products')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 font-medium transition-opacity"
            >
              Detailed Analysis
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-xs text-gray-500">Total Revenue</div>
            <div className="text-lg font-bold text-gray-800">
              ${sortedProducts.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-xs text-gray-500">Total Sales</div>
            <div className="text-lg font-bold text-gray-800">
              {sortedProducts.reduce((sum, p) => sum + p.sales, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-xs text-gray-500">Avg. Rating</div>
            <div className="text-lg font-bold text-gray-800">
              {(sortedProducts.reduce((sum, p) => sum + p.rating, 0) / sortedProducts.length).toFixed(1)}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-xs text-gray-500">Avg. Growth</div>
            <div className="text-lg font-bold text-green-600">
              +{(sortedProducts.reduce((sum, p) => sum + p.growth, 0) / sortedProducts.length).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;