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

  // Rest of the component remains the same...
  // [All the previous code from the fixed version]


