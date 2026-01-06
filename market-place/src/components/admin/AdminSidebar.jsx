// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  CreditCard, 
  BarChart, 
  Settings,
  LogOut,
  Shield,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'User Management', icon: <Users size={20} /> },
    { id: 'products', label: 'Product Approval', icon: <Package size={20} />, badge: 5 },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-gray-400 text-sm">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* System Alerts */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle size={18} className="text-yellow-500" />
            <h4 className="font-medium">System Alerts</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Server: Online
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Database: Active
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Pending Approvals: 5
            </li>
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400">admin@marketplace.com</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-red-600 rounded-lg transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>MarketPlace Admin v1.0</p>
          <p className="mt-1">© {new Date().getFullYear()}</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;