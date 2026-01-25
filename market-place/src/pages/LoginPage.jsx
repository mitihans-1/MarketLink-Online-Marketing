import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import axios from 'axios';

const LoginPageContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin, facebookLogin } = useAuth();

  // Get the page they wanted to go to before login
  const from = location.state?.from?.pathname || '/dashboard';

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get('verified');
    const message = params.get('message');

    if (verified === 'true') {
      toast.success('Email verified successfully! You can now log in.');
      // Remove query params from URL
      navigate('/login', { replace: true });
    } else if (verified === 'false') {
      if (message === 'invalid_token') {
        toast.error('Invalid or expired verification link.');
      } else if (message === 'server_error') {
        toast.error('An error occurred during verification. Please try again later.');
      } else {
        toast.error('Email verification failed.');
      }
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const handleMockLogin = (provider) => {
    setLoading(true);
    const loadingToast = toast.loading(`Connecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`);

    // Simulate API call
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success(`Welcome back! Successfully logged in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`);

      // We can't really log them in without a user object, but we can simulate redirection
      // In a real mock scenarios, you might want to set a dummy user in context
      navigate(from, { replace: true });
      setLoading(false);
    }, 1500);
  };

  // Helper function to determine where the user should go based on their role
  const getRedirectPath = (userRole) => {
    // If they were trying to reach a specific page (e.g. checkout), let them go there
    if (from !== '/dashboard') return from;

    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'seller':
        return '/seller';
      case 'both':
        return '/seller'; // Business users usually want their dashboard first
      case 'buyer':
      default:
        return '/dashboard';
    }
  };

  const handleFacebookResponse = async (response) => {
    if (response.accessToken) {
      setLoading(true);
      const loadingToast = toast.loading('Authenticating with Facebook...');

      try {
        const result = await facebookLogin({
          email: response.email,
          name: response.name,
          facebookId: response.userID,
          avatar: response.picture?.data?.url || '',
          role: 'buyer' // Default role for social login
        });

        toast.dismiss(loadingToast);

        if (result.success) {
          toast.success(`Welcome back, ${result.name}!`);
          navigate(getRedirectPath(result.role), { replace: true });
        } else {
          setError(result.message || 'Facebook login failed');
          toast.error(result.message || 'Facebook login failed');
        }
      } catch (err) {
        toast.dismiss(loadingToast);
        setError('An error occurred during Facebook login');
        console.error('Facebook login error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const loginToGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      const loadingToast = toast.loading('Connecting to Google...');
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const googleData = {
          email: userInfo.data.email,
          name: userInfo.data.name,
          googleId: userInfo.data.sub,
          avatar: userInfo.data.picture,
          role: 'buyer' // Default role
        };

        const result = await googleLogin(googleData);
        toast.dismiss(loadingToast);

        if (result.success) {
          toast.success(`Welcome back, ${result.name}!`);
          navigate(getRedirectPath(result.role), { replace: true });
        } else {
          setError(result.message || 'Google login failed');
          toast.error(result.message || 'Google login failed');
        }
      } catch (err) {
        toast.dismiss(loadingToast);
        setError('An error occurred during Google login');
        console.error('google login error:', err);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Login Error:', error);
      toast.error('Google login failed');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);

      if (result && result.success === true) {
        toast.success(`Welcome back!`);
        navigate(getRedirectPath(result.role), { replace: true });
      } else {
        const errorMessage = result?.message || result?.error || 'Login failed. Please try again.';
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Login catch error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 sm:px-16 lg:px-24 py-12 relative bg-white">

        {/* Logo */}
        <div className="flex-none mb-8 lg:mb-0">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
              ML
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">MarketLink</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto animate-fade-in-up">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 text-lg">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-medium"
                  placeholder="name@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-medium"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                disabled={loading}
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2 animate-shake">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Social Logins Moved to Bottom */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => loginToGoogle()}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Google</span>
              </button>

              <FacebookLogin
                appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                autoLoad={false}
                fields="name,email,picture"
                callback={handleFacebookResponse}
                render={renderProps => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-gray-700"
                  >
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>
                )}
              />
            </div>
          </div>

          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Feature Section */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center">
        {/* Background Image/Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-900/90"></div>

        {/* Decorative Circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 p-12 text-center max-w-xl mx-auto text-white">
          <div className="mb-8 flex justify-center">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-lg border border-white/20 shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight">
            Experience the Future of Marketplace Shopping
          </h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed font-medium">
            Join thousands of sellers and buyers connected in one seamless platform. Fast, secure, and built for you.
          </p>

          {/* Testimonial Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-left max-w-sm mx-auto shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-yellow-900">
                JS
              </div>
              <div>
                <h4 className="font-bold">John Smith</h4>
                <div className="flex text-yellow-400 text-xs">
                  ★★★★★
                </div>
              </div>
            </div>
            <p className="text-sm opacity-90 italic">
              "MarketLink has completely transformed how I buy and sell online. The interface is stunning and so easy to use!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <LoginPageContent />
    </GoogleOAuthProvider>
  );
};

export default LoginPage;