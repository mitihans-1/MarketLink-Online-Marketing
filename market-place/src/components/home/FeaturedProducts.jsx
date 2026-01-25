import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useCart } from '../../context/useCart';
import { useAuth } from '../../context/useAuth';
import toast from 'react-hot-toast';

const FeaturedProducts = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const products = [
    {
      id: 'prod_1',
      name: "Premium Wireless Headphones",
      description: "Noise-cancelling over-ear headphones with 30hr battery life",
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.8,
      reviewCount: 128,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Electronics",
      tags: ["Best Seller", "Wireless", "Audio"],
      inStock: true,
      stock: 45
    },
    {
      id: 'prod_2',
      name: "Smart Fitness Watch",
      description: "Track your health with heart rate, sleep, and activity monitoring",
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.6,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Wearables",
      tags: ["Fitness", "Smartwatch", "Health"],
      inStock: true,
      stock: 28
    },
    {
      id: 'prod_3',
      name: "Professional Camera Kit",
      description: "DSLR camera with 24.1MP sensor and 18-55mm lens",
      price: 899.99,
      originalPrice: 1099.99,
      rating: 4.9,
      reviewCount: 56,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Photography",
      tags: ["Professional", "Camera", "DSLR"],
      inStock: true,
      stock: 12
    },
    {
      id: 'prod_4',
      name: "Ergonomic Office Chair",
      description: "Adjustable lumbar support with breathable mesh back",
      price: 349.99,
      originalPrice: 449.99,
      rating: 4.7,
      reviewCount: 234,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Furniture",
      tags: ["Ergonomic", "Office", "Comfort"],
      inStock: true,
      stock: 62
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const toggleFavorite = (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to favorites');
      navigate('/login');
      return;
    }

    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));

    toast.success(
      favorites[productId]
        ? 'Removed from favorites'
        : 'Added to favorites!'
    );
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });

      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Calculate discount percentage
  const calculateDiscount = (price, originalPrice) => {
    return Math.round((1 - price / originalPrice) * 100);
  };

  // Helper function to get button text and styling
  const getButtonState = (product) => {
    if (!product.inStock) {
      return {
        text: 'Out of Stock',
        bgColor: 'bg-gray-300',
        textColor: 'text-gray-500',
        icon: <ShoppingBag size={16} className="mr-1 sm:mr-2" />
      };
    }

    if (addingToCart[product.id]) {
      return {
        text: 'Adding...',
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        icon: <Loader2 size={16} className="mr-1 sm:mr-2 animate-spin" />
      };
    }

    return {
      text: `Add to Cart - $${Number(product.price).toFixed(2)}`,
      bgColor: 'bg-gradient-to-r from-blue-500 to-purple-500',
      textColor: 'text-white',
      icon: <ShoppingBag size={16} className="mr-1 sm:mr-2" />
    };
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-3 md:mb-4">
            <TrendingUp className="text-purple-600 mr-2" size={20} />
            <span className="text-purple-600 font-semibold text-sm md:text-base">Trending Now</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto px-4">
            Discover our most popular and highly-rated products. Quality you can trust at unbeatable prices.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 md:mb-12">
          {products.map((product) => {
            const buttonState = getButtonState(product);

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                {/* Product Image */}
                <div
                  className="relative overflow-hidden cursor-pointer flex-grow"
                  onClick={() => handleProductClick(product.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleProductClick(product.id);
                    }
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Tags */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1 sm:gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={`${product.id}-${tag}`}
                        className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${tag === product.tags[0]
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-white text-gray-700'
                          }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
                    aria-label={favorites[product.id] ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart
                      size={18}
                      className={favorites[product.id] ? "text-red-500 fill-red-500" : "text-gray-400"}
                    />
                  </button>

                  {/* Quick View Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickView(product);
                    }}
                    className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 p-2 sm:p-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-50 hover:scale-110 z-10"
                    aria-label="Quick view"
                  >
                    <Eye size={18} className="text-blue-600" />
                  </button>

                  {/* Discount Badge */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10">
                    <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full">
                      -{calculateDiscount(product.price, product.originalPrice)}%
                    </span>
                  </div>

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                      <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-6 flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm text-gray-500">{product.category}</span>
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-xs sm:text-sm font-semibold">{product.rating}</span>
                      <span className="mx-1 text-gray-300">•</span>
                      <span className="text-xs sm:text-sm text-gray-500">{product.reviewCount}</span>
                    </div>
                  </div>

                  <h3
                    className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer line-clamp-1"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price and Add to Cart Button Container */}
                  <div className="mt-auto">
                    <div className="mb-3">
                      <div className="flex items-center">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-400 line-through">
                          ${Number(product.originalPrice).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart Button - Always visible at bottom */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={!product.inStock || addingToCart[product.id]}
                      className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-200 shadow-lg hover:opacity-90 hover:shadow-xl ${buttonState.bgColor} ${buttonState.textColor} ${!product.inStock || addingToCart[product.id] ? 'cursor-not-allowed' : ''}`}
                    >
                      {buttonState.icon}
                      <span>{buttonState.text}</span>
                    </button>

                    {/* Stock Info */}
                    {product.inStock && product.stock < 20 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Only {product.stock} left in stock</span>
                          <span>{Math.round((product.stock / 100) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full"
                            style={{ width: `${(product.stock / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center space-x-3 sm:space-x-4">
          <button
            onClick={prevSlide}
            className="p-2 sm:p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-gray-700" />
          </button>

          {/* Slide Indicators */}
          <div className="flex space-x-1.5 sm:space-x-2">
            {products.map((product, index) => (
              <button
                key={product.id}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${index === currentSlide
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'bg-gray-300'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-2 sm:p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6 text-gray-700" />
          </button>
        </div>

        {/* CTA Section */}
        <div className="mt-12 md:mt-16 text-center">
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:opacity-90 transition-all font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl"
          >
            <span className="hidden sm:inline">View All Products</span>
            <span className="sm:hidden">View All</span>
            <ChevronRight className="ml-2" size={16} />
          </Link>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
            Over 1000+ products waiting for you
          </p>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Quick View</h3>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{quickViewProduct.name}</h4>
                  <p className="text-gray-600 mb-4">{quickViewProduct.description}</p>
                  <div className="flex items-center mb-4">
                    <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    <span className="ml-2 font-semibold">{quickViewProduct.rating}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-500">{quickViewProduct.reviewCount} reviews</span>
                  </div>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-gray-900">${Number(quickViewProduct.price).toFixed(2)}</span>
                    <span className="ml-2 text-lg text-gray-400 line-through">${Number(quickViewProduct.originalPrice).toFixed(2)}</span>
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                      Save ${(Number(quickViewProduct.originalPrice) - Number(quickViewProduct.price)).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
                  >
                    Add to Cart - ${Number(quickViewProduct.price).toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;