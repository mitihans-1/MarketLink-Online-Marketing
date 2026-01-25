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
    },

    updateProfile: async (userData) => {
        try {
            const response = await axiosInstance.put('/auth/profile', userData);
            // Update local storage with new user data if needed
            if (response.data.user) {
                localStorage.setItem('marketplace_user', JSON.stringify(response.data.user));
            }
            return { success: true, ...response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    },

    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/auth/profile');
            return { success: true, user: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch profile'
            };
        }
    },

    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get('/auth/users');
            return response.data;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error.response?.data || { message: 'Failed to fetch users' };
        }
    },

    updateUserRole: async (id, role) => {
        try {
            const response = await axiosInstance.put(`/auth/users/${id}`, { role });
            return response.data;
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error.response?.data || { message: 'Failed to update user role' };
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await axiosInstance.delete(`/auth/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error.response?.data || { message: 'Failed to delete user' };
        }
    },

    switchToSeller: async () => {
        try {
            const response = await axiosInstance.post('/auth/switch-to-seller');
            // Update local storage if user data is returned
            if (response.data.user) {
                localStorage.setItem('marketplace_user', JSON.stringify(response.data.user));
            }
            return { success: true, ...response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to switch to seller'
            };
        }
    }
};

export default authService;
