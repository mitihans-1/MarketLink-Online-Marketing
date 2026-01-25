const db = require('../config/db');

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
    const { q, category, minPrice, maxPrice, sortBy, limit } = req.query;

    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const queryParams = [];

    if (q) {
        query += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
        const searchTerm = `%${q}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (category) {
        query += ' AND (c.name = ? OR c.slug = ?)';
        queryParams.push(category, category);
    }

    if (minPrice) {
        query += ' AND p.price >= ?';
        queryParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
        query += ' AND p.price <= ?';
        queryParams.push(parseFloat(maxPrice));
    }

    // Sorting
    if (sortBy) {
        switch (sortBy) {
            case 'price-low':
                query += ' ORDER BY p.price ASC';
                break;
            case 'price-high':
                query += ' ORDER BY p.price DESC';
                break;
            case 'name':
                query += ' ORDER BY p.name ASC';
                break;
            case 'newest':
                query += ' ORDER BY p.created_at DESC';
                break;
            default:
                query += ' ORDER BY p.id DESC';
        }
    } else {
        query += ' ORDER BY p.id DESC';
    }

    if (limit) {
        query += ' LIMIT ?';
        queryParams.push(parseInt(limit));
    }

    try {
        const [rows] = await db.query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [req.params.id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = async (req, res) => {
    const { name, description, price, image_url, category_id, stock } = req.body;

    if (!name || !price || !category_id) {
        return res.status(400).json({ message: 'Please provide name, price and category' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, image_url, category_id, stock, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, image_url, category_id, stock || 0, req.user.id]
        );

        const newProductId = result.insertId;
        const [newProduct] = await db.query('SELECT * FROM products WHERE id = ?', [newProductId]);

        res.status(201).json(newProduct[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all categories
// @route   GET /api/products/categories
const getCategories = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a category
// @route   POST /api/products/categories
// @access  Private/Admin or Seller
const createCategory = async (req, res) => {
    const { name, image_url } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Please provide a category name' });
    }

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    try {
        const [existing] = await db.query('SELECT * FROM categories WHERE slug = ?', [slug]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const [result] = await db.query(
            'INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)',
            [name, slug, image_url || null]
        );

        res.status(201).json({ id: result.insertId, name, slug, image_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a category
// @route   PUT /api/products/categories/:id
// @access  Private/Admin or Seller
const updateCategory = async (req, res) => {
    const { name, image_url } = req.body;
    const { id } = req.params;

    try {
        const [existing] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const slug = name ? name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : existing[0].slug;

        await db.query(
            'UPDATE categories SET name = ?, slug = ?, image_url = ? WHERE id = ?',
            [name || existing[0].name, slug, image_url || existing[0].image_url, id]
        );

        res.json({ id, name: name || existing[0].name, slug, image_url: image_url || existing[0].image_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a category
// @route   DELETE /api/products/categories/:id
// @access  Private/Admin or Seller
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const [existing] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if there are products in this category
        const [products] = await db.query('SELECT * FROM products WHERE category_id = ?', [id]);
        if (products.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category with associated products' });
        }

        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Category removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get products by seller
// @route   GET /api/products/seller
// @access  Private/Seller
const getSellerProducts = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.seller_id = ? ORDER BY p.created_at DESC',
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Seller
const updateProduct = async (req, res) => {
    const { name, description, price, image_url, category_id, stock } = req.body;
    const { id } = req.params;

    try {
        const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ownership check
        if (existing[0].seller_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to update this product' });
        }

        await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category_id = ?, stock = ? WHERE id = ?',
            [
                name || existing[0].name,
                description || existing[0].description,
                price || existing[0].price,
                image_url || existing[0].image_url,
                category_id || existing[0].category_id,
                stock !== undefined ? stock : existing[0].stock,
                id
            ]
        );

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Seller
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ownership check
        if (existing[0].seller_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete this product' });
        }

        await db.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getSellerProducts,
    updateProduct,
    deleteProduct
};
