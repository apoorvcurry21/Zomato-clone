import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="min-h-screen pt-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-12 mb-16"
                >
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6 italic text-zomato-red">
                        zomato
                    </h1>
                    <p className="text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        Find the best restaurants, cafés and bars in <span className="font-semibold text-zomato-red">India</span>
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* Placeholder Categories */}
                    {['Order Online', 'Dining', 'Nightlife'].map((item) => (
                        <motion.div
                            key={item}
                            whileHover={{ scale: 1.03 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer"
                        >
                            <div className="h-48 bg-gray-200 animate-pulse"></div>
                            <div className="p-6 text-xl font-semibold text-gray-800">
                                {item}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
