// src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../context/useAuth';
import { LogOut, User, Settings, ShoppingBag, Package, Users, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import dashboard components from correct path
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentOrders from '../components/dashboard/RecentOrders';
import SalesChart from '../components/dashboard/SalesChart';
import TopProducts from '../components/dashboard/TopProducts';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Dashboard cards based on user role
  const getDashboardCards = () => {
    const commonCards = [
      { 
        id: 'profile',
        icon: User, 
        title: 'Profile', 
        description: 'View and edit your profile', 
        bgColor: 'bg-blue-100', 
        textColor: 'text-blue-600' 
      },
      { 
        id: 'settings',
        icon: Settings, 
        title: 'Settings', 
        description: 'Account settings', 
        bgColor: 'bg-gray-100', 
        textColor: 'text-gray-600' 
      },
    ];

    if (user?.role === 'user') {
      return [
        ...commonCards,
        { 
          id: 'orders',
          icon: ShoppingBag, 
          title: 'My Orders', 
          description: 'Track your orders', 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-600' 
        },
        { 
          id: 'wishlist',
          icon: Package, 
          title: 'Wishlist', 
          description: 'View saved items', 
          bgColor: 'bg-purple-100', 
          textColor: 'text-purple-600' 
        },
      ];
    }

    if (user?.role === 'seller') {
      return [
        ...commonCards,
        { 
          id: 'products',
          icon: Package, 
          title: 'Products', 
          description: 'Manage your products', 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-600' 
        },
        { 
          id: 'analytics',
          icon: BarChart, 
          title: 'Analytics', 
          description: 'View sales analytics', 
          bgColor: 'bg-yellow-100', 
          textColor: 'text-yellow-600' 
        },
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...commonCards,
        { 
          id: 'users',
          icon: Users, 
          title: 'Users', 
          description: 'Manage all users', 
          bgColor: 'bg-red-100', 
          textColor: 'text-red-600' 
        },
        { 
          id: 'admin-analytics',
          icon: BarChart, 
          title: 'Admin Analytics', 
          description: 'System analytics', 
          bgColor: 'bg-purple-100', 
          textColor: 'text-purple-600' 
        },
      ];
    }

    return commonCards;
  };

  const handleCardClick = (cardId) => {
    console.log(`Clicked ${cardId}`);
    // Navigate based on card ID
    switch(cardId) {
      case 'profile':
        navigate('/dashboard/profile');
        break;
      case 'settings':
        navigate('/dashboard/settings');
        break;
      case 'orders':
        navigate('/dashboard/orders');
        break;
      case 'wishlist':
        navigate('/dashboard/wishlist');
        break;
      case 'products':
        navigate('/seller/products');
        break;
      case 'analytics':
        navigate('/seller/analytics');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'admin-analytics':
        navigate('/admin/analytics');
        break;
      default:
        console.log(`No route for ${cardId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">MP</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img 
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                  alt={user?.name || 'User'}
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'user'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name || 'User'}!
          </h2>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your {user?.role || 'user'} account today.
          </p>
        </div>

        {/* Dashboard Stats Component */}
        <DashboardStats userRole={user?.role} />

        {/* Stats Grid - Fixed key and accessibility issues */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getDashboardCards().map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id)}
              className={`${card.bgColor} rounded-xl p-6 hover:shadow-lg transition cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label={`Go to ${card.title}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">12</p>
                  <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className={`${card.textColor}`}>
                  <card.icon className="h-8 w-8" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Charts and Recent Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h3>
            <SalesChart />
          </div>
          
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h3>
            <TopProducts />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <RecentOrders />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;