const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProducts)
    .post(protect, authorize('seller', 'admin'), createProduct);

router.route('/seller')
    .get(protect, authorize('seller', 'admin'), getSellerProducts);

router.get('/categories', getCategories);
router.post('/categories', protect, authorize('seller', 'admin'), createCategory);
router.put('/categories/:id', protect, authorize('seller', 'admin'), updateCategory);
router.delete('/categories/:id', protect, authorize('admin'), deleteCategory);

router.route('/:id')
    .get(getProductById)
    .put(protect, authorize('seller', 'admin'), updateProduct)
    .delete(protect, authorize('seller', 'admin'), deleteProduct);

module.exports = router;
