import axiosInstance from '../api/axiosConfig';

const authService = {
    login: async (email, password) => {
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            return { success: true, ...response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    },

    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register', userData);
            return { success: true, ...response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    },

    verifyEmail: async (token) => {
        try {
            const response = await axiosInstance.get(`/auth/verify-email/${token}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Verification failed'
            };
        }
    },

    googleLogin: async (data) => {
        try {
            const response = await axiosInstance.post('/auth/google', data);
            return { success: true, ...response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Google Auth failed'
            };
        }
    },

    facebookLogin: async (data) => {
        try {
            const response = await axiosInstance.post('/auth/facebook', data);
            return { success: true, ...response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Facebook Auth failed'
            };
        }
    },

    logout: () => {
        localStorage.removeItem('marketplace_token');
        localStorage.removeItem('marketplace_user');
        return { success: true };
    }
};

export default authService;
