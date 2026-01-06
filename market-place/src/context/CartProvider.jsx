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
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calculate cart total
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => 
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0
    );
  }, [cartItems]);

  // Calculate item count
  const cartCount = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [cartItems]
  );

  // Check if item is in cart
  const isInCart = useCallback((productId) => 
    cartItems.some(item => item.id === productId),
    [cartItems]
  );

  // Memoized context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    isInCart,
    isInitialized
  }), [
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    isInCart,
    isInitialized
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