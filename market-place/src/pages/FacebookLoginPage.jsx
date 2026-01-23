import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useAuth } from '../context/useAuth';
import { toast } from 'react-hot-toast';

const FacebookLoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { facebookLogin } = useAuth();

    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role') || 'buyer';

    const handleFacebookResponse = async (response) => {
        if (response.accessToken) {
            const loadingToast = toast.loading('Authenticating with Facebook...');

            try {
                const result = await facebookLogin({
                    email: response.email,
                    name: response.name,
                    facebookId: response.userID,
                    avatar: response.picture?.data?.url || '',
                    role: role
                });

                toast.dismiss(loadingToast);

                if (result.success) {
                    toast.success(`Welcome, ${result.name}!`);

                    if (result.role === 'seller') {
                        navigate('/seller');
                    } else if (result.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/dashboard');
                    }
                } else {
                    toast.error(result.message || 'Facebook authentication failed');
                }
            } catch (error) {
                toast.dismiss(loadingToast);
                toast.error('Authentication failed');
                console.error('Facebook login error:', error);
            }
        } else {
            toast.error('Facebook authentication was cancelled');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">

                {/* Facebook Header */}
                <div className="p-8 text-center border-b border-gray-100">
                    <div className="flex justify-center mb-4">
                        <svg className="w-12 h-12" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-800">Continue with Facebook</h1>
                    <p className="text-gray-500 mt-2">to continue to MarketLink</p>
                </div>

                {/* OAuth Button */}
                <div className="p-8">
                    <FacebookLogin
                        appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={handleFacebookResponse}
                        render={renderProps => (
                            <button
                                onClick={renderProps.onClick}
                                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span>Continue with Facebook</span>
                            </button>
                        )}
                    />

                    <div className="mt-6 text-sm text-gray-600 text-center">
                        Facebook will share your name, email address, and profile picture with MarketLink.
                    </div>

                    <div className="flex justify-center pt-6">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                        >
                            ← Back to registration
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-gray-50 flex justify-between text-xs text-gray-500">
                    <div className="hover:text-gray-700 cursor-pointer">English (US)</div>
                    <div className="flex space-x-4">
                        <span className="hover:text-gray-700 cursor-pointer">Help</span>
                        <span className="hover:text-gray-700 cursor-pointer">Privacy</span>
                        <span className="hover:text-gray-700 cursor-pointer">Terms</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FacebookLoginPage;