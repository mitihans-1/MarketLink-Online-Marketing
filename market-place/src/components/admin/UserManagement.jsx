import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import { toast } from 'react-hot-toast';
import { Search, Trash2, Shield, User as UserIcon, Loader2 } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Failed to load user database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await authService.updateUserRole(userId, newRole);
      toast.success(`User promoted to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user permissions');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('CRITICAL: Are you sure you want to PERMANENTLY delete this user?')) return;
    try {
      await authService.deleteUser(userId);
      toast.success('User account removed from platform');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user account');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-50 text-red-700 border-red-100';
      case 'seller': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'user': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-gray-50 bg-gray-50/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Active Accounts</h3>
            <p className="text-gray-500 font-medium">Control platform access and user privileges</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Find user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm transition-all shadow-sm"
              />
            </div>
            <select
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Every Role</option>
              <option value="admin">System Admin</option>
              <option value="seller">Verified Seller</option>
              <option value="user">Verified Buyer</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white border-b border-gray-50">
              <th className="text-left py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity</th>
              <th className="text-left py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Privileges</th>
              <th className="text-left py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Joined On</th>
              <th className="text-right py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Authority Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="py-6 px-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 relative shadow-inner overflow-hidden">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon size={20} />}
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <div className="font-black text-gray-900 leading-tight">{user.name}</div>
                      <div className="text-xs text-gray-400 font-bold tracking-tight">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-8 text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getRoleColor(user.role.toLowerCase())}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-6 px-8 text-center text-xs font-black text-gray-400">
                  {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="py-6 px-8">
                  <div className="flex items-center justify-end gap-3">
                    <select
                      className="text-[10px] font-black uppercase border border-gray-100 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="user">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-gray-300 hover:text-red-600 transition-all hover:bg-red-50 rounded-xl"
                      title="Terminate Account"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-20">
          <Shield className="mx-auto mb-4 opacity-10 text-gray-400" size={64} />
          <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No accounts found</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;