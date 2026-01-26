// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  // Local state for editable user data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notifications: {
      email: false,
      push: false,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
    },
  });

  // Sync user from context into local state
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        notifications: user.notifications || {
          email: false,
          push: false,
          sms: false,
        },
        privacy: user.privacy || {
          profileVisibility: 'public',
          showEmail: false,
          showPhone: false,
        },
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      alert('Profile updated successfully!');
    } else {
      alert(result.message || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 text-center">
            <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto">
              {user?.name?.charAt(0) || '👤'}
            </div>
            <h3 className="font-bold text-gray-800 mt-2">{user?.name || 'Guest'}</h3>
            <p className="text-gray-600 text-sm">{user?.email}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {['profile','security','notifications','privacy','payment','preferences'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-6 py-4 hover:bg-gray-50 ${
                  activeSection === section ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 space-y-6">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder="Full Name"
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  placeholder="Phone Number"
                  className="w-full p-3 border rounded-lg"
                />
                <textarea
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  placeholder="Address"
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                ></textarea>
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Security Settings</h2>
              <p className="text-gray-600 mb-4">Manage your account security settings and authentication methods.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Password: <strong>********</strong></li>
                <li>Two-Factor Authentication: <strong>Enabled</strong></li>
                <li>Login Alerts: <strong>On</strong></li>
              </ul>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Notification Preferences</h2>
              {['email','push','sms'].map(type => (
                <label key={type} className="flex items-center space-x-4 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.notifications[type]}
                    onChange={e => handleNestedChange('notifications', type, e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="capitalize">{type} notifications</span>
                </label>
              ))}
              <button onClick={handleSubmit} className="px-6 py-3 bg-blue-600 text-white rounded-lg mt-4">
                Save Notification Settings
              </button>
            </div>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Privacy Settings</h2>
              <label className="block mb-3">
                Profile Visibility:
                <select
                  value={formData.privacy.profileVisibility}
                  onChange={e => handleNestedChange('privacy', 'profileVisibility', e.target.value)}
                  className="w-full p-3 border rounded-lg mt-1"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </label>
              <label className="flex items-center space-x-4 mb-2">
                <input
                  type="checkbox"
                  checked={formData.privacy.showEmail}
                  onChange={e => handleNestedChange('privacy', 'showEmail', e.target.checked)}
                  className="h-4 w-4"
                />
                <span>Show Email</span>
              </label>
              <label className="flex items-center space-x-4 mb-2">
                <input
                  type="checkbox"
                  checked={formData.privacy.showPhone}
                  onChange={e => handleNestedChange('privacy', 'showPhone', e.target.checked)}
                  className="h-4 w-4"
                />
                <span>Show Phone Number</span>
              </label>
              <button onClick={handleSubmit} className="px-6 py-3 bg-blue-600 text-white rounded-lg mt-4">
                Save Privacy Settings
              </button>
            </div>
          )}

          {/* Other Sections */}
          {['payment','preferences'].includes(activeSection) && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800">{activeSection}</h2>
              <p className="text-gray-600 mt-2">This section is under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
