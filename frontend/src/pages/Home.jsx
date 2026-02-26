import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, ArrowRight, Utensils, Bike } from 'lucide-react';
import api from '../api/axios';
import RestaurantCard from '../components/RestaurantCard';
import { useUserLocation } from '../context/LocationContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { pincode, updatePincode } = useUserLocation();
    const [searchPincode, setSearchPincode] = useState(pincode || '');
    const [restaurants, setRestaurants] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFeatured();
        if (pincode) {
            fetchByPincode(pincode);
        }
    }, [pincode]);

    const fetchFeatured = async () => {
        try {
            const { data } = await api.get('/restaurants/featured');
            setFeatured(data.slice(0, 10));
        } catch (err) {
            console.error('Error fetching featured restaurants:', err);
        }
    };

    const fetchByPincode = async (code) => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get(`/restaurants?pincode=${code}`);
            setRestaurants(data);
        } catch (err) {
            setError('Failed to fetch restaurants for this location.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchPincode.length >= 6) {
            updatePincode(searchPincode);
        } else {
            setError('Please enter a valid 6-digit pincode.');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[500px] flex items-center justify-center bg-gray-900 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    alt="Hero Background"
                />
                <div className="relative z-10 max-w-4xl w-full px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-7xl font-extrabold text-white italic mb-4"
                    >
                        zomato
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl md:text-3xl text-white mb-10 font-medium"
                    >
                        Find the best food & drinks in India
                    </motion.p>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden p-2 max-w-2xl mx-auto"
                    >
                        <div className="flex items-center flex-1 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
                            <MapPin className="text-zomato-red mr-3" size={24} />
                            <input
                                type="text"
                                placeholder="Enter your 6-digit Pincode"
                                className="w-full focus:outline-none text-gray-700 text-lg"
                                value={searchPincode}
                                onChange={(e) => setSearchPincode(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-zomato-red text-white text-lg font-bold px-8 py-3 hover:bg-opacity-90 transition-all flex items-center justify-center"
                        >
                            <Search className="mr-2" size={20} />
                            Search
                        </button>
                    </motion.form>
                    {error && <p className="text-red-400 mt-4 font-semibold">{error}</p>}
                </div>
            </section>

            {/* Featured Section */}
            <AnimatePresence>
                {featured.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-7xl mx-auto px-4 py-16"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Top Rated Near You</h2>
                                <p className="text-gray-500">Curated list of the best outlets in town</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featured.map((rest) => (
                                <RestaurantCard key={rest._id} restaurant={rest} />
                            ))}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Main Delivery Section */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">
                        {pincode ? `Delivery in ${pincode}` : 'Restaurants near you'}
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-xl h-72 animate-pulse shadow-sm"></div>
                            ))}
                        </div>
                    ) : restaurants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {restaurants.map((rest) => (
                                <RestaurantCard key={rest._id} restaurant={rest} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <Utensils size={64} className="mx-auto text-gray-300 mb-6" />
                            <h3 className="text-2xl font-bold text-gray-700 mb-2">
                                {pincode ? 'No restaurants found for this pincode.' : 'Enter your pincode to get started'}
                            </h3>
                            <p className="text-gray-500 mb-8">
                                {pincode ? 'Try another pincode or check back later.' : 'See which restaurants are delivering delicious food to your doorstep.'}
                            </p>
                            {!pincode && (
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="bg-zomato-red text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all"
                                >
                                    Set Location
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Onboarding Banners */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="relative rounded-3xl overflow-hidden h-64 shadow-xl group border border-gray-100"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt="Restaurant Owner"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-10 flex flex-col justify-center">
                            <h3 className="text-3xl font-bold text-white mb-2">List your Restaurant</h3>
                            <p className="text-gray-200 mb-6 text-lg">Reach millions of customers today!</p>
                            <Link to="/apply-restaurant" className="bg-zomato-red text-white py-3 px-6 rounded-xl w-fit font-bold shadow-lg transform hover:scale-105 transition-transform">
                                Partner with us
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="relative rounded-3xl overflow-hidden h-64 shadow-xl group border border-gray-100"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1624373415554-e75871323558?q=80&w=800&auto=format&fit=crop"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt="Delivery Partner"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-10 flex flex-col justify-center">
                            <h3 className="text-3xl font-bold text-white mb-2">Become a Delivery Partner</h3>
                            <p className="text-gray-200 mb-6 text-lg">Join our fleet and earn on your schedule</p>
                            <Link to="/apply-delivery" className="bg-white text-gray-900 py-3 px-6 rounded-xl w-fit font-bold shadow-lg transform hover:scale-105 transition-transform">
                                Start Earning
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 py-16 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-black italic text-gray-400 mb-4 opacity-50">zomato</h2>
                    <p className="text-gray-500 mb-8">© 2026 Zomato Clone Project by Antigravity AI.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
