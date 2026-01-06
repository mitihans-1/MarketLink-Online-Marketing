// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import CategoryGrid from '../components/home/CategoryGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    inStock: false,
    rating: 0
  });
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);

  // Fetch category info and products
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Fetch category information
        const categoryData = await fetchCategoryInfo(categoryId);
        setCategoryInfo(categoryData);

        // Fetch products for this category
        const productsData = await fetchProductsByCategory(categoryId, filters);
        setProducts(productsData);

        // Fetch sub-categories if any
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
  }, [categoryId, filters]);

  // Mock API functions (replace with actual API calls)
  const fetchCategoryInfo = async (id) => {
    // Replace with actual API call
    const mockCategories = {
      'electronics': { id: 'electronics', name: 'Electronics', description: 'Latest gadgets and electronics' },
      'fashion': { id: 'fashion', name: 'Fashion', description: 'Clothing and accessories' },
      'home': { id: 'home', name: 'Home & Kitchen', description: 'Home decor and kitchen items' },
      'sports': { id: 'sports', name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },
      'books': { id: 'books', name: 'Books', description: 'Books and educational materials' },
    };
    return mockCategories[id] || { id, name: id.charAt(0).toUpperCase() + id.slice(1), description: `Products in ${id} category` };
  };

  const fetchProductsByCategory = async (categoryId, filters) => {
    // Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    
    const mockProducts = [
      {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        price: 89.99,
        originalPrice: 129.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Electronics',
        rating: 4.5,
        reviewCount: 128,
        stock: 15,
        isNew: true,
        discount: 30
      },
      {
        id: 2,
        name: 'Smart Watch Series 5',
        price: 299.99,
        originalPrice: 399.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Electronics',
        rating: 4.7,
        reviewCount: 89,
        stock: 8,
        isNew: false,
        discount: 25
      },
      {
        id: 3,
        name: 'Laptop Backpack',
        price: 49.99,
        originalPrice: 69.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Fashion',
        rating: 4.3,
        reviewCount: 45,
        stock: 25,
        isNew: true,
        discount: 28
      },
      {
        id: 4,
        name: 'Coffee Maker',
        price: 79.99,
        originalPrice: 99.99,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Home',
        rating: 4.6,
        reviewCount: 67,
        stock: 12,
        isNew: false,
        discount: 20
      }
    ];

    // Filter by category
    let filteredProducts = mockProducts.filter(product => 
      product.category.toLowerCase() === categoryId?.toLowerCase()
    );

    // Apply additional filters
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

    // Apply sorting
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
  };

  const fetchSubCategories = async (categoryId) => {
    // Replace with actual API call
    const mockSubCategories = {
      'electronics': [
        { id: 'smartphones', name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
        { id: 'laptops', name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
        { id: 'headphones', name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
      ],
      'fashion': [
        { id: 'men', name: "Men's Wear", image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
        { id: 'women', name: "Women's Wear", image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
        { id: 'shoes', name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
      ],
    };
    return mockSubCategories[categoryId] || [];
  };

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
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <a href="/categories" className="text-gray-500 hover:text-gray-700">Categories</a>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="text-gray-900 font-medium capitalize" aria-current="page">
                {categoryInfo?.name || categoryId}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">
            {categoryInfo?.name || categoryId}
          </h1>
          {categoryInfo?.description && (
            <p className="text-gray-600 text-lg max-w-3xl">
              {categoryInfo.description}
            </p>
          )}
          <div className="mt-4 flex items-center text-gray-500">
            <span className="mr-4">{products.length} products</span>
            <span>•</span>
            <span className="ml-4">Free shipping on orders over $50</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <ProductFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Products ({products.length})
              </h2>
              <div className="flex items-center space-x-4">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <>
                <ProductGrid products={products} />
                
                {/* Sub-categories if available */}
                {categories.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Shop by Sub-category
                    </h3>
                    <CategoryGrid categories={categories} />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="mx-auto max-w-md">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your filters or browse other categories.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setFilters({})}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Clear All Filters
                    </button>
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