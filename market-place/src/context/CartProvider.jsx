// src/context/CartProvider.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import CartContext from './CartContext';

const CartProvider = ({ children }) => {
  // Lazy initialization for cart items - runs once on mount
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);

  // Mark as initialized after mount (no setState in this effect)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cartItems, isInitialized]);

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const productId = product.id || product._id || product.productId;
      const existing = prev.find(item => (item.id || item._id || item.productId) === productId);
      if (existing) {
        return prev.map(item =>
          (item.id || item._id || item.productId) === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => {
      const id = item.id || item._id || item.productId;
      return id !== productId;
    }));
  }, []);

  const removeItem = removeFromCart; // Alias for compatibility

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        const id = item.id || item._id || item.productId;
        return id === productId ? { ...item, quantity } : item;
      })
    );
  }, [removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0
    );
  }, [cartItems]);

  const getCartTotals = useCallback(() => {
    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      totalItems: cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    };
  }, [cartItems, getCartTotal]);

  // Calculate item count
  const cartCount = useMemo(() =>
    cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [cartItems]
  );

  // Check if item is in cart
  const isInCart = useCallback((productId) =>
    cartItems.some(item => (item.id || item._id || item.productId) === productId),
    [cartItems]
  );

  const saveForLater = useCallback((productId) => {
    const item = cartItems.find(item => (item.id || item._id || item.productId) === productId);
    if (item) {
      setSavedItems(prev => [...prev, item]);
      removeFromCart(productId);
    }
  }, [cartItems, removeFromCart]);

  const moveToCart = useCallback((productId) => {
    const item = savedItems.find(item => (item.id || item._id || item.productId) === productId);
    if (item) {
      addToCart(item, item.quantity);
      setSavedItems(prev => prev.filter(i => (i.id || i._id || i.productId) !== productId));
    }
  }, [savedItems, addToCart]);

  // Memoized context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartTotals,
    isInCart,
    isInitialized,
    loading,
    error,
    savedItems,
    saveForLater,
    moveToCart
  }), [
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartTotals,
    isInCart,
    isInitialized,
    loading,
    error,
    savedItems,
    saveForLater,
    moveToCart
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;