import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import productService from '../services/productService';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await productService.getProductById(productId);

        // Add mock fields if they don't exist in DB yet
        if (!productData.features) productData.features = [];
        if (!productData.specifications) {
          productData.specifications = {
            condition: 'New',
            delivery: 'Available'
          };
        }

        setProduct(productData);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity
    });

    // Optional: Show success message
    toast.success(`Added ${quantity} × ${product.name} to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Implement wishlist functionality here
  };

  const handleShare = () => {
    if (globalThis.navigator.share) {
      globalThis.navigator.share({
        title: product.name,
        text: product.description,
        url: globalThis.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      globalThis.navigator.clipboard.writeText(globalThis.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatPrice = (price) => {
    return `$${Number.parseFloat(price).toFixed(2)}`;
  };

  const getStockStatus = () => {
    if (!product) return { text: '', class: '' };
    if (product.stock > 10) {
      return { text: 'In Stock', class: 'text-green-600 bg-green-100' };
    }
    if (product.stock > 0) {
      return { text: 'Low Stock', class: 'text-orange-600 bg-orange-100' };
    }
    return { text: 'Out of Stock', class: 'text-red-600 bg-red-100' };
  };

  const isInCart = cartItems.some(item => item.id === productId);

  const getAddToCartButtonText = () => {
    if (isInCart) {
      return 'Already in Cart - View Cart';
    }
    return 'Add to Cart';
  };

  // Helper function to get delivery estimate
  const getDeliveryEstimate = () => {
    if (!product) return '';

    if (product.stock > 20) {
      return '1-2 business days';
    }
    if (product.stock > 5) {
      return '3-5 business days';
    }
    return '7-10 business days';
  };

  // Helper function to generate image key
  const getImageKey = (imgIndex) => {
    return `img-${productId}-${imgIndex}`;
  };

  // Helper function to generate star key
  const getStarKey = (starIndex) => {
    return `star-${productId}-${starIndex}`;
  };

  // Helper function to generate feature key
  const getFeatureKey = (feature) => {
    return feature.id || `feature-${feature.text}`;
  };

  // Helper function to generate specification key
  const getSpecKey = (key) => {
    return `spec-${productId}-${key}`;
  };

  // Helper function to get add to cart button class
  const getAddToCartButtonClass = () => {
    if (isInCart) {
      return 'bg-green-600 hover:bg-green-700 text-white';
    }
    if (product?.stock <= 0) {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    }
    return 'bg-blue-600 hover:bg-blue-700 text-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Product not found'}</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus();
  const deliveryEstimate = getDeliveryEstimate();
  const addToCartButtonClass = getAddToCartButtonClass();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
                  Home
                </button>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <button onClick={() => navigate('/categories')} className="text-gray-500 hover:text-gray-700">
                  Categories
                </button>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <button onClick={() => navigate(`/category/${product.category.toLowerCase()}`)} className="text-gray-500 hover:text-gray-700 capitalize">
                  {product.category}
                </button>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="text-gray-900 font-medium" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 h-96">
              <img
                src={product.images?.[selectedImage] || product.image || product.image_url || 'https://via.placeholder.com/800x600?text=Product'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x600?text=Product+Image';
                }}
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3">
              {product.images.map((img, imgIndex) => (
                <button
                  key={getImageKey(imgIndex)}
                  onClick={() => setSelectedImage(imgIndex)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === imgIndex
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200'
                    }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${imgIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Badges */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                {product.category}
              </span>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleWishlist}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    size={24}
                    className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600"}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Share product"
                >
                  <Share2 size={24} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={getStarKey(starIndex)}
                    size={20}
                    className={`${starIndex < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-2 py-1 text-sm font-semibold text-red-600 bg-red-100 rounded">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${stockStatus.class}`}>
                {stockStatus.text}
              </span>
              {product.stock > 0 && product.stock < 10 && (
                <span className="ml-2 text-orange-600">
                  Only {product.stock} left in stock!
                </span>
              )}
            </div>

            {/* Delivery Estimate */}
            <div className="mb-6">
              <p className="text-gray-700">
                <span className="font-medium">Delivery:</span> {deliveryEstimate}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-lg font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={product.stock > 0 && quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-500">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold transition-colors ${addToCartButtonClass}`}
              >
                <ShoppingCart size={22} />
                {getAddToCartButtonText()}
              </button>

              <button
                onClick={() => {
                  if (product.stock > 0) {
                    handleAddToCart();
                    navigate('/checkout');
                  }
                }}
                disabled={product.stock <= 0}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-colors ${product.stock <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white'
                  }`}
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mt-8 pb-8 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map(feature => (
                    <li key={getFeatureKey(feature)} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Seller Information */}
            <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden border border-blue-50">
                    <img
                      src={`https://ui-avatars.com/api/?name=${product.seller_name || 'Market'}&background=random`}
                      alt="Seller"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Sold By</h4>
                    <p className="text-lg font-black text-gray-900">{product.seller_name || 'Premium Seller'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star size={14} fill="currentColor" />
                    <span>4.9</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Top Rated</p>
                </div>
              </div>
              <Link
                to={`/store/${(product.seller_name || 'premium-seller').toLowerCase().replace(/\s+/g, '-')}`}
                className="w-full py-3 bg-white text-blue-600 font-black rounded-xl text-center border border-blue-200 hover:bg-blue-600 hover:text-white transition-all block focus:ring-4 focus:ring-blue-100 outline-none"
              >
                Visit Storefront
              </Link>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={getSpecKey(key)}
                    className="flex items-center px-6 py-4 border-b border-gray-100 even:bg-gray-50"
                  >
                    <span className="w-1/3 font-medium text-gray-700 capitalize">
                      {key.replaceAll(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="w-2/3 text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;