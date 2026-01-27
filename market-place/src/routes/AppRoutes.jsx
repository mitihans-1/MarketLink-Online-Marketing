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
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
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
import VerifyEmailPage from '../pages/VerifyEmailPage';
import GoogleLoginPage from '../pages/GoogleLoginPage';
import FacebookLoginPage from '../pages/FacebookLoginPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import ReportsPage from '../pages/ReportsPage';
import SellerStorePage from '../pages/SellerStorePage';
import DealsPage from '../pages/DealsPage';

// Import Seller COMPONENTS (not pages)
import SellerProducts from '../components/seller/SellerProducts';
import SellerOrders from '../components/seller/SellerOrders';
import SellerAnalytics from '../components/seller/SellerAnalytics';
import SellerProfile from '../components/seller/SellerProfile';
import SellerCategories from '../components/seller/SellerCategories';
import SellerSettings from '../components/seller/SellerSettings';
import ShippingInfoPage from '../pages/ShippingInfoPage';
import ReturnsPage from '../pages/ReturnsPage';
import SecurityPage from '../pages/SecurityPage';
import SitemapPage from '../pages/SitemapPage';
import AccessibilityPage from '../pages/AccessibilityPage';
import CookiesPage from '../pages/CookiesPage';
import PaymentMethodsPage from '../pages/PaymentMethodsPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import PriceMatchPage from '../pages/PriceMatchPage';

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
        <Route path="/store/:sellerId" element={<SellerStorePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/google" element={<GoogleLoginPage />} />
        <Route path="/auth/facebook" element={<FacebookLoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* SELLER REGISTER MUST COME BEFORE SELLER WILDCARD */}
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
        <Route path="/payment-methods" element={<PaymentMethodsPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/price-match" element={<PriceMatchPage />} />

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
          <>
            <ScrollToTop />
            <Routes>
              {/* MAIN LAYOUT FOR ALL PUBLIC PAGES */}
              <Route element={<MainLayout />}>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/store/:sellerId" element={<SellerStorePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/google" element={<GoogleLoginPage />} />
                <Route path="/auth/facebook" element={<FacebookLoginPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                {/* SELLER REGISTER MUST COME BEFORE SELLER WILDCARD */}
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
                <Route path="/payment-methods" element={<PaymentMethodsPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/price-match" element={<PriceMatchPage />} />

                {/* Protected Routes - Still inside MainLayout */}
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                } />