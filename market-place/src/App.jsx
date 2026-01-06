// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './context/AuthProvider.jsx';  // Import AuthProvider
import CartProvider from './context/CartProvider.jsx';   // Import CartProvider
import MainLayout from './components/layout/MainLayout.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;