import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const CheckoutPage = () => {
  // Cart state
  const [cartItems, setCartItems] = useState([
    { 
      id: 1, 
      name: 'Wireless Headphones', 
      price: 99.99, 
      quantity: 1, 
      color: 'Black',
      image: '/images/headphones.jpg'
    },
    { 
      id: 2, 
      name: 'Phone Case', 
      price: 24.99, 
      quantity: 2, 
      color: 'Blue',
      image: '/images/case.jpg'
    },
    { 
      id: 3, 
      name: 'USB-C Cable', 
      price: 14.99, 
      quantity: 1, 
      color: 'White',
      image: '/images/cable.jpg'
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    shippingMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
    termsAccepted: false,
  });

  // UI state
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Shipping methods
  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', price: 9.99, time: '5-7 business days', icon: '🚚' },
    { id: 'express', name: 'Express Shipping', price: 19.99, time: '2-3 business days', icon: '⚡' },
    { id: 'nextday', name: 'Next Day Delivery', price: 34.99, time: '1 business day', icon: '🚀' },
    { id: 'pickup', name: 'Store Pickup', price: 0, time: 'Ready in 1 hour', icon: '🏪' },
  ];

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedShipping = shippingMethods.find(m => m.id === formData.shippingMethod)?.price || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + selectedShipping + tax;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Cart item handlers
  const handleQuantityChange = (id, newQuantity) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Validation functions
  const validateShippingStep = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    
    return errors;
  };

  const validatePaymentStep = () => {
    const errors = {};
    
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) errors.cardNumber = 'Card number is required';
      if (!formData.cardName.trim()) errors.cardName = 'Name on card is required';
      if (!formData.expiryDate.trim()) errors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) errors.cvv = 'CVV is required';
    }
    if (!formData.termsAccepted) errors.termsAccepted = 'You must accept the terms';
    
    return errors;
  };

  const validateStep = () => {
    let errors = {};
    
    switch(activeStep) {
      case 1:
        errors = validateShippingStep();
        break;
      case 3:
        errors = validatePaymentStep();
        break;
      default:
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      setActiveStep(prev => Math.min(prev + 1, 4));
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  // Format card number
  const formatCardNumber = (value) => {
    const cleaned = value.replaceAll(/\D/g, '');
    const match = cleaned.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
    if (match) {
      return match[1] + (match[2] ? ' ' + match[2] : '') + (match[3] ? ' ' + match[3] : '') + (match[4] ? ' ' + match[4] : '');
    }
    return cleaned;
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const cleaned = value.replaceAll(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Order submitted:', { formData, cartItems, total });
    alert('Order placed successfully! Thank you for your purchase!');
    setIsSubmitting(false);
  };

  // Steps configuration
  const steps = [
    { number: 1, title: 'Information', description: 'Shipping details' },
    { number: 2, title: 'Shipping', description: 'Delivery method' },
    { number: 3, title: 'Payment', description: 'Payment details' },
    { number: 4, title: 'Review', description: 'Order review' },
  ];

  // Helper functions for step rendering
  const renderStepIndicator = () => (
    <div className="mb-8 md:mb-12">
      <div className="flex items-center justify-between max-w-3xl mx-auto relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
        
        {steps.map((step) => (
          <div key={step.number} className="relative z-10 flex flex-col items-center">
            <button
              onClick={() => setActiveStep(step.number)}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform hover:scale-110
                ${step.number <= activeStep 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                  : 'bg-white border-gray-300 text-gray-400 hover:border-blue-400'
                }`}
            >
              {step.number < activeStep ? (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="font-semibold">{step.number}</span>
              )}
            </button>
            <span className={`mt-2 text-sm font-medium ${step.number <= activeStep ? 'text-blue-600' : 'text-gray-500'}`}>
              {step.title}
            </span>
            <span className="mt-1 text-xs text-gray-400">{step.description}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Render different steps
  const renderStepContent = () => {
    switch(activeStep) {
      case 1:
        return renderShippingInfo();
      case 2:
        return renderShippingMethod();
      case 3:
        return renderPaymentDetails();
      case 4:
        return renderOrderReview();
      default:
        return renderShippingInfo();
    }
  };

  const renderShippingInfo = () => (
    <div className="p-6 md:p-8 animate-slideIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
        <span className="text-sm text-gray-500">All fields marked with * are required</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="John"
          />
          {formErrors.firstName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Doe"
          />
          {formErrors.lastName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          placeholder="john@example.com"
        />
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          placeholder="(123) 456-7890"
        />
        {formErrors.phone && (
          <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          placeholder="123 Main St"
        />
        {formErrors.address && (
          <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="New York"
          />
          {formErrors.city && (
            <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="NY"
          />
          {formErrors.state && (
            <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.zipCode ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="10001"
          />
          {formErrors.zipCode && (
            <p className="mt-1 text-sm text-red-600">{formErrors.zipCode}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderShippingMethod = () => (
    <div className="p-6 md:p-8 animate-slideIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Method</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shippingMethods.map((method) => (
          <label
            key={method.id}
            className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md
              ${formData.shippingMethod === method.id 
                ? 'border-blue-500 bg-blue-50 shadow-sm' 
                : 'border-gray-200 hover:border-blue-300'
              }`}
          >
            <input
              type="radio"
              name="shippingMethod"
              value={method.id}
              checked={formData.shippingMethod === method.id}
              onChange={handleInputChange}
              className="h-5 w-5 mt-0.5 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{method.icon}</span>
                  <span className="font-medium text-gray-900">{method.name}</span>
                </div>
                <span className={`font-bold text-lg ${method.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {method.time}
              </div>
            </div>
            {formData.shippingMethod === method.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="p-6 md:p-8 animate-slideIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
      
      {/* Payment Method Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['card', 'paypal', 'bank'].map((method) => (
            <label
              key={method}
              className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                ${formData.paymentMethod === method 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={formData.paymentMethod === method}
                onChange={handleInputChange}
                className="sr-only"
              />
              <span className="font-medium text-gray-700">
                {method === 'card' && '💳 Credit/Debit Card'}
                {method === 'paypal' && '🔵 PayPal'}
                {method === 'bank' && '🏦 Bank Transfer'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Card Details */}
      {formData.paymentMethod === 'card' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Card Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                setFormData(prev => ({ ...prev, cardNumber: formatted }));
              }}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
            {formErrors.cardNumber && (
              <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name on Card <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.cardName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="JOHN DOE"
              />
              {formErrors.cardName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.cardName}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={(e) => {
                    const formatted = formatExpiryDate(e.target.value);
                    setFormData(prev => ({ ...prev, expiryDate: formatted }));
                  }}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.expiryDate ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {formErrors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  CVV <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${formErrors.cvv ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="123"
                  maxLength="4"
                />
                {formErrors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>
                )}
              </div>
            </div>
          </div>

          <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              name="saveCard"
              checked={formData.saveCard}
              onChange={handleInputChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <div className="ml-3">
              <span className="text-sm font-medium text-gray-700">Save card for future purchases</span>
              <p className="text-xs text-gray-500 mt-0.5">Securely stored with 256-bit encryption</p>
            </div>
          </label>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="mt-8">
        <label className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${formErrors.termsAccepted ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}`}>
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            className="h-5 w-5 mt-0.5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className="ml-3">
            <span className="text-sm font-medium text-gray-700">
              I agree to the Terms & Conditions and Privacy Policy
            </span>
            <p className="text-xs text-gray-500 mt-0.5">
              By placing your order, you agree to our terms of service and privacy policy
            </p>
            {formErrors.termsAccepted && (
              <p className="mt-1 text-sm text-red-600">{formErrors.termsAccepted}</p>
            )}
          </div>
        </label>
      </div>

      {/* Secure Payment Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mt-6">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-gray-900">Secure SSL encryption</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">🔒 Secure checkout. Your information is safe with us.</p>
          </div>
          <div className="flex space-x-1">
            <div className="w-8 h-5 bg-blue-600 rounded-sm"></div>
            <div className="w-8 h-5 bg-red-500 rounded-sm"></div>
            <div className="w-8 h-5 bg-yellow-400 rounded-sm"></div>
            <div className="w-8 h-5 bg-green-500 rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrderReview = () => (
    <div className="p-6 md:p-8 animate-slideIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Review</h2>
      
      {/* Order Summary using CartItem components */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
        
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleQuantityChange}
              onRemove={removeItem}
              showControls={true}
            />
          ))}
        </div>
      </div>

      {/* Shipping Information Review */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Information</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700">{formData.firstName} {formData.lastName}</p>
          <p className="text-gray-700">{formData.address}</p>
          <p className="text-gray-700">{formData.city}, {formData.state} {formData.zipCode}</p>
          <p className="text-gray-700">{formData.email} | {formData.phone}</p>
          <p className="text-gray-700 mt-2">
            <span className="font-medium">Shipping Method: </span>
            {shippingMethods.find(m => m.id === formData.shippingMethod)?.name}
          </p>
        </div>
      </div>

      {/* Payment Information Review */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Information</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700">
            <span className="font-medium">Payment Method: </span>
            {formData.paymentMethod === 'card' && 'Credit/Debit Card'}
            {formData.paymentMethod === 'paypal' && 'PayPal'}
            {formData.paymentMethod === 'bank' && 'Bank Transfer'}
          </p>
          {formData.paymentMethod === 'card' && (
            <p className="text-gray-700">
              <span className="font-medium">Card: </span>
              •••• {formData.cardNumber.slice(-4)} | {formData.cardName}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Helper functions for button text
  const getNextStepButtonText = () => {
    if (activeStep === 1) return 'Continue to Shipping';
    if (activeStep === 2) return 'Continue to Payment';
    if (activeStep === 3) return 'Continue to Review';
    return 'Continue';
  };

  const getNextStepButtonIcon = () => (
    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Processing...';
    return 'Place Order';
  };

  const getSubmitButtonIcon = () => {
    if (isSubmitting) return null;
    return (
      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  };

  const getSubmitButtonClasses = () => {
    const baseClasses = 'w-full px-6 py-3 rounded-xl font-medium active:scale-95 transition-all duration-200 shadow-lg flex items-center justify-center';
    
    if (isSubmitting) {
      return `${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed`;
    }
    
    return `${baseClasses} bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800 hover:shadow-xl`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase in just a few steps</p>
        </div>

        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {renderStepContent()}
            </div>
          </div>

          {/* Right Column - Cart Summary & Navigation */}
          <div className="space-y-6">
            {/* Cart Summary */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-6">
              <CartSummary
                items={cartItems}
                subtotal={subtotal}
                shipping={selectedShipping}
                tax={tax}
                total={total}
              />

              {/* Navigation Buttons */}
              <div className="mt-8 space-y-4">
                {activeStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="w-full px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 active:scale-95 transition-all duration-200 flex items-center justify-center"
                    type="button"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                )}

                {activeStep < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                    type="button"
                  >
                    {getNextStepButtonText()}
                    {getNextStepButtonIcon()}
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={getSubmitButtonClasses()}
                    type="button"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {getSubmitButtonText()}
                      </>
                    ) : (
                      <>
                        {getSubmitButtonText()}
                        {getSubmitButtonIcon()}
                      </>
                    )}
                  </button>
                )}

                {activeStep === 1 && (
                  <Link
                    to="/cart"
                    className="block text-center text-blue-600 hover:text-blue-800 font-medium mt-4"
                  >
                    ← Return to Cart
                  </Link>
                )}
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Secure Checkout</h3>
                  <p className="text-sm text-gray-600">
                    Your payment information is encrypted and secure. We never store your CVV or full card details.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">SSL</div>
                    <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">PCI DSS</div>
                    <div className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">256-bit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;