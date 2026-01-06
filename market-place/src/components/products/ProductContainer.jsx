import React, { useState, useCallback } from 'react';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilters';
import Pagination from '../ui/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import { useCart } from '../../context/CartContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const { addToCart } = useCart();
  const productsPerPage = 12;

  // Define fetchProducts with useCallback
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    // API call would go here
    setTimeout(() => {
      const mockProducts = Array.from({ length: 36 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        price: Math.random() * 100 + 10,
        category: ['Electronics', 'Fashion', 'Home'][i % 3],
        rating: Math.random() * 2 + 3,
      }));
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Call fetchProducts on mount and when filters change
  React.useEffect(() => {
    fetchProducts();
  }, [filters, fetchProducts]);

  const handleAddToCart = (product) => {
    addToCart(product);
    // Show success toast
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products</h1>
        <p>Browse our collection</p>
      </div>

      <div className="products-container">
        <aside className="filters-sidebar">
          <ProductFilters 
            filters={filters} 
            onFilterChange={setFilters} 
          />
        </aside>

        <main className="products-main">
          <ProductGrid 
            products={currentProducts}
            onAddToCart={handleAddToCart}
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(products.length / productsPerPage)}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;