import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Users, Package, Clock, CheckCircle } from 'lucide-react';

const AdminStats = ({ statsData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-32" />
        ))}
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: statsData?.totalUsers || '0', change: '+12%', icon: <Users className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Platform Revenue', value: `$${statsData?.totalRevenue || '0'}`, change: '+8%', icon: <TrendingUp className="text-green-600" />, color: 'bg-green-50' },
    { label: 'Orders Processed', value: statsData?.totalOrders || '0', change: '+23%', icon: <ShoppingBag className="text-purple-600" />, color: 'bg-purple-50' },
    { label: 'Active Listings', value: statsData?.totalProducts || '0', change: '+15%', icon: <Package className="text-orange-600" />, color: 'bg-orange-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth {stat.change}</span>
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mt-1">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;