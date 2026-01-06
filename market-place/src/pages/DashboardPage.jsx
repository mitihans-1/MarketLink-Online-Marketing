// src/pages/DashboardPage.jsx
import React from 'react';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentOrders from '../components/dashboard/RecentOrders';
import SalesChart from '../components/dashboard/SalesChart';
import TopProducts from '../components/dashboard/TopProducts';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  // Mock data for dashboard
  const dashboardStats = [
    { 
      title: 'Total Revenue', 
      value: '$24,580', 
      change: '+12.5%', 
      icon: <DollarSign className="text-green-500" size={24} />,
      color: 'bg-gradient-to-r from-green-400 to-emerald-500'
    },
    { 
      title: 'Total Orders', 
      value: '1,248', 
      change: '+8.2%', 
      icon: <ShoppingBag className="text-blue-500" size={24} />,
      color: 'bg-gradient-to-r from-blue-400 to-cyan-500'
    },
    { 
      title: 'Total Customers', 
      value: '8,456', 
      change: '+5.7%', 
      icon: <Users className="text-purple-500" size={24} />,
      color: 'bg-gradient-to-r from-purple-400 to-pink-500'
    },
    { 
      title: 'Growth Rate', 
      value: '24.3%', 
      change: '+3.1%', 
      icon: <TrendingUp className="text-orange-500" size={24} />,
      color: 'bg-gradient-to-r from-orange-400 to-red-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-blue-100">Welcome back! Here's what's happening with your store today.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <div 
                key={index} 
                className={`${stat.color} rounded-xl shadow-lg p-6 text-white transform transition-transform hover:scale-105`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-90">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                  <span className="text-sm ml-2 opacity-90">from last month</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts and Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <SalesChart />
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Top Products</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
            <TopProducts />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Orders
            </button>
          </div>
          <RecentOrders />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left border border-gray-200 hover:border-blue-500">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Add New Product</h3>
              <p className="text-gray-600 text-sm">List a new product in your store</p>
            </button>
            
            <button className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left border border-gray-200 hover:border-green-500">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">View Earnings</h3>
              <p className="text-gray-600 text-sm">Check your revenue and profits</p>
            </button>
            
            <button className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left border border-gray-200 hover:border-purple-500">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Customer Insights</h3>
              <p className="text-gray-600 text-sm">Analyze customer behavior</p>
            </button>
            
            <button className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left border border-gray-200 hover:border-orange-500">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Generate Report</h3>
              <p className="text-gray-600 text-sm">Create detailed business reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;