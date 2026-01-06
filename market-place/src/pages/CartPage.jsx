import React, { useState } from 'react';
import CartItem from '../components/cart/CartItem';
import CartSidebar from '../components/cart/CartSidebar';
import CartSummary from '../components/cart/CartSummary';

// Mock cart data - replace with your actual state management
const mockCartItems = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 129.99,
    quantity: 2,
    image: 'https://via.placeholder.com/100x100',
    inStock: true,
    maxQuantity: 10
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    price: 299.99,
    quantity: 1,
    image: 'https://via.placeholder.com/100x100',
    inStock: true,
    maxQuantity: 5
  },
  {
    id: 3,
    name: 'USB-C Laptop Charger',
    price: 39.99,
    quantity: 3,
    image: 'https://via.placeholder.com/100x100',
    inStock: false,
    maxQuantity: 20
  }
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleSaveForLater = (id) => {
    console.log('Saving item for later:', id);
    // Implement save for later functionality
  };

  const handleMoveToCart = (id) => {
    console.log('Moving item to cart:', id);
    // Implement move to cart functionality
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout');
    // Navigate to checkout page
  };

  const handleContinueShopping = () => {
    console.log('Continuing shopping');
    // Navigate back to products
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Cart Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleSidebar}
                    className="lg:hidden flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <span className="mr-2">Cart Summary</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <span className="text-gray-600">{totalItems} items</span>
                </div>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Add some items to your cart to get started!</p>
                  <button
                    onClick={handleContinueShopping}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                        onSaveForLater={handleSaveForLater}
                      />
                    ))}
                  </div>

                  {/* Cart Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <button
                        onClick={handleContinueShopping}
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        ← Continue Shopping
                      </button>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to clear your cart?')) {
                              setCartItems([]);
                            }
                          }}
                          className="px-6 py-3 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Clear Cart
                        </button>
                        <button
                          onClick={() => {
                            // Save cart functionality
                            console.log('Cart saved');
                          }}
                          className="px-6 py-3 border border-blue-300 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Save Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Recently Viewed / Recommendations Section */}
            {cartItems.length > 0 && (
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently bought together</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Add recommendation items here */}
                </div>
              </div>
            )}
          </div>

          {/* Cart Summary Sidebar */}
          <div className={`lg:w-1/3 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-8">
              <CartSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                totalItems={totalItems}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>

        {/* Cart Sidebar (Saved Items, etc.) */}
        <div className="mt-8">
          <CartSidebar
            savedItems={[]} // Pass saved items here
            onMoveToCart={handleMoveToCart}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  );
};

export default CartPage;