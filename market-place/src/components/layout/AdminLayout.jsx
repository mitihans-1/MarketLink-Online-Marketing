// src/components/layout/AdminLayout.jsx
import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* AdminLayout just wraps the AdminPage which has its own sidebar */}
      {children}
    </div>
  );
};

export default AdminLayout;