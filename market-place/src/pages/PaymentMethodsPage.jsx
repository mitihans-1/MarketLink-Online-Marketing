import React from 'react';
import { Shield, CreditCard, ShoppingCart, Lock, Globe, CheckCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentMethodsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Hero Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        Secure Payments & Cart
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Your security is our top priority. Learn about our secure shopping cart features and the variety of payment methods we accept.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:-translate-y-2 transition-all duration-300">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <Lock size={28} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">SSL Encryption</h3>
                        <p className="text-gray-500 leading-relaxed">
                            All transactions are secured with 256-bit SSL encryption. Your personal and financial data is protected at all times.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:-translate-y-2 transition-all duration-300">
                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                            <Shield size={28} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Buyer Protection</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Shop with confidence. Our Buyer Protection policy ensures you get exactly what you ordered, or your money back.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:-translate-y-2 transition-all duration-300">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                            <Globe size={28} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Global Transactions</h3>
                        <p className="text-gray-500 leading-relaxed">
                            We accept international cards and multiple currencies, making it easy to shop from anywhere in the world.
                        </p>
                    </div>
                </div>

                {/* Accepted Payment Methods */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-16">
                    <div className="p-10 md:p-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Accepted Payment Methods</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Credit Cards */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <CreditCard className="text-blue-600" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Credit & Debit Cards</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Visa', 'Mastercard', 'American Express', 'Discover'].map(card => (
                                        <div key={card} className="flex items-center space-x-3 p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                                            <div className="w-8 h-5 bg-gray-300 rounded shadow-inner"></div>
                                            <span className="font-semibold text-gray-700">{card}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Digital Wallets */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="p-3 bg-indigo-50 rounded-lg">
                                        <ShoppingCart className="text-indigo-600" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Digital Wallets</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {['PayPal', 'Apple Pay', 'Google Pay'].map(wallet => (
                                        <div key={wallet} className="flex items-center space-x-3 p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                                            <CheckCircle className="text-green-500" size={20} />
                                            <span className="font-semibold text-gray-700">{wallet}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-10 py-8 border-t border-gray-100">
                        <p className="text-center text-gray-500 text-sm">
                            * Payment options may vary depending on your shipping location and order value.
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Common Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: 'Is it safe to save my card details?', a: 'Yes. We use industry-standard tokenization, meaning your actual card details are never stored on our servers. They are securely handled by our payment processor.' },
                            { q: 'When will I be charged?', a: 'You will be charged immediately upon placing your order. If an item is out of stock, we will issue a refund within 3-5 business days.' },
                            { q: 'Can I split my payment?', a: 'Currently, we only support a single payment method per order. You can, however, use a gift card in combination with a credit card.' }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="flex items-start text-lg font-bold text-gray-900 mb-2">
                                    <HelpCircle className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={20} />
                                    {faq.q}
                                </h4>
                                <p className="text-gray-600 ml-8">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart CTA */}
                <div className="mt-16 text-center">
                    <div className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all">
                        <Link to="/products" className="font-bold text-lg flex items-center">
                            Start Shopping Securely
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentMethodsPage;
