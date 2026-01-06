// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SearchPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    
    // Fetch search results
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const mockResults = [
          {
            id: 1,
            name: `Search result for: ${query}`,
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
            category: 'Electronics',
            stock: 10
          }
        ];
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
        setProducts(mockResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [location.search]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {searchQuery ? `Search Results for: "${searchQuery}"` : 'Search Products'}
      </h1>
      
      {searchQuery ? (
        <>
          <p className="text-gray-600 mb-8">
            Found {products.length} results for "{searchQuery}"
          </p>
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
              <p className="mt-2 text-gray-500">
                Try different keywords or browse our categories.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Enter a search term to find products
          </h2>
          <p className="text-gray-600">
            Use the search bar in the navigation to find products, categories, or brands.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;