// src/pages/HelpPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HelpPage = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ Categories
  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀', count: 8 },
    { id: 'account', name: 'Account & Profile', icon: '👤', count: 12 },
    { id: 'products', name: 'Products & Listings', icon: '📦', count: 15 },
    { id: 'orders', name: 'Orders & Shipping', icon: '📋', count: 10 },
    { id: 'payments', name: 'Payments & Refunds', icon: '💰', count: 7 },
    { id: 'seller', name: 'Seller Help', icon: '🏪', count: 9 },
    { id: 'buyer', name: 'Buyer Help', icon: '🛒', count: 11 },
    { id: 'technical', name: 'Technical Issues', icon: '🔧', count: 6 },
  ];

  // FAQ Items by Category
  const faqs = {
    'getting-started': [
      { id: 1, question: 'How do I create an account?', answer: 'Click the "Sign Up" button in the top right corner, fill in your details, and verify your email address.' },
      { id: 2, question: 'Is registration free?', answer: 'Yes, creating an account on our marketplace is completely free for both buyers and sellers.' },
      { id: 3, question: 'How do I start selling?', answer: 'After creating an account, go to your dashboard and click "Start Selling". Follow the steps to set up your seller profile.' },
      { id: 4, question: 'What are the seller fees?', answer: 'We charge a 5% commission on each successful sale. There are no listing fees or monthly charges.' },
    ],
    'account': [
      { id: 1, question: 'How do I reset my password?', answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.' },
      { id: 2, question: 'Can I change my email address?', answer: 'Yes, go to Settings → Account → Email Address to update your email. You will need to verify the new email.' },
      { id: 3, question: 'How do I delete my account?', answer: 'Go to Settings → Account → Delete Account. Note: This action is irreversible and will remove all your data.' },
    ],
    'products': [
      { id: 1, question: 'How do I list a product?', answer: 'Go to your seller dashboard, click "Add Product", fill in the product details, upload images, and set your price.' },
      { id: 2, question: 'What are the product guidelines?', answer: 'Products must be legal, accurately described, and meet our community standards. Prohibited items include counterfeit goods and illegal substances.' },
    ],
  };

  // Popular articles
  const popularArticles = [
    { title: 'How to track my order', category: 'orders', reads: '1.2k' },
    { title: 'Setting up payment methods', category: 'payments', reads: '890' },
    { title: 'Return policy explained', category: 'buyer', reads: '2.1k' },
    { title: 'Seller verification process', category: 'seller', reads: '750' },
    { title: 'Troubleshooting login issues', category: 'technical', reads: '1.5k' },
  ];

  // Contact methods
  const contactMethods = [
    { type: 'Email', details: 'support@marketplace.com', response: 'Within 24 hours', icon: '✉️' },
    { type: 'Live Chat', details: 'Available 9AM-6PM EST', response: 'Instant', icon: '💬' },
    { type: 'Phone', details: '+1 (800) 123-4567', response: 'Within 30 min', icon: '📞' },
    { type: 'Community Forum', details: 'Ask other users', response: 'Varies', icon: '👥' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
      // In real app, you would implement search functionality here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              How can we help you today?
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Find answers to common questions or get in touch with our support team
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for answers..."
                  className="w-full px-6 py-4 rounded-lg text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} articles</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {categories.find(c => c.id === activeCategory)?.name} FAQs
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {faqs[activeCategory]?.map((faq) => (
                  <div key={faq.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        Read more
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500">Was this helpful?</span>
                      <button className="text-sm text-gray-500 hover:text-blue-600">👍 Yes</button>
                      <button className="text-sm text-gray-500 hover:text-red-600">👎 No</button>
                    </div>
                  </div>
                )) || (
                  <div className="p-12 text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No FAQs available for this category
                    </h3>
                    <p className="text-gray-600">
                      Check back soon or browse other categories
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Popular Articles */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Popular Help Articles
              </h2>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">{article.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">{article.reads} reads</span>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Read →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact & Resources Sidebar */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Contact Support
              </h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">{method.type}</h4>
                        <p className="text-gray-600 text-sm mt-1">{method.details}</p>
                        <p className="text-green-600 text-xs mt-1">
                          Response: {method.response}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Contact Support Now
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Quick Resources
              </h3>
              <div className="space-y-3">
                <Link to="/faq" className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow transition-all">
                  <span className="font-medium text-gray-800">FAQ Center</span>
                  <span>→</span>
                </Link>
                <Link to="/terms" className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow transition-all">
                  <span className="font-medium text-gray-800">Terms of Service</span>
                  <span>→</span>
                </Link>
                <Link to="/privacy" className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow transition-all">
                  <span className="font-medium text-gray-800">Privacy Policy</span>
                  <span>→</span>
                </Link>
                <Link to="/seller/register" className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow transition-all">
                  <span className="font-medium text-gray-800">Become a Seller</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Help Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-800">Support System Status</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Website</span>
                  <span className="text-green-600 font-medium">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payments</span>
                  <span className="text-green-600 font-medium">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API</span>
                  <span className="text-yellow-600 font-medium">Minor Issues</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email Support</span>
                  <span className="text-green-600 font-medium">Operational</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        </div>

        {/* Still Need Help Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Still need help?
            </h2>
            <p className="text-blue-100 mb-6">
              Our support team is here to help you with any questions or issues you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
              <button className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                Schedule a Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;