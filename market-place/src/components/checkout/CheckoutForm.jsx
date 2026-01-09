import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Extracted InputField component with proper prop validation
const InputField = React.memo(({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  icon, 
  maxLength, 
  required = false,
  value,
  error,
  onChange,
  ...props 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400
          ${icon ? 'pl-10' : ''}
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
          ${type === 'checkbox' ? 'w-5 h-5' : ''}`}
        required={required}
        {...props}
      />
    </div>
    {error && (
      <p className="mt-1.5 text-sm text-red-600 animate-fadeIn">{error}</p>
    )}
  </div>
));

// Prop types for InputField component
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.node,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  value: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

// Helper function for string formatting
const formatString = {
  removeSpaces: (str) => str.replaceAll(/\s+/g, ''),
  formatCardNumber: (str) => {
    const cleaned = str.replaceAll(/\s+/g, '');
    return cleaned.replaceAll(/(\d{4})/g, '$1 ').trim();
  },
  formatExpiryDate: (str) => {
    const cleaned = str.replaceAll(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  },
  cleanPhoneNumber: (str) => str.replaceAll(/\D/g, ''),
};

const CheckoutForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    
    // Billing
    sameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    
    // Payment
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
    
    // Shipping method
    shippingMethod: 'standard',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, time: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 12.99, time: '2-3 business days' },
    { id: 'nextday', name: 'Next Day', price: 24.99, time: '1 business day' },
    { id: 'pickup', name: 'Store Pickup', price: 0, time: 'Ready in 1 hour' },
  ];

  // Handle input changes with formatting
  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    // Apply formatting based on field type
    if (field === 'cardNumber') {
      formattedValue = formatString.formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatString.formatExpiryDate(value);
    } else if (field === 'phone') {
      formattedValue = formatString.cleanPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Split validation into smaller functions to reduce cognitive complexity
  const validateShippingStep = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP Code is required';
    
    return errors;
  };

  const validateBillingStep = () => {
    const errors = {};
    
    if (!formData.sameAsShipping) {
      if (!formData.billingFirstName.trim()) errors.billingFirstName = 'First name is required';
      if (!formData.billingLastName.trim()) errors.billingLastName = 'Last name is required';
      if (!formData.billingAddress.trim()) errors.billingAddress = 'Address is required';
      if (!formData.billingCity.trim()) errors.billingCity = 'City is required';
      if (!formData.billingState.trim()) errors.billingState = 'State is required';
      if (!formData.billingZipCode.trim()) errors.billingZipCode = 'ZIP Code is required';
    }
    
    return errors;
  };

  const validatePaymentStep = () => {
    const errors = {};
    const cleanedCardNumber = formatString.removeSpaces(formData.cardNumber);
    
    if (!cleanedCardNumber) {
      errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(cleanedCardNumber)) {
      errors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.cardName.trim()) {
      errors.cardName = 'Name on card is required';
    }
    
    if (!formData.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      errors.expiryDate = 'Invalid format (MM/YY)';
    }
    
    if (!formData.cvv) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      errors.cvv = 'CVV must be 3-4 digits';
    }
    
    return errors;
  };

  const validateStep = () => {
    let errors = {};
    
    switch(step) {
      case 1:
        errors = validateShippingStep();
        break;
      case 2:
        errors = validateBillingStep();
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (['cardNumber', 'expiryDate', 'phone'].includes(name)) {
      handleInputChange(name, value);
    } else {
      const newValue = type === 'checkbox' ? checked : value;
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
    }

    // If same as shipping is checked, copy shipping to billing
    if (name === 'sameAsShipping' && checked) {
      setFormData(prev => ({
        ...prev,
        billingFirstName: prev.firstName,
        billingLastName: prev.lastName,
        billingAddress: prev.address,
        billingCity: prev.city,
        billingState: prev.state,
        billingZipCode: prev.zipCode,
      }));
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Order submitted:', formData);
    alert('Order placed successfully!');
    setIsSubmitting(false);
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-slideIn">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Shipping Information</h3>
        <div className="text-sm text-gray-500">All fields marked with * are required</div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <InputField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          placeholder="John"
          error={formErrors.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          placeholder="Doe"
          error={formErrors.lastName}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="john@example.com"
          error={formErrors.email}
          icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>}
        />
        <InputField
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="(123) 456-7890"
          error={formErrors.phone}
          icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>}
        />
      </div>

      <InputField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
        placeholder="123 Main St"
        error={formErrors.address}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <InputField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          placeholder="New York"
          error={formErrors.city}
        />
        <InputField
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
          placeholder="NY"
          error={formErrors.state}
        />
        <InputField
          label="ZIP Code"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          required
          placeholder="10001"
          error={formErrors.zipCode}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-slideIn">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Method</h3>
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
                onChange={handleChange}
                className="h-5 w-5 mt-0.5 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-4 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-medium text-gray-900">{method.name}</span>
                  <span className={`font-bold text-lg mt-1 sm:mt-0
                    ${method.price === 0 ? 'text-green-600' : 'text-gray-900'}`}
                  >
                    {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
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

      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Billing Address</h3>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                id="sameAsShipping"
                name="sameAsShipping"
                checked={formData.sameAsShipping}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors duration-200
                ${formData.sameAsShipping ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200
                  ${formData.sameAsShipping ? 'left-5' : 'left-1'}`}
                />
              </div>
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              Same as shipping address
            </span>
          </label>
        </div>

        {!formData.sameAsShipping && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <InputField
                label="First Name"
                name="billingFirstName"
                value={formData.billingFirstName}
                onChange={handleChange}
                required={!formData.sameAsShipping}
                placeholder="John"
                error={formErrors.billingFirstName}
              />
              <InputField
                label="Last Name"
                name="billingLastName"
                value={formData.billingLastName}
                onChange={handleChange}
                required={!formData.sameAsShipping}
                placeholder="Doe"
                error={formErrors.billingLastName}
              />
            </div>

            <InputField
              label="Address"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              required={!formData.sameAsShipping}
              placeholder="123 Main St"
              error={formErrors.billingAddress}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <InputField
                label="City"
                name="billingCity"
                value={formData.billingCity}
                onChange={handleChange}
                required={!formData.sameAsShipping}
                placeholder="New York"
                error={formErrors.billingCity}
              />
              <InputField
                label="State"
                name="billingState"
                value={formData.billingState}
                onChange={handleChange}
                required={!formData.sameAsShipping}
                placeholder="NY"
                error={formErrors.billingState}
              />
              <InputField
                label="ZIP Code"
                name="billingZipCode"
                value={formData.billingZipCode}
                onChange={handleChange}
                required={!formData.sameAsShipping}
                placeholder="10001"
                error={formErrors.billingZipCode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-slideIn">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h3>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8">
          <div className="flex items-center">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">Secure Payment</h4>
              <p className="text-sm text-gray-600">
                Your payment information is encrypted and secure. We never store your CVV.
              </p>
            </div>
            <div className="flex space-x-2">
              <div className="w-10 h-6 bg-blue-600 rounded-sm"></div>
              <div className="w-10 h-6 bg-red-500 rounded-sm"></div>
              <div className="w-10 h-6 bg-yellow-400 rounded-sm"></div>
              <div className="w-10 h-6 bg-green-500 rounded-sm"></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <InputField
                label="Card Number"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                error={formErrors.cardNumber}
                icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>}
              />
              
              <InputField
                label="Name on Card"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                required
                placeholder="JOHN A DOE"
                error={formErrors.cardName}
              />
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Expiry Date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                  error={formErrors.expiryDate}
                />
                <InputField
                  label="CVV"
                  name="cvv"
                  type="password"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  placeholder="123"
                  maxLength={4}
                  error={formErrors.cvv}
                  icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>}
                />
              </div>
              
              <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  id="saveCard"
                  name="saveCard"
                  checked={formData.saveCard}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">Save card for future purchases</span>
                  <p className="text-xs text-gray-500 mt-0.5">Securely stored with 256-bit encryption</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Or pay with</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['PayPal', 'Google Pay', 'Apple Pay', 'Amazon Pay'].map((method) => (
            <button
              key={method}
              type="button"
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 active:scale-95"
            >
              <div className="w-8 h-8 mb-2">
                {method === 'PayPal' && (
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path fill="#FFC439" d="M6.622 16.724c-.14-.453.264-.698.585-.775 1.58-.38 2.67-.52 4.296-.616 1.6-.094 2.756.012 4.18.284.348.067.726.28.595.745-.135.478-.73.837-1.217.925-1.523.28-3.025.35-4.558.294-1.497-.055-2.903-.185-4.404-.48a1.268 1.268 0 01-1.077-.377z"/>
                    <path fill="#293688" d="M9.286 4.196c.77-.21 1.593-.277 2.37-.29 1.5-.024 3.01.18 4.445.57.76.206 1.49.514 2.14.93.64.408 1.18.948 1.56 1.62.34.6.5 1.29.48 1.98-.02.86-.25 1.7-.68 2.44-.38.66-.91 1.22-1.55 1.65-.63.42-1.35.71-2.1.86-1.5.3-3.05.32-4.56.1-1.2-.18-2.37-.53-3.45-1.05-.29-.14-.57-.3-.83-.48-.1-.07-.2-.14-.3-.22a.8.8 0 01-.27-.32c-.08-.17-.02-.37.14-.46.16-.09.36-.03.46.13.23.31.51.58.82.81 1.12.81 2.43 1.32 3.8 1.5 1.63.22 3.29.15 4.9-.2 1.38-.3 2.67-.94 3.7-1.87 1.03-.93 1.77-2.15 2.1-3.5.18-.74.19-1.51.06-2.26-.13-.75-.44-1.46-.9-2.06-.46-.6-1.06-1.08-1.75-1.4-.7-.32-1.47-.46-2.24-.5-1.5-.06-3.01.17-4.42.66-.82.28-1.6.67-2.32 1.15-.23.15-.45.32-.66.50-.1.08-.2.17-.3.26a.47.47 0 01-.32.12c-.18 0-.33-.15-.33-.33 0-.09.03-.18.1-.25.23-.22.47-.42.73-.6.9-.63 1.9-1.1 2.96-1.39z"/>
                  </svg>
                )}
                {method === 'Google Pay' && (
                  <svg fill="#000000" viewBox="0 0 24 24" className="w-full h-full">
                    <path d="M7 9H2V7h5v2zm0 3H2v2h5v-2zm13.59 7l-3.83-3.83c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L22 17.59 20.59 19zM17 11c0-1.65-1.35-3-3-3s-3 1.35-3 3 1.35 3 3 3 3-1.35 3-3zM2 19h10v-2H2v2z"/>
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium">{method}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Helper function to get step button text (replaces nested ternary)
  const getButtonText = () => {
    if (step < 3) return 'Continue to Next Step';
    if (isSubmitting) return 'Processing...';
    return 'Place Order';
  };

  // Helper function to get button icon (replaces nested ternary)
  const getButtonIcon = () => {
    if (step < 3) {
      return (
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      );
    }
    if (!isSubmitting) {
      return (
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return null;
  };

  // Helper function to get button classes (replaces nested ternary)
  const getButtonClasses = () => {
    const baseClasses = 'px-8 py-3 rounded-xl font-medium active:scale-95 transition-all duration-200 shadow-lg flex items-center justify-center';
    
    if (isSubmitting) {
      return `${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed`;
    }
    
    if (step < 3) {
      return `${baseClasses} bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl`;
    }
    
    return `${baseClasses} bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800 hover:shadow-xl`;
  };

  const renderStepIndicator = () => (
    <div className="mb-8 md:mb-12">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((stepNum) => (
          <React.Fragment key={stepNum}>
            <button
              type="button"
              onClick={() => stepNum < step && setStep(stepNum)}
              className={`flex flex-col items-center group ${stepNum < step ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center transition-all duration-300
                ${step === stepNum 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg scale-110' 
                  : step > stepNum 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md group-hover:scale-105'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {step > stepNum ? (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm md:text-base font-semibold">{stepNum}</span>
                )}
              </div>
              <span className={`mt-2 text-xs md:text-sm font-medium transition-colors
                ${step >= stepNum ? 'text-gray-900' : 'text-gray-500'}`}
              >
                {stepNum === 1 && 'Shipping'}
                {stepNum === 2 && 'Billing'}
                {stepNum === 3 && 'Payment'}
              </span>
              <span className="mt-1 text-xs text-gray-400 text-center">
                {stepNum === 1 && 'Add your address'}
                {stepNum === 2 && 'Select shipping & billing'}
                {stepNum === 3 && 'Secure payment'}
              </span>
            </button>
            {stepNum < 3 && (
              <div className={`flex-1 h-1 mx-2 md:mx-4 transition-all duration-300
                ${step > stepNum ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-200'}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6 md:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase in just 3 simple steps</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8">
            {renderStepIndicator()}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-8 md:mb-12">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </div>

              <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
                <div>
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 active:scale-95 transition-all duration-200 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                  ) : (
                    <Link
                      to="/cart"
                      className="inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 active:scale-95 transition-all duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Return to Cart
                    </Link>
                  )}
                </div>

                <div>
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                    >
                      {getButtonText()}
                      {getButtonIcon()}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={getButtonClasses()}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          {getButtonText()}
                          {getButtonIcon()}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-gray-400">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">256-bit SSL Security</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">PCI DSS Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;