import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star, MapPin, ChevronRight, Plus, Minus, ShoppingBag, Leaf, Info, Utensils } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const RestaurantMenu = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const { cartItems, addItem, removeItem, totalAmount, totalItems } = useCart();

    useEffect(() => {
        fetchRestaurantData();
    }, [id]);

    const fetchRestaurantData = async () => {
        setLoading(true);
        try {
            const [resData, menuData] = await Promise.all([
                api.get(`/restaurants/${id}`),
                api.get(`/menu/${id}`)
            ]);
            setRestaurant(resData.data);
            setMenuItems(menuData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(menuItems.map(item => item.category))];

    const filteredItems = activeCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    const getItemQuantity = (itemId) => {
        const item = cartItems.find(i => i._id === itemId);
        return item ? item.quantity : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-zomato-red border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <h2 className="text-2xl font-bold">Restaurant not found</h2>
                <button onClick={() => navigate('/')} className="mt-4 text-zomato-red font-bold underline">Go Home</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <section className="pt-24 pb-8 bg-gray-50 border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                <span onClick={() => navigate('/')} className="cursor-pointer hover:text-zomato-red">Home</span>
                                <ChevronRight size={14} className="mx-1" />
                                <span className="text-gray-900 font-medium">{restaurant.name}</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{restaurant.name}</h1>
                            <p className="text-gray-600 mb-4">{restaurant.cuisine || 'Multi-cuisine'}</p>
                            <div className="flex items-center text-gray-500 text-sm gap-4">
                                <div className="flex items-center bg-white px-3 py-1 rounded-lg border border-gray-200">
                                    <MapPin size={16} className="text-gray-400 mr-1" />
                                    <span>{restaurant.address}</span>
                                </div>
                                <div className="flex items-center bg-white px-3 py-1 rounded-lg border border-gray-200">
                                    <Clock size={16} className="text-zomato-red mr-1" />
                                    <span>{restaurant.estimatedPrepTime} min</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-center min-w-[80px]">
                                <div className="flex items-center justify-center font-bold text-lg text-gray-800">
                                    {restaurant.rating} <Star size={18} className="text-yellow-400 fill-current ml-1" />
                                </div>
                                <div className="text-[10px] text-gray-400 uppercase font-black uppercase tracking-tighter">
                                    {restaurant.numReviews} Reviews
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
                {/* Sidebar Categories */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Categories</h3>
                        <div className="space-y-1">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${activeCategory === cat
                                        ? 'bg-zomato-red text-white shadow-md shadow-red-100'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Menu Items */}
                <main className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">{activeCategory} Items</h2>
                    </div>

                    <div className="space-y-6">
                        {filteredItems.map(item => (
                            <motion.div
                                layout
                                key={item._id}
                                className="flex justify-between p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex-1 pr-6">
                                    <div className="flex items-center mb-1">
                                        <div className={`w-4 h-4 border-2 flex items-center justify-center mr-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                        </div>
                                        {item.isBestSeller && <span className="text-[10px] font-bold text-orange-500 uppercase flex items-center bg-orange-50 px-2 py-0.5 rounded">Bestseller</span>}
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h4>
                                    <p className="text-gray-900 font-bold text-lg mb-2">₹{item.price}</p>
                                    <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                                </div>
                                <div className="relative w-32 h-32">
                                    <img
                                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop'}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded-xl shadow-sm"
                                    />
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24">
                                        {getItemQuantity(item._id) > 0 ? (
                                            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-md">
                                                <button
                                                    onClick={() => removeItem(item._id)}
                                                    className="text-zomato-red hover:bg-red-50 p-1 rounded transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="font-bold text-zomato-red">{getItemQuantity(item._id)}</span>
                                                <button
                                                    onClick={() => addItem(item, id)}
                                                    className="text-zomato-red hover:bg-red-50 p-1 rounded transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addItem(item, id)}
                                                className="w-full bg-white border border-gray-200 text-zomato-red font-bold py-1.5 px-4 rounded-lg shadow-md hover:bg-gray-50 transition-colors uppercase tracking-tight"
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {filteredItems.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <Utensils size={48} className="mx-auto text-gray-300 mb-4" />
                                <h4 className="text-xl font-bold text-gray-500">No items found in this category</h4>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Cart Float Widget */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 bg-zomato-red text-white p-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]"
                    >
                        <div className="max-w-6xl mx-auto flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="bg-white/20 p-2 rounded-lg mr-4">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{totalItems} Item{totalItems > 1 ? 's' : ''}</p>
                                    <p className="text-sm opacity-90">Total: ₹{totalAmount}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/checkout')}
                                className="flex items-center text-lg font-black uppercase tracking-tight hover:underline"
                            >
                                View Cart <ChevronRight className="ml-1" size={24} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RestaurantMenu;
