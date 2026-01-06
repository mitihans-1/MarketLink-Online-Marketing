import React, { useState } from 'react';
import { Eye, Edit, MoreVertical, ChevronDown, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentOrders = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('date');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const orders = [
    { 
      id: '#ORD-001', 
      customer: 'John Smith', 
      email: 'john@example.com',
      amount: 245.99, 
      status: 'Delivered', 
      date: '2024-01-15',
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 89.99 },
        { name: 'Phone Case', quantity: 2, price: 78.00 }
      ],
      shipping: 'Express Shipping'
    },
    { 
      id: '#ORD-002', 
      customer: 'Emma Johnson', 
      email: 'emma@example.com',
      amount: 129.50, 
      status: 'Processing', 
      date: '2024-01-14',
      items: [
        { name: 'Smart Watch', quantity: 1, price: 129.50 }
      ],
      shipping: 'Standard Shipping'
    },
    { 
      id: '#ORD-003', 
      customer: 'Michael Brown', 
      email: 'michael@example.com',
      amount: 89.99, 
      status: 'Shipped', 
      date: '2024-01-13',
      items: [
        { name: 'USB Cable Pack', quantity: 3, price: 29.97 },
        { name: 'Mouse Pad', quantity: 1, price: 19.99 },
        { name: 'Laptop Stand', quantity: 1, price: 40.03 }
      ],
      shipping: 'Express Shipping'
    },
    { 
      id: '#ORD-004', 
      customer: 'Sarah Davis', 
      email: 'sarah@example.com',
      amount: 356.75, 
      status: 'Pending', 
      date: '2024-01-12',
      items: [
        { name: 'Gaming Laptop', quantity: 1, price: 356.75 }
      ],
      shipping: 'Next Day Delivery'
    },
    { 
      id: '#ORD-005', 
      customer: 'Robert Wilson', 
      email: 'robert@example.com',
      amount: 199.99, 
      status: 'Delivered', 
      date: '2024-01-11',
      items: [
        { name: 'Tablet', quantity: 1, price: 199.99 }
      ],
      shipping: 'Standard Shipping'
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return '✅';
      case 'Processing': return '🔄';
      case 'Shipped': return '🚚';
      case 'Pending': return '⏳';
      default: return '📦';
    }
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'amount') return b.amount - a.amount;
    return 0;
  });

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleEditOrder = (orderId) => {
    navigate(`/orders/${orderId}/edit`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
            <p className="text-gray-600 mt-1">Latest 5 orders from your store</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* View All Button */}
            <button 
              onClick={() => navigate('/orders')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 font-medium transition-opacity"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  {/* Order Details - Responsive */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">#{order.id.split('-')[1]}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500 lg:hidden">{order.customer}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Customer - Hidden on mobile */}
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </td>
                  
                  {/* Amount */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">${order.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{order.items.length} item(s)</div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(order.status)}`}>
                      <span className="mr-1">{getStatusIcon(order.status)}</span>
                      {order.status}
                    </span>
                  </td>
                  
                  {/* Date - Hidden on mobile */}
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="text-sm text-gray-900">{order.date}</div>
                    <div className="text-xs text-gray-500">{order.shipping}</div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrder(order.id);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Order"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditOrder(order.id);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Order"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOrderDetails(order.id);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="More Options"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <tr className="bg-blue-50">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Order Items */}
                        <div className="lg:col-span-2">
                          <h4 className="font-medium text-gray-700 mb-2">Order Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                                <span className="text-gray-700">{item.name}</span>
                                <div className="flex items-center space-x-4">
                                  <span className="text-gray-500">Qty: {item.quantity}</span>
                                  <span className="font-medium">${item.price.toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Shipping Info */}
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Shipping Info</h4>
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-gray-600">{order.shipping}</p>
                            <p className="text-sm text-gray-500 mt-2">Expected delivery: 3-5 business days</p>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Quick Actions</h4>
                          <div className="space-y-2">
                            <button className="w-full px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
                              Print Invoice
                            </button>
                            <button className="w-full px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition">
                              Track Order
                            </button>
                            <button className="w-full px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition">
                              Cancel Order
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing <span className="font-bold">{sortedOrders.length}</span> of <span className="font-bold">{orders.length}</span> orders
          </div>
          
          <div className="flex items-center space-x-2 mt-3 sm:mt-0">
            <button 
              disabled={true}
              className="px-3 py-1 border border-gray-300 rounded text-gray-400 cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;