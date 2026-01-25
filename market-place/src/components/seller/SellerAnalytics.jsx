import React, { useState, useEffect } from "react";
import orderService from "../../services/orderService";
import LoadingSpinner from "../common/LoadingSpinner";

const SellerAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await orderService.getSellerStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching seller analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Shop Analytics</h1>
        <p className="text-gray-600 mt-2">Real-time performance of your products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Revenue</div>
          <div className="text-3xl font-black text-gray-900">${stats?.totalRevenue || 0}</div>
          <div className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1">
            <span>↑</span> 12.5% vs last month
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Orders Received</div>
          <div className="text-3xl font-black text-gray-900">{stats?.totalOrders || 0}</div>
          <div className="text-sm text-blue-600 font-bold mt-2 flex items-center gap-1">
            <span>●</span> Life-time total
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Items Sold</div>
          <div className="text-3xl font-black text-gray-900">{stats?.itemsSold || 0}</div>
          <div className="text-sm text-purple-600 font-bold mt-2 flex items-center gap-1">
            <span>✔</span> Product volume
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Active Listings</div>
          <div className="text-3xl font-black text-gray-900">{stats?.activeProducts || 0}</div>
          <div className="text-sm text-orange-600 font-bold mt-2 flex items-center gap-1">
            <span>★</span> In your shop
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-50 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
          <h3 className="text-xl font-black text-gray-800">Sales Breakdown</h3>
          <p className="text-sm text-gray-500">How your products are distributing revenue</p>
        </div>
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">This section will visualize your sales trends as your shop grows with more orders.</p>
          <button className="mt-8 px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Export JSON Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
