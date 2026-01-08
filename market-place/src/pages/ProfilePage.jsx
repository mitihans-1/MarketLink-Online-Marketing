import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';
import { Button, Input, Alert, Badge, Avatar } from '../components/ui';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  User, Mail, Phone, MapPin, Edit2, Save, X, 
  Lock, Bell, Shield, Package, Heart, Settings,
  CreditCard, LogOut, Calendar, CheckCircle, Eye, EyeOff,
  Star, TrendingUp, ShoppingCart, Award, Download,
  ShieldCheck, MessageSquare, HelpCircle,
  Camera, Trash2, Globe, Bell as BellIcon, UserCheck
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { orderHistory = [], wishlist = [] } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [showPassword, setShowPassword] = useState(false);

  // Mock data for demonstration
  const mockOrders = orderHistory.length > 0 ? orderHistory : [
    { id: 'ORD-001', date: new Date(), status: 'delivered', total: 149.99, items: 3 },
    { id: 'ORD-002', date: new Date(Date.now() - 86400000), status: 'shipped', total: 89.5, items: 2 },
    { id: 'ORD-003', date: new Date(Date.now() - 172800000), status: 'processing', total: 299.99, items: 5 },
  ];

  const mockWishlist = wishlist.length > 0 ? wishlist : [
    { id: 1, name: 'Wireless Headphones', price: 199.99, image: '🎧' },
    { id: 2, name: 'Smart Watch', price: 299.99, image: '⌚' },
    { id: 3, name: 'Laptop Stand', price: 49.99, image: '💻' },
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || 'John Doe',
        email: user.email || 'john@example.com',
        phone: user.phone || '+1 (555) 123-4567',
        address: user.address || '123 Main St, New York, NY 10001',
        bio: user.bio || 'Digital enthusiast and tech lover. Always looking for the next innovation.',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(formData);
      setMessage({ 
        type: 'success', 
        text: '✅ Profile updated successfully!' 
      });
      setTimeout(() => {
        setIsEditing(false);
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch {
      setMessage({ 
        type: 'error', 
        text: '❌ Failed to update profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={18} />, color: 'blue' },
    { id: 'orders', label: 'Orders', icon: <Package size={18} />, color: 'green' },
    { id: 'security', label: 'Security', icon: <Shield size={18} />, color: 'red' },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} />, color: 'purple' },
  ];

  // Stats data
  const stats = [
    { label: 'Total Orders', value: mockOrders.length, change: '+12%', icon: <ShoppingCart size={24} />, color: 'blue' },
    { label: 'Total Spent', value: '$1,249.99', change: '+8%', icon: <CreditCard size={24} />, color: 'green' },
    { label: 'Wishlist Items', value: mockWishlist.length, change: '+5', icon: <Heart size={24} />, color: 'pink' },
    { label: 'Member Since', value: '2023', icon: <Calendar size={24} />, color: 'purple' },
  ];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Account
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your profile, orders, and preferences
            </p>
          </div>
          
          <Button
            variant="danger"
            onClick={handleLogout}
            className="flex items-center gap-2 hover:scale-105 transition-transform shadow-md hover:shadow-lg"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp size={16} className="text-green-500" />
                      <span className="text-sm text-green-600">{stat.change}</span>
                      <span className="text-sm text-gray-500">from last month</span>
                    </div>
                  )}
                </div>
                <div className={`p-4 rounded-full bg-${stat.color}-100`}>
                  <div className={`text-${stat.color}-500`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Tabs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card with Tabs */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-3 px-6 py-4 font-medium whitespace-nowrap transition-all duration-300
                        ${activeTab === tab.id 
                          ? `bg-${tab.color}-50 text-${tab.color}-600 border-b-2 border-${tab.color}-500` 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      {tab.icon}
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="ml-2 w-2 h-2 rounded-full bg-current animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-fade-in">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="relative group">
                        <Avatar 
                          size="2xl"
                          src={user?.avatar}
                          name={formData.name}
                          className="border-4 border-white shadow-2xl"
                        />
                        <button className="absolute bottom-2 right-2 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all hover:scale-110 shadow-lg">
                          <Camera size={20} />
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
                          <Badge variant="success" className="flex items-center gap-2">
                            <UserCheck size={14} /> Verified
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{formData.email}</p>
                        <p className="text-gray-700 max-w-2xl">{formData.bio}</p>
                      </div>
                      
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "outline" : "primary"}
                        className="flex items-center gap-2"
                      >
                        {isEditing ? (
                          <>
                            <X size={18} /> Cancel
                          </>
                        ) : (
                          <>
                            <Edit2 size={18} /> Edit Profile
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Message Alert */}
                    {message.text && (
                      <Alert 
                        type={message.type} 
                        message={message.text}
                        className="animate-slide-down"
                      />
                    )}

                    {/* Edit Form / View Details */}
                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-6 mt-8 animate-slide-down">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <Input
                              label="Full Name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              icon={<User size={18} />}
                              className="hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                            <Input
                              label="Email Address"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              disabled
                              icon={<Mail size={18} />}
                            />
                          </div>
                          <div className="space-y-4">
                            <Input
                              label="Phone Number"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              icon={<Phone size={18} />}
                              className="hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                            />
                            <div className="relative">
                              <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                icon={<Lock size={18} />}
                                className="hover:border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <Input
                              label="Address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              multiline
                              rows={3}
                              icon={<MapPin size={18} />}
                              className="hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Input
                              label="Bio"
                              name="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                              multiline
                              rows={2}
                              icon={<MessageSquare size={18} />}
                              className="hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                            />
                          </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                          <Button 
                            type="submit" 
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            disabled={loading}
                          >
                            {loading ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              <>
                                <Save size={18} className="mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="flex-1"
                          >
                            <X size={18} className="mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
                          <User size={20} /> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            { label: 'Full Name', value: formData.name, icon: <User className="text-blue-500" /> },
                            { label: 'Email Address', value: formData.email, icon: <Mail className="text-green-500" /> },
                            { label: 'Phone Number', value: formData.phone, icon: <Phone className="text-purple-500" /> },
                            { label: 'Member Since', value: 'Jan 2023', icon: <Calendar className="text-orange-500" /> },
                            { label: 'Account Status', value: 'Active', icon: <CheckCircle className="text-green-500" /> },
                            { label: 'Last Login', value: 'Today, 10:30 AM', icon: <ShieldCheck className="text-blue-500" /> },
                          ].map((item) => (
                            <div 
                              key={item.label}
                              className="group p-4 bg-gray-50 rounded-xl hover:bg-white transition-all duration-300 hover:shadow-md cursor-pointer animate-fade-in"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-white shadow-sm group-hover:shadow transition-shadow">
                                  {item.icon}
                                </div>
                                <span className="text-sm text-gray-500">{item.label}</span>
                              </div>
                              <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Address Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <MapPin size={20} /> Primary Address
                        </h3>
                        <Button variant="ghost" size="sm">
                          <Edit2 size={16} />
                        </Button>
                      </div>
                      <p className="text-gray-700">{formData.address}</p>
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900">Order History</h3>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download size={16} /> Export
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <div 
                          key={order.id}
                          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Package size={20} className="text-blue-500" />
                                <span className="font-semibold text-gray-900">{order.id}</span>
                                <Badge 
                                  variant={getStatusBadgeVariant(order.status)}
                                  className="capitalize"
                                >
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {new Date(order.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                              <p className="text-sm text-gray-600">{order.items} items</p>
                            </div>
                          </div>
                          <div className="flex gap-4 mt-6">
                            <Button variant="outline" size="sm" className="flex-1">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Track Order
                            </Button>
                            <Button size="sm" className="flex-1">
                              Buy Again
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          id: 1,
                          title: 'Change Password',
                          description: 'Update your password regularly',
                          icon: <Lock className="text-blue-500" size={24} />,
                          action: 'Change',
                          color: 'blue'
                        },
                        {
                          id: 2,
                          title: 'Two-Factor Authentication',
                          description: 'Add an extra layer of security',
                          icon: <ShieldCheck className="text-green-500" size={24} />,
                          action: 'Enable',
                          color: 'green'
                        },
                        {
                          id: 3,
                          title: 'Login Activity',
                          description: 'View recent login attempts',
                          icon: <UserCheck className="text-purple-500" size={24} />,
                          action: 'View',
                          color: 'purple'
                        },
                        {
                          id: 4,
                          title: 'Connected Devices',
                          description: 'Manage logged-in devices',
                          icon: <Globe className="text-orange-500" size={24} />,
                          action: 'Manage',
                          color: 'orange'
                        },
                      ].map((item) => (
                        <div 
                          key={item.id}
                          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className={`p-3 rounded-lg bg-${item.color}-50 inline-block mb-4`}>
                                {item.icon}
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              {item.action}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Account Settings</h3>
                    
                    <div className="space-y-4">
                      {[
                        { id: 1, label: 'Email Notifications', value: true, icon: <BellIcon size={18} /> },
                        { id: 2, label: 'SMS Notifications', value: false, icon: <MessageSquare size={18} /> },
                        { id: 3, label: 'Marketing Emails', value: true, icon: <Mail size={18} /> },
                        { id: 4, label: 'Security Alerts', value: true, icon: <Shield size={18} /> },
                      ].map((setting) => (
                        <div 
                          key={setting.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white">
                              {setting.icon}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{setting.label}</p>
                              <p className="text-sm text-gray-500">
                                {setting.value ? 'Enabled' : 'Disabled'}
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={setting.value}
                              readOnly
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Danger Zone</h4>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          variant="outline" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 size={18} className="mr-2" />
                          Delete Account
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-amber-600 border-amber-200 hover:bg-amber-50"
                        >
                          <Download size={18} className="mr-2" />
                          Export Data
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Wishlist Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Heart size={20} className="text-pink-500" />
                  Wishlist
                </h3>
                <Badge variant="pink">{mockWishlist.length} items</Badge>
              </div>
              
              <div className="space-y-4">
                {mockWishlist.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-2xl">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ShoppingCart size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-6">
                View All Wishlist
              </Button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
              
              <div className="space-y-4">
                {[
                  { id: 1, action: 'Order placed', detail: 'ORD-004', time: '2 hours ago', icon: <ShoppingCart size={16} />, color: 'green' },
                  { id: 2, action: 'Profile updated', detail: 'Changed email', time: '1 day ago', icon: <User size={16} />, color: 'blue' },
                  { id: 3, action: 'Password changed', detail: 'Security update', time: '2 days ago', icon: <Lock size={16} />, color: 'purple' },
                  { id: 4, action: 'Review added', detail: '4 stars', time: '3 days ago', icon: <Star size={16} />, color: 'amber' },
                ].map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-full bg-${activity.color}-100`}>
                      <div className={`text-${activity.color}-500`}>
                        {activity.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-6">Account Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Orders Completed</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Spent</span>
                  <span className="font-bold">$1,249.99</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average Rating</span>
                  <span className="font-bold flex items-center gap-1">
                    4.8 <Star size={16} fill="currentColor" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Support Tickets</span>
                  <span className="font-bold">2</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <Award size={20} />
                  <span className="text-sm">Gold Member • Level 3</span>
                </div>
                <div className="mt-3 w-full bg-white/20 rounded-full h-2">
                  <div className="bg-yellow-300 h-2 rounded-full w-3/4"></div>
                </div>
                <p className="text-xs mt-2 text-white/90">75% to Platinum Level</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                  <CreditCard size={20} className="mb-2 text-blue-500" />
                  <span className="text-sm">Payment</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                  <Shield size={20} className="mb-2 text-green-500" />
                  <span className="text-sm">Security</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                  <Bell size={20} className="mb-2 text-purple-500" />
                  <span className="text-sm">Alerts</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                  <HelpCircle size={20} className="mb-2 text-orange-500" />
                  <span className="text-sm">Help</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
