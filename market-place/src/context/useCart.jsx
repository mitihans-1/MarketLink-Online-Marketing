// src/context/useCart.jsx
import { useContext } from 'react';
import CartContext from './CartContext';

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};