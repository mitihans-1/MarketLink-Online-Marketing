import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const OrderSummary = ({ items = [], shippingCost = 5.99, taxRate = 0.08, onPromoApply, onNotesChange }) => {
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [orderNotes, setOrderNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate totals
  const subtotal = items.reduce((total, item) => {
    const price = item.discountedPrice || item.price;
    return total + (price * item.quantity);
  }, 0);

  const tax = subtotal * taxRate;
  const discount = promoDiscount;
  const total = subtotal + shippingCost + tax - discount;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const handlePromoApply = () => {
    if (promoCode.trim() && !isPromoApplied) {
      // Simulate promo validation
      const validPromos = ['SAVE10', 'WELCOME20', 'FREESHIP'];
      const isDiscount = validPromos.includes(promoCode.toUpperCase());
      
      if (isDiscount) {
        let discountAmount = 0;
        switch(promoCode.toUpperCase()) {
          case 'SAVE10':
            discountAmount = subtotal * 0.1;
            break;
          case 'WELCOME20':
            discountAmount = subtotal * 0.2;
            break;
          case 'FREESHIP':
            discountAmount = shippingCost;
            break;
        }
        
        setPromoDiscount(discountAmount);
        setIsPromoApplied(true);
        if (onPromoApply) onPromoApply(promoCode, discountAmount);
        
        // Show success message
        const event = new CustomEvent('showToast', {
          detail: { 
            message: `Promo code applied! You saved $${discountAmount.toFixed(2)}`,
            type: 'success'
          }
        });
        globalThis.dispatchEvent(event);
      } else {
        // Show error message
        const event = new CustomEvent('showToast', {
          detail: { 
            message: 'Invalid promo code. Try SAVE10, WELCOME20, or FREESHIP',
            type: 'error'
          }
        });
        globalThis.dispatchEvent(event);
      }
    }
  };

  const handleRemovePromo = () => {
    setPromoDiscount(0);
    setIsPromoApplied(false);
    setPromoCode('');
    if (onPromoApply) onPromoApply('', 0);
  };

  const handleNotesChange = (e) => {
    const notes = e.target.value;
    setOrderNotes(notes);
    if (onNotesChange) onNotesChange(notes);
  };

  const promoButtons = [
    { code: 'SAVE10', label: 'SAVE10', discount: '10% OFF' },
    { code: 'WELCOME20', label: 'WELCOME20', discount: '20% OFF' },
    { code: 'FREESHIP', label: 'FREESHIP', discount: 'FREE Shipping' },
  ];

  // Calculate discounted price display
  const getDiscountedPrice = (item) => {
    const hasDiscount = item.discountedPrice;
    const originalPrice = item.price * item.quantity;
    const finalPrice = (item.discountedPrice || item.price) * item.quantity;
    
    return { hasDiscount, originalPrice, finalPrice };
  };

  // Get button class based on promo status
  const getApplyButtonClass = () => {
    if (isPromoApplied) {
      return 'bg-green-100 text-green-700 cursor-not-allowed';
    }
    
    if (promoCode.trim()) {
      return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800';
    }
    
    return 'bg-gray-100 text-gray-400 cursor-not-allowed';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      {/* Header with Toggle */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Order Summary</h3>
            <div className="flex items-center mt-1">
              <span className="text-gray-600 text-sm">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-blue-600 text-sm font-medium">
                ${total.toFixed(2)} total
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isExpanded ? 'Collapse order summary' : 'Expand order summary'}
          >
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Order Items with Animation */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 text-lg">Order Items</h4>
              <span className="text-sm text-gray-500">Total: ${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-gray-500">No items in cart</p>
                </div>
              ) : (
                items.map((item, index) => {
                  const priceInfo = getDiscountedPrice(item);
                  
                  return (
                    <div 
                      key={item.id} 
                      className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden group">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <h5 className="text-sm font-medium text-gray-900 truncate">{item.name}</h5>
                            {item.color && (
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-gray-500 mr-2">Color:</span>
                                <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.color }} />
                              </div>
                            )}
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500 mr-2">Qty:</span>
                              <span className="text-sm font-medium text-gray-700">{item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              {priceInfo.hasDiscount ? (
                                <>
                                  <span className="text-sm font-medium text-gray-500 line-through">
                                    ${priceInfo.originalPrice.toFixed(2)}
                                  </span>
                                  <span className="text-sm font-bold text-green-600">
                                    ${priceInfo.finalPrice.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm font-bold text-gray-900">
                                  ${priceInfo.finalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              ${((item.discountedPrice || item.price)).toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 text-lg mb-6">Price Details</h4>
            
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax ({Math.round(taxRate * 100)}%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              {isPromoApplied && (
                <div className="flex justify-between items-center animate-fadeIn">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">Discount</span>
                    <button
                      onClick={handleRemovePromo}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                      aria-label="Remove promo code"
                    >
                      Remove
                    </button>
                  </div>
                  <span className="font-medium text-green-600">-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</div>
                    <p className="text-sm text-gray-500 mt-0.5">Including ${tax.toFixed(2)} in taxes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Code Section */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 text-lg mb-4">Promo Code</h4>
            
            <div className="space-y-4">
              {/* Quick Promo Buttons */}
              <div className="flex flex-wrap gap-2">
                {promoButtons.map((promo) => (
                  <button
                    key={promo.code}
                    onClick={() => setPromoCode(promo.code)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95
                      ${promoCode === promo.code 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
                      }`}
                  >
                    <div className="font-medium">{promo.label}</div>
                    <div className="text-xs text-green-600">{promo.discount}</div>
                  </button>
                ))}
              </div>

              {/* Promo Input */}
              <div className="flex">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    disabled={isPromoApplied}
                    className={`w-full px-4 py-3 border rounded-l-xl focus:outline-none focus:ring-2 transition-all duration-200
                      ${isPromoApplied 
                        ? 'bg-green-50 border-green-400 text-green-700' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      }`}
                  />
                  {isPromoApplied && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  onClick={handlePromoApply}
                  disabled={!promoCode.trim() || isPromoApplied}
                  className={`px-6 font-medium rounded-r-xl transition-all duration-200 active:scale-95 ${getApplyButtonClass()}`}
                >
                  {isPromoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <h4 className="font-medium text-gray-900 text-lg">
                Order Notes
              </h4>
              <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
            </div>
            <div className="relative">
              <textarea
                rows="3"
                value={orderNotes}
                onChange={handleNotesChange}
                placeholder="Add special instructions for your order..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none transition-all duration-200 hover:border-gray-400"
                maxLength="500"
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {orderNotes.length}/500
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Add delivery instructions or gift messages</span>
            </div>
          </div>

          {/* Security & Policies */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Secure SSL encryption</p>
                  <p className="text-xs text-gray-500 mt-0.5">256-bit encryption keeps your data safe</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">30-day return policy</p>
                  <p className="text-xs text-gray-500 mt-0.5">Full refund if you're not satisfied</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span>
                    By completing your purchase, you agree to our{' '}
                  </span>
                  <Link 
                    to="/terms" 
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <span>
                    {' '}and{' '}
                  </span>
                  <Link 
                    to="/privacy" 
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  .
                </div>
                
                {/* Payment Methods */}
                <div className="flex items-center mt-4 space-x-4">
                  <div className="text-xs text-gray-500">Accepted Payments:</div>
                  <div className="flex space-x-2">
                    <svg className="w-8 h-5" viewBox="0 0 32 20">
                      <rect width="32" height="20" rx="4" fill="#1A1F71"/>
                      <path d="M12 6h8v8h-8z" fill="#FFF"/>
                    </svg>
                    <svg className="w-8 h-5" viewBox="0 0 32 20">
                      <rect width="32" height="20" rx="4" fill="#FF5F00"/>
                      <path d="M11 10a5 5 0 015-5h10v10H16a5 5 0 01-5-5z" fill="#EB001B"/>
                      <path d="M21 15a5 5 0 015-5v10a5 5 0 01-5-5z" fill="#F79E1B"/>
                    </svg>
                    <svg className="w-8 h-5" viewBox="0 0 32 20">
                      <rect width="32" height="20" rx="4" fill="#ED0006"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

OrderSummary.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      discountedPrice: PropTypes.number,
      quantity: PropTypes.number.isRequired,
      color: PropTypes.string,
    })
  ),
  shippingCost: PropTypes.number,
  taxRate: PropTypes.number,
  onPromoApply: PropTypes.func,
  onNotesChange: PropTypes.func,
};

OrderSummary.defaultProps = {
  items: [],
  shippingCost: 5.99,
  taxRate: 0.08,
  onPromoApply: () => {},
  onNotesChange: () => {},
};

export default OrderSummary;