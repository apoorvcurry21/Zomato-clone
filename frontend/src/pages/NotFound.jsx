import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, UtensilsCrossed } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4 bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="w-24 h-24 bg-zomato-red/10 text-zomato-red rounded-full flex items-center justify-center mx-auto mb-8">
                    <UtensilsCrossed size={48} />
                </div>
                <h1 className="text-8xl font-black text-gray-900 mb-4 tracking-tighter">404</h1>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Oops! Page not found</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
                    The page you're looking for doesn't exist or has been moved to a different kitchen.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-zomato-red text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all shadow-lg flex items-center mx-auto"
                >
                    <Home className="mr-2" size={20} />
                    Back to Home
                </button>
            </motion.div>
        </div>
    );
};

export default NotFound;
