import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Move InputField component outside of ShippingAddress
const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder = '', 
  required = false,
  value,
  error,
  onChange,
  autoFocus = false,
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
      autoFocus={autoFocus}
      className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400
        ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
      required={required}
      {...props}
    />
    {error && (
      <p className="mt-2 text-sm text-red-600 animate-fadeIn">{error}</p>
    )}
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
};

InputField.defaultProps = {
  type: 'text',
  placeholder: '',
  required: false,
  value: '',
  error: '',
  autoFocus: false,
};

// Helper function to check if phone is valid (extracted to reduce nesting)
const isValidPhoneNumber = (phoneDigits) => {
  return /^[+]?\d{10,15}$/.test(phoneDigits);
};

// Helper function to update addresses (extracted to reduce nesting)
const getUpdatedAddress = (addr, isEditing, newAddress) => {
  if (addr.id === isEditing) {
    return { ...newAddress, id: isEditing };
  }
  if (newAddress.isDefault) {
    return { ...addr, isDefault: false };
  }
  return addr;
};

// Helper function to show toast messages
const showToast = (message, type = 'success') => {
  const event = new CustomEvent('showToast', {
    detail: { 
      message,
      type
    }
  });
  globalThis.dispatchEvent(event);
};

const ShippingAddress = ({ onAddressSelect = () => {}, onAddressesChange = () => {} }) => {
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'John Smith',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '(555) 123-4567',
      isDefault: true,
      type: 'home'
    },
    {
      id: 2,
      name: 'John Smith',
      street: '456 Oak Avenue',
      apartment: '',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      phone: '(555) 987-6543',
      isDefault: false,
      type: 'work'
    },
    {
      id: 3,
      name: 'Jane Smith',
      street: '789 Pine Road',
      apartment: 'Suite 300',
      city: 'Queens',
      state: 'NY',
      zipCode: '11354',
      phone: '(555) 456-7890',
      isDefault: false,
      type: 'other'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    type: 'home',
    isDefault: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(null);
  const nextIdRef = useRef(1000);

  const addressTypes = [
    { id: 'home', name: 'Home', icon: '🏠', color: 'bg-blue-100 text-blue-800' },
    { id: 'work', name: 'Work', icon: '💼', color: 'bg-green-100 text-green-800' },
    { id: 'other', name: 'Other', icon: '📍', color: 'bg-purple-100 text-purple-800' }
  ];

  useEffect(() => {
    if (selectedAddress) {
      const selected = addresses.find(addr => addr.id === selectedAddress);
      onAddressSelect(selected);
    }
  }, [selectedAddress, addresses, onAddressSelect]);

  useEffect(() => {
    onAddressesChange(addresses);
  }, [addresses, onAddressesChange]);

  const validateAddress = (address) => {
    const errors = {};
    
    if (!address.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!address.street.trim()) {
      errors.street = 'Street address is required';
    }
    if (!address.city.trim()) {
      errors.city = 'City is required';
    }
    if (!address.state.trim()) {
      errors.state = 'State is required';
    }
    if (!address.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    }
    if (!address.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else {
      const phoneDigits = address.phone.replaceAll(/\D/g, '');
      const isPhoneValid = isValidPhoneNumber(phoneDigits);
      if (isPhoneValid === false) {
        errors.phone = 'Invalid phone number';
      }
    }
    
    return errors;
  };

  const handleSaveAddress = () => {
    const errors = validateAddress(newAddress);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    let updatedAddresses;
    
    if (isEditing) {
      updatedAddresses = addresses.map(addr => getUpdatedAddress(addr, isEditing, newAddress));
    } else {
      updatedAddresses = newAddress.isDefault 
        ? addresses.map(addr => ({ ...addr, isDefault: false }))
        : [...addresses];
      
      const newAddr = {
        ...newAddress,
        id: nextIdRef.current++
      };
      
      updatedAddresses = [...updatedAddresses, newAddr];
    }
    
    setAddresses(updatedAddresses);
    
    const lastAddress = updatedAddresses.at(-1);
    const newSelectedId = isEditing || lastAddress?.id;
    if (newSelectedId) {
      setSelectedAddress(newSelectedId);
    }
    
    resetForm();
    
    showToast(`Address ${isEditing ? 'updated' : 'added'} successfully`, 'success');
  };

  const handleDeleteAddress = (id) => {
    if (addresses.length <= 1) {
      showToast('You must have at least one address', 'error');
      return;
    }
    
    if (globalThis.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      setAddresses(updatedAddresses);
      
      if (selectedAddress === id && updatedAddresses.length > 0) {
        setSelectedAddress(updatedAddresses[0].id);
      }
      
      showToast('Address deleted successfully', 'success');
    }
  };

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    
    showToast('Default address updated', 'success');
  };

  const handleEditAddress = (address) => {
    setIsEditing(address.id);
    setNewAddress(address);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setNewAddress({
      name: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      type: 'home',
      isDefault: false
    });
    setFormErrors({});
    setShowAddForm(false);
    setIsEditing(null);
  };

  const handleChangeNewAddress = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setNewAddress(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Format phone number
    if (name === 'phone') {
      const cleaned = value.replaceAll(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length >= 4) {
        formatted = '(' + cleaned.slice(0, 3) + ') ' + cleaned.slice(3, 6);
        if (cleaned.length > 6) {
          formatted += '-' + cleaned.slice(6, 10);
        }
      }
      if (formatted !== value) {
        setNewAddress(prev => ({ ...prev, phone: formatted }));
      }
    }
  };

  const getAddressIcon = (type) => {
    const addressType = addressTypes.find(t => t.id === type);
    return addressType ? addressType.icon : '📍';
  };

  const getAddressColor = (type) => {
    const addressType = addressTypes.find(t => t.id === type);
    return addressType ? addressType.color : 'bg-gray-100 text-gray-800';
  };

  const getButtonText = () => {
    if (isEditing) {
      return 'Update Address';
    }
    return 'Save Address';
  };

  const getFormTitle = () => {
    if (isEditing) {
      return 'Edit Address';
    }
    return 'Add New Address';
  };

  // Helper function to handle address type button click
  const handleAddressTypeClick = (typeId) => {
    setNewAddress(prev => ({ ...prev, type: typeId }));
  };

  // Helper function to handle address type key down
  const handleAddressTypeKeyDown = (e, typeId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAddressTypeClick(typeId);
    }
  };

  // Helper function to render address type buttons
  const renderAddressTypeButtons = () => (
    <div className="flex space-x-3">
      {addressTypes.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => handleAddressTypeClick(type.id)}
          className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
            ${newAddress.type === type.id 
              ? `${type.color.split(' ')[0]} border-current shadow-md` 
              : 'border-gray-200 hover:border-gray-300'
            }`}
          role="radio"
          aria-checked={newAddress.type === type.id}
          tabIndex={0}
          onKeyDown={(e) => handleAddressTypeKeyDown(e, type.id)}
        >
          <div className="text-2xl mb-2" aria-hidden="true">{type.icon}</div>
          <div className="text-sm font-medium">{type.name}</div>
        </button>
      ))}
    </div>
  );

  const selectedAddressData = addresses.find(a => a.id === selectedAddress);
  const hasSelectedAddress = Boolean(selectedAddressData);

  // Helper function to handle address card click
  const handleAddressCardClick = (addressId) => {
    setSelectedAddress(addressId);
  };

  // Helper function to handle address card key down
  const handleAddressCardKeyDown = (e, addressId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAddressCardClick(addressId);
    }
  };

  // Helper function to handle add form click
  const handleAddFormClick = () => {
    setShowAddForm(true);
  };

  // Helper function to handle add form key down
  const handleAddFormKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAddFormClick();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      <div className="p-8 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Shipping Address</h3>
            <p className="text-gray-600 mt-2">Choose where to ship your order</p>
          </div>
          <button
            onClick={handleAddFormClick}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
            type="button"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Address
          </button>
        </div>
      </div>

      {/* Address Cards Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => handleAddressCardClick(address.id)}
              onKeyDown={(e) => handleAddressCardKeyDown(e, address.id)}
              className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] group
                ${selectedAddress === address.id
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              role="radio"
              aria-checked={selectedAddress === address.id}
              tabIndex={0}
            >
              {selectedAddress === address.id && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg mr-3 ${getAddressColor(address.type)}`}>
                    {getAddressIcon(address.type)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{address.name}</div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-1
                      ${address.isDefault ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {address.isDefault ? 'Default' : 'Alternative'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-gray-600">
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div>{address.street}</div>
                    {address.apartment && <div className="text-sm text-gray-500">{address.apartment}</div>}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{address.city}, {address.state} {address.zipCode}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{address.phone}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAddress(address);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
                  type="button"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                
                <div className="flex space-x-2">
                  {!address.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(address.id);
                      }}
                      className="text-sm text-green-600 hover:text-green-800 px-3 py-1 hover:bg-green-50 rounded-lg transition-colors"
                      type="button"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(address.id);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 px-3 py-1 hover:bg-red-50 rounded-lg transition-colors"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Address Card */}
          {!showAddForm && (
            <div
              onClick={handleAddFormClick}
              onKeyDown={handleAddFormKeyDown}
              className="p-6 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 hover:scale-[1.02] group flex flex-col items-center justify-center min-h-[200px]"
              role="button"
              tabIndex={0}
              type="button"
            >
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-lg">Add New Address</span>
              <span className="text-sm text-gray-500 mt-2">Click to add a new shipping address</span>
            </div>
          )}
        </div>

        {/* Add/Edit Address Form */}
        {showAddForm && (
          <div className="mt-8 p-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white rounded-2xl animate-slideIn">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-bold text-gray-900">
                {getFormTitle()}
              </h4>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close form"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <InputField
                  label="Full Name"
                  name="name"
                  required
                  placeholder="John Smith"
                  value={newAddress.name}
                  error={formErrors.name}
                  onChange={handleChangeNewAddress}
                  autoFocus
                />
                
                <InputField
                  label="Street Address"
                  name="street"
                  required
                  placeholder="123 Main Street"
                  value={newAddress.street}
                  error={formErrors.street}
                  onChange={handleChangeNewAddress}
                />
                
                <InputField
                  label="Apartment, Suite, etc. (Optional)"
                  name="apartment"
                  placeholder="Apt 4B, Suite 300"
                  value={newAddress.apartment}
                  error={formErrors.apartment}
                  onChange={handleChangeNewAddress}
                />
                
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  required
                  placeholder="(555) 123-4567"
                  value={newAddress.phone}
                  error={formErrors.phone}
                  onChange={handleChangeNewAddress}
                />
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <InputField
                    label="City"
                    name="city"
                    required
                    placeholder="New York"
                    value={newAddress.city}
                    error={formErrors.city}
                    onChange={handleChangeNewAddress}
                  />
                  <InputField
                    label="State"
                    name="state"
                    required
                    placeholder="NY"
                    value={newAddress.state}
                    error={formErrors.state}
                    onChange={handleChangeNewAddress}
                  />
                </div>
                
                <InputField
                  label="ZIP Code"
                  name="zipCode"
                  required
                  placeholder="10001"
                  value={newAddress.zipCode}
                  error={formErrors.zipCode}
                  onChange={handleChangeNewAddress}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Address Type
                  </label>
                  {renderAddressTypeButtons()}
                </div>
                
                <div className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={newAddress.isDefault}
                    onChange={handleChangeNewAddress}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isDefault" className="ml-3 flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900">Set as default shipping address</div>
                    <p className="text-sm text-gray-500 mt-0.5">This address will be preselected for future orders</p>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-200">
              <button
                onClick={resetForm}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 active:scale-95 transition-all duration-200"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                type="button"
              >
                {getButtonText()}
              </button>
            </div>
          </div>
        )}

        {/* Selected Address Summary */}
        {!showAddForm && hasSelectedAddress && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Shipping to this address:</h4>
                    <p className="text-sm text-gray-600 mt-0.5">Your order will be delivered here</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Name</div>
                    <div className="font-medium">{selectedAddressData.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Address</div>
                    <div className="font-medium">
                      {selectedAddressData.street}
                      {selectedAddressData.apartment && (
                        <div className="text-sm">{selectedAddressData.apartment}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">City, State ZIP</div>
                    <div className="font-medium">
                      {selectedAddressData.city}, {selectedAddressData.state} {selectedAddressData.zipCode}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedAddressData.isDefault && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                    Default Address
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ShippingAddress.propTypes = {
  onAddressSelect: PropTypes.func,
  onAddressesChange: PropTypes.func,
};

ShippingAddress.defaultProps = {
  onAddressSelect: () => {},
  onAddressesChange: () => {},
};

export default ShippingAddress;