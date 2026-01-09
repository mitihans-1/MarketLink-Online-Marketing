import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LogOut, Bell, User as UserIcon, Settings, ChevronDown } from 'lucide-react';

const UserPanel = ({ user = {}, onLogout, notifications = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Handle key events for notification items
  const handleNotificationKeyDown = (e, itemId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      console.log('Notification clicked:', itemId);
      setIsNotificationsOpen(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event) => {
      const isMenuClicked = menuRef.current?.contains(event.target);
      const isNotificationsClicked = notificationsRef.current?.contains(event.target);
      
      if (menuRef.current && !isMenuClicked) {
        setIsMenuOpen(false);
      }
      
      if (notificationsRef.current && !isNotificationsClicked) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  // Sample notifications data
  const notificationItems = [
    { id: 1, title: 'New message received', time: '5 min ago', read: false },
    { id: 2, title: 'Profile updated', time: '1 hour ago', read: false },
    { id: 3, title: 'Password changed', time: '2 days ago', read: true },
  ];

  const unreadCount = notifications || notificationItems.filter(item => !item.read).length;

  return (
    <div className="flex items-center space-x-4">
      {/* Notifications (Optional but common) */}
      <div className="relative" ref={notificationsRef}>
        <button
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell size={20} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {isNotificationsOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">
                {unreadCount} unread of {notificationItems.length}
              </p>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {notificationItems.length > 0 ? (
                notificationItems.map((item) => (
                  <button
                    key={item.id}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${!item.read ? 'bg-blue-50' : ''}`}
                    onClick={() => {
                      console.log('Notification clicked:', item.id);
                      setIsNotificationsOpen(false);
                    }}
                    onKeyDown={(e) => handleNotificationKeyDown(e, item.id)}
                    aria-label={`Notification: ${item.title} from ${item.time}`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      {!item.read && (
                        <span 
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          aria-label="Unread notification"
                        ></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <Bell size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No notifications</p>
                </div>
              )}
            </div>
            
            <div className="px-4 py-2 border-t border-gray-100">
              <button
                className="text-sm text-blue-600 hover:text-blue-800 w-full text-center"
                onClick={() => {
                  console.log('Mark all as read clicked');
                  setIsNotificationsOpen(false);
                }}
              >
                Mark all as read
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="User menu"
        >
          <div className="relative">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'user'}`}
              alt={user.name || 'User'}
              className="w-8 h-8 rounded-full border-2 border-white"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=3b82f6&color=fff`;
              }}
            />
            <span 
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
              aria-label="Online status"
            ></span>
          </div>
          
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user.role || 'User'}
            </p>
          </div>
          
          <ChevronDown 
            size={16} 
            className={`text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {/* Profile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-medium text-gray-900">{user.name || 'User'}</p>
              <p className="text-sm text-gray-500 truncate">{user.email || 'user@example.com'}</p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  console.log('Navigate to profile');
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition"
              >
                <UserIcon size={18} className="text-gray-500" />
                <span className="text-sm text-gray-700">My Profile</span>
              </button>

              <button
                onClick={() => {
                  console.log('Navigate to settings');
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition"
              >
                <Settings size={18} className="text-gray-500" />
                <span className="text-sm text-gray-700">Account Settings</span>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* Logout */}
            <div className="px-2 py-1">
              <button
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-md transition"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

UserPanel.propTypes = {
  user: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string
  }),
  onLogout: PropTypes.func.isRequired,
  notifications: PropTypes.number
};

UserPanel.defaultProps = {
  user: {},
  notifications: 0
};

export default UserPanel;