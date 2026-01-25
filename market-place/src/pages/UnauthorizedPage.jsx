import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-100">
                    <ShieldAlert size={48} />
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Access Denied</h1>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    Oops! It looks like you don't have permission to access this area.
                    This section is restricted to specific account types.
                </p>

                <div className="space-y-4">
                    <Button
                        onClick={() => navigate(-1)}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
                    >
                        <ArrowLeft size={20} /> Go Back
                    </Button>

                    <Button
                        onClick={() => {
                            globalThis.localStorage.clear();
                            globalThis.location.href = '/login';
                        }}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-amber-200 text-amber-700 bg-amber-50 rounded-2xl font-bold hover:bg-amber-100 transition-all"
                    >
                        Fix My Account (Reset)
                    </Button>

                    <Link
                        to="/"
                        className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all block"
                    >
                        <Home size={20} /> Back to Home
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-400 font-medium">
                        Need help? <Link to="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
