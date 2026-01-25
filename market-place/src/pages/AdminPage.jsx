import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStats from '../components/admin/AdminStats';
import UserManagement from '../components/admin/UserManagement';
import ProductApproval from '../components/admin/ProductApproval';
import TransactionLog from '../components/admin/TransactionLog';
import ReportGenerator from '../components/admin/ReportGenerator';
import SellerCategories from '../components/seller/SellerCategories';
import orderService from '../services/orderService';
import {
  Users,
  Package,
  BarChart,
  Shield,
  Tag,
  ChevronRight,
  Settings,
  LayoutDashboard
} from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const data = await orderService.getAdminStats();
        setStatsData(data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Platform Overview</h2>
                <p className="text-gray-500 font-medium">Real-time statistics across all shops</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2">
                <BarChart size={18} />
                Generate Audit
              </button>
            </div>

            <AdminStats statsData={statsData} loading={loading} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-black text-gray-900 mb-6">System Status</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-bold text-gray-700">API Gateway</span>
                    </div>
                    <span className="text-xs font-black text-green-600 uppercase">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-bold text-gray-700">Database Engine</span>
                    </div>
                    <span className="text-xs font-black text-green-600 uppercase">Operational</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-black text-gray-900 mb-6">Platform Security</h3>
                <div className="space-y-4">
                  <button onClick={() => setActiveTab('users')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group border border-dashed border-gray-200">
                    <div className="flex items-center gap-4">
                      <Users className="text-blue-600" />
                      <span className="font-bold text-gray-700">Verify New Sellers</span>
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </button>
                  <button onClick={() => setActiveTab('products')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group border border-dashed border-gray-200">
                    <div className="flex items-center gap-4">
                      <Package className="text-orange-600" />
                      <span className="font-bold text-gray-700">Moderation Queue</span>
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-orange-600 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users': return <UserManagement />;
      case 'products': return <ProductApproval />;
      case 'transactions': return <TransactionLog />;
      case 'reports': return <ReportGenerator />;
      case 'categories': return <SellerCategories />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPage;