const db = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         total_amount:
 *           type: number
 *         status:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               shippingAddress:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 */
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        city,
        state,
        zipCode,
        country,
        phone,
        paymentMethod,
        totalAmount
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Create the order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total_amount, shipping_address, city, state, zip_code, country, phone, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, totalAmount, shippingAddress, city, state, zipCode, country, phone, paymentMethod]
        );

        const orderId = orderResult.insertId;

        // 2. Create the order items
        for (const item of orderItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );

            // 3. Update stock (optional but recommended)
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.id]
            );
        }

        await connection.commit();
        res.status(201).json({
            message: 'Order created successfully',
            orderId
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    } finally {
        connection.release();
    }
};

/**
 * @swagger
 * /orders/myorders:
 *   get:
 *     summary: Get logged in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 */
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );

        // Fetch items for each order
        for (let order of orders) {
            const [items] = await db.query(
                'SELECT oi.*, p.name, p.image_url FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
                [order.id]
            );
            order.products = items;
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orders[0];
        const [items] = await db.query(
            'SELECT oi.*, p.name, p.image_url FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
            [order.id]
        );
        order.products = items;

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order' });
    }
};

/**
 * @swagger
 * /orders/seller/stats:
 *   get:
 *     summary: Get sales statistics for the logged-in seller
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seller statistics (Revenue, Orders, Items Sold)
 */
// @desc    Get seller stats
// @route   GET /api/orders/seller/stats
// @access  Private/Seller
const getSellerStats = async (req, res) => {
    try {
        // Total products count
        const [prodResult] = await db.query(
            'SELECT COUNT(*) as productCount FROM products WHERE seller_id = ?',
            [req.user.id]
        );
        const productCount = prodResult[0]?.productCount || 0;

        // Sales and Revenue for this seller's products
        const [salesData] = await db.query(
            `SELECT 
                COUNT(DISTINCT oi.order_id) as totalOrders,
                SUM(oi.quantity * oi.price) as totalRevenue,
                SUM(oi.quantity) as itemsSold
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE p.seller_id = ?`,
            [req.user.id]
        );

        const stats = {
            totalOrders: salesData[0]?.totalOrders || 0,
            totalRevenue: Number(salesData[0]?.totalRevenue || 0).toFixed(2),
            itemsSold: salesData[0]?.itemsSold || 0,
            activeProducts: productCount
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching seller stats:', error);
        res.status(500).json({ message: 'Error fetching seller stats' });
    }
};

// @desc    Get orders for items sold by seller
// @route   GET /api/orders/seller
// @access  Private/Seller
const getSellerOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            `SELECT DISTINCT 
                o.*, 
                u.name as customerName, 
                u.email as customerEmail
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            JOIN users u ON o.user_id = u.id
            WHERE p.seller_id = ?
            ORDER BY o.created_at DESC`,
            [req.user.id]
        );

        // For each order, get ONLY the products that belong to this seller
        for (let order of orders) {
            const [items] = await db.query(
                `SELECT oi.*, p.name, p.image_url 
                FROM order_items oi 
                JOIN products p ON oi.product_id = p.id 
                WHERE oi.order_id = ? AND p.seller_id = ?`,
                [order.id, req.user.id]
            );
            order.products = items;
            // Calculate seller-specific total for this order
            order.sellerTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching seller orders:', error);
        res.status(500).json({ message: 'Error fetching seller orders' });
    }
};

/**
 * @swagger
 * /orders/admin/stats:
 *   get:
 *     summary: Get global administrative statistics
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard statistics
 */
// @desc    Get global admin stats
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const [orderResult] = await db.query(
            'SELECT SUM(total_amount) as totalRevenue, COUNT(*) as totalOrders FROM orders'
        );
        const [userResult] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
        const [prodResult] = await db.query('SELECT COUNT(*) as totalProducts FROM products');
        const [sellerResult] = await db.query('SELECT COUNT(DISTINCT seller_id) as activeSellers FROM products');

        res.json({
            totalRevenue: Number(orderResult[0]?.totalRevenue || 0).toFixed(2),
            totalOrders: orderResult[0]?.totalOrders || 0,
            totalUsers: userResult[0]?.totalUsers || 0,
            totalProducts: prodResult[0]?.totalProducts || 0,
            activeSellers: sellerResult[0]?.activeSellers || 0
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Error fetching admin stats' });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getSellerStats,
    getSellerOrders,
    getAdminStats
};
