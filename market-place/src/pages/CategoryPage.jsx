import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import CategoryGrid from '../components/home/CategoryGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import productService from '../services/productService';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subCategory = queryParams.get('sub');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    inStock: false,
    rating: 0,
    subCategory: subCategory || ''
  });

  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);

  // Modern, professional category images for e-commerce
  const CATEGORY_IMAGES = useMemo(() => ({
    electronics: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    home: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    sports: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    books: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    toys: 'https://images.unsplash.com/photo-1578116922645-3976907a7671?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    automotive: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    'home-appliances': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    furniture: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    jewelry: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    watches: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    gadgets: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
  }), []);

  const fetchCategoryInfo = useCallback(async (id) => {
    const mockCategories = {
      'electronics': {
        id: 'electronics',
        name: 'Electronics',
        description: 'Latest gadgets, smartphones, laptops, and cutting-edge technology from top brands',
        image: CATEGORY_IMAGES.electronics,
        icon: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        featured: true
      },
      'fashion': {
        id: 'fashion',
        name: 'Fashion',
        description: 'Trendy clothing, accessories, and premium style essentials for every season',
        image: CATEGORY_IMAGES.fashion,
        icon: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        featured: true
      },
      'home': {
        id: 'home',
        name: 'Home & Living',
        description: 'Premium home decor, furniture, kitchen appliances, and living space essentials',
        image: CATEGORY_IMAGES.home,
        icon: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        featured: true
      },
      'sports': {
        id: 'sports',
        name: 'Sports & Fitness',
        description: 'Professional sports equipment, fitness gear, outdoor adventure, and training essentials',
        image: CATEGORY_IMAGES.sports,
        icon: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        featured: false
      },
      'books': {
        id: 'books',
        name: 'Books & Stationery',
        description: 'Bestselling books, educational materials, premium stationery, and learning resources',
        image: CATEGORY_IMAGES.books,
        icon: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        featured: false
      },
      'beauty': {
        id: 'beauty',
        name: 'Beauty & Wellness',
        description: 'Luxury skincare, premium cosmetics, wellness products, and personal care essentials',
        image: CATEGORY_IMAGES.beauty,
        icon: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        featured: true
      },
      'home-appliances': {
        id: 'home-appliances',
        name: 'Home Appliances',
        description: 'Smart home appliances, kitchen gadgets, and modern living solutions',
        image: CATEGORY_IMAGES['home-appliances'],
        icon: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        featured: true
      },
      'furniture': {
        id: 'furniture',
        name: 'Furniture',
        description: 'Modern furniture, home office setups, and premium interior solutions',
        image: CATEGORY_IMAGES.furniture,
        icon: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        featured: false
      },
      'jewelry': {
        id: 'jewelry',
        name: 'Jewelry',
        description: 'Fine jewelry, luxury watches, and premium accessories',
        image: CATEGORY_IMAGES.jewelry,
        icon: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        featured: true
      },
      'watches': {
        id: 'watches',
        name: 'Watches',
        description: 'Luxury watches, smartwatches, and premium timepieces',
        image: CATEGORY_IMAGES.watches,
        icon: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        featured: false
      }
    };
    return mockCategories[id] || {
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' '),
      description: `Discover premium products in our exclusive ${id.replace('-', ' ')} collection`,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      icon: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      featured: false
    };
  }, [CATEGORY_IMAGES]);

  const fetchProductsByCategory = useCallback(async (categoryId, filters) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Premium product images
    const mockProducts = [
      {
        id: 1,
        name: 'Apple MacBook Pro 16" M3 Max',
        price: 3499.99,
        originalPrice: 3999.99,
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        subCategory: 'Laptops',
        rating: 4.9,
        reviewCount: 428,
        stock: 12,
        isNew: true,
        discount: 13,
        brand: 'Apple',
        features: ['M3 Max Chip', '48GB RAM', '1TB SSD', 'Liquid Retina XDR']
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra',
        price: 1299.99,
        originalPrice: 1399.99,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        subCategory: 'Smartphones',
        rating: 4.8,
        reviewCount: 1567,
        stock: 45,
        isNew: true,
        discount: 7,
        brand: 'Samsung',
        features: ['200MP Camera', 'Snapdragon 8 Gen 3', '12GB RAM', '1TB Storage']
      },
      {
        id: 3,
        name: 'Sony WH-1000XM5 Wireless Headphones',
        price: 399.99,
        originalPrice: 449.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        subCategory: 'Audio',
        rating: 4.7,
        reviewCount: 2893,
        stock: 89,
        isNew: false,
        discount: 11,
        brand: 'Sony',
        features: ['Noise Cancelling', '30-hour Battery', 'Hi-Res Audio', 'Multi-point']
      },
      {
        id: 4,
        name: 'Dyson V15 Detect Vacuum',
        price: 749.99,
        originalPrice: 849.99,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Home Appliances',
        subCategory: 'Cleaning',
        rating: 4.8,
        reviewCount: 1245,
        stock: 23,
        isNew: true,
        discount: 12,
        brand: 'Dyson',
        features: ['Laser Detection', '60-min Runtime', 'HEPA Filter', '5 Attachments']
      },
      {
        id: 5,
        name: 'Rolex Submariner Date',
        price: 12500.00,
        originalPrice: 13500.00,
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Watches',
        subCategory: 'Luxury',
        rating: 4.9,
        reviewCount: 89,
        stock: 3,
        isNew: false,
        discount: 7,
        brand: 'Rolex',
        features: ['Ceramic Bezel', '300m Waterproof', 'Chronometer', 'Oystersteel']
      },
      {
        id: 6,
        name: 'Nike Air Jordan 1 Retro High',
        price: 179.99,
        originalPrice: 199.99,
        image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Fashion',
        subCategory: 'Shoes',
        rating: 4.6,
        reviewCount: 5678,
        stock: 156,
        isNew: false,
        discount: 10,
        brand: 'Nike',
        features: ['Premium Leather', 'Air Cushioning', 'Classic Design', 'Multiple Colors']
      }
    ];

    let filteredProducts = mockProducts.filter(product =>
      product.category.toLowerCase() === categoryId?.toLowerCase()
    );

    if (filters.subCategory) {
      filteredProducts = filteredProducts.filter(p =>
        p.subCategory.toLowerCase() === filters.subCategory.toLowerCase()
      );
    }

    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= Number.parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= Number.parseFloat(filters.maxPrice));
    }
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(p => p.stock > 0);
    }
    if (filters.rating > 0) {
      filteredProducts = filteredProducts.filter(p => p.rating >= filters.rating);
    }

    switch (filters.sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
    }

    return filteredProducts;
  }, []);

  const fetchSubCategories = useCallback(async (categoryId) => {
    const subCategoryImages = {
      electronics: [
        {
          id: 'smartphones',
          name: 'Smartphones',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          icon: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          count: 234
        },
        {
          id: 'laptops',
          name: 'Laptops',
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          icon: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          count: 189
        },
        {
          id: 'audio',
          name: 'Audio & Headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          icon: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          count: 312
        },
        {
          id: 'cameras',
          name: 'Cameras',
          image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          icon: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          count: 156
        },
        {
          id: 'wearables',
          name: 'Wearable Tech',
          image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          icon: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          count: 89
        },
        {
          id: 'gaming',
          name: 'Gaming',
          image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          icon: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          count: 267
        },
      ],
      fashion: [
        {
          id: 'men',
          name: "Men's Fashion",
          image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          icon: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          count: 456
        },
        {
          id: 'women',
          name: "Women's Fashion",
          image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          icon: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          count: 589
        },
        {
          id: 'shoes',
          name: 'Shoes',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          icon: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          count: 312
        },
        {
          id: 'accessories',
          name: 'Accessories',
          image: 'https://images.unsplash.com/photo-1590649887896-6c7e47b3c7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          icon: 'https://images.unsplash.com/photo-1590649887896-6c7e47b3c7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          count: 234
        },
        {
          id: 'jewelry',
          name: 'Jewelry',
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          icon: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          count: 178
        },
        {
          id: 'bags',
          name: 'Bags & Luggage',
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          icon: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          count: 145
        },
      ],
    };
    return subCategoryImages[categoryId] || [];
  }, []);

  // Update filters when URL changes
  useEffect(() => {
    if (subCategory) {
      setFilters(prev => ({ ...prev, subCategory }));
    }
  }, [subCategory]);

  // Fetch category info and products
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const categoryData = await fetchCategoryInfo(categoryId);
        setCategoryInfo(categoryData);

        // Try to fetch from backend first
        let productsData;
        try {
          productsData = await productService.getProducts({ category: categoryId, ...filters });
        } catch (apiError) {
          console.warn('API error in CategoryPage, falling back to mock:', apiError);
          productsData = await fetchProductsByCategory(categoryId, filters);
        }

        setProducts(productsData);

        const subCategories = await fetchSubCategories(categoryId);
        setCategories(subCategories);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryData();
    }
  }, [categoryId, filters, fetchCategoryInfo, fetchProductsByCategory, fetchSubCategories]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Hero Banner - More Professional */}
      <div className="relative h-80 md:h-[500px] overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="absolute inset-0">
          <img
            src={categoryInfo?.image}
            alt={categoryInfo?.name}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-medium text-white">Premium Collection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {categoryInfo?.name}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl">
              {categoryInfo?.description}
            </p>
            <div className="flex gap-4">
              <a
                href="#products"
                className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </a>
              <a
                href="#categories"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Explore Categories
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center py-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {products.length} premium products available
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              {categoryInfo?.featured && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-blue-700">Featured Category</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Premium products curated from top brands worldwide.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4" id="products">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Premium {categoryInfo?.name}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Curated selection of premium products from trusted brands
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                      className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="popular">Most Popular</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <>
                <ProductGrid products={products} />

                {/* Sub-categories if available */}
                {categories.length > 0 && (
                  <div className="mt-16" id="categories">
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            Shop by Category
                          </h3>
                          <p className="text-gray-600 mt-1">
                            Browse our premium {categoryInfo?.name} collections
                          </p>
                        </div>
                        <a
                          href={`/categories/${categoryId}`}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          View all
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {categories.map((subCategory) => (
                        <a
                          key={subCategory.id}
                          href={`/categories/${categoryId}?sub=${subCategory.id}`}
                          className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={subCategory.image}
                              alt={subCategory.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <h4 className="text-lg font-semibold text-white mb-1">
                                {subCategory.name}
                              </h4>
                              {subCategory.count && (
                                <p className="text-white/80 text-sm">
                                  {subCategory.count} products
                                </p>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="mx-auto max-w-md">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Products Found</h3>
                  <p className="text-gray-500 mb-6">
                    We couldn't find products matching your criteria. Try adjusting your filters or browse other categories.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setFilters({
                        minPrice: '',
                        maxPrice: '',
                        sortBy: 'newest',
                        inStock: false,
                        rating: 0,
                        subCategory: ''
                      })}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Clear All Filters
                    </button>
                    <a
                      href="/categories"
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Browse All Categories
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;