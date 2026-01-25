import axiosInstance from '../api/axiosConfig';

const productService = {
    getProducts: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/products', { params });
            if (response.data && response.data.length > 0) {
                return response.data.map(product => normalizeProduct(product));
            }
            throw new Error('No products found');
        } catch (error) {
            console.warn('Using mock products due to API error:', error.message);
            // Return high-quality mock products for an independent experience
            return [
                { id: 1, name: 'Premium Wireless Headphones', price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', category: 'Electronics', stock: 15, rating: 4.8 },
                { id: 2, name: 'Smart Watch Series X', price: 299.50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', category: 'Electronics', stock: 8, rating: 4.5 },
                { id: 3, name: 'Organic Cotton T-Shirt', price: 29.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', category: 'Fashion', stock: 50, rating: 4.2 },
                { id: 4, name: 'Leather Messenger Bag', price: 89.00, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', category: 'Accessories', stock: 12, rating: 4.7 },
                { id: 5, name: 'Professional Camera Tripod', price: 55.40, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', category: 'Electronics', stock: 20, rating: 4.4 },
                { id: 6, name: 'Minimalist Wall Clock', price: 45.00, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800', category: 'Home', stock: 5, rating: 4.9 }
            ];
        }
    },

    getProductById: async (id) => {
        try {
            const response = await axiosInstance.get(`/products/${id}`);
            return normalizeProduct(response.data);
        } catch (error) {
            console.warn(`Using mock product for ${id} due to API error:`, error.message);
            return {
                id,
                name: 'Premium Display Product',
                description: 'This is a premium high-quality product carefully selected for our marketplace. It features exceptional durability and modern design.',
                price: 149.99,
                originalPrice: 199.99,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
                category: 'Electronics',
                stock: 10,
                rating: 4.8,
                reviews: [
                    { id: 1, user: 'John Doe', rating: 5, comment: 'Excellent product!' },
                    { id: 2, user: 'Jane Smith', rating: 4, comment: 'Very good quality.' }
                ]
            };
        }
    },

    createProduct: async (productData) => {
        try {
            const response = await axiosInstance.post('/products', productData);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    getCategories: async () => {
        try {
            const response = await axiosInstance.get('/products/categories');
            if (response.data && response.data.length > 0) {
                return response.data.map(category => ({
                    ...category,
                    image: category.image_url ? normalizeImageUrl(category.image_url) : null
                }));
            }
            throw new Error('No categories found');
        } catch (error) {
            console.warn('Using mock categories due to API error:', error.message);
            return [
                { id: 1, name: 'Electronics', slug: 'electronics', image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800' },
                { id: 2, name: 'Fashion', slug: 'fashion', image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800' },
                { id: 3, name: 'Home & Garden', slug: 'home-garden', image_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800' },
                { id: 4, name: 'Books & Games', slug: 'books-games', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800' }
            ];
        }
    },

    createCategory: async (categoryData) => {
        try {
            const response = await axiosInstance.post('/products/categories', categoryData);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    updateCategory: async (id, categoryData) => {
        try {
            const response = await axiosInstance.put(`/products/categories/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    deleteCategory: async (id) => {
        try {
            const response = await axiosInstance.delete(`/products/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    },

    uploadImage: async (formData) => {
        try {
            const response = await axiosInstance.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    },

    searchProducts: async (params) => {
        try {
            const response = await axiosInstance.get('/products', { params });
            return response.data.map(product => normalizeProduct(product));
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    },

    getSellerProducts: async () => {
        try {
            const response = await axiosInstance.get('/products/seller');
            return response.data.map(product => normalizeProduct(product));
        } catch (error) {
            console.error('Error fetching seller products:', error);
            throw error.response?.data || { message: 'Failed to fetch your products' };
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const response = await axiosInstance.put(`/products/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error.response?.data || { message: 'Failed to update product' };
        }
    },

    deleteProduct: async (id) => {
        try {
            const response = await axiosInstance.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error.response?.data || { message: 'Failed to delete product' };
        }
    }
};

const normalizeImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    // Handle cases where path might be stored with or without leading slash
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    // If it starts with /uploads, it's a backend file
    if (cleanPath.startsWith('/uploads')) {
        return `http://localhost:5000${cleanPath}`;
    }
    return url;
};

const normalizeProduct = (product) => {
    const mainImage = normalizeImageUrl(product.image_url || product.image);
    return {
        ...product,
        image: mainImage,
        images: Array.isArray(product.image_url)
            ? product.image_url.map(url => normalizeImageUrl(url))
            : [mainImage],
        category: product.category_name || product.category
    };
};

export default productService;
