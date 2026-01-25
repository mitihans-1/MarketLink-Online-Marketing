import React, { useState, useEffect } from "react";
import { ShoppingBag, Download, Plus, Search, Filter, MoreVertical, CheckCircle, Clock } from "lucide-react";
import ManualOrderModal from "./ManualOrderModal";
import { toast } from "react-hot-toast";
import orderService from "../../services/orderService";
import LoadingSpinner from "../common/LoadingSpinner";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getSellerOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch seller orders:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const exportToCSV = () => {
    if (orders.length === 0) return toast.error("No orders to export");

    const headers = ["Order ID", "Customer", "Items", "Amount", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...orders.map(o => `ORD-${o.id},${o.customerName},${o.products.length},${o.sellerTotal},${o.status},${new Date(o.created_at).toLocaleDateString()}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `seller_orders_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders exported to CSV");
  };

  const filteredOrders = orders.filter(o =>
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toString().includes(searchTerm)
  );

  if (loading) {
    return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;
  }

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-6 lg:p-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 font-medium">Track and manage your customer transactions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Total Orders</p>
          <p className="text-3xl font-black text-gray-900 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Pending</p>
          <p className="text-3xl font-black text-orange-600 mt-1">{orders.filter(o => o.status.toLowerCase() === 'pending').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Revenue</p>
          <p className="text-3xl font-black text-green-600 mt-1">${orders.reduce((acc, curr) => acc + Number(curr.sellerTotal), 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-bold text-sm">
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Items</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">#ORD-{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-gray-900">{order.customerName}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">{new Date(order.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {order.products.map((p, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden" title={p.name}>
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/30'} />
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900">${Number(order.sellerTotal).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${order.status.toLowerCase() === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'
                        }`}>
                        {order.status === 'Delivered' ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <ShoppingBag className="mx-auto mb-4 opacity-20" size={48} />
                    <p className="font-bold">No orders found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ManualOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderAdded={fetchOrders}
      />
    </div>
  );
};

export default SellerOrders;
