import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import orderService from '../services/orderService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SellerDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, productsData, ordersData] = await Promise.all([
          orderService.getSellerStats(),
          productService.getSellerProducts(),
          orderService.getSellerOrders()
        ]);
        setStats(statsData);
        setProducts(productsData.slice(0, 5));
        setOrders(ordersData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching seller dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleAddProduct = () => {
    navigate('/seller/add-product');
  };

  const getStockBadgeClass = (stock) => {
    if (stock > 10) return 'bg-green-100 text-green-800';
    if (stock > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getOrderBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Seller Dashboard</h1>
          <p className="text-gray-500 font-medium">Manage your shop in real-time</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          List New Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <p className="text-3xl font-black text-gray-900">${stats?.totalRevenue || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Orders</p>
          <p className="text-3xl font-black text-gray-900">{stats?.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Items Sold</p>
          <p className="text-3xl font-black text-gray-900">{stats?.itemsSold || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Listings</p>
          <p className="text-3xl font-black text-gray-900">{stats?.activeProducts || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-800">My Items</h2>
            <Link to="/seller/products" className="text-blue-600 font-bold text-sm hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {products.length > 0 ? products.map(product => (
              <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/50'} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 truncate max-w-[150px]">{product.name}</h3>
                    <p className="text-xs font-bold text-blue-600">${Number(product.price).toFixed(2)}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${getStockBadgeClass(product.stock)}`}>
                  {product.stock} in stock
                </span>
              </div>
            )) : (
              <p className="p-8 text-center text-gray-500 font-medium">No items listed yet</p>
            )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-800">Customer Orders</h2>
            <Link to="/seller/orders" className="text-blue-600 font-bold text-sm hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {orders.length > 0 ? orders.map(order => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div>
                  <h3 className="font-bold text-gray-900">#ORD-{order.id}</h3>
                  <p className="text-xs text-gray-500 font-medium">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${getOrderBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-xs font-black text-gray-900 mt-1">${Number(order.sellerTotal).toFixed(2)}</p>
                </div>
              </div>
            )) : (
              <p className="p-8 text-center text-gray-500 font-medium">No orders received yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;