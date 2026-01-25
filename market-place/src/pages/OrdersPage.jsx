import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import orderService from '../services/orderService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length },
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  }).filter(order => {
    const hasSearchQuery = searchQuery.trim() !== '';
    if (!hasSearchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return order.id.toString().toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower);
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return '✅';
      case 'Processing': return '🔄';
      case 'Shipped': return '🚚';
      case 'Pending': return '⏳';
      case 'Cancelled': return '❌';
      default: return '📦';
    }
  };

  const handleOrderAction = (orderId, action) => {
    toast.success(`${action} action triggered for order #${orderId}`);
  };

  const normalizeImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/100x100?text=Order';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000/${url.startsWith('/') ? url.slice(1) : url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Orders</h1>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
            </div>
            <Link
              to="/products"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Orders</div>
            <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Spent</div>
            <div className="text-2xl font-bold text-gray-800">
              ${orders.reduce((sum, order) => sum + Number(order.total_amount), 0).toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'Pending').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Delivered</div>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'Delivered').length}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              <span className="font-medium">{tab.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
            >
              {/* Header */}
              <div className="p-4 md:p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getStatusIcon(order.status)}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">#ORD-{order.id}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <svg
                        className={`w-6 h-6 transform transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 md:p-6 bg-gray-50/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total</p>
                    <p className="text-lg font-black text-gray-900">${Number(order.total_amount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Items</p>
                    <p className="text-lg font-bold text-gray-800">{order.products?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Payment</p>
                    <p className="text-sm font-medium text-gray-700 capitalize">{order.payment_method}</p>
                  </div>
                  <div className="flex justify-end items-center">
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="text-blue-600 font-bold text-sm hover:underline"
                    >
                      {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="p-4 md:p-6 border-t border-gray-100 animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Items In Order</h4>
                      <div className="space-y-3">
                        {order.products?.map((product, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={normalizeImageUrl(product.image_url)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=Product' }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 truncate">{product.name}</p>
                              <p className="text-sm text-gray-500">Qty: {product.quantity} × ${Number(product.price).toFixed(2)}</p>
                            </div>
                            <p className="font-black text-gray-900">${(product.quantity * product.price).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Shipping Destination</h4>
                      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        <p className="font-bold text-gray-900 mb-1">Delivery Address</p>
                        <p className="text-gray-600 leading-relaxed">
                          {order.shipping_address}<br />
                          {order.city}, {order.state} {order.zip_code}<br />
                          {order.country}
                        </p>
                        {order.phone && <p className="mt-2 text-sm text-gray-500">📞 {order.phone}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className="p-4 md:px-6 md:py-4 border-t border-gray-100 flex flex-wrap gap-2">
                <button onClick={() => handleOrderAction(order.id, 'reorder')} className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Buy Again</button>
                <button onClick={() => handleOrderAction(order.id, 'invoice')} className="px-4 py-2 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Invoice</button>
                {order.status === 'Pending' && <button onClick={() => handleOrderAction(order.id, 'cancel')} className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">Cancel</button>}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-7xl mb-6">🛍️</div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">Looks like you haven't placed any orders yet. Start shopping to see your history!</p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;