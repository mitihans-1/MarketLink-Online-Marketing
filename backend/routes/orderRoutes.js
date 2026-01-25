const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getSellerStats,
    getSellerOrders,
    getAdminStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createOrder);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/seller/stats')
    .get(protect, getSellerStats);

router.route('/seller')
    .get(protect, getSellerOrders);

router.route('/admin/stats')
    .get(protect, authorize('admin'), getAdminStats);

router.route('/:id')
    .get(protect, getOrderById);

module.exports = router;
