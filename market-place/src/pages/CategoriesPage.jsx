import React from 'react';
import { Link } from 'react-router-dom';

const CategoriesPage = () => {
  const categories = [
    { id: 1, name: 'Electronics', count: 245, icon: '📱', color: 'bg-blue-100', textColor: 'text-blue-600' },
    { id: 2, name: 'Fashion', count: 189, icon: '👕', color: 'bg-pink-100', textColor: 'text-pink-600' },
    { id: 3, name: 'Home & Garden', count: 156, icon: '🏠', color: 'bg-green-100', textColor: 'text-green-600' },
    { id: 4, name: 'Books', count: 342, icon: '📚', color: 'bg-purple-100', textColor: 'text-purple-600' },
    { id: 5, name: 'Sports', count: 98, icon: '⚽', color: 'bg-orange-100', textColor: 'text-orange-600' },
    { id: 6, name: 'Beauty', count: 176, icon: '💄', color: 'bg-red-100', textColor: 'text-red-600' },
    { id: 7, name: 'Toys', count: 134, icon: '🧸', color: 'bg-yellow-100', textColor: 'text-yellow-600' },
    { id: 8, name: 'Automotive', count: 87, icon: '🚗', color: 'bg-gray-100', textColor: 'text-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Product Categories</h1>
          <p className="text-xl text-blue-100">Browse products by category</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Categories Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map(category => (
              <div 
                key={category.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center mr-4`}>
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${category.textColor}`}>{category.name}</h3>
                      <p className="text-gray-500 text-sm">{category.count} products</p>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/category/${category.name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                    className="block w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 font-medium transition"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Categories</h2>
          <div className="space-y-4">
            {categories.slice(0, 4).map(category => (
              <div 
                key={category.id} 
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center mr-3`}>
                    <span className="text-lg">{category.icon}</span>
                  </div>
                  <span className="font-medium text-gray-700">{category.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">{category.count} products</span>
                  <Link 
                    to={`/category/${category.name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browse All Button */}
        <div className="mt-8 text-center">
          <Link 
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            <span>Browse All Products</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;