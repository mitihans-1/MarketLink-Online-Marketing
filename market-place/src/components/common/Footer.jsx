// src/components/common/Footer.jsx
import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  ShoppingBag,
  Shield,
  Truck,
  CreditCard 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Updated footer links based on your existing pages
  const footerLinks = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      { name: 'Categories', path: '/categories' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Help', path: '/help' },
    ],
    'Support': [
      { name: 'Help Center', path: '/help' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Shipping', path: '/shipping-info' }, // Will need to create or use help
      { name: 'Returns', path: '/returns' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
    'Account': [
      { name: 'My Profile', path: '/profile' },
      { name: 'My Orders', path: '/orders' },
      { name: 'Wishlist', path: '/wishlist' },
      { name: 'Settings', path: '/settings' },
      { name: 'Seller Dashboard', path: '/seller' },
      { name: 'Admin Panel', path: '/admin' },
    ],
    'Features': [
      { name: 'Secure Payments', path: '/security', icon: <Shield size={16} /> },
      { name: 'Fast Delivery', path: '/shipping', icon: <Truck size={16} /> },
      { name: 'Easy Returns', path: '/returns', icon: <ShoppingBag size={16} /> },
      { name: 'Price Match', path: '/price-match', icon: <CreditCard size={16} /> },
    ]
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter size={20} />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram size={20} />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <Linkedin size={20} />, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Top Features Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {footerLinks['Features'].map((feature) => (
              <Link 
                key={feature.name} 
                to={feature.path}
                className="flex items-center space-x-3 hover:scale-105 transition-transform"
              >
                <div className="text-white/80">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium">{feature.name}</h4>
                  <p className="text-sm text-white/70">Learn more</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-gray-900 font-bold text-2xl">MP</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">MarketPlace</h2>
                <p className="text-gray-400">Your Trusted Online Marketplace</p>
              </div>
            </Link>
            
            <p className="text-gray-400 mb-6 max-w-md">
              Discover amazing products from verified sellers. Fast delivery, 
              secure payments, and excellent customer support. Join millions 
              of satisfied customers worldwide.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">123 Market Street, City, Country 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400 flex-shrink-0" size={18} />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400 flex-shrink-0" size={18} />
                <span className="text-gray-400">support@marketplace.com</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks)
            .filter(([category]) => category !== 'Features')
            .map(([category, links]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {category}
                  </span>
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400">Subscribe to our newsletter for the latest deals and updates</p>
            </div>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
            
            <p className="text-gray-500 text-sm text-center mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} MarketPlace. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Designed with ❤️ for the community
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition">
                Cookie Policy
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white text-sm transition">
                Sitemap
              </Link>
              <Link to="/accessibility" className="text-gray-400 hover:text-white text-sm transition">
                Accessibility
              </Link>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 text-sm">Secure payment by:</span>
                <div className="flex space-x-1">
                  <div className="w-8 h-5 bg-gray-700 rounded"></div>
                  <div className="w-8 h-5 bg-gray-700 rounded"></div>
                  <div className="w-8 h-5 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;