import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Extracted InputField component with proper prop validation
const InputField = React.memo(({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  maxLength, 
  required = false,
  value,
  error,
  onChange,
  ...props 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400
        ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
      required={required}
      {...props}
    />
    {error && (
      <p className="mt-2 text-sm text-red-600 animate-fadeIn">{error}</p>
    )}
  </div>
));

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  value: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

// Helper functions
const formatString = {
  removeSpaces: (str) => str?.replaceAll(/\s+/g, '') || '',
  cleanNonDigits: (str) => str?.replaceAll(/\D/g, '') || '',
  formatCardNumber: (str) => {
    const cleaned = formatString.removeSpaces(str);
    return cleaned.replaceAll(/(\d{4})/g, '$1 ').trim();
  },
  formatExpiryDate: (str) => {
    const cleaned = formatString.cleanNonDigits(str);
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  },
};

// Card detection helper
const detectCardType = (cardNumber) => {
  const cleaned = formatString.removeSpaces(cardNumber);
  if (cleaned.startsWith('4')) return 'visa';
  if (cleaned.startsWith('5') && cleaned[1] >= '1' && cleaned[1] <= '5') return 'mastercard';
  if (cleaned.startsWith('34') || cleaned.startsWith('37')) return 'amex';
  return 'unknown';
};

// Component
const PaymentMethod = ({ onPaymentMethodChange, onCardDetailsChange }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [savedCards, setSavedCards] = useState([
    { id: 1, type: 'visa', last4: '4242', name: 'John Smith', expiry: '12/24', default: true },
    { id: 2, type: 'mastercard', last4: '8888', name: 'John Smith', expiry: '08/25', default: false },
    { id: 3, type: 'amex', last4: '1234', name: 'John Smith', expiry: '05/26', default: false },
  ]);

  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    saveCard: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [selectedCard, setSelectedCard] = useState(1);
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);
  const [nextCardId, setNextCardId] = useState(4); // Track next ID for new cards

  const paymentMethods = [
    { 
      id: 'card', 
      name: 'Credit/Debit Card', 
      icon: '💳',
      description: 'Pay with Visa, Mastercard, or American Express'
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      icon: '💰',
      description: 'Pay securely with your PayPal account'
    },
    { 
      id: 'applepay', 
      name: 'Apple Pay', 
      icon: '',
      description: 'Pay with Face ID or Touch ID'
    },
    { 
      id: 'googlepay', 
      name: 'Google Pay', 
      icon: 'G',
      description: 'Pay with your Google account'
    },
    { 
      id: 'bank', 
      name: 'Bank Transfer', 
      icon: '🏦',
      description: 'Direct bank transfer'
    },
  ];

  useEffect(() => {
    if (onPaymentMethodChange) {
      onPaymentMethodChange(selectedMethod);
    }
  }, [selectedMethod, onPaymentMethodChange]);

  useEffect(() => {
    if (onCardDetailsChange) {
      onCardDetailsChange(cardDetails);
    }
  }, [cardDetails, onCardDetailsChange]);

  const handleCardInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    let processedValue = newValue;
    
    // Apply formatting
    if (name === 'number') {
      processedValue = formatString.formatCardNumber(value);
    } else if (name === 'expiry') {
      processedValue = formatString.formatExpiryDate(value);
    } else if (name === 'cvv' && value.length > 4) {
      processedValue = value.slice(0, 4);
    }
    
    setCardDetails(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDeleteCard = (cardId) => {
    if (globalThis.confirm?.('Are you sure you want to remove this card?')) {
      const updatedCards = savedCards.filter(card => card.id !== cardId);
      setSavedCards(updatedCards);
      
      if (selectedCard === cardId && updatedCards.length > 0) {
        setSelectedCard(updatedCards[0].id);
      }
      
      const event = new CustomEvent('showToast', {
        detail: { 
          message: 'Card removed successfully',
          type: 'success'
        }
      });
      globalThis.dispatchEvent?.(event);
    }
  };

  const handleSetDefaultCard = (cardId) => {
    setSavedCards(savedCards.map(card => ({
      ...card,
      default: card.id === cardId
    })));
    
    const event = new CustomEvent('showToast', {
      detail: { 
        message: 'Default card updated',
        type: 'success'
      }
    });
    globalThis.dispatchEvent?.(event);
  };

  const validateCardForm = () => {
    const errors = {};
    const cleanedCardNumber = formatString.removeSpaces(cardDetails.number);
    
    if (!cleanedCardNumber) {
      errors.number = 'Card number is required';
    } else if (!/^\d{16}$/.test(cleanedCardNumber)) {
      errors.number = 'Card number must be 16 digits';
    }
    
    if (!cardDetails.expiry) {
      errors.expiry = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
      errors.expiry = 'Invalid format (MM/YY)';
    }
    
    if (!cardDetails.cvv) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      errors.cvv = 'CVV must be 3-4 digits';
    }
    
    if (!cardDetails.name.trim()) {
      errors.name = 'Name on card is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCard = () => {
    if (!validateCardForm()) {
      return;
    }

    const newCard = {
      id: nextCardId,
      type: detectCardType(cardDetails.number),
      last4: cardDetails.number.slice(-4),
      name: cardDetails.name,
      expiry: cardDetails.expiry,
      default: savedCards.length === 0
    };
    
    setSavedCards(prev => [...prev, newCard]);
    setNextCardId(prev => prev + 1);
    setSelectedCard(newCard.id);
    setIsAddingNewCard(false);
    
    // Reset form
    setCardDetails({
      number: '',
      expiry: '',
      cvv: '',
      name: '',
      saveCard: false,
    });
    
    const event = new CustomEvent('showToast', {
      detail: { 
        message: 'Card added successfully',
        type: 'success'
      }
    });
    globalThis.dispatchEvent?.(event);
  };

  const getCardIcon = (type) => {
    switch(type) {
      case 'visa': return 'VISA';
      case 'mastercard': return 'MC';
      case 'amex': return 'AMEX';
      default: return 'CC';
    }
  };

  const getCardColor = (type) => {
    switch(type) {
      case 'visa': return 'bg-gradient-to-br from-blue-600 to-blue-800';
      case 'mastercard': return 'bg-gradient-to-br from-red-500 to-red-700';
      case 'amex': return 'bg-gradient-to-br from-green-500 to-green-700';
      default: return 'bg-gradient-to-br from-gray-600 to-gray-800';
    }
  };

  const getCardLogo = (type) => {
    if (type === 'visa') return 'Visa';
    if (type === 'mastercard') return 'Mastercard';
    if (type === 'amex') return 'American Express';
    return 'Credit Card';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      <div className="p-8 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900">Payment Method</h3>
        <p className="text-gray-600 mt-2">Choose your preferred payment method</p>
      </div>

      {/* Payment Method Selection */}
      <div className="p-8 border-b border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02] active:scale-95 group
                ${selectedMethod === method.id 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              aria-label={`Select ${method.name}`}
              type="button"
            >
              <div className={`text-3xl mb-3 transition-transform duration-300 group-hover:scale-110
                ${selectedMethod === method.id ? 'scale-110' : ''}`}
              >
                {method.icon}
              </div>
              <span className="text-sm font-semibold text-gray-900 mb-1">{method.name}</span>
              <span className="text-xs text-gray-500 text-center">{method.description}</span>
              
              {selectedMethod === method.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Cards */}
      {selectedMethod === 'card' && savedCards.length > 0 && (
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-gray-900">Saved Cards</h4>
            <button
              onClick={() => setIsAddingNewCard(true)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
              type="button"
            >
              <svg className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Card
            </button>
          </div>
          
          <div className="space-y-4">
            {savedCards.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card.id)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md
                  ${selectedCard === card.id 
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50' 
                    : 'border-gray-200 hover:border-blue-300'
                  }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCard(card.id);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-10 w-14 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow ${getCardColor(card.type)}`}>
                      {getCardIcon(card.type)}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{getCardLogo(card.type)}</span>
                        {card.default && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-mono">•••• {card.last4}</span>
                        <span className="mx-2">•</span>
                        <span>Expires {card.expiry}</span>
                        <span className="mx-2">•</span>
                        <span>{card.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {!card.default && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefaultCard(card.id);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Set as default card"
                        type="button"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(card.id);
                      }}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove card"
                      type="button"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Card Form */}
      {selectedMethod === 'card' && isAddingNewCard && (
        <div className="p-8 border-b border-gray-200 animate-slideIn">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-gray-900">Add New Card</h4>
            <button
              onClick={() => setIsAddingNewCard(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close new card form"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <InputField
                  label="Card Number"
                  name="number"
                  value={cardDetails.number}
                  onChange={handleCardInputChange}
                  required
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  error={formErrors.number}
                />
                
                <InputField
                  label="Name on Card"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleCardInputChange}
                  required
                  placeholder="JOHN A. DOE"
                  error={formErrors.name}
                />
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Expiry Date"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleCardInputChange}
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    error={formErrors.expiry}
                  />
                  <InputField
                    label="CVV"
                    name="cvv"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    required
                    placeholder="123"
                    maxLength={4}
                    error={formErrors.cvv}
                  />
                </div>
                
                <div className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    id="saveCard"
                    name="saveCard"
                    checked={cardDetails.saveCard}
                    onChange={handleCardInputChange}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="saveCard" className="ml-3 flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900">Save card for future purchases</div>
                    <p className="text-sm text-gray-500 mt-0.5">Securely stored with 256-bit encryption</p>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsAddingNewCard(false)}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 active:scale-95 transition-all duration-200"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCard}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                type="button"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Details */}
      {selectedMethod === 'card' && !isAddingNewCard && savedCards.length === 0 && (
        <div className="p-8 text-center">
          <div className="inline-block p-6 bg-blue-50 rounded-full mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-2">No Saved Cards</h4>
          <p className="text-gray-600 mb-6">Add a card to complete your purchase</p>
          <button
            onClick={() => setIsAddingNewCard(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200"
            type="button"
          >
            Add New Card
          </button>
        </div>
      )}

      {/* PayPal */}
      {selectedMethod === 'paypal' && (
        <div className="p-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block p-6 bg-blue-50 rounded-full mb-4">
                <svg className="w-16 h-16" viewBox="0 0 24 24">
                  <path fill="#003087" d="M12.422 3.395c-.774-.116-1.54-.22-2.297-.22-4.5 0-8.125 3.625-8.125 8.125s3.625 8.125 8.125 8.125c.757 0 1.523-.104 2.297-.22 2.485-.37 4.922-1.502 6.578-3.547 1.656-2.045 2.344-4.724 1.875-7.422-.469-2.698-2.188-5.03-4.688-6.242-2.5-1.21-5.43-1.008-7.93.2z"/>
                  <path fill="#009CDE" d="M12.422 3.395c-.774-.116-1.54-.22-2.297-.22-4.5 0-8.125 3.625-8.125 8.125s3.625 8.125 8.125 8.125c.757 0 1.523-.104 2.297-.22 2.485-.37 4.922-1.502 6.578-3.547 1.656-2.045 2.344-4.724 1.875-7.422-.469-2.698-2.188-5.03-4.688-6.242-2.5-1.21-5.43-1.008-7.93.2z" opacity=".5"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Pay with PayPal</h4>
              <p className="text-gray-600">
                You'll be redirected to PayPal to complete your payment securely. Your PayPal account will be charged immediately.
              </p>
            </div>
            
            <button 
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              type="button"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path fill="#003087" d="M12.422 3.395c-.774-.116-1.54-.22-2.297-.22-4.5 0-8.125 3.625-8.125 8.125s3.625 8.125 8.125 8.125c.757 0 1.523-.104 2.297-.22 2.485-.37 4.922-1.502 6.578-3.547 1.656-2.045 2.344-4.724 1.875-7.422-.469-2.698-2.188-5.03-4.688-6.242-2.5-1.21-5.43-1.008-7.93.2z"/>
                <path fill="#009CDE" d="M12.422 3.395c-.774-.116-1.54-.22-2.297-.22-4.5 0-8.125 3.625-8.125 8.125s3.625 8.125 8.125 8.125c.757 0 1.523-.104 2.297-.22 2.485-.37 4.922-1.502 6.578-3.547 1.656-2.045 2.344-4.724 1.875-7.422-.469-2.698-2.188-5.03-4.688-6.242-2.5-1.21-5.43-1.008-7.93.2z" opacity=".5"/>
              </svg>
              Continue with PayPal
            </button>
          </div>
        </div>
      )}

      {/* Apple Pay */}
      {selectedMethod === 'applepay' && (
        <div className="p-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block p-6 bg-black rounded-full mb-4">
                <span className="text-4xl font-bold text-white"></span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Pay with Apple Pay</h4>
              <p className="text-gray-600">
                Pay securely with Apple Pay using your iPhone, iPad, or Mac. Your payment information is never shared with merchants.
              </p>
            </div>
            
            <button 
              className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-900 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              type="button"
            >
              <span className="text-2xl mr-3"></span>Continue with Apple Pay
              
            </button>
          </div>
        </div>
      )}

      {/* Google Pay */}
      {selectedMethod === 'googlepay' && (
        <div className="p-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block p-6 bg-white border-2 border-gray-300 rounded-full mb-4">
                <svg className="w-16 h-16" viewBox="0 0 24 24">
                  <path d="M7 9H2V7h5v2zm0 3H2v2h5v-2zm13.59 7l-3.83-3.83c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L22 17.59 20.59 19zM17 11c0-1.65-1.35-3-3-3s-3 1.35-3 3 1.35 3 3 3 3-1.35 3-3zM2 19h10v-2H2v2z" fill="#5F6368"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Pay with Google Pay</h4>
              <p className="text-gray-600">
                Pay securely with Google Pay using your saved payment methods. Your payment information is protected by Google.
              </p>
            </div>
            
            <button 
              className="w-full py-4 bg-white border-2 border-gray-300 text-gray-900 rounded-xl font-bold hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              type="button"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path d="M7 9H2V7h5v2zm0 3H2v2h5v-2zm13.59 7l-3.83-3.83c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L22 17.59 20.59 19zM17 11c0-1.65-1.35-3-3-3s-3 1.35-3 3 1.35 3 3 3 3-1.35 3-3zM2 19h10v-2H2v2z" fill="#5F6368"/>
              </svg>
              Continue with Google Pay
            </button>
          </div>
        </div>
      )}

      {/* Bank Transfer */}
      {selectedMethod === 'bank' && (
        <div className="p-8">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-6">
              <h4 className="font-bold text-blue-900 text-lg mb-3">Bank Transfer Instructions</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <span className="text-blue-800">Use your order ID as payment reference</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <span className="text-blue-800">Payment must be received within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <span className="text-blue-800">Order will be processed after payment confirmation</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-500 mb-2">Bank Name</label>
                <div className="font-semibold text-gray-900">Global Commerce Bank</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-500 mb-2">Account Name</label>
                <div className="font-semibold text-gray-900">MarketLink Payments Inc.</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-500 mb-2">Account Number</label>
                <div className="font-mono font-bold text-gray-900 text-lg">1234 5678 9012</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-500 mb-2">Routing Number</label>
                <div className="font-mono font-bold text-gray-900 text-lg">0210 0002 1</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-500 mb-2">SWIFT/BIC Code</label>
              <div className="font-mono font-bold text-gray-900 text-lg">GLOBUS33XXX</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-500 mb-2">Reference / Note</label>
              <div className="font-mono font-bold text-blue-600 text-lg">ORDER-2024-001234</div>
              <p className="text-sm text-gray-500 mt-2">Use this reference when making the transfer</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

PaymentMethod.propTypes = {
  onPaymentMethodChange: PropTypes.func,
  onCardDetailsChange: PropTypes.func,
};

PaymentMethod.defaultProps = {
  onPaymentMethodChange: () => {},
  onCardDetailsChange: () => {},
};

export default PaymentMethod;