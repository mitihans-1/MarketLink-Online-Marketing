// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
       
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This renders the page content */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;