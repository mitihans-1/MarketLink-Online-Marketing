// src/pages/SellerRegisterPage.jsx
import React, { useEffect } from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const SellerRegisterPage = () => {
  useEffect(() => {
    console.log('SellerRegisterPage loaded successfully');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Become a Seller</h1>
              <p className="text-gray-600 mt-2">Join our marketplace and start selling today</p>
            </div>
            
            <RegisterForm initialUserType="seller" />
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegisterPage;