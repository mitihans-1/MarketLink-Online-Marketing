import React from 'react';
import { Link } from 'react-router-dom';

const SellerDashboardPage = () => {
  // Mock data for seller dashboard
  const sellerStats = {
    totalProducts: 24,
    totalSales: 154,
    totalRevenue: 12540.75,
    pendingOrders: 7,
    outOfStock: 3
  };

  const recentProducts = [
    { id: 1, name: 'Wireless Headphones', price: 129.99, stock: 15, sales: 42 },
    { id: 2, name: 'Smart Watch', price: 249.99, stock: 8, sales: 28 },
    { id: 3, name: 'Laptop Backpack', price: 59.99, stock: 32, sales: 67 },
    { id: 4, name: 'Coffee Maker', price: 89.99, stock: 0, sales: 19 }
  ];

  const recentOrders = [
    { id: 'ORD-1001', customer: 'John Doe', amount: 189.97, status: 'Delivered', date: '2024-01-15' },
    { id: 'ORD-1002', customer: 'Jane Smith', amount: 249.99, status: 'Processing', date: '2024-01-14' },
    { id: 'ORD-1003', customer: 'Robert Johnson', amount: 89.99, status: 'Pending', date: '2024-01-14' },
    { id: 'ORD-1004', customer: 'Sarah Williams', amount: 319.98, status: 'Shipped', date: '2024-01-13' }
  ];

  // Function to add a new product
  const handleAddProduct = () => {
    alert('Navigate to add product form');
    // In real app: navigate('/seller/add-product')
  };

  // Helper functions to avoid nested ternaries
  const getStockBadgeClass = (stock) => {
    if (stock > 10) return 'bg-green-100 text-green-800';
    if (stock > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStockText = (stock) => {
    if (stock > 0) return `${stock} in stock`;
    return 'Out of stock';
  };

  const getOrderBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your products, orders, and sales</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{sellerStats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">{sellerStats.totalSales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">${sellerStats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold">{sellerStats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold">{sellerStats.outOfStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </button>
          
          <Link
            to="/seller/products"
            className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 p-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Manage Products
          </Link>
          
          <Link
            to="/seller/orders"
            className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 p-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            View Orders
          </Link>
          
          <Link
            to="/seller/analytics"
            className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 p-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </Link>
        </div>
      </div>

      {/* Recent Products & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Products</h2>
            <Link to="/seller/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStockBadgeClass(product.stock)}`}>
                    {getStockText(product.stock)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{product.sales} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
            <Link to="/seller/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium text-gray-800">{order.id}</h3>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getOrderBadgeClass(order.status)}`}>
                    {order.status}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">${order.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">42%</div>
            <div className="text-sm text-gray-500">Conversion Rate</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-3xl font-bold text-green-600">4.7/5.0</div>
            <div className="text-sm text-gray-500">Customer Rating</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">87%</div>
            <div className="text-sm text-gray-500">Repeat Customers</div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Last updated: Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        <p className="mt-2">Need help? Contact <a href="mailto:support@marketplace.com" className="text-blue-600 hover:underline">seller support</a></p>
      </div>
    </div>
  );
};

export default SellerDashboardPage;