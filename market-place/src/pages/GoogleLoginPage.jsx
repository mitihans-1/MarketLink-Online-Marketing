import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/useAuth';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const GoogleLoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { googleLogin } = useAuth();

    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role') || 'buyer';

    const handleGoogleSuccess = async (credentialResponse) => {
        const loadingToast = toast.loading('Authenticating with Google...');

        try {
            // Decode the JWT token from Google to get user info
            const decoded = jwtDecode(credentialResponse.credential);

            const result = await googleLogin({
                email: decoded.email,
                name: decoded.name,
                googleId: decoded.sub,
                avatar: decoded.picture,
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
                toast.error(result.message || 'Google authentication failed');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Authentication failed');
            console.error('Google login error:', error);
        }
    };

    const handleGoogleError = () => {
        toast.error('Google authentication was cancelled or failed');
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">

                    {/* Google Logo Header */}
                    <div className="p-8 text-center border-b border-gray-100">
                        <div className="flex justify-center mb-4">
                            <svg className="w-12 h-12" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-800">Sign in with Google</h1>
                        <p className="text-gray-500 mt-2">to continue to MarketLink</p>
                    </div>

                    {/* OAuth Button */}
                    <div className="p-8">
                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap
                                theme="outline"
                                size="large"
                                text="continue_with"
                                shape="rectangular"
                            />
                        </div>

                        <div className="mt-6 text-sm text-gray-600 text-center">
                            Google will share your name, email address, and profile picture with MarketLink.
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
                        <div className="hover:text-gray-700 cursor-pointer">English (United States)</div>
                        <div className="flex space-x-4">
                            <span className="hover:text-gray-700 cursor-pointer">Help</span>
                            <span className="hover:text-gray-700 cursor-pointer">Privacy</span>
                            <span className="hover:text-gray-700 cursor-pointer">Terms</span>
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginPage;