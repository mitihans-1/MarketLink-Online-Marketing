import React from 'react';
import { ShieldCheck, Zap, Heart, CheckCircle, ArrowRight, DollarSign, HelpingHand, Scale } from 'lucide-react';
import { Button } from '../components/ui';

const PriceMatchPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white relative overflow-hidden py-24">
                <div className="absolute top-0 right-0 -m-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 -m-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px]"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <DollarSign size={16} />
                        <span className="text-sm font-bold tracking-wider uppercase">Best Price Guarantee</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Shop with <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Confidence</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Found a lower price elsewhere? We'll match it. That's the MarketLink promise.
                        We ensure you get the best value on every single purchase.
                    </p>
                </div>
            </div>

            {/* How it Works */}
            <div className="py-24 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">How it Works</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">Three simple steps to getting the best price on the market.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            step: "01",
                            title: "Find it Lower",
                            desc: "Locate an identical product on an authorized competitor's website at a lower price.",
                            icon: <Scale className="text-blue-600" size={32} />
                        },
                        {
                            step: "02",
                            title: "Let Us Know",
                            desc: "Share the link or proof of the lower price with our dedicated support team.",
                            icon: <HelpingHand className="text-blue-600" size={32} />
                        },
                        {
                            step: "03",
                            title: "We Match It",
                            desc: "Once verified, we'll immediately match the price and give you an extra 5% discount.",
                            icon: <Zap className="text-blue-600" size={32} />
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                            <div className="text-6xl font-black text-slate-50 mb-4 group-hover:text-blue-50 transition-colors">{item.step}</div>
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900">{item.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Guidelines - Glassmorphism */}
            <div className="py-24 bg-slate-50 border-y border-slate-200 overflow-hidden relative">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-xl border border-white/40 p-12 rounded-[3.5rem] shadow-2xl relative z-10">
                        <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                                <ShieldCheck size={24} />
                            </div>
                            Match Eligibility
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1"><CheckCircle size={20} className="text-green-500" /></div>
                                    <div>
                                        <p className="font-bold text-slate-900">Identical Item</p>
                                        <p className="text-sm text-slate-500">Must be the same brand, model, color, and size.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1"><CheckCircle size={20} className="text-green-500" /></div>
                                    <div>
                                        <p className="font-bold text-slate-900">Currently in Stock</p>
                                        <p className="text-sm text-slate-500">Must be available for immediate purchase at both locations.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1"><CheckCircle size={20} className="text-green-500" /></div>
                                    <div>
                                        <p className="font-bold text-slate-900">Authorized Seller</p>
                                        <p className="text-sm text-slate-500">Only authorized online retailers. Private sales not included.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1"><CheckCircle size={20} className="text-green-500" /></div>
                                    <div>
                                        <p className="font-bold text-slate-900">Active Price</p>
                                        <p className="text-sm text-slate-500">The lower price must be currently active and not an expired deal.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-slate-500 text-sm italic">Terms and conditions apply. One match per customer per item.</p>
                            <Button className="rounded-2xl px-8 h-14 bg-slate-900 text-white font-bold hover:bg-black gap-2">
                                Contact Support <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 container mx-auto px-4 text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Heart size={40} className="animate-pulse" />
                </div>
                <h2 className="text-4xl font-black mb-6">Our Goal is Your Happiness</h2>
                <p className="text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
                    We want you to shop with a clear mind, knowing you are getting the absolute best deal without the hassle of hunting for coupons.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => window.history.back()} variant="outline" className="rounded-2xl px-12 h-14 font-bold border-2">
                        Browse Products
                    </Button>
                    <Button className="rounded-2xl px-12 h-14 bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xl shadow-blue-100">
                        Learn More
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PriceMatchPage;
