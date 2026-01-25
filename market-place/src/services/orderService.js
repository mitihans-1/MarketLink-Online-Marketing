import axiosInstance from '../api/axiosConfig';

const orderService = {
    /**
     * Create a new order
     * @param {Object} orderData - Shipping info, items, and total
     */
    createOrder: async (orderData) => {
        try {
            const response = await axiosInstance.post('/orders', orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error.response?.data || { message: 'Failed to place order' };
        }
    },

    /**
     * Get orders for the logged-in user
     */
    getMyOrders: async () => {
        try {
            const response = await axiosInstance.get('/orders/myorders');
            return response.data;
        } catch (error) {
            console.error('Error fetching my orders:', error);
            throw error.response?.data || { message: 'Failed to fetch orders' };
        }
    },

    /**
     * Get order details by ID
     * @param {string} id - Order ID
     */
    getOrderById: async (id) => {
        try {
            const response = await axiosInstance.get(`/orders/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error.response?.data || { message: 'Failed to fetch order details' };
        }
    },

    getSellerStats: async () => {
        try {
            const response = await axiosInstance.get('/orders/seller/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching seller stats:', error);
            throw error.response?.data || { message: 'Failed to fetch sales stats' };
        }
    },

    getSellerOrders: async () => {
        try {
            const response = await axiosInstance.get('/orders/seller');
            return response.data;
        } catch (error) {
            console.error('Error fetching seller orders:', error);
            throw error.response?.data || { message: 'Failed to fetch customer orders' };
        }
    },

    getAdminStats: async () => {
        try {
            const response = await axiosInstance.get('/orders/admin/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            throw error.response?.data || { message: 'Failed to fetch platform stats' };
        }
    }
};

export default orderService;
