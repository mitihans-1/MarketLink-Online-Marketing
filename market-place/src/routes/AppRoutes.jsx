// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

// Import pages that exist
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import AdminPage from '../pages/AdminPage';
import SellerDashboardPage from '../pages/SellerDashboardPage';
import ProfilePage from '../pages/ProfilePage';
import OrdersPage from '../pages/OrdersPage';
import CategoriesPage from '../pages/CategoriesPage';
import CategoryPage from '../pages/CategoryPage';
import SettingsPage from '../pages/SettingsPage';
import WishlistPage from '../pages/WishlistPage';
import SearchPage from '../pages/SearchPage';
import NotFoundPage from '../pages/NotFoundPage';

// Import layouts
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminLayout from '../components/layout/AdminLayout';
import SellerLayout from '../components/layout/SellerLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Simple placeholder pages for missing routes
const HelpPage = () => <div className="p-8"><h1>Help</h1><p>Help page</p></div>;
const TermsPage = () => <div className="p-8"><h1>Terms</h1></div>;
const PrivacyPage = () => <div className="p-8"><h1>Privacy</h1></div>;
const SellerRegisterPage = () => <div className="p-8"><h1>Become a Seller</h1></div>;
const CheckoutPage = () => <div className="p-8"><h1>Checkout</h1></div>;

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/seller/register" element={<SellerRegisterPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* Protected Routes */}
      <Route path="/cart" element={
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/wishlist" element={
        <ProtectedRoute>
          <WishlistPage />
        </ProtectedRoute>
      } />

      <Route path="/checkout" element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      } />

      {/* Dashboard - Uses different layout */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Admin - Uses different layout */}
      <Route path="/admin/*" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Seller - Uses different layout */}
      <Route path="/seller/*" element={
        <ProtectedRoute requireSeller>
          <SellerLayout>
            <Routes>
              <Route path="/" element={<SellerDashboardPage />} />
              <Route path="*" element={<Navigate to="/seller" replace />} />
            </Routes>
          </SellerLayout>
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;