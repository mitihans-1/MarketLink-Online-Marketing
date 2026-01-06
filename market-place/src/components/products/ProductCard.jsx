// src/components/products/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ShoppingCart, Heart, Eye, Check } from 'lucide-react';
import  {useCart}  from '../../context/useCart';

const ProductCard = ({ product }) => {
  const { cartItems, addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check if product is already in cart
  const isInCart = cartItems.some(item => item.id === product.id);
  const savings = product.originalPrice 
    ? product.originalPrice - (product.price || 0)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInCart) {
      // Navigate to cart page if already in cart
      globalThis.location.href = '/cart';
      return;
    }

    setIsAdding(true);
    
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        image: product.image,
        quantity: 1
      });
      
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Quick view:', product.id);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    console.log('Wishlist toggle:', product.id);
  };

  const getButtonClass = () => {
    if (isInCart) {
      return 'bg-green-100 text-green-700 hover:bg-green-200';
    }
    if (isAdding) {
      return 'bg-blue-400 text-white cursor-wait';
    }
    if (product.stock !== undefined && product.stock <= 0) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }
    return 'bg-blue-600 hover:bg-blue-700 text-white';
  };

  const getButtonContent = () => {
    if (isAdding) {
      return (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Adding...</span>
        </>
      );
    }
    if (isInCart) {
      return (
        <>
          <Check size={18} />
          <span>In Cart - View Cart</span>
        </>
      );
    }
    if (product.stock !== undefined && product.stock <= 0) {
      return (
        <>
          <ShoppingCart size={18} />
          <span>Out of Stock</span>
        </>
      );
    }
    return (
      <>
        <ShoppingCart size={18} />
        <span>Add to Cart</span>
      </>
    );
  };

  const getButtonAriaLabel = () => {
    if (isInCart) {
      return 'Go to Cart';
    }
    if (product.stock !== undefined && product.stock <= 0) {
      return 'Out of Stock';
    }
    return `Add ${product.name} to cart`;
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
      {/* Product Image Container */}
      <Link to={`/product/${product.id}`} className="block relative">
        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-3 left-3 z-10 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            NEW
          </span>
        )}
        {product.discount && (
          <span className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}

        {/* Product Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={product.image || 'https://via.placeholder.com/300x300?text=Product'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={handleQuickView}
              className="bg-white p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-100 mx-1"
              type="button"
              aria-label="Quick view"
            >
              <Eye size={20} className="text-gray-700" />
            </button>
            <button
              onClick={handleWishlist}
              className="bg-white p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-100 mx-1"
              type="button"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart 
                size={20} 
                className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-700"} 
              />
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
        )}
        
        {/* Product Name */}
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-800 mt-1 hover:text-blue-600 transition-colors line-clamp-2 h-14">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center mt-3">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ${(product.price || 0).toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {savings > 0 && (
              <span className="text-xs text-green-600 font-medium ml-2">
                Save ${savings.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="mt-3">
            <div className="text-sm text-gray-600 mb-1">
              <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.stock > 0 && product.stock < 10 && (
                <span className="text-orange-600 ml-2">Only {product.stock} left!</span>
              )}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || (product.stock !== undefined && product.stock <= 0)}
          className={`w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-lg transition-all font-medium text-sm ${getButtonClass()}`}
          type="button"
          aria-label={getButtonAriaLabel()}
        >
          {getButtonContent()}
        </button>

        {/* Added to Cart Success Message */}
        {showAddedMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in z-20">
            <div className="flex items-center gap-2">
              <Check size={16} />
              <span>Added to cart!</span>
            </div>
          </div>
        )}
      </div>

      {/* View Details Link */}
      <div className="px-4 pb-4">
        <Link
          to={`/product/${product.id}`}
          className="block text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors"
        >
          View Full Details
        </Link>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number,
    originalPrice: PropTypes.number,
    image: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    stock: PropTypes.number,
    isNew: PropTypes.bool,
    discount: PropTypes.number,
  }).isRequired,
};

export default ProductCard;