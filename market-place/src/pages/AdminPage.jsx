// src/pages/AdminPage.jsx
import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStats from '../components/admin/AdminStats';
import UserManagement from '../components/admin/UserManagement';
import ProductApproval from '../components/admin/ProductApproval';
import TransactionLog from '../components/admin/TransactionLog';
import ReportGenerator from '../components/admin/ReportGenerator';
import { 
  Users, 
  Package, 
  BarChart, 
  Shield, 
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock admin data
  const adminStats = {
    totalUsers: 1245,
    totalProducts: 5678,
    pendingApprovals: 23,
    totalRevenue: '$124,560',
    todayOrders: 45,
    activeSellers: 89
  };
  
  // Recent activities
  const recentActivities = [
    { id: 1, type: 'user', action: 'New user registered', user: 'John Doe', time: '5 min ago', status: 'success' },
    { id: 2, type: 'product', action: 'Product needs approval', product: 'Wireless Headphones', time: '15 min ago', status: 'pending' },
    { id: 3, type: 'transaction', action: 'Large transaction processed', amount: '$2,450', time: '30 min ago', status: 'success' },
    { id: 4, type: 'user', action: 'User reported', user: 'Jane Smith', time: '1 hour ago', status: 'warning' },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'warning': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
                <p className="text-gray-600">Welcome back, Administrator</p>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Generate Report
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Settings
                </button>
              </div>
            </div>
            
            <AdminStats stats={adminStats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          {getStatusIcon(activity.status)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                          <p className="text-xs text-gray-500">
                            {activity.user || activity.product || activity.amount} • {activity.time}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.status === 'success' ? 'bg-green-100 text-green-800' :
                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center"
                  >
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-700">Manage Users</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('products')}
                    className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center"
                  >
                    <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-700">Product Approval</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('transactions')}
                    className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center"
                  >
                    <BarChart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-700">Transactions</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition text-center"
                  >
                    <Shield className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-700">Reports</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'users':
        return <UserManagement />;
      
      case 'products':
        return <ProductApproval />;
      
      case 'transactions':
        return <TransactionLog />;
      
      case 'reports':
        return <ReportGenerator />;
      
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h2>
            <div className="space-y-4">
              <p className="text-gray-600">Admin settings content will go here.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
            <p className="text-gray-600">Select a section from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Admin Sidebar */}
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;