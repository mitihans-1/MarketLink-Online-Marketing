// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

// Import layouts
import MainLayout from '../components/layout/MainLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminLayout from '../components/layout/AdminLayout';
import SellerLayout from '../components/layout/SellerLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Import ALL your existing pages
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
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import FAQPage from '../pages/FAQPage';
import HelpPage from '../pages/HelpPage';
import PrivacyPage from '../pages/PrivacyPage';
import TermsPage from '../pages/TermsPage';
import SellerRegisterPage from '../pages/SellerRegisterPage';
import CheckoutPage from '../pages/CheckoutPage';

// Import Seller pages (you need to create these)
import SellerProductsPage from '../pages/seller/SellerProductsPage';
import SellerOrdersPage from '../pages/seller/SellerOrdersPage';
import SellerAnalyticsPage from '../pages/seller/SellerAnalyticsPage';
import SellerProfilePage from '../pages/seller/SellerProfilePage';

// Create simple placeholder pages for any missing routes
const ShippingInfoPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">Shipping Information</h1>
    <p>Shipping details page</p>
  </div>
);

const ReturnsPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">Returns & Refunds</h1>
    <p>Returns policy page</p>
  </div>
);

const SecurityPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">Security</h1>
    <p>Security information page</p>
  </div>
);

const SitemapPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">Sitemap</h1>
    <p>Sitemap page</p>
  </div>
);

const AccessibilityPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">Accessibility</h1>
    <p>Accessibility statement</p>
  </div>
);

const CookiesPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
    <p>Cookie policy page</p>
  </div>
);

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
      {/* MAIN LAYOUT FOR ALL PUBLIC PAGES */}
      <Route element={<MainLayout />}>
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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/shipping-info" element={<ShippingInfoPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        
        {/* Protected Routes - Still inside MainLayout */}
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
        
        {/* 404 inside MainLayout */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* DASHBOARD - Uses different layout (no MainLayout) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* ADMIN - Uses different layout */}
      <Route path="/admin/*" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<AdminPage />} />
              <Route path="/users" element={<AdminPage />} />
              <Route path="/products" element={<AdminPage />} />
              <Route path="/transactions" element={<AdminPage />} />
              <Route path="/reports" element={<AdminPage />} />
              <Route path="/settings" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* SELLER - Uses different layout */}
      <Route path="/seller/*" element={
        <ProtectedRoute requireSeller>
          <SellerLayout>
            <Routes>
              <Route path="/" element={<SellerDashboardPage />} />
              <Route path="/dashboard" element={<SellerDashboardPage />} />
              <Route path="/products" element={<SellerProductsPage />} />
              <Route path="/orders" element={<SellerOrdersPage />} />
              <Route path="/analytics" element={<SellerAnalyticsPage />} />
              <Route path="/profile" element={<SellerProfilePage />} />
              <Route path="*" element={<Navigate to="/seller" replace />} />
            </Routes>
          </SellerLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;