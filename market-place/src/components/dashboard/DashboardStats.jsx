import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Package, Star } from 'lucide-react';
import orderService from '../../services/orderService';
import { useAuth } from '../../context/useAuth';

const DashboardStats = () => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role === 'seller') {
        try {
          const data = await orderService.getSellerStats();
          setStatsData(data);
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const stats = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: statsData ? `$${statsData.totalRevenue}` : '$0',
      change: '+12.5%',
      icon: <TrendingUp size={24} />,
      color: 'blue'
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: statsData ? statsData.totalOrders : '0',
      change: '+8.2%',
      icon: <ShoppingBag size={24} />,
      color: 'green'
    },
    {
      id: 'products',
      title: 'Active Products',
      value: statsData ? statsData.activeProducts : '0',
      change: '+3.1%',
      icon: <Package size={24} />,
      color: 'orange'
    },
    {
      id: 'rating',
      title: 'Customer Rating',
      value: '4.8/5',
      change: '+0.2',
      icon: <Star size={24} />,
      color: 'yellow'
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-100 text-blue-600',
      green: 'bg-green-50 border-green-100 text-green-600',
      orange: 'bg-orange-50 border-orange-100 text-orange-600',
      yellow: 'bg-yellow-50 border-yellow-100 text-yellow-600'
    };
    return colors[color] || colors.blue;
  };

  if (loading) return <div className="p-6 text-gray-500">Loading metrics...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Overview</h2>
      <p className="text-gray-600 mb-6">Your marketplace performance summary</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-semibold px-2 py-1 rounded ${stat.change.startsWith('+')
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
                }`}>
                {stat.change}
              </span>
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mt-4 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>

            <div className="mt-4 flex items-center text-xs text-gray-500">
              <span>Compared to last month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;